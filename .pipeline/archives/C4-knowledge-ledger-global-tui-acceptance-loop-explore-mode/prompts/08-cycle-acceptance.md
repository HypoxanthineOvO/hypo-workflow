# M09 / F003 - Cycle Acceptance

## 需求

- Add Cycle-level pending acceptance.
- Completed milestones should not automatically archive the Cycle in manual acceptance mode.
- Add `/hw:accept` and `/hw:reject` command semantics for Cycle acceptance.
- Update `PROGRESS.md`, status, logs, and OpenCode TUI status model.

## 实施计划

1. Extend Cycle lifecycle states:
   - active
   - pending_acceptance
   - completed
   - rejected or active with acceptance iteration
   - paused
   - abandoned
2. Make `cycle.yaml` authoritative for Cycle acceptance state.
3. Mirror minimal runtime state in `state.yaml` where status/TUI needs it.
4. Define `/hw:accept`:
   - confirm pending acceptance
   - close/archive Cycle
   - write log and PROGRESS entries
5. Define `/hw:reject`:
   - parse simple feedback input
   - store structured feedback
   - reopen or append repair work according to scope
6. Update `PROGRESS.md` table rules for pending acceptance, accepted, rejected, and iteration.

## 预期测试

- Cycle lifecycle fixture tests.
- Status model tests for `pending_acceptance`.
- PROGRESS format tests.
- Command map tests for `/hw:accept` and `/hw:reject`.
- Archive behavior tests.

## 预期产出

- `skills/accept/SKILL.md`
- `skills/reject/SKILL.md` or combined lifecycle skill if cleaner
- updated `skills/cycle/SKILL.md`
- updated `references/state-contract.md`
- updated `references/progress-spec.md`
- updated command map and OpenCode artifacts

## 约束

- Preserve auto mode compatibility.
- Do not archive a manually accepted Cycle before user acceptance.
- Do not store full reject context in `state.yaml`.
