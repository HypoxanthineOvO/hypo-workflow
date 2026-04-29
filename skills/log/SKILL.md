---
name: log
description: Read the unified lifecycle log when the user wants milestone, fix, audit, debug, review, or release history.
---

# /hypo-workflow:log

Use this skill to inspect `.pipeline/log.yaml`.

## Execution Flow

1. If the user passed `--full`, read `.pipeline/log.yaml` directly and print `加载完整版 log.yaml (<N> 行)` when line counts are available.
2. If `--full` is absent, prefer `.pipeline/log.compact.yaml` when it exists; otherwise read `.pipeline/log.yaml`.
3. Resolve `output.language` and `output.timezone`.
4. Show the latest 10 entries by default, with timestamps converted to `output.timezone`.
5. Support:
   - `--all`
   - `--type <type>`
   - `--since <milestone>`
   - `--full`
6. If the log file is missing, state that no lifecycle log has been created yet in `output.language`.

## Flags

- `/hw:log --full`: ignore `.pipeline/log.compact.yaml` and load the complete lifecycle log.
- `/hw:log`: use compact log context when available, with full-file fallback when compact is absent.

## Reference Files

- `references/log-spec.md`
- `references/commands-spec.md`
- `SKILL.md`
