import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseYaml } from "../config/index.js";

export async function loadRulesSummary(projectRoot = ".", repoRoot = process.cwd()) {
  const builtin = await loadBuiltinRules(join(repoRoot, "rules", "builtin"));
  const preset = await loadPreset(repoRoot, projectRoot);
  const lines = [`Rules: ${preset.name}`, `Source: ${preset.source}`, "", "[Built-in Rules]"];
  let enabled = 0;
  let errors = 0;
  let warns = 0;
  let off = 0;

  for (const rule of builtin) {
    const severity = preset.rules[rule.name] || rule.default_severity || "warn";
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
    const severity = preset.rules[rule.name] || rule.default_severity || "warn";
    if (severity !== "off" && Array.isArray(rule.hooks) && rule.hooks.includes("always")) {
      lines.push(`- ${rule.name} (${severity})`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function loadBuiltinRules(dir) {
  const entries = await readdir(dir);
  const rules = [];
  for (const entry of entries.filter((name) => name.endsWith(".yaml")).sort()) {
    const content = await readFile(join(dir, entry), "utf8");
    rules.push(parseYaml(content));
  }
  return rules;
}

async function loadPreset(repoRoot, projectRoot) {
  const projectRulesFile = join(projectRoot, ".pipeline", "rules.yaml");
  let projectRules = {};
  let presetName = "recommended";
  let source = "builtin defaults";
  try {
    projectRules = parseYaml(await readFile(projectRulesFile, "utf8"));
    presetName = typeof projectRules.extends === "string" ? projectRules.extends : "recommended";
    source = ".pipeline/rules.yaml";
  } catch {
    projectRules = {};
  }

  if (!["recommended", "strict", "minimal"].includes(presetName)) presetName = "recommended";
  const presetFile = join(repoRoot, "rules", "presets", `${presetName}.yaml`);
  const preset = parseYaml(await readFile(presetFile, "utf8"));
  return {
    name: presetName,
    source,
    rules: {
      ...(preset.rules || {}),
      ...(projectRules.rules || {}),
    },
  };
}
