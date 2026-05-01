import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export const DEFAULT_GLOBAL_CONFIG = Object.freeze({
  version: "9.1.1-alpha.0",
  agent: {
    platform: "codex",
    model: "default",
  },
  execution: {
    default_mode: "self",
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
  const root = {};
  const stack = [{ indent: -1, value: root }];
  const lines = source.split(/\r?\n/);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const rawLine = lines[lineIndex];
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;
    const indent = rawLine.match(/^ */)[0].length;
    const line = rawLine.trim();
    while (stack.length > 1 && indent <= stack.at(-1).indent) stack.pop();
    const parent = stack.at(-1).value;

    if (line.startsWith("- ")) {
      if (!Array.isArray(parent)) {
        throw new Error(`YAML list item without array parent: ${line}`);
      }
      parent.push(parseScalar(line.slice(2).trim()));
      continue;
    }

    const match = /^([^:]+):(.*)$/.exec(line);
    if (!match) continue;
    const key = match[1].trim();
    const rawValue = match[2].trim();

    if (!rawValue) {
      const next = nextMeaningful(lines, lineIndex + 1);
      const child = next && next.trim().startsWith("- ") ? [] : {};
      parent[key] = child;
      stack.push({ indent, value: child });
      continue;
    }
    parent[key] = parseScalar(rawValue);
  }
  return root;
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
