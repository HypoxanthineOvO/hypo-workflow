import test from "node:test";
import assert from "node:assert/strict";
import {
  assessExecutionLease,
  buildExecutionLease,
  resolvePlatformHandoff,
} from "../src/index.js";

test("fresh foreign execution lease blocks resume", () => {
  const lease = buildExecutionLease({
    platform: "opencode",
    session_id: "sess-1",
    owner: "alice",
    command: "/hw:start",
    phase: "executing",
    created_at: "2026-05-03T10:00:00+08:00",
    heartbeat_at: "2026-05-03T10:04:00+08:00",
    expires_at: "2026-05-03T10:09:00+08:00",
    cycle_id: "C5",
    workflow_kind: "build",
    handoff_allowed: true,
  });

  const result = assessExecutionLease(lease, {
    now: "2026-05-03T10:05:00+08:00",
    requester: { platform: "codex", session_id: "sess-2", owner: "bob" },
  });

  assert.equal(result.action, "block");
  assert.equal(result.reason, "fresh_foreign_lease");
  assert.equal(result.recovery_signal, null);
  assert.equal(result.log_event, null);
});

test("expired execution lease allows takeover with inferred stall evidence", () => {
  const result = assessExecutionLease(
    {
      schema_version: "1",
      platform: "claude-code",
      session_id: "sess-old",
      owner: "worker-a",
      command: "/hw:resume",
      phase: "executing",
      heartbeat_at: "2026-05-03T10:00:00+08:00",
      expires_at: "2026-05-03T10:05:00+08:00",
      handoff_allowed: true,
    },
    {
      now: "2026-05-03T10:06:00+08:00",
      requester: { platform: "opencode", session_id: "sess-new", owner: "worker-b" },
    },
  );

  assert.equal(result.action, "takeover");
  assert.equal(result.reason, "expired_lease");
  assert.equal(result.recovery_signal, "inferred_stall");
  assert.equal(result.log_event.type, "lease_takeover");
  assert.match(result.log_event.summary, /expired_lease/);
});

test("reported platform failure allows takeover with reported_failure evidence", () => {
  const result = assessExecutionLease(
    {
      schema_version: "1",
      platform: "opencode",
      session_id: "sess-failed",
      owner: "agent",
      command: "/hw:start",
      phase: "executing",
      heartbeat_at: "2026-05-03T10:04:00+08:00",
      expires_at: "2026-05-03T10:09:00+08:00",
      reported_failure: { type: "model_api_error", message: "429 rate limit" },
      handoff_allowed: true,
    },
    {
      now: "2026-05-03T10:05:00+08:00",
      requester: { platform: "codex", session_id: "sess-new" },
    },
  );

  assert.equal(result.action, "takeover");
  assert.equal(result.reason, "reported_failure");
  assert.equal(result.recovery_signal, "reported_failure");
  assert.match(result.log_event.summary, /model_api_error/);
});

test("malformed execution lease reports repair guidance", () => {
  const result = assessExecutionLease(
    { platform: "opencode", heartbeat_at: "not-a-date" },
    { now: "2026-05-03T10:05:00+08:00" },
  );

  assert.equal(result.action, "repair");
  assert.equal(result.reason, "malformed_lease");
  assert.match(result.repair_hint, /hw:check/i);
  assert.ok(result.errors.includes("session_id is required"));
});

test("platform handoff preserves stricter permission and auto-continue boundaries", () => {
  const result = resolvePlatformHandoff({
    from: {
      platform: "codex",
      permissions: "ask",
      auto_continue: false,
      network: "ask",
      destructive: "ask",
    },
    to: {
      platform: "opencode",
      permissions: "allow-safe",
      auto_continue: true,
      network: "allow",
      destructive: "allow",
    },
  });

  assert.equal(result.allowed, false);
  assert.equal(result.requires_confirmation, true);
  assert.deepEqual(result.effective_boundaries, {
    permissions: "ask",
    auto_continue: false,
    network: "ask",
    destructive: "ask",
  });
  assert.ok(result.warnings.some((warning) => /would widen/i.test(warning)));
});
