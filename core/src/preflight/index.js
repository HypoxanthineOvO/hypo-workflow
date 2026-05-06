import { access, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { parseYaml } from "../config/index.js";
import { checkDocs } from "../docs/index.js";
import { checkDerivedArtifacts } from "../sync/index.js";

const PROTECTED_AUTHORITY_PATHS = new Set([
  ".pipeline/state.yaml",
  ".pipeline/cycle.yaml",
  ".pipeline/rules.yaml",
]);

const SECRET_PATTERNS = [
  /\b(?:OPENAI|ANTHROPIC|DEEPSEEK|MIMO|GITHUB|GH|NPM)_?(?:API_?)?KEY\s*=\s*[A-Za-z0-9_\-]{8,}/i,
  /\bsk-[A-Za-z0-9_\-]{8,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/,
];

export async function runCodexPreflight(projectRoot = ".", options = {}) {
  const checks = [];
  checks.push(checkProtectedAuthorityWrites(options));
  checks.push(...await checkFormatValidity(projectRoot, options));
  checks.push(await checkDerivedHealth(projectRoot, options));
  checks.push(await checkReadmeFreshness(projectRoot, options));
  checks.push(await checkOutputLanguage(projectRoot, options));
  checks.push(...await checkSecretMarkers(projectRoot, options));
  checks.push(await checkEvidenceFiles(projectRoot, options));
  checks.push(await checkCodexNotify(projectRoot));

  const blocking = checks.filter((check) => check.status === "block");
  const warnings = checks.filter((check) => check.status === "warn");
  return {
    ok: blocking.length === 0,
    blocking_count: blocking.length,
    warning_count: warnings.length,
    next_action: blocking.length ? "fix_blocking_preflight" : "continue_or_complete",
    checks,
  };
}

function checkProtectedAuthorityWrites(options = {}) {
  const writes = arrayOfStrings(options.protected_writes || options.protectedWrites)
    .concat(arrayOfStrings(options.changed_files || options.changedFiles))
    .filter((path) => PROTECTED_AUTHORITY_PATHS.has(normalizePath(path)));
  if (!writes.length || options.authority_writes_committed || options.authorityWritesCommitted) {
    return pass("protected-authority-writes", "No uncommitted protected authority writes detected.");
  }
  return block("protected-authority-writes", `Protected authority writes need lifecycle commit evidence: ${unique(writes).join(", ")}`);
}

async function checkFormatValidity(root, options = {}) {
  const files = arrayOfStrings(options.files || options.changed_files || options.changedFiles)
    .filter((file) => /\.(ya?ml|json|md)$/i.test(file));
  const checks = [];
  for (const file of files) {
    const path = join(root, file);
    const content = await readOptionalText(path);
    if (!content) {
      checks.push(warn("format-validity", `File is missing or unreadable during preflight: ${file}`, { path: file }));
      continue;
    }
    try {
      if (/\.json$/i.test(file)) JSON.parse(content);
      if (/\.ya?ml$/i.test(file)) parseYaml(content);
      if (/\.md$/i.test(file) && content.includes("\u0000")) throw new Error("Markdown contains NUL byte");
      checks.push(pass("format-validity", `Format valid: ${file}`, { path: file }));
    } catch (error) {
      checks.push(block("format-validity", `Invalid format in ${file}: ${error.message}`, { path: file }));
    }
  }
  return checks.length ? checks : [pass("format-validity", "No YAML/JSON/Markdown files selected for format validation.")];
}

async function checkDerivedHealth(root, options = {}) {
  const health = await checkDerivedArtifacts(root, options.derived || {});
  if (health.error_count > 0) {
    return block("derived-artifacts", `Derived artifact authority conflicts: ${health.error_count}`, { health });
  }
  if (health.stale_count > 0) {
    return warn("derived-artifacts", `Derived artifacts are stale or missing: ${health.stale_count}`, { health });
  }
  return pass("derived-artifacts", "Derived artifacts are fresh.");
}

async function checkReadmeFreshness(root) {
  const result = await checkDocs(root).catch((error) => ({
    ok: false,
    failures: [{ check: "readme-freshness", message: error.message }],
    warnings: [],
  }));
  if (!result.ok) {
    return warn("readme-freshness", `README/docs freshness gaps: ${result.failures.length}`, {
      failures: result.failures,
    });
  }
  return pass("readme-freshness", "README/docs freshness checks passed.");
}

async function checkOutputLanguage(root) {
  const config = await readYamlIfPresent(join(root, ".pipeline", "config.yaml"));
  const language = config.output?.language || "auto";
  if (!/^zh(?:-|$)|zh-CN/i.test(language)) return pass("output-language", `Output language is ${language}.`);

  const progress = await readOptionalText(join(root, ".pipeline", "PROGRESS.md"));
  if (progress && !/[\u3400-\u9fff]/.test(progress)) {
    return warn("output-language", "output.language is zh-CN but PROGRESS.md does not appear to contain Chinese prose.");
  }
  return pass("output-language", "Chinese output language evidence is present.");
}

async function checkSecretMarkers(root, options = {}) {
  const files = arrayOfStrings(options.files || options.changed_files || options.changedFiles)
    .filter((file) => /\.(md|txt|ya?ml|json|toml|env)$/i.test(file));
  const checks = [];
  for (const file of files) {
    const content = await readOptionalText(join(root, file));
    if (!content) continue;
    if (SECRET_PATTERNS.some((pattern) => pattern.test(content))) {
      checks.push(block("secret-markers", `Potential secret marker found in ${file}.`, { path: file }));
    }
  }
  return checks.length ? checks : [pass("secret-markers", "No secret markers detected in selected files.")];
}

async function checkEvidenceFiles(root) {
  const missing = [];
  for (const file of [".pipeline/PROGRESS.md", ".pipeline/log.yaml"]) {
    if (!await exists(join(root, file))) missing.push(file);
  }
  if (!await hasReport(root)) missing.push(".pipeline/reports/*.md");
  if (missing.length) return block("completion-evidence", `Missing completion evidence: ${missing.join(", ")}`);
  return pass("completion-evidence", "Report, progress, and log evidence are present.");
}

async function checkCodexNotify(root) {
  const path = join(root, "hooks", "codex-notify.sh");
  if (!await exists(path)) {
    return warn("codex-notify", "Codex notify hook is optional and missing; recovery must rely on state/continuation files.");
  }
  const content = await readOptionalText(path);
  if (!/observability|not a runner|不是.*runner|非.*runner|只.*观测/i.test(content)) {
    return warn("codex-notify", "Codex notify exists but should state observability, not runner semantics.");
  }
  return pass("codex-notify", "Codex notify is present and treated as observability.");
}

function pass(id, message, extra = {}) {
  return { id, status: "pass", severity: "ok", message, ...extra };
}

function warn(id, message, extra = {}) {
  return { id, status: "warn", severity: "warning", message, ...extra };
}

function block(id, message, extra = {}) {
  return { id, status: "block", severity: "error", message, ...extra };
}

async function readYamlIfPresent(path) {
  const content = await readOptionalText(path);
  return content ? parseYaml(content) : {};
}

async function readOptionalText(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

async function hasReport(root) {
  try {
    const entries = await readdir(join(root, ".pipeline", "reports"));
    return entries.some((entry) => entry.endsWith(".md"));
  } catch {
    return false;
  }
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function arrayOfStrings(value) {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (!value) return [];
  return [String(value)];
}

function normalizePath(path) {
  return String(path).split("\\").join("/");
}

function unique(values) {
  return [...new Set(values)];
}
