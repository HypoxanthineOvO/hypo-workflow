const DEFAULT_TTL_MS = 5 * 60 * 1000;

export function buildExecutionLease(input = {}, options = {}) {
  const now = input.created_at || input.createdAt || options.now || new Date().toISOString();
  const heartbeat = input.heartbeat_at || input.heartbeatAt || now;
  return {
    schema_version: String(input.schema_version || input.schemaVersion || "1"),
    platform: normalizePlatformName(input.platform || options.platform || "unknown"),
    session_id: input.session_id || input.sessionId || options.session_id || options.sessionId || "",
    owner: input.owner || options.owner || "",
    command: input.command || options.command || "",
    phase: input.phase || options.phase || "executing",
    created_at: now,
    heartbeat_at: heartbeat,
    expires_at: input.expires_at || input.expiresAt || addMsIso(heartbeat, options.ttl_ms || options.ttlMs || DEFAULT_TTL_MS),
    workflow_kind: input.workflow_kind || input.workflowKind || options.workflow_kind || options.workflowKind || "build",
    cycle_id: input.cycle_id || input.cycleId || options.cycle_id || options.cycleId || null,
    handoff_allowed: input.handoff_allowed ?? input.handoffAllowed ?? options.handoff_allowed ?? true,
    ...(input.reported_failure ? { reported_failure: input.reported_failure } : {}),
  };
}

export function assessExecutionLease(lease = {}, options = {}) {
  const normalized = normalizeLease(lease);
  if (normalized.errors.length) {
    return {
      action: "repair",
      reason: "malformed_lease",
      recovery_signal: null,
      errors: normalized.errors,
      repair_hint: "Run /hw:check, inspect .pipeline/.lock, and remove or repair the malformed execution lease only after confirming no active run owns it.",
      log_event: {
        type: "lease_repair_required",
        status: "blocked",
        summary: `Malformed execution lease: ${normalized.errors.join("; ")}`,
      },
    };
  }

  const value = normalized.lease;
  const requester = normalizeRequester(options.requester || {});
  const sameOwner = requester.session_id && requester.session_id === value.session_id;
  if (sameOwner) {
    return {
      action: "continue",
      reason: "same_session",
      recovery_signal: null,
      lease: value,
      log_event: null,
    };
  }

  if (value.reported_failure) {
    return takeoverResult(value, "reported_failure", "reported_failure", requester);
  }

  if (isExpired(value, options.now)) {
    return takeoverResult(value, "expired_lease", "inferred_stall", requester);
  }

  return {
    action: "block",
    reason: "fresh_foreign_lease",
    recovery_signal: null,
    lease: value,
    log_event: null,
  };
}

export function resolvePlatformHandoff(input = {}) {
  const from = normalizeBoundaryProfile(input.from || {});
  const to = normalizeBoundaryProfile(input.to || {});
  const effective = {
    permissions: stricterPermission(from.permissions, to.permissions),
    auto_continue: Boolean(from.auto_continue && to.auto_continue),
    network: stricterBoundary(from.network, to.network),
    destructive: stricterBoundary(from.destructive, to.destructive),
  };
  const warnings = [];

  if (isWiderPermission(to.permissions, from.permissions)) warnings.push("Target permissions would widen the source boundary.");
  if (to.auto_continue && !from.auto_continue) warnings.push("Target auto-continue would widen the source boundary.");
  if (isWiderBoundary(to.network, from.network)) warnings.push("Target network boundary would widen the source boundary.");
  if (isWiderBoundary(to.destructive, from.destructive)) warnings.push("Target destructive/external-side-effect boundary would widen the source boundary.");

  return {
    allowed: warnings.length === 0 || Boolean(input.confirmed),
    requires_confirmation: warnings.length > 0 && !input.confirmed,
    from,
    to,
    effective_boundaries: effective,
    warnings,
  };
}

function normalizeLease(lease) {
  const errors = [];
  const value = {
    schema_version: String(lease.schema_version || lease.schemaVersion || "1"),
    platform: normalizePlatformName(lease.platform),
    session_id: lease.session_id || lease.sessionId || "",
    owner: lease.owner || "",
    command: lease.command || "",
    phase: lease.phase || "executing",
    created_at: lease.created_at || lease.createdAt || null,
    heartbeat_at: lease.heartbeat_at || lease.heartbeatAt || null,
    expires_at: lease.expires_at || lease.expiresAt || null,
    workflow_kind: lease.workflow_kind || lease.workflowKind || "build",
    cycle_id: lease.cycle_id || lease.cycleId || null,
    handoff_allowed: lease.handoff_allowed ?? lease.handoffAllowed ?? true,
    ...(lease.reported_failure ? { reported_failure: lease.reported_failure } : {}),
  };

  if (!value.platform || value.platform === "unknown") errors.push("platform is required");
  if (!value.session_id) errors.push("session_id is required");
  if (!validDate(value.heartbeat_at)) errors.push("heartbeat_at must be an ISO timestamp");
  if (!validDate(value.expires_at)) errors.push("expires_at must be an ISO timestamp");
  if (value.handoff_allowed === false) errors.push("handoff_allowed is false");
  return { lease: value, errors };
}

function normalizeRequester(value) {
  return {
    platform: normalizePlatformName(value.platform),
    session_id: value.session_id || value.sessionId || "",
    owner: value.owner || "",
  };
}

function takeoverResult(lease, reason, recoverySignal, requester) {
  const failure = lease.reported_failure;
  const detail = failure ? `${failure.type || "failure"} ${failure.message || ""}`.trim() : reason;
  return {
    action: "takeover",
    reason,
    recovery_signal: recoverySignal,
    lease,
    requester,
    log_event: {
      type: "lease_takeover",
      status: "completed",
      recovery_signal: recoverySignal,
      previous_session_id: lease.session_id,
      next_session_id: requester.session_id || null,
      summary: `Execution lease takeover: ${reason}${detail && detail !== reason ? ` (${detail})` : ""}.`,
    },
  };
}

function isExpired(lease, now) {
  const nowMs = Date.parse(now || new Date().toISOString());
  return Number.isFinite(nowMs) && nowMs >= Date.parse(lease.expires_at);
}

function validDate(value) {
  return Boolean(value) && Number.isFinite(Date.parse(value));
}

function addMsIso(value, ms) {
  const parsed = Date.parse(value);
  return new Date((Number.isFinite(parsed) ? parsed : Date.now()) + ms).toISOString();
}

function normalizePlatformName(value) {
  const normalized = String(value || "unknown").trim().toLowerCase();
  if (normalized === "claude") return "claude-code";
  if (normalized === "open-code") return "opencode";
  return normalized;
}

function normalizeBoundaryProfile(value) {
  return {
    platform: normalizePlatformName(value.platform),
    permissions: normalizePermission(value.permissions),
    auto_continue: Boolean(value.auto_continue ?? value.autoContinue ?? false),
    network: normalizeBoundary(value.network),
    destructive: normalizeBoundary(value.destructive || value.external_side_effects || value.externalSideEffects),
  };
}

function normalizePermission(value) {
  const normalized = String(value || "ask").trim().toLowerCase();
  if (["deny", "ask", "allow-safe", "allow"].includes(normalized)) return normalized;
  return "ask";
}

function normalizeBoundary(value) {
  const normalized = String(value || "ask").trim().toLowerCase();
  if (["deny", "ask", "confirm", "allow"].includes(normalized)) return normalized === "confirm" ? "ask" : normalized;
  return "ask";
}

function stricterPermission(a, b) {
  return permissionRank(a) <= permissionRank(b) ? a : b;
}

function isWiderPermission(candidate, baseline) {
  return permissionRank(candidate) > permissionRank(baseline);
}

function permissionRank(value) {
  return { deny: 0, ask: 1, "allow-safe": 2, allow: 3 }[normalizePermission(value)];
}

function stricterBoundary(a, b) {
  return boundaryRank(a) <= boundaryRank(b) ? a : b;
}

function isWiderBoundary(candidate, baseline) {
  return boundaryRank(candidate) > boundaryRank(baseline);
}

function boundaryRank(value) {
  return { deny: 0, ask: 1, allow: 2 }[normalizeBoundary(value)];
}
