---
name: report
description: Summarize the latest Hypo-Workflow report when the user asks for the most recent evaluation result or milestone outcome.
---

# /hypo-workflow:report

Use this skill to summarize the latest generated report file.

## Preconditions

- a report exists in `.pipeline/reports/`, or the current state points to the latest report

## Execution Flow

1. Read `.pipeline/state.yaml` if present.
2. Locate the latest report:
   - prefer `history.completed_prompts[-1].report_file`
   - otherwise use the newest report in `.pipeline/reports/`
3. Summarize:
   - milestone or prompt name
   - final decision
   - key scores
   - warnings
   - deferred or blocking notes if present
4. If `.pipeline/PROGRESS.md` exists, keep its summary consistent conceptually, but do not mutate it from a read-only report command.

## Reference Files

- `references/evaluation-spec.md` — score interpretation
- `references/commands-spec.md` — report selection behavior
- `references/progress-spec.md` — progress summary relationship
- `SKILL.md` — full reporting context
