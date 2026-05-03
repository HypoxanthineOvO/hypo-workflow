# M02 - Consistent Lifecycle Commit and Derived Refresh Slice

## 需求

- Make lifecycle-mutating commands update authoritative workflow state and affected derived views in one consistent command flow.
- Add a central workflow commit/update helper with prevalidation, temp-file atomic writes, post-write invariant checks, and explicit failure reporting.
- Apply the helper to the first high-risk lifecycle paths: accept, reject, start, resume, and plan-generate.
- If authoritative facts commit successfully but a derived refresh fails, keep authority committed, return failure or warning, mark/report the derived refresh failure, and provide repair/sync guidance.

## 设计输入

- Audit findings C-03, H-04, H-06, H-07, H-08, and M-03.
- D-20260503-07 decision records in `.pipeline/audits/audit-001-discussion-plan.md`.
- Existing protected-file policy: `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, and `.pipeline/rules.yaml` require lifecycle-aware writes.

## 执行计划

1. Inventory every command/helper that writes lifecycle state, progress, log, metrics, compact, summary, or OpenCode status inputs.
2. Define the workflow commit contract: inputs, prevalidation, authority writes, derived refresh list, invariant checks, and failure marker.
3. Implement a deterministic helper in `core/` or the existing shared helper layer.
4. Migrate accept/reject/start/resume/plan-generate paths to use the helper for their lifecycle writes.
5. Define initial derived refresh targets: PROGRESS, metrics mirrors, compact views, PROJECT-SUMMARY, OpenCode status inputs, and log.
6. Add invariant checks for done step pointers, rejected acceptance state, prompt completion counts, and follow-up continuation state.
7. Update skill/reference docs and add tests.

## 预期测试

- Accept/reject/start/resume fixtures update state/cycle/log/PROGRESS/metrics consistently.
- Post-write invariant failure does not silently report success.
- Derived refresh failure is visible and repairable without rolling back authoritative lifecycle facts.
- Existing local tests and config validation continue to pass.

## 预期产出

- Shared lifecycle commit/update helper.
- Updated command/skill contracts for accept/reject/start/resume/plan-generate.
- Invariant fixtures and tests.
- Derived refresh failure marker/report contract.

## 约束

- Do not use status as a permanent conflict resolver. Conflicts are health issues, not normal UX.
- Do not roll back authoritative lifecycle facts only because a derived view failed to refresh.
- Do not silently mutate protected files outside the commit helper.
