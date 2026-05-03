---
name: audit
description: Run a preventive code audit when the user wants graded findings across security, bugs, architecture, performance, tests, and quality.
---

# /hypo-workflow:audit
## Output Language Rules

📌 输出语言规则：
读取 config.yaml → output.language
- zh-CN / zh：所有用户可见的输出使用中文（PROGRESS、报告、状态提示、错误消息、交互提问）
- en：使用英文
- auto：跟随用户对话语言
内部日志（log.yaml、state.yaml）始终英文。

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
8. Apply the shared secret-safe evidence redaction helper before durable writes; do not store raw API keys, tokens, Authorization headers, cookies, passwords, or private keys.
9. Append a lifecycle log entry.
10. Set `current.phase=lifecycle_audit` when state tracking is used.

## Reference Files

- `references/audit-spec.md`
- `references/log-spec.md`
- `SKILL.md`
