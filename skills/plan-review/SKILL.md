---
name: plan-review
description: Review architecture changes after a completed milestone when the user wants downstream prompt impact analyzed.
---

# /hypo-workflow:plan-review

Use this skill for Plan Review after execution changes project reality.

## Preconditions

- a milestone has completed
- architecture tracking is active or an architecture baseline exists

## Execution Flow

1. Read the architecture baseline.
2. Resolve `output.language` and `output.timezone`.
3. Summarize what the completed milestone actually changed in `output.language`.
4. Record:
   - `ADDED`
   - `CHANGED`
   - `REASON`
   - `IMPACT`
5. Check downstream prompts for stale assumptions.
6. Propose edits in `.plan-state/prompt-patch-queue.yaml` instead of silently rewriting prompts.
7. Append a lifecycle log entry and update progress context if this review materially changes the plan.

## Reference Files

- `references/plan-review-spec.md` — full review format
- `plan/PLAN-SKILL.md` — planning context
- `SKILL.md` — broader system context
