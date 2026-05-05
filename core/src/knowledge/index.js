import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { redactSecrets } from "../evidence/index.js";

export const KNOWLEDGE_RECORD_TYPES = Object.freeze([
  "milestone",
  "patch",
  "chat",
  "explore",
  "release",
  "sync",
]);

export const KNOWLEDGE_INDEX_CATEGORIES = Object.freeze([
  "dependencies",
  "references",
  "pitfalls",
  "decisions",
  "config-notes",
  "secret-refs",
]);

export const DEFAULT_KNOWLEDGE_CONFIG = Object.freeze({
  enabled: true,
  root: ".pipeline/knowledge",
  loading: {
    session_start: true,
    compact: true,
    indexes: [...KNOWLEDGE_INDEX_CATEGORIES],
    records: false,
  },
  compaction: {
    auto: true,
    max_records_per_category: 50,
    compact_file: ".pipeline/knowledge/knowledge.compact.md",
  },
  redaction: {
    enabled: true,
    replacement: "[REDACTED]",
    secret_keys: [
      "api_key",
      "token",
      "secret",
      "password",
      "authorization",
      "access_token",
      "refresh_token",
      "client_secret",
    ],
  },
  strictness: {
    invalid_record: "warn",
    missing_index: "warn",
    secret_leak: "error",
  },
});

const REQUIRED_RECORD_FIELDS = Object.freeze([
  "schema_version",
  "id",
  "type",
  "source",
  "created_at",
  "summary",
  "details",
  "tags",
  "categories",
  "refs",
]);

const SOURCE_FIELDS_BY_TYPE = Object.freeze({
  milestone: ["cycle", "feature", "milestone", "prompt_file"],
  patch: ["patch"],
  chat: ["session_id"],
  explore: ["explore_id"],
  release: ["version"],
  sync: ["sync_id"],
});

const CATEGORY_TITLES = Object.freeze({
  dependencies: "Dependencies",
  references: "References",
  pitfalls: "Pitfalls",
  decisions: "Decisions",
  "config-notes": "Config Notes",
  "secret-refs": "Secret Refs",
});

export function validateKnowledgeRecord(record = {}) {
  const errors = [];
  for (const field of REQUIRED_RECORD_FIELDS) {
    if (!(field in record)) errors.push(`missing required field: ${field}`);
  }

  if (!KNOWLEDGE_RECORD_TYPES.includes(record.type)) {
    errors.push(`unsupported record type: ${record.type}`);
  }

  const source = record.source || {};
  for (const field of SOURCE_FIELDS_BY_TYPE[record.type] || []) {
    if (!(field in source)) errors.push(`missing source field for ${record.type}: ${field}`);
  }

  for (const field of ["tags", "categories"]) {
    if (!Array.isArray(record[field])) errors.push(`${field} must be an array`);
  }

  for (const category of Array.isArray(record.categories) ? record.categories : []) {
    if (!KNOWLEDGE_INDEX_CATEGORIES.includes(category)) {
      errors.push(`unsupported category: ${category}`);
    }
  }

  if (!isPlainObject(record.refs)) {
    errors.push("refs must be an object");
  }

  for (const secretRef of Array.isArray(record.secret_refs) ? record.secret_refs : []) {
    if (!secretRef.provider) errors.push("secret_refs.provider is required");
    if (!secretRef.env) errors.push("secret_refs.env is required");
    for (const forbidden of ["raw_value", "value", "secret", "token", "api_key", "password"]) {
      if (Object.hasOwn(secretRef, forbidden)) {
        errors.push(`secret_refs must not store raw secret field: ${forbidden}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

export function normalizeKnowledgeRecord(record = {}, options = {}) {
  const redactionOptions = options.redaction ? { redaction: options.redaction } : {};
  const normalized = redactKnowledgeSecrets({
    schema_version: record.schema_version || "1",
    type: normalizeRecordType(record.type || "milestone"),
    source: normalizeKnowledgeSource(record.source || {}, record.type || "milestone"),
    created_at: record.created_at || new Date().toISOString(),
    summary: String(record.summary || "").trim(),
    details: isPlainObject(record.details) ? record.details : {},
    tags: normalizeStringList(record.tags).map((tag) => slugify(tag)),
    categories: normalizeCategories(record.categories),
    refs: isPlainObject(record.refs) ? record.refs : {},
    ...(Array.isArray(record.secret_refs) ? { secret_refs: normalizeSecretRefs(record.secret_refs) } : {}),
  }, redactionOptions);

  const id = record.id || buildKnowledgeRecordId(normalized);
  return {
    id,
    ...normalized,
  };
}

export function normalizeKnowledgeSourceRef(value) {
  const ref = String(value || "").trim();
  const milestone = /^C(\d+)\/M(\d+)$/i.exec(ref);
  if (milestone) {
    return {
      kind: "milestone",
      ref: `C${Number(milestone[1])}/M${String(Number(milestone[2])).padStart(2, "0")}`,
      cycle: `C${Number(milestone[1])}`,
      milestone: `M${String(Number(milestone[2])).padStart(2, "0")}`,
    };
  }

  const patch = /^P(\d+)$/i.exec(ref);
  if (patch) {
    const id = `P${String(Number(patch[1])).padStart(3, "0")}`;
    return { kind: "patch", ref: id, patch: id };
  }

  const explore = /^E(\d+)$/i.exec(ref);
  if (explore) {
    const id = `E${String(Number(explore[1])).padStart(3, "0")}`;
    return { kind: "explore", ref: id, explore_id: id };
  }

  return { kind: "unknown", ref };
}

export function redactKnowledgeSecrets(value, options = {}) {
  const config = {
    ...DEFAULT_KNOWLEDGE_CONFIG.redaction,
    ...(options.redaction || options),
  };
  if (config.enabled === false) return value;
  return redactSecrets(value, {
    replacement: config.replacement,
    preservePaths: ["secret_refs"],
  });
}

export function buildKnowledgeLoadPlan(config = DEFAULT_KNOWLEDGE_CONFIG) {
  const merged = mergeObjects(DEFAULT_KNOWLEDGE_CONFIG, config || {});
  const root = merged.root || ".pipeline/knowledge";
  const loading = merged.loading || {};
  const indexes = loading.indexes === true
    ? [...KNOWLEDGE_INDEX_CATEGORIES]
    : Array.isArray(loading.indexes)
      ? loading.indexes
      : [];

  return {
    enabled: Boolean(merged.enabled),
    session_start: Boolean(loading.session_start),
    compact: loading.compact === false ? null : merged.compaction?.compact_file || `${root}/knowledge.compact.md`,
    indexes: indexes.map((category) => `${root}/index/${category}.yaml`),
    records: loading.records ? [`${root}/records/*.yaml`] : [],
  };
}

export async function appendKnowledgeRecord(projectRoot, record, options = {}) {
  const normalized = normalizeKnowledgeRecord(record, options);
  const result = validateKnowledgeRecord(normalized);
  if (!result.ok) {
    throw new Error(`Invalid knowledge record:\n${result.errors.join("\n")}`);
  }

  const root = knowledgeRoot(projectRoot, options);
  const recordsDir = join(root, "records");
  await mkdir(recordsDir, { recursive: true });
  const path = join(recordsDir, `${normalized.id}.yaml`);
  await writeFile(path, `${stringifyKnowledgeYaml(normalized)}\n`, "utf8");
  return { record: normalized, path };
}

export async function rebuildKnowledgeIndexes(projectRoot, options = {}) {
  const records = await loadKnowledgeRecords(projectRoot, options);
  const root = knowledgeRoot(projectRoot, options);
  const indexDir = join(root, "index");
  await mkdir(indexDir, { recursive: true });

  const files = {};
  for (const category of KNOWLEDGE_INDEX_CATEGORIES) {
    const index = buildCategoryIndex(category, records, options);
    const path = join(indexDir, `${category}.yaml`);
    await writeFile(path, `${stringifyKnowledgeYaml(index)}\n`, "utf8");
    files[category] = path;
  }

  return { records, files };
}

export async function renderKnowledgeCompact(projectRoot, options = {}) {
  const records = options.records || await loadKnowledgeRecords(projectRoot, options);
  const content = renderCompactContent(records, options);
  const compactFile = options.compact_file || DEFAULT_KNOWLEDGE_CONFIG.compaction.compact_file;
  const path = join(projectRoot, compactFile);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content.endsWith("\n") ? content : `${content}\n`, "utf8");
  return { path, content };
}

export async function rebuildKnowledgeLedger(projectRoot, options = {}) {
  const indexes = await rebuildKnowledgeIndexes(projectRoot, options);
  const compact = await renderKnowledgeCompact(projectRoot, { ...options, records: indexes.records });
  return {
    records: indexes.records,
    indexes: indexes.files,
    compact: compact.path,
  };
}

export async function loadKnowledgeRecords(projectRoot, options = {}) {
  const recordsDir = join(knowledgeRoot(projectRoot, options), "records");
  let entries = [];
  try {
    entries = await readdir(recordsDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const records = [];
  for (const entry of entries.filter((item) => item.isFile() && item.name.endsWith(".yaml")).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(recordsDir, entry.name);
    const record = parseKnowledgeYaml(await readFile(path, "utf8"));
    const normalized = normalizeKnowledgeRecord(record, options);
    const result = validateKnowledgeRecord(normalized);
    if (!result.ok) {
      throw new Error(`Invalid knowledge record ${relative(projectRoot, path)}:\n${result.errors.join("\n")}`);
    }
    records.push(normalized);
  }
  return records.sort(compareRecords);
}

function mergeObjects(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override;
  }
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    merged[key] = key in merged ? mergeObjects(merged[key], value) : value;
  }
  return merged;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeRecordType(type) {
  return String(type || "").trim().toLowerCase();
}

function normalizeKnowledgeSource(source, type) {
  if (typeof source === "string") {
    const sourceRef = normalizeKnowledgeSourceRef(source);
    if (sourceRef.kind === "milestone") return { cycle: sourceRef.cycle, milestone: sourceRef.milestone };
    if (sourceRef.kind === "patch") return { patch: sourceRef.patch };
    if (sourceRef.kind === "explore") return { explore_id: sourceRef.explore_id };
  }

  const result = { ...(isPlainObject(source) ? source : {}) };
  if ("cycle" in result) result.cycle = normalizePrefixedId(result.cycle, "C", 0);
  if ("feature" in result) result.feature = normalizePrefixedId(result.feature, "F", 3);
  if ("milestone" in result) result.milestone = normalizePrefixedId(result.milestone, "M", 2);
  if ("patch" in result) result.patch = normalizePrefixedId(result.patch, "P", 3);
  if ("explore_id" in result) result.explore_id = normalizePrefixedId(result.explore_id, "E", 3);
  if ("sync_id" in result) result.sync_id = String(result.sync_id).trim();
  if ("version" in result) result.version = String(result.version).trim();

  if (type === "patch" && !result.patch && result.id) result.patch = normalizePrefixedId(result.id, "P", 3);
  return result;
}

function normalizePrefixedId(value, prefix, width) {
  const raw = String(value || "").trim();
  const match = new RegExp(`^${prefix}?(\\d+)$`, "i").exec(raw);
  if (!match) return raw.toUpperCase();
  const number = String(Number(match[1]));
  return `${prefix}${width ? number.padStart(width, "0") : number}`;
}

function normalizeStringList(value) {
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return [...new Set(values.map((item) => String(item).trim()).filter(Boolean))];
}

function normalizeCategories(value) {
  const normalized = [...new Set(normalizeStringList(value).map((category) => {
    const normalized = category.toLowerCase().replace(/[_\s]+/g, "-");
    return normalized === "secret-ref" ? "secret-refs" : normalized;
  }).filter((category) => KNOWLEDGE_INDEX_CATEGORIES.includes(category)))];
  return KNOWLEDGE_INDEX_CATEGORIES.filter((category) => normalized.includes(category));
}

function normalizeSecretRefs(secretRefs) {
  return secretRefs.map((secretRef) => {
    const result = {};
    for (const [key, value] of Object.entries(secretRef || {})) {
      if (["raw_value", "value", "secret", "token", "api_key", "password"].includes(key)) continue;
      result[key] = typeof value === "string" ? value.trim() : value;
    }
    return result;
  });
}

function buildKnowledgeRecordId(record) {
  const source = formatKnowledgeSource(record).replace("/", "-");
  const summary = slugify(record.summary || record.type || "knowledge-record");
  const hash = createHash("sha256").update(stableStringify(record)).digest("hex").slice(0, 8);
  return `${source}-${summary || "knowledge-record"}-${hash}`;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function knowledgeRoot(projectRoot, options = {}) {
  return join(projectRoot, options.root || DEFAULT_KNOWLEDGE_CONFIG.root);
}

function buildCategoryIndex(category, records, options = {}) {
  const max = Number(options.max_records_per_category || DEFAULT_KNOWLEDGE_CONFIG.compaction.max_records_per_category);
  const entries = records
    .filter((record) => record.categories.includes(category))
    .slice(0, max > 0 ? max : undefined)
    .map((record) => ({
      record_id: record.id,
      type: record.type,
      source: formatKnowledgeSource(record),
      created_at: record.created_at,
      summary: record.summary,
      tags: record.tags,
      refs: record.refs,
      items: categoryItems(record, category),
    }));

  return {
    schema_version: "1",
    category,
    entries,
  };
}

function categoryItems(record, category) {
  if (category === "secret-refs") return record.secret_refs || [];
  const details = record.details || {};
  const value = details[category] ?? details[category.replace(/-/g, "_")];
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function renderCompactContent(records, options = {}) {
  const max = Number(options.max_records_per_category || DEFAULT_KNOWLEDGE_CONFIG.compaction.max_records_per_category);
  const lines = [
    "# Knowledge Compact",
    "",
    "Generated from `.pipeline/knowledge/records/*.yaml`. Raw records are loaded only on demand.",
  ];

  for (const category of KNOWLEDGE_INDEX_CATEGORIES) {
    const entries = records
      .filter((record) => record.categories.includes(category))
      .slice(0, max > 0 ? max : undefined);
    lines.push("", `## ${CATEGORY_TITLES[category]}`);
    if (!entries.length) {
      lines.push("- n/a");
      continue;
    }
    for (const record of entries) {
      const itemSummary = summarizeItems(categoryItems(record, category));
      lines.push(`- ${record.id} (${formatKnowledgeSource(record)}): ${record.summary}${itemSummary ? ` - ${itemSummary}` : ""}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function summarizeItems(items) {
  if (!items.length) return "";
  const first = items[0];
  if (typeof first === "string") return first;
  if (isPlainObject(first)) {
    return first.title || first.name || first.issue || first.key || first.env || first.purpose || "";
  }
  return String(first);
}

function formatKnowledgeSource(record) {
  const source = record.source || {};
  if (record.type === "milestone") return `${source.cycle}/${source.milestone}`;
  if (record.type === "patch") return source.patch;
  if (record.type === "explore") return source.explore_id;
  if (record.type === "chat") return source.session_id;
  if (record.type === "release") return source.version;
  if (record.type === "sync") return source.sync_id;
  return "unknown";
}

function compareRecords(a, b) {
  return String(b.created_at).localeCompare(String(a.created_at)) || a.id.localeCompare(b.id);
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  if (isPlainObject(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function stringifyKnowledgeYaml(value, indent = 0) {
  if (!isPlainObject(value)) return `${" ".repeat(indent)}${formatScalar(value)}`;
  const lines = [];
  for (const [key, child] of Object.entries(value)) {
    if (Array.isArray(child)) {
      lines.push(`${" ".repeat(indent)}${key}:`);
      for (const item of child) {
        if (isPlainObject(item)) {
          lines.push(`${" ".repeat(indent + 2)}-`);
          lines.push(stringifyKnowledgeYaml(item, indent + 4));
        } else {
          lines.push(`${" ".repeat(indent + 2)}- ${formatScalar(item)}`);
        }
      }
    } else if (isPlainObject(child)) {
      lines.push(`${" ".repeat(indent)}${key}:`);
      lines.push(stringifyKnowledgeYaml(child, indent + 2));
    } else {
      lines.push(`${" ".repeat(indent)}${key}: ${formatScalar(child)}`);
    }
  }
  return lines.join("\n");
}

function parseKnowledgeYaml(source) {
  const lines = source
    .split(/\r?\n/)
    .filter((raw) => raw.trim() && !raw.trimStart().startsWith("#"))
    .map((raw) => ({ indent: raw.match(/^ */)[0].length, text: raw.trim() }));
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
      if (rest.startsWith('"') || rest.startsWith("'") || rest.startsWith("[")) {
        value.push(parseScalar(rest));
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

function parseYamlKeyValue(text) {
  const match = /^([^:]+):(.*)$/.exec(text);
  return match ? { key: match[1].trim(), rawValue: match[2].trim() } : null;
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
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
    if (!value || /[:#\n]/.test(value) || /^\s|\s$/.test(value)) return JSON.stringify(value);
    return value;
  }
  if (value === null || value === undefined) return "null";
  return String(value);
}
