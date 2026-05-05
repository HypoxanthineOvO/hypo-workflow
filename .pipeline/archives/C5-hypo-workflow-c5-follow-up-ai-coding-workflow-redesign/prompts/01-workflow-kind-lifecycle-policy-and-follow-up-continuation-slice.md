# M01 - Workflow Kind, Lifecycle Policy, and Follow-Up Continuation Slice

## 需求

- Implement the first runnable vertical slice for the C5 follow-up redesign.
- Make Cycle-scoped `workflow_kind` the single source for Plan/Start/Status/Report/Acceptance/OpenCode semantics inside one Cycle.
- Add lifecycle policy defaults derived from `workflow_kind`, with Plan-level overrides for gates, reject behavior, auto-continue, and continuations.
- Use `cycle.continuations[]` as the planned follow-up node model. `state.yaml` may only mirror the currently active continuation state.
- Support the user-visible phases `needs_revision` and `follow_up_planning`.
- Ensure reject defaults to `needs_revision` and accept can route to `follow_up_planning` when a continuation is declared.

## 设计输入

- C5 follow-up Discover decisions in `.plan-state/discover-c5-followup.yaml`.
- P2 milestone split in `.plan-state/decompose-c5-followup.yaml`.
- Audit findings H-03, H-04, H-06, M-04, and M-06.
- Do not write live `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, or `.pipeline/rules.yaml` fixtures except through tests or explicit fixture directories.

## 执行计划

1. Inspect existing workflow/preset/config/cycle/state/OpenCode generation code and tests.
2. Define the contract for `workflow_kind`, `analysis_kind`, `lifecycle_policy`, and `continuations[]` in the relevant references.
3. Add or update deterministic helpers that derive preset, analysis defaults, lifecycle defaults, and user-visible phase from Cycle metadata.
4. Update Plan Generate and artifact generation paths so analysis/build fixtures agree on workflow kind and preset semantics.
5. Update status model logic to surface one canonical phase and one next action for reject and follow-up planning cases.
6. Update accept/reject/resume skill contracts to describe the new lifecycle policy behavior.
7. Add focused fixtures and tests before broad refactors.

## 预期测试

- Analysis Cycle fixture generates consistent workflow kind/preset metadata across config/cycle/state/prompt/OpenCode artifacts.
- Build Cycle fixture still defaults to build/tdd behavior and does not inherit analysis semantics.
- Rejecting a completed audit produces `needs_revision`, preserves `feedback_ref`, and points resume to revision rather than a done step.
- Accepting an audit with `continuations[]` produces `follow_up_planning` and one clear next action.
- Existing config validation and current tests still pass.

## 预期产出

- Updated workflow, analysis, config, state, and lifecycle reference docs.
- Deterministic helper/tests for workflow kind and lifecycle phase derivation.
- Status builder fixture coverage for analysis/build/reject/follow-up.
- OpenCode boundary generation aligned with workflow kind.

## 约束

- Do not make `cycle.type` a second user-facing taxonomy. It may remain only as a legacy alias derived from `workflow_kind`.
- Do not put `analysis` into Test Profiles.
- Do not treat continuation as ordinary `plan:extend`.
- Keep Hypo-Workflow as a workflow protocol; do not add a runner.
