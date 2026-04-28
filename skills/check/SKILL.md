---
name: check
description: Run a health check over config, state, prompts, and architecture when the user wants to diagnose a Hypo-Workflow workspace quickly.
---

# /hypo-workflow:check

Use this skill for the six-surface health check.

## Preconditions

- if `.pipeline/` is missing, instruct the user to run init first

## Execution Flow

1. Read `~/.hypo-workflow/config.yaml` if present and warn if it is malformed.
2. Resolve `output.language` and `output.timezone`.
3. Run the six checks from `references/check-spec.md`:
   - Config
   - Pipeline
   - State
   - Prompts
   - Notion
   - Architecture
4. Print `✅`, `⚠️`, or `❌` for each surface.
5. Summarize overall health, effective config source, and recommended next action in `output.language`.
6. Set `current.phase=lifecycle_check` when tracking this command through state.

## Reference Files

- `references/check-spec.md`
- `references/commands-spec.md`
- `references/config-spec.md`
- `SKILL.md`
