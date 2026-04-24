---
name: check
description: Run a health check over config, state, prompts, and architecture when the user wants to diagnose a Hypo-Workflow workspace quickly.
---

# /hypo-workflow:check

Use this skill for the six-surface health check.

## Preconditions

- if `.pipeline/` is missing, instruct the user to run init first

## Execution Flow

1. Run the six checks from `references/check-spec.md`:
   - Config
   - Pipeline
   - State
   - Prompts
   - Notion
   - Architecture
2. Print `✅`, `⚠️`, or `❌` for each surface.
3. Summarize overall health and recommended next action.
4. Set `current.phase=lifecycle_check` when tracking this command through state.

## Reference Files

- `references/check-spec.md`
- `references/commands-spec.md`
- `SKILL.md`
