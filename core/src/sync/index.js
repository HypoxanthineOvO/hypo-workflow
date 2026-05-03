import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { DEFAULT_GLOBAL_CONFIG, loadConfig, parseYaml, stringifyYaml } from "../config/index.js";
import { writeOpenCodeArtifacts } from "../artifacts/opencode.js";
import { refreshProjectRegistryAction } from "../actions/index.js";
import { rebuildKnowledgeLedger } from "../knowledge/index.js";

const PROTECTED_AUTHORITY_PATHS = Object.freeze([
  ".pipeline/state.yaml",
  ".pipeline/cycle.yaml",
  ".pipeline/rules.yaml",
]);

export async function runProjectSync(projectRoot = ".", options = {}) {
  const root = resolve(projectRoot);
  const mode = normalizeSyncMode(options);
  const now = options.now || new Date().toISOString();

  if (options.checkOnly || options.check_only) {
    const externalChanges = await detectExternalChanges(root, options);
    const derivedHealth = await checkDerivedArtifacts(root, { ...options, now });
    return {
      mode,
      check_only: true,
      heavy: false,
      operations: ["external_change_detection", "derived_check"],
      external_changes: externalChanges,
      derived_health: derivedHealth,
    };
  }

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

  let compact = { files: [] };
  let derivedHealth = null;
  if (options.repair || mode === "deep") {
    const repair = await repairDerivedArtifacts(root, { ...options, now, config });
    compact = { files: repair.refreshed };
    derivedHealth = repair.health;
    operations.push("derived_repair");
  } else {
    compact = await refreshCompactViews(root);
    derivedHealth = await checkDerivedArtifacts(root, { ...options, now });
    operations.push("derived_check");
  }
  if (compact.files.length) operations.push("compact_refresh");

  const result = {
    mode,
    heavy: mode === "deep",
    operations: unique(operations),
    external_changes: light.external_changes,
    compact_files: compact.files,
    derived_health: derivedHealth,
  };

  if (mode === "deep") {
    result.dependency_scan = await scanDependencies(root);
    result.architecture_hint = "Deep sync completed dependency scan; run architecture rescan when source layout changed.";
    result.operations.push("dependency_scan", "architecture_rescan_hint");
  }

  return result;
}

export function buildDerivedArtifactMap() {
  return [
    {
      id: "progress_compact",
      path: ".pipeline/PROGRESS.compact.md",
      authority: [".pipeline/PROGRESS.md"],
      derived_from: [".pipeline/PROGRESS.md"],
      protected_authorities: [],
      writer_commands: ["/hw:compact", "/hw:sync --repair", "/hw:sync --deep"],
      refresh_triggers: ["progress_update", "compact_refresh", "sync_repair"],
      staleness_severity: "warning",
      repair_behavior: "safe_refresh",
      refresh: renderProgressCompact,
    },
    {
      id: "metrics_compact",
      path: ".pipeline/metrics.compact.yaml",
      authority: [".pipeline/metrics.yaml"],
      derived_from: [".pipeline/metrics.yaml"],
      protected_authorities: [],
      writer_commands: ["/hw:sync --repair", "/hw:sync --deep"],
      refresh_triggers: ["metrics_update", "sync_repair"],
      staleness_severity: "warning",
      repair_behavior: "safe_refresh",
      refresh: renderMetricsCompact,
    },
    {
      id: "reports_compact",
      path: ".pipeline/reports.compact.md",
      authority: [".pipeline/reports"],
      derived_from: [".pipeline/reports"],
      protected_authorities: [],
      writer_commands: ["/hw:compact", "/hw:sync --repair", "/hw:sync --deep"],
      refresh_triggers: ["report_written", "sync_repair"],
      staleness_severity: "warning",
      repair_behavior: "safe_refresh",
      refresh: renderReportsCompact,
    },
    {
      id: "project_summary",
      path: "PROJECT-SUMMARY.md",
      authority: [".pipeline/state.yaml", ".pipeline/cycle.yaml", ".pipeline/config.yaml", ".pipeline/PROGRESS.md"],
      derived_from: [".pipeline/state.yaml", ".pipeline/cycle.yaml", ".pipeline/config.yaml", ".pipeline/PROGRESS.md"],
      protected_authorities: PROTECTED_AUTHORITY_PATHS,
      writer_commands: ["/hw:sync --repair", "/hw:sync --deep"],
      refresh_triggers: ["lifecycle_commit", "progress_update", "sync_repair"],
      staleness_severity: "warning",
      repair_behavior: "safe_refresh",
      refresh: renderProjectSummary,
    },
    {
      id: "opencode_metadata",
      path: ".opencode/hypo-workflow.json",
      authority: [".pipeline/config.yaml", "core/src/commands/index.js"],
      derived_from: [".pipeline/config.yaml", "core/src/commands/index.js"],
      protected_authorities: [],
      writer_commands: ["hypo-workflow sync --platform opencode", "/hw:sync", "/hw:sync --repair"],
      refresh_triggers: ["config_update", "adapter_sync", "sync_repair"],
      staleness_severity: "warning",
      repair_behavior: "adapter_refresh",
    },
    {
      id: "readme_managed_blocks",
      path: "README.md",
      authority: ["core/src/commands/index.js", "core/src/platform/index.js"],
      derived_from: ["core/src/commands/index.js", "core/src/platform/index.js"],
      protected_authorities: [],
      writer_commands: ["/hw:docs repair", "/hw:release"],
      refresh_triggers: ["command_registry_update", "platform_matrix_update", "docs_repair"],
      staleness_severity: "info",
      repair_behavior: "explicit_docs_repair",
    },
  ].map((entry) => ({
    protected_authority: false,
    ...entry,
  }));
}

export async function checkDerivedArtifacts(projectRoot = ".", options = {}) {
  const root = resolve(projectRoot);
  const map = options.map || buildDerivedArtifactMap();
  const artifacts = [];
  for (const entry of map) {
    artifacts.push(await assessDerivedArtifact(root, normalizeDerivedEntry(entry)));
  }
  const staleCount = artifacts.filter((artifact) => ["missing", "stale"].includes(artifact.status)).length;
  const errors = artifacts.filter((artifact) => artifact.status === "authority_conflict");
  return {
    ok: errors.length === 0 && staleCount === 0,
    checked_at: options.now || new Date().toISOString(),
    stale_count: staleCount,
    error_count: errors.length,
    artifacts,
  };
}

export async function repairDerivedArtifacts(projectRoot = ".", options = {}) {
  const root = resolve(projectRoot);
  const map = (options.map || buildDerivedArtifactMap()).map(normalizeDerivedEntry);
  const refreshed = [];
  const skipped = [];
  const failures = [];

  for (const entry of map) {
    const assessment = await assessDerivedArtifact(root, entry);
    if (assessment.status === "authority_conflict") {
      failures.push({ id: entry.id, path: entry.path, reason: assessment.reason });
      continue;
    }
    if (entry.repair_behavior !== "safe_refresh") {
      skipped.push({ id: entry.id, path: entry.path, reason: entry.repair_behavior });
      continue;
    }
    try {
      const content = await entry.refresh(root, entry, options);
      if (content === null || content === undefined) {
        skipped.push({ id: entry.id, path: entry.path, reason: "source_missing" });
        continue;
      }
      await writeText(join(root, entry.path), content);
      refreshed.push(entry.path);
    } catch (error) {
      failures.push({ id: entry.id, path: entry.path, reason: error.message || String(error) });
    }
  }

  const health = await checkDerivedArtifacts(root, { ...options, map });
  const record = {
    ok: health.ok,
    checked_at: health.checked_at,
    stale_count: health.stale_count,
    error_count: health.error_count,
    refreshed,
    skipped,
    failures,
    artifacts: health.artifacts.map((artifact) => ({
      id: artifact.id,
      path: artifact.path,
      status: artifact.status,
      severity: artifact.severity,
      repair_hint: artifact.repair_hint,
    })),
  };
  await writeText(join(root, ".pipeline", "derived-health.yaml"), `${stringifyYaml(record).trimEnd()}\n`);

  return {
    refreshed,
    skipped,
    failures,
    health,
  };
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
    const compact = await renderProgressCompact(root);
    await writeFile(join(root, ".pipeline", "PROGRESS.compact.md"), compact, "utf8");
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

async function assessDerivedArtifact(root, entry) {
  if (PROTECTED_AUTHORITY_PATHS.includes(entry.path)) {
    return {
      id: entry.id,
      path: entry.path,
      status: "authority_conflict",
      severity: "error",
      reason: "derived target overlaps protected authority",
      authority: entry.authority,
      derived_from: entry.derived_from,
      writer_commands: entry.writer_commands,
      refresh_triggers: entry.refresh_triggers,
      repair_behavior: "requires_confirmation",
      repair_hint: `Refusing to treat protected authority ${entry.path} as a derived artifact; repair requires explicit confirmation.`,
    };
  }

  const target = await maxMtime(root, entry.path);
  const sources = [];
  for (const source of entry.derived_from) {
    const sourceMtime = await maxMtime(root, source);
    sources.push({ path: source, exists: sourceMtime.exists, mtimeMs: sourceMtime.mtimeMs });
  }
  const existingSources = sources.filter((source) => source.exists);
  if (!target.exists && !existingSources.length) {
    return derivedStatus(entry, "missing_sources", target, sources);
  }
  if (!target.exists) {
    return derivedStatus(entry, "missing", target, sources);
  }
  if (existingSources.some((source) => source.mtimeMs > target.mtimeMs)) {
    return derivedStatus(entry, "stale", target, sources);
  }
  return derivedStatus(entry, "fresh", target, sources);
}

function derivedStatus(entry, status, target, sources) {
  const needsRepair = ["missing", "stale"].includes(status);
  return {
    id: entry.id,
    path: entry.path,
    status,
    severity: needsRepair ? entry.staleness_severity : "ok",
    authority: entry.authority,
    derived_from: entry.derived_from,
    protected_authorities: entry.protected_authorities,
    writer_commands: entry.writer_commands,
    refresh_triggers: entry.refresh_triggers,
    repair_behavior: entry.repair_behavior,
    target_mtime_ms: target.exists ? target.mtimeMs : null,
    sources,
    repair_hint: needsRepair ? repairHint(entry) : null,
  };
}

function repairHint(entry) {
  if (entry.repair_behavior === "safe_refresh") return `Run /hw:sync --repair to refresh ${entry.path}.`;
  if (entry.repair_behavior === "adapter_refresh") return "Run /hw:sync to refresh platform adapters.";
  return `Run ${entry.writer_commands[0] || "/hw:docs repair"} to repair ${entry.path}.`;
}

function normalizeDerivedEntry(entry = {}) {
  return {
    id: entry.id || entry.path,
    path: entry.path,
    authority: arrayOfStrings(entry.authority || entry.authorities || entry.derived_from),
    derived_from: arrayOfStrings(entry.derived_from || entry.authority || entry.authorities),
    protected_authorities: arrayOfStrings(entry.protected_authorities),
    writer_commands: arrayOfStrings(entry.writer_commands || entry.writers),
    refresh_triggers: arrayOfStrings(entry.refresh_triggers || entry.triggers),
    staleness_severity: entry.staleness_severity || "warning",
    repair_behavior: entry.repair_behavior || "manual_repair",
    refresh: entry.refresh,
  };
}

async function renderProgressCompact(root) {
  const source = await readOptionalText(join(root, ".pipeline", "PROGRESS.md"));
  if (!source) return null;
  return `${source.split(/\r?\n/).slice(0, 80).join("\n").trimEnd()}\n`;
}

async function renderMetricsCompact(root) {
  const source = await readOptionalText(join(root, ".pipeline", "metrics.yaml"));
  if (!source) return null;
  return `${source.split(/\r?\n/).slice(0, 120).join("\n").trimEnd()}\n`;
}

async function renderReportsCompact(root) {
  const reportsDir = join(root, ".pipeline", "reports");
  let entries = [];
  try {
    entries = await readdir(reportsDir);
  } catch {
    return null;
  }
  const reports = [];
  for (const entry of entries.filter((name) => name.endsWith(".md")).sort()) {
    const source = await readOptionalText(join(reportsDir, entry));
    if (!source) continue;
    const title = source.split(/\r?\n/).find((line) => /^#\s+/.test(line)) || `# ${entry}`;
    const result = /-\s*Result:\s*(.+)/i.exec(source)?.[1] || /Decision:\s*(.+)/i.exec(source)?.[1] || "unknown";
    reports.push(`- ${title.replace(/^#\s+/, "")} (${entry}) result=${result}`);
  }
  if (!reports.length) return null;
  return `# Reports Compact\n\n${reports.join("\n")}\n`;
}

async function renderProjectSummary(root) {
  const config = await readYaml(join(root, ".pipeline", "config.yaml"));
  const state = await readYaml(join(root, ".pipeline", "state.yaml"));
  const cycle = await readYaml(join(root, ".pipeline", "cycle.yaml"));
  const progress = await readOptionalText(join(root, ".pipeline", "PROGRESS.md"));
  const pipelineName = state.pipeline?.name || config.pipeline?.name || "Hypo-Workflow Project";
  const cycleId = cycle.cycle?.id || cycle.cycle?.number || "n/a";
  const current = state.current?.prompt_name || "n/a";
  const progressLine = progress
    .split(/\r?\n/)
    .find((line) => /M\d+|F\d+|进度|Status|状态/.test(line))
    || "See .pipeline/PROGRESS.md";
  return [
    `# ${pipelineName}`,
    "",
    "This file is a generated Hypo-Workflow project summary. Edit authority files under `.pipeline/`, then run `/hw:sync --repair`.",
    "",
    `- Pipeline status: ${state.pipeline?.status || "unknown"}`,
    `- Cycle: ${cycleId}`,
    `- Current: ${current}`,
    `- Step: ${state.current?.step || "n/a"}`,
    `- Progress: ${state.pipeline?.prompts_completed ?? "n/a"}/${state.pipeline?.prompts_total ?? "n/a"}`,
    `- Progress note: ${progressLine.replace(/^#+\s*/, "")}`,
  ].join("\n") + "\n";
}

async function readYaml(file) {
  const source = await readOptionalText(file);
  return source ? parseYaml(source) : {};
}

async function readOptionalText(file) {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

async function writeText(file, content) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

async function maxMtime(root, relativePath) {
  const path = join(root, relativePath);
  try {
    const stats = await stat(path);
    if (!stats.isDirectory()) return { exists: true, mtimeMs: stats.mtimeMs };
    const childTimes = await maxDirectoryMtime(path);
    return { exists: true, mtimeMs: Math.max(stats.mtimeMs, childTimes) };
  } catch (error) {
    if (error.code === "ENOENT") return { exists: false, mtimeMs: 0 };
    throw error;
  }
}

async function maxDirectoryMtime(dir) {
  let max = 0;
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return max;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    const stats = await stat(path);
    max = Math.max(max, stats.mtimeMs);
    if (entry.isDirectory()) max = Math.max(max, await maxDirectoryMtime(path));
  }
  return max;
}

function arrayOfStrings(value) {
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);
  if (!value) return [];
  return [String(value)];
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
