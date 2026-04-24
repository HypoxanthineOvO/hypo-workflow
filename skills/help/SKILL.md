---
name: help
description: Show the full Hypo-Workflow command map when the user needs a quick reference or per-command usage details.
---

# /hypo-workflow:help

Use this skill to explain the 22 native Hypo-Workflow skills.

## Command Groups

- Setup:
  - `setup`
- Pipeline:
  - `start`, `resume`, `status`, `skip`, `stop`, `report`
- Plan:
  - `plan`, `plan-discover`, `plan-decompose`, `plan-generate`, `plan-confirm`, `plan-review`
- Lifecycle:
  - `init`, `check`, `audit`, `release`, `debug`
- Utility:
  - `dashboard`, `help`, `reset`, `log`

## Execution Flow

1. By default, list all 22 commands grouped by category.
2. For a specific command, explain:
   - when to use it
   - required inputs or flags
   - reference files
3. Mention that Codex still uses the root `SKILL.md` and `/hw:*` compatibility path.

## Reference Files

- `SKILL.md` — full command list and system context
- `references/commands-spec.md` — parsing details
