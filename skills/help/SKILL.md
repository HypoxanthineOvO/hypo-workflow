---
name: help
description: Show the full Hypo-Workflow command map when the user needs a quick reference or per-command usage details.
---

# /hypo-workflow:help

Use this skill to explain the 25 user-facing Hypo-Workflow commands and the internal watchdog skill.

## Command Groups

- Setup:
  - `setup`
- Pipeline:
  - `start`, `resume`, `status`, `skip`, `stop`, `report`
- Plan:
  - `plan`, `plan-discover`, `plan-decompose`, `plan-generate`, `plan-confirm`, `plan-extend`, `plan-review`
- Lifecycle:
  - `init`, `check`, `audit`, `release`, `debug`, `cycle`, `patch`
- Utility:
  - `dashboard`, `help`, `reset`, `log`
- Internal:
  - `watchdog` (cron-only; hidden from normal quick help unless explicitly requested)

## Execution Flow

1. By default, list all 25 user-facing commands grouped by category.
2. For a specific command, explain:
   - when to use it
   - required inputs or flags
   - reference files
3. Mention that `/hypo-workflow:setup` creates `~/.hypo-workflow/config.yaml` and that project config overrides global defaults.
4. Include a short subagent hint:
   - Claude Code can configure Codex as the subagent provider
   - Codex can configure Claude as the subagent provider
   - mixed mode can delegate individual steps through `step_overrides`
5. Mention that Codex still uses the root `SKILL.md` and `/hw:*` compatibility path.
6. Include `/hw:cycle`, `/hw:patch`, and `/hw:plan:extend` in normal help output.
7. Mention `/hw:watchdog` only when the user asks about watchdog or auto resume internals.

## Reference Files

- `SKILL.md` — full command list and system context
- `references/commands-spec.md` — parsing details
- `references/config-spec.md` — global config and subagent fallback rules
