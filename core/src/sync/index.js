import { access, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { DEFAULT_GLOBAL_CONFIG, loadConfig } from "../config/index.js";
import { writeOpenCodeArtifacts } from "../artifacts/opencode.js";
import { refreshProjectRegistryAction } from "../actions/index.js";
import { rebuildKnowledgeLedger } from "../knowledge/index.js";

export async function runProjectSync(projectRoot = ".", options = {}) {
  const root = resolve(projectRoot);
  const mode = normalizeSyncMode(options);
  const now = options.now || new Date().toISOString();
  if (mode === "light") return runLightSync(root, { ...options, now });

  const light = await runLightSync(root, { ...options, now });
  const operations = ["light_sync", ...light.operations];
  const config = await loadConfig(join(root, ".pipeline", "config.yaml")).catch(() => DEFAULT_GLOBAL_CONFIG);
  operations.push("config_check");

  if ((options.platform || "opencode") === "opencode") {
    await writeOpenCodeArtifacts(root, {
      config,
      profile: options.profile,
    });
    operations.push("opencode_artifacts");
  }

  const compact = await refreshCompactViews(root);
  if (compact.files.length) operations.push("compact_refresh");

  const result = {
    mode,
    heavy: mode === "deep",
    operations: unique(operations),
    external_changes: light.external_changes,
    compact_files: compact.files,
  };

  if (mode === "deep") {
    result.dependency_scan = await scanDependencies(root);
    result.architecture_hint = "Deep sync completed dependency scan; run architecture rescan when source layout changed.";
    result.operations.push("dependency_scan", "architecture_rescan_hint");
  }

  return result;
}

export async function runSessionStartLightSyncCheck(projectRoot = ".", options = {}) {
  const root = resolve(projectRoot);
  const externalChanges = await detectExternalChanges(root, options);
  const promptRequired = externalChanges.length > 0;
  return {
    mode: "session-start-light",
    heavy: false,
    operations: ["external_change_detection"],
    external_changes: externalChanges,
    prompt_required: promptRequired,
    prompt: promptRequired
      ? "External changes detected. Review them or run /hw:sync --light before heavier sync."
      : null,
  };
}

async function runLightSync(root, options = {}) {
  const operations = ["external_change_detection"];
  const externalChanges = await detectExternalChanges(root, options);

  if (options.registryFile && await exists(options.registryFile)) {
    await refreshProjectRegistryAction(options.registryFile, {
      platform: options.platform || "opencode",
      profile: options.profile || "standard",
      now: options.now,
    });
    operations.push("registry_refresh");
  }

  if (await exists(join(root, ".pipeline", "knowledge", "records"))) {
    await rebuildKnowledgeLedger(root);
    operations.push("knowledge_refresh");
  }

  return {
    mode: "light",
    heavy: false,
    operations: unique(operations),
    external_changes: externalChanges,
  };
}

async function detectExternalChanges(root, options = {}) {
  const changes = [];
  const status = git(root, ["status", "--short"], { allowFailure: true });
  const files = status.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (files.length) {
    changes.push({ type: "git_dirty", files });
  }

  const adapterMetadata = join(root, ".opencode", "hypo-workflow.json");
  if (!await exists(adapterMetadata)) {
    changes.push({ type: "adapter_missing", path: ".opencode/hypo-workflow.json" });
  } else {
    const configFile = join(root, ".pipeline", "config.yaml");
    if (await isNewer(configFile, adapterMetadata)) {
      changes.push({ type: "adapter_stale", path: ".opencode/hypo-workflow.json", source: ".pipeline/config.yaml" });
    }
  }

  if (options.includeKnowledge !== false && await isKnowledgeSourceNewer(root)) {
    changes.push({ type: "knowledge_stale", path: ".pipeline/knowledge/knowledge.compact.md" });
  }

  return changes;
}

async function refreshCompactViews(root) {
  const files = [];
  const progress = join(root, ".pipeline", "PROGRESS.md");
  if (await exists(progress)) {
    const source = await readFile(progress, "utf8");
    const compact = source.split(/\r?\n/).slice(0, 80).join("\n").trimEnd();
    await writeFile(join(root, ".pipeline", "PROGRESS.compact.md"), `${compact}\n`, "utf8");
    files.push(".pipeline/PROGRESS.compact.md");
  }
  return { files };
}

async function scanDependencies(root) {
  const pkgFile = join(root, "package.json");
  if (await exists(pkgFile)) {
    const pkg = JSON.parse(await readFile(pkgFile, "utf8"));
    return {
      source: "package.json",
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {},
    };
  }
  return {
    source: null,
    dependencies: {},
    devDependencies: {},
  };
}

function normalizeSyncMode(options = {}) {
  if (options.light) return "light";
  if (options.deep) return "deep";
  const mode = String(options.mode || "standard").replace(/^--/, "");
  if (["light", "standard", "deep"].includes(mode)) return mode;
  throw new Error(`Unsupported sync mode: ${options.mode}`);
}

async function isKnowledgeSourceNewer(root) {
  const recordsDir = join(root, ".pipeline", "knowledge", "records");
  const compactFile = join(root, ".pipeline", "knowledge", "knowledge.compact.md");
  if (!await exists(recordsDir)) return false;
  if (!await exists(compactFile)) return true;
  const compactStat = await stat(compactFile);
  let entries = [];
  try {
    entries = await readdir(recordsDir);
  } catch {
    return false;
  }
  for (const entry of entries) {
    if (await isNewer(join(recordsDir, entry), compactFile, compactStat)) return true;
  }
  return false;
}

async function isNewer(source, target, targetStat = null) {
  try {
    const sourceStat = await stat(source);
    const resolvedTargetStat = targetStat || await stat(target);
    return sourceStat.mtimeMs > resolvedTargetStat.mtimeMs;
  } catch {
    return false;
  }
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function git(cwd, args, options = {}) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(result.stderr || result.stdout || `git ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
}

function unique(values) {
  return [...new Set(values)];
}
