---
name: resume
description: Resume Hypo-Workflow execution from the saved state when the user wants to continue an interrupted or stopped pipeline.
---

# /hypo-workflow:resume

Use this skill to continue from `.pipeline/state.yaml` without restarting completed work.

## Preconditions

- `.pipeline/state.yaml` exists
- the saved pipeline is unfinished, usually `pipeline.status=running` or `pipeline.status=stopped`

## Execution Flow

1. Read `~/.hypo-workflow/config.yaml` if present.
2. Read `.pipeline/config.yaml` and `.pipeline/state.yaml`.
3. Resolve effective execution and subagent defaults as project > global > defaults before selecting the next step.
4. Validate that `current.prompt_file`, `current.step`, and `current.step_index` still point to a valid prompt and step.
5. Set `current.phase=executing` when resuming active milestone execution.
6. Continue from the next runnable step instead of replaying completed steps.
7. Use the same serial orchestration model as `/hypo-workflow:start`:
   - Claude coordinates
   - subagent tasks execute concrete work
   - Claude validates, scores, and updates artifacts
8. Update `.pipeline/PROGRESS.md`, `.pipeline/log.yaml`, and `.pipeline/state.yaml` after each meaningful transition.
9. Apply the same `retry` / `deferred` / `stop` decision model on failures.

## Safety Rules

- never silently discard saved work
- if state references a missing prompt, stop and explain the inconsistency
- if the current step is already complete, advance to the next runnable step rather than rerunning it blindly

## Reference Files

- `references/state-contract.md` — resume semantics and required fields
- `references/commands-spec.md` — command behavior
- `references/progress-spec.md` — progress summary rules
- `references/config-spec.md` — global/project config fallback rules
- `SKILL.md` — full execution context if needed
