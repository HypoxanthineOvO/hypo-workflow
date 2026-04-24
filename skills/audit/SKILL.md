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
3. Scan the six audit dimensions.
4. Grade findings as `Critical`, `Warning`, or `Info`.
5. Write the report to `.pipeline/audits/audit-NNN.md`.
6. Append a lifecycle log entry.
7. Set `current.phase=lifecycle_audit` when state tracking is used.

## Reference Files

- `references/audit-spec.md`
- `references/log-spec.md`
- `SKILL.md`
