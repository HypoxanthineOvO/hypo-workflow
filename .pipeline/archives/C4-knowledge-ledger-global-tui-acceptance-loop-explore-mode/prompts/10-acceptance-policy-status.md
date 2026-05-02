# M11 / F003 - Acceptance Policy And Status

## 需求

- Add configurable acceptance policies:
  - manual
  - auto
  - timeout
- Ensure status surfaces show current acceptance state clearly.
- Ensure rejection feedback is always structured on disk.

## 实施计划

1. Add config schema and defaults:
   - `acceptance.mode`
   - `acceptance.timeout_hours`
   - `acceptance.reject_escalation_threshold`
2. Implement policy resolution as project > global > defaults.
3. Implement timeout behavior as a deterministic status/check decision, not a background runner.
4. Update `/hw:status`, OpenCode status model, TUI, log, and PROGRESS.
5. Add reject feedback template:
   - problem
   - reproduce_steps
   - expected
   - actual
   - context
   - iteration
   - created_at
6. Add docs and migration guidance.

## 预期测试

- Config/schema tests.
- Manual/auto/timeout fixture tests.
- Status model tests.
- Rejection template tests.
- OpenCode TUI/status tests.

## 预期产出

- config updates
- status and TUI updates
- docs/spec updates
- tests for policy resolution and timeout handling

## 约束

- Timeout must record that acceptance was automatic.
- Auto mode must preserve current behavior where users rely on unattended flow.
- Reject feedback should not become unstructured prose-only state.
