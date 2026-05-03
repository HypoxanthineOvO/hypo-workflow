const TELEMETRY_UNAVAILABLE = "telemetry_unavailable";

export function normalizeMetricRecord(input = {}) {
  const durationMs = normalizeDuration(input);
  const tokens = normalizeTokens(input.tokens, input.token_count ?? input.tokenCount);
  const tokenCount = normalizeTokenCount(tokens, input.token_count ?? input.tokenCount);
  const cost = normalizeTelemetryValue(input.cost);
  return {
    id: input.id || null,
    ...(input.cycle_id || input.cycleId ? { cycle_id: input.cycle_id || input.cycleId } : {}),
    ...(input.feature_id || input.featureId ? { feature_id: input.feature_id || input.featureId } : {}),
    ...(input.milestone_id || input.milestoneId ? { milestone_id: input.milestone_id || input.milestoneId } : {}),
    ...(input.step ? { step: input.step } : {}),
    status: input.status || "completed",
    started_at: input.started_at || input.startedAt || null,
    finished_at: input.finished_at || input.finishedAt || null,
    duration_ms: durationMs,
    message_count: input.message_count ?? input.messageCount ?? TELEMETRY_UNAVAILABLE,
    tokens,
    token_count: tokenCount,
    cost,
    currency: cost === TELEMETRY_UNAVAILABLE ? TELEMETRY_UNAVAILABLE : input.currency || "USD",
    updated_at: input.updated_at || input.updatedAt || input.finished_at || input.finishedAt || new Date().toISOString(),
    source: input.source || "agent",
    telemetry_status: {
      token_count: tokenCount === TELEMETRY_UNAVAILABLE ? TELEMETRY_UNAVAILABLE : "available",
      cost: cost === TELEMETRY_UNAVAILABLE ? TELEMETRY_UNAVAILABLE : "available",
    },
  };
}

export function rollupMetricRecords(id, records = [], input = {}) {
  const normalized = records.map((record) => record.telemetry_status ? record : normalizeMetricRecord(record));
  const duration = sumAvailable(normalized.map((record) => record.duration_ms));
  const tokenValues = normalized.map((record) => record.token_count);
  const costValues = normalized.map((record) => record.cost);
  const tokenCount = sumAvailable(tokenValues);
  const cost = sumAvailable(costValues);
  return {
    id,
    status: input.status || "completed",
    duration_ms: duration,
    token_count: tokenCount,
    cost,
    currency: cost === TELEMETRY_UNAVAILABLE ? TELEMETRY_UNAVAILABLE : firstCurrency(normalized),
    updated_at: input.updated_at || input.updatedAt || new Date().toISOString(),
    telemetry_status: {
      token_count: availabilityStatus(tokenValues),
      cost: availabilityStatus(costValues),
    },
  };
}

function normalizeDuration(input = {}) {
  if (input.duration_ms !== undefined && input.duration_ms !== null) {
    const duration = Number(input.duration_ms);
    return Number.isFinite(duration) ? Math.max(0, Math.round(duration)) : input.duration_ms;
  }
  const started = Date.parse(input.started_at || input.startedAt || "");
  const finished = Date.parse(input.finished_at || input.finishedAt || "");
  if (Number.isFinite(started) && Number.isFinite(finished)) {
    return Math.max(0, finished - started);
  }
  return TELEMETRY_UNAVAILABLE;
}

function normalizeTokens(tokens = {}, tokenCount) {
  const input = normalizeTelemetryValue(tokens.input);
  const output = normalizeTelemetryValue(tokens.output);
  const total = normalizeTelemetryValue(tokens.total ?? tokenCount);
  const computedTotal = total === TELEMETRY_UNAVAILABLE && input !== TELEMETRY_UNAVAILABLE && output !== TELEMETRY_UNAVAILABLE
    ? Number(input) + Number(output)
    : total;
  return {
    input,
    output,
    total: computedTotal,
  };
}

function normalizeTokenCount(tokens, tokenCount) {
  const explicit = normalizeTelemetryValue(tokenCount);
  if (explicit !== TELEMETRY_UNAVAILABLE) return explicit;
  return tokens.total;
}

function normalizeTelemetryValue(value) {
  if (value === undefined || value === null || value === "" || value === "n/a") return TELEMETRY_UNAVAILABLE;
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}

function sumAvailable(values) {
  const available = values.filter((value) => typeof value === "number" && Number.isFinite(value));
  if (!available.length) return TELEMETRY_UNAVAILABLE;
  return Number(available.reduce((sum, value) => sum + value, 0).toFixed(6));
}

function availabilityStatus(values) {
  const available = values.filter((value) => value !== TELEMETRY_UNAVAILABLE).length;
  if (available === 0) return TELEMETRY_UNAVAILABLE;
  if (available === values.length) return "available";
  return "partial";
}

function firstCurrency(records) {
  return records.find((record) => record.currency && record.currency !== TELEMETRY_UNAVAILABLE)?.currency || "USD";
}
