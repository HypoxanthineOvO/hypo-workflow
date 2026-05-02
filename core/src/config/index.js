import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { DEFAULT_ANALYSIS_INTERACTION } from "../analysis/index.js";

export const DEFAULT_GLOBAL_CONFIG = Object.freeze({
  version: "10.0.0",
  agent: {
    platform: "codex",
    model: "default",
  },
  execution: {
    default_mode: "self",
    analysis: DEFAULT_ANALYSIS_INTERACTION,
    test_profiles: {
      enabled: true,
      selection: "auto",
      compose: true,
      profiles: [],
    },
  },
  subagent: {
    provider: "codex",
  },
  dashboard: {
    enabled: true,
    port: 7700,
  },
  plan: {
    default_mode: "interactive",
    interaction_depth: "medium",
    interactive: {
      min_rounds: 3,
      require_explicit_confirm: true,
    },
    discover: {
      progressive: true,
      big_questions_first: true,
      plan_extend_mode: "lightweight",
    },
  },
  output: {
    language: "zh-CN",
    timezone: "Asia/Shanghai",
  },
  opencode: {
    auto_continue: true,
    profile: "standard",
    compaction: {
      effective_context_target: 900000,
    },
    agents: {
      plan: {
        model: "gpt-5.5",
      },
      compact: {
        model: "deepseek-v4-flash",
      },
      test: {
        model: "gpt-5.4",
      },
      "code-a": {
        model: "gpt-5.4",
      },
      "code-b": {
        model: "gpt-5.4-mini",
      },
      debug: {
        model: "gpt-5.4",
      },
      report: {
        model: "gpt-5.4-mini",
      },
    },
  },
  release: {
    readme: {
      mode: "loose",
      full_regen: "auto",
    },
  },
  batch: {
    decompose_mode: "upfront",
    failure_policy: "skip_defer",
    auto_chain: true,
    default_gate: "auto",
  },
});

export async function loadConfig(file, defaults = DEFAULT_GLOBAL_CONFIG) {
  const raw = await readFile(file, "utf8");
  return mergeConfig(defaults, parseYaml(raw));
}

export async function writeConfig(file, config) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${stringifyYaml(config).trimEnd()}\n`, "utf8");
}

export function mergeConfig(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override;
  }
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    merged[key] = key in merged ? mergeConfig(merged[key], value) : value;
  }
  return merged;
}

export function parseYaml(source) {
  const lines = source
    .split(/\r?\n/)
    .filter((raw) => raw.trim() && !raw.trimStart().startsWith("#"))
    .map((raw) => ({
      indent: raw.match(/^ */)[0].length,
      text: raw.trim(),
    }));
  let index = 0;

  function parseNode(indent) {
    return lines[index]?.text.startsWith("-") ? parseArray(indent) : parseObject(indent);
  }

  function parseArray(indent) {
    const value = [];
    while (index < lines.length && lines[index].indent === indent && lines[index].text.startsWith("-")) {
      const rest = lines[index].text.slice(1).trim();
      index += 1;
      if (!rest) {
        value.push(index < lines.length && lines[index].indent > indent ? parseNode(lines[index].indent) : null);
        continue;
      }

      const pair = parseYamlKeyValue(rest);
      if (!pair) {
        value.push(parseScalar(rest));
        continue;
      }

      const item = {};
      item[pair.key] = pair.rawValue
        ? parseScalar(pair.rawValue)
        : index < lines.length && lines[index].indent > indent
          ? parseNode(lines[index].indent)
          : {};
      if (index < lines.length && lines[index].indent > indent) {
        Object.assign(item, parseObject(lines[index].indent));
      }
      value.push(item);
    }
    return value;
  }

  function parseObject(indent) {
    const object = {};
    while (index < lines.length && lines[index].indent === indent && !lines[index].text.startsWith("-")) {
      const pair = parseYamlKeyValue(lines[index].text);
      index += 1;
      if (!pair) continue;
      object[pair.key] = pair.rawValue
        ? parseScalar(pair.rawValue)
        : index < lines.length && lines[index].indent > indent
          ? parseNode(lines[index].indent)
          : {};
    }
    return object;
  }

  return lines.length ? parseNode(lines[0].indent) : {};
}

export function stringifyYaml(value, indent = 0) {
  if (!isPlainObject(value)) return `${" ".repeat(indent)}${formatScalar(value)}`;
  const lines = [];
  for (const [key, child] of Object.entries(value)) {
    if (Array.isArray(child)) {
      lines.push(`${" ".repeat(indent)}${key}:`);
      for (const item of child) {
        if (isPlainObject(item)) {
          lines.push(`${" ".repeat(indent + 2)}-`);
          lines.push(stringifyYaml(item, indent + 4));
        } else {
          lines.push(`${" ".repeat(indent + 2)}- ${formatScalar(item)}`);
        }
      }
    } else if (isPlainObject(child)) {
      lines.push(`${" ".repeat(indent)}${key}:`);
      lines.push(stringifyYaml(child, indent + 2));
    } else {
      lines.push(`${" ".repeat(indent)}${key}: ${formatScalar(child)}`);
    }
  }
  return lines.join("\n");
}

function nextMeaningful(lines, start) {
  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() && !line.trimStart().startsWith("#")) return line;
  }
  return null;
}

function parseYamlKeyValue(text) {
  const match = /^([^:]+):(.*)$/.exec(text);
  if (!match) return null;
  return {
    key: match[1].trim(),
    rawValue: match[2].trim(),
  };
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    return inner ? inner.split(",").map((item) => parseScalar(item.trim())) : [];
  }
  return trimmed;
}

function formatScalar(value) {
  if (typeof value === "string") {
    if (!value || /[:#\n]/.test(value) || /^\s|\s$/.test(value)) {
      return JSON.stringify(value);
    }
    return value;
  }
  return String(value);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
