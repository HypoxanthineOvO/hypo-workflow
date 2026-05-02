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

export function redactKnowledgeSecrets(value, options = {}) {
  const config = {
    ...DEFAULT_KNOWLEDGE_CONFIG.redaction,
    ...(options.redaction || options),
  };
  return redactValue(value, config, []);
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

function redactValue(value, config, path) {
  if (Array.isArray(value)) {
    return value.map((item, index) => redactValue(item, config, [...path, String(index)]));
  }
  if (!isPlainObject(value)) return value;

  const result = {};
  for (const [key, child] of Object.entries(value)) {
    const nextPath = [...path, key];
    if (shouldRedactKey(key, config, nextPath)) {
      result[key] = config.replacement;
    } else {
      result[key] = redactValue(child, config, nextPath);
    }
  }
  return result;
}

function shouldRedactKey(key, config, path) {
  if (!config.enabled) return false;
  if (path.includes("secret_refs")) return false;
  const normalized = String(key).toLowerCase().replace(/[-\s]+/g, "_");
  return (config.secret_keys || []).some((secretKey) => {
    const normalizedSecret = String(secretKey).toLowerCase().replace(/[-\s]+/g, "_");
    return normalized === normalizedSecret || normalized.includes(normalizedSecret);
  });
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
