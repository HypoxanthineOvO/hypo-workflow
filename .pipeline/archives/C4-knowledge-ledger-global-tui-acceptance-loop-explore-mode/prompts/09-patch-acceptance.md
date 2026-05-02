# M10 / F003 - Patch Acceptance

## 需求

- Add Patch-level pending acceptance.
- Support `/hw:patch accept P001` and `/hw:patch reject P001 "feedback"`.
- Rejected patches reopen with iteration count and structured feedback.
- Repeated rejection should recommend escalation to a Cycle.

## 实施计划

1. Extend patch file metadata:
   - status: open, pending_acceptance, closed, rejected
   - iteration
   - acceptance_requested_at
   - accepted_at
   - rejection_refs
2. Update Patch fix flow:
   - manual acceptance mode ends in pending acceptance
   - auto mode may close directly for backward compatibility
3. Implement accept/reject commands.
4. Store rejection feedback under `.pipeline/patches/feedback/` or another clear location.
5. Inject structured rejection context into the next patch fix attempt.
6. Update patch list/status/progress behavior.

## 预期测试

- Patch metadata parse tests.
- Patch accept/reject lifecycle fixture tests.
- Iteration count tests.
- Feedback injection tests.
- PROGRESS/log tests.

## 预期产出

- updated `skills/patch/SKILL.md`
- patch acceptance helpers/tests
- command guidance updates
- PROGRESS and log contract updates

## 约束

- Patch fix remains lightweight and must not mutate `state.yaml`.
- Avoid full TDD pipeline for patch fix.
- Preserve existing closed patch compatibility.
