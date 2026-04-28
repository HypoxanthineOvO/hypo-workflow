---
name: log
description: Read the unified lifecycle log when the user wants milestone, fix, audit, debug, review, or release history.
---

# /hypo-workflow:log

Use this skill to inspect `.pipeline/log.yaml`.

## Execution Flow

1. Read `.pipeline/log.yaml`.
2. Resolve `output.language` and `output.timezone`.
3. Show the latest 10 entries by default, with timestamps converted to `output.timezone`.
4. Support:
   - `--all`
   - `--type <type>`
   - `--since <milestone>`
5. If the log file is missing, state that no lifecycle log has been created yet in `output.language`.

## Reference Files

- `references/log-spec.md`
- `references/commands-spec.md`
- `SKILL.md`
