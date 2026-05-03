# M11 - Evidence Contracts, Metrics, and Real Lifecycle Regression

## 需求

- Harden the final C5 follow-up implementation with evidence contracts, useful metrics, and real lifecycle regression coverage.
- Prevent workflow or preset names such as `analysis` from being written into Test Profiles.
- Route analysis evidence through analysis evaluation, report, and ledger contracts.
- Record wall-clock duration where possible. Represent missing token/cost telemetry as `telemetry_unavailable`.
- Add end-to-end lifecycle fixtures for the new main-path and recovery behaviors.

## 设计输入

- D-20260503-16 evidence/regression/metrics decision.
- All previous C5 follow-up milestones.
- Audit findings M-06, M-07, L-03, and H-03.

## 执行计划

1. Inspect test-profile, analysis, metrics, and regression helpers after M01-M10.
2. Enforce separation between workflow kind, execution preset, and Test Profiles.
3. Add analysis evidence fixtures that satisfy analysis evaluation without using `analysis` as a Test Profile.
4. Update metrics helpers to record duration and explicit telemetry-unavailable markers.
5. Add lifecycle regression fixtures:
   - stale execution lease takeover
   - heartbeat timeout resume
   - context compact then resume
   - Codex to OpenCode handoff with matching boundaries
   - reject to needs_revision
   - accept to follow_up_plan continuation
   - sync derived artifact repair
   - workflow_kind analysis vs build artifact consistency
6. Run final validation commands and write a concise validation report.

## 预期测试

- Plan Generate never emits `analysis` as a Test Profile.
- Analysis report/evidence fixture satisfies analysis evaluation.
- Metrics fixture records duration and explicit `telemetry_unavailable` for token/cost gaps.
- Lifecycle regression suite covers recovery, handoff, continuation, sync repair, and workflow kind consistency.
- Final validation passes:
  - `bash scripts/validate-config.sh .pipeline/config.yaml`
  - `node --test core/test/*.test.js`
  - `python3 tests/run_regression.py`
  - `git diff --check`

## 预期产出

- Updated test-profile and analysis contracts.
- Expanded regression suite and fixtures.
- Metrics helper/docs updates.
- Final validation report for the C5 follow-up work.

## 约束

- Token/cost telemetry remains optional until provider/platform support is reliable.
- Do not confuse validation policy with workflow taxonomy.
- Do not treat helper-only tests as sufficient for recovery features.
