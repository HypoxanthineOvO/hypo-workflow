---
name: audit
description: Run a preventive code audit when the user wants graded findings across security, bugs, architecture, performance, tests, and quality.
---

# /hypo-workflow:audit

Use this skill for deep project auditing.

## Preconditions

- source code and architecture baseline should be available

## Execution Flow

1. Determine scope:
   - full project
   - `--scope <dir>`
   - `--since <milestone>`
2. Read the architecture baseline first.
3. Resolve `output.language` and `output.timezone`.
4. Scan the six audit dimensions.
5. Grade findings as `Critical`, `Warning`, or `Info`.
6. Write the report to `.pipeline/audits/audit-NNN.md` in `output.language`.
7. Render report timestamps in `output.timezone`.
8. Append a lifecycle log entry.
9. Set `current.phase=lifecycle_audit` when state tracking is used.

## Reference Files

- `references/audit-spec.md`
- `references/log-spec.md`
- `SKILL.md`
