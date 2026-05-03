# M07 - Execution Lease, Recovery, and Platform Handoff

## 需求

- Replace fragile one-line `.pipeline/.lock` behavior with structured execution leases.
- Automatically take over clearly stale leases based on heartbeat/expiry, and log every takeover.
- Treat model/API failure recovery, context-compaction recovery, watchdog resume, and Codex/OpenCode/Claude handoff as one recovery design.
- Preserve authorization, protected-file, gate, auto-continue, network, restart, and external-side-effect semantics across platform handoff.

## 设计输入

- D-20260503-11 recovery and handoff decisions.
- Audit findings H-05, M-05, M-07, H-03, and M-04.
- Official hook/event references already recorded in the discussion plan.

## 执行计划

1. Inspect start/resume/watchdog/status/check lock and heartbeat behavior.
2. Define the execution lease shape with platform, session id, owner, command, phase, created_at, heartbeat_at, expires_at, workflow kind, cycle id, and handoff_allowed.
3. Implement shared lease parsing, validation, stale detection, atomic create/update, and owner-safe cleanup helpers.
4. Update start/resume/watchdog/status/check to use the lease helper.
5. Record `reported_failure` when platform events provide one and `inferred_stall` when lease/heartbeat expires without explicit error.
6. Generate or update platform capability/boundary profiles for Codex, Claude Code, and OpenCode.
7. Ensure compact/session-start context supports recovery but is not the only recovery mechanism.
8. Add recovery and handoff fixtures.

## 预期测试

- Fresh foreign lease blocks resume.
- Expired lease auto-takeover succeeds and writes lifecycle log evidence.
- Malformed lease reports repair guidance.
- Heartbeat timeout and compact-resume fixtures recover from durable state.
- Codex-to-OpenCode handoff fixture preserves permission and auto-continue boundaries.
- Watchdog no longer skips forever just because a stale lease exists.

## 预期产出

- Execution lease contract and helper.
- Updated start/resume/watchdog/status/check skills and scripts.
- Platform capability/boundary profile generation tests.
- Recovery/handoff regression fixtures.

## 约束

- Do not assume every platform exposes a reliable 429/failure hook.
- Lease/heartbeat timeout is the portable recovery signal.
- Do not auto-takeover a fresh active lease.
- Do not widen permissions during handoff without explicit confirmation.
