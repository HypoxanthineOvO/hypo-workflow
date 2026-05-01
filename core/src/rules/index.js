import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { parseYaml } from "../config/index.js";

export async function loadRulesSummary(projectRoot = ".", repoRoot = process.cwd(), options = {}) {
  const builtin = await loadBuiltinRules(
    join(repoRoot, "rules", "builtin"),
    join(repoRoot, "rules", "packs"),
  );
  const preset = await loadPreset(repoRoot, projectRoot, builtin, options);
  const lines = [`Rules: ${preset.name}`, `Source: ${preset.source}`];
  for (const pack of preset.activePacks) {
    lines.push(`Pack: ${pack}`);
  }
  lines.push("", "[Built-in Rules]");
  let enabled = 0;
  let errors = 0;
  let warns = 0;
  let off = 0;

  for (const rule of builtin) {
    const severity = resolveSeverity(rule, preset.rules, preset.activePacks);
    if (severity === "error") {
      errors += 1;
      enabled += 1;
    } else if (severity === "warn") {
      warns += 1;
      enabled += 1;
    } else {
      off += 1;
    }
    lines.push(`${rule.name}\t${rule.label || "workflow"}\t${severity}\t${(rule.hooks || []).join(",") || "—"}`);
  }

  lines.push("");
  lines.push(`Summary: ${enabled}/${builtin.length} enabled | ${errors} error | ${warns} warn | ${off} off`);
  lines.push("");
  lines.push("[Always Rules]");
  for (const rule of builtin) {
    const severity = resolveSeverity(rule, preset.rules, preset.activePacks);
    if (severity !== "off" && Array.isArray(rule.hooks) && rule.hooks.includes("always")) {
      lines.push(`- ${rule.name} (${severity})`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function loadBuiltinRules(dir, packDir) {
  const entries = await readdir(dir);
  const rules = [];
  for (const entry of entries.filter((name) => name.endsWith(".yaml")).sort()) {
    const content = await readFile(join(dir, entry), "utf8");
    rules.push(parseYaml(content));
  }
  for (const file of await walkYaml(packDir)) {
    const content = await readFile(file, "utf8");
    const rule = parseYaml(content);
    const pack = derivePackId(packDir, file);
    rules.push({ ...rule, pack });
  }
  return rules;
}

async function loadPreset(repoRoot, projectRoot, builtin, options = {}) {
  const projectRulesFile = options.rulesFile || join(projectRoot, ".pipeline", "rules.yaml");
  let projectRules = {};
  let presetName = "recommended";
  let source = "builtin defaults";
  let activePacks = [];
  try {
    projectRules = parseYaml(await readFile(projectRulesFile, "utf8"));
    ({ presetName, activePacks } = resolveExtends(projectRules.extends));
    source = ".pipeline/rules.yaml";
  } catch {
    projectRules = {};
  }

  if (!["recommended", "strict", "minimal"].includes(presetName)) presetName = "recommended";
  const presetFile = join(repoRoot, "rules", "presets", `${presetName}.yaml`);
  const preset = parseYaml(await readFile(presetFile, "utf8"));
  const packRules = {};
  for (const rule of builtin) {
    if (rule.pack && activePacks.includes(rule.pack)) {
      packRules[rule.name] = rule.pack_default_severity || "warn";
    }
  }
  return {
    name: presetName,
    source,
    activePacks,
    rules: {
      ...(preset.rules || {}),
      ...packRules,
      ...(projectRules.rules || {}),
    },
  };
}

function resolveSeverity(rule, rules, activePacks) {
  if (rules[rule.name]) {
    return rules[rule.name];
  }
  if (rule.pack && activePacks.includes(rule.pack)) {
    return rule.pack_default_severity || "warn";
  }
  return rule.default_severity || "warn";
}

function resolveExtends(value) {
  const list = Array.isArray(value) ? value : value ? [value] : ["recommended"];
  const presetName = list.find((item) => ["recommended", "strict", "minimal"].includes(item)) || "recommended";
  const activePacks = list.filter((item) => /^@[^/]+\/[^/]+$/.test(item));
  return { presetName, activePacks };
}

async function walkYaml(dir) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkYaml(full)));
    } else if (entry.isFile() && entry.name.endsWith(".yaml")) {
      files.push(full);
    }
  }
  return files.sort();
}

function derivePackId(packDir, file) {
  const rel = relative(packDir, file);
  const parts = rel.split(sep);
  if (parts.length < 3) {
    return null;
  }
  return `@${parts[0]}/${parts[1]}`;
}
