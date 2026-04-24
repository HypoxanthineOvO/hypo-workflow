---
name: skip
description: Skip the current prompt or step when the user explicitly wants to bypass work while keeping the pipeline state recoverable.
---

# /hypo-workflow:skip

Use this skill for prompt-level skip behavior. For step-level skip cascade, apply the root system rules for `skip step`.

## Preconditions

- a pipeline is active
- there is a current prompt to skip

## Execution Flow

1. Read `.pipeline/state.yaml` and confirm there is an active current prompt.
2. Mark the prompt as skipped with a machine-readable reason.
3. Append a prompt-level skip event to `.pipeline/log.yaml`.
4. Update `.pipeline/PROGRESS.md` so the milestone summary shows the skip outcome.
5. Advance to the next prompt without incrementing `pipeline.prompts_completed`.
6. If no next prompt exists, mark the pipeline completed.

## Safety Rules

- keep skipped work explicit and recoverable
- do not pretend skipped milestones passed
- preserve the reason in state and human-readable progress output

## Reference Files

- `references/commands-spec.md` — skip semantics
- `references/state-contract.md` — state mutations
- `references/progress-spec.md` — progress summary updates
- `SKILL.md` — broader pipeline behavior
