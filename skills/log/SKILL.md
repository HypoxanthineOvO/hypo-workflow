---
name: log
description: Read the unified lifecycle log when the user wants milestone, fix, audit, debug, review, or release history.
---

# /hypo-workflow:log

Use this skill to inspect `.pipeline/log.yaml`.

## Execution Flow

1. Read `.pipeline/log.yaml`.
2. Show the latest 10 entries by default.
3. Support:
   - `--all`
   - `--type <type>`
   - `--since <milestone>`
4. If the log file is missing, state that no lifecycle log has been created yet.

## Reference Files

- `references/log-spec.md`
- `references/commands-spec.md`
- `SKILL.md`
