---
name: accept
description: Accept pending Hypo-Workflow Cycle work and complete the manual acceptance gate.
---

# /hw:accept
## Output Language Rules

📌 输出语言规则：
读取 config.yaml → output.language
- zh-CN / zh：所有用户可见的输出使用中文（PROGRESS、报告、状态提示、错误消息、交互提问）
- en：使用英文
- auto：跟随用户对话语言
内部日志（log.yaml、state.yaml）始终英文。

Use this skill when the user invokes `/hw:accept`.

## Semantics

- Read `.pipeline/cycle.yaml` and `.pipeline/state.yaml`.
- Require Cycle acceptance state `pending_acceptance` or `acceptance.state: pending`.
- Mark `cycle.status: completed`.
- Mark `cycle.acceptance.state: accepted` and store `accepted_at`.
- Mirror only compact acceptance state in `state.yaml`:
  - `acceptance.scope: cycle`
  - `acceptance.state: accepted`
  - `acceptance.cycle_id`
  - `acceptance.updated_at`
- Set `pipeline.status: completed` and `current.phase: completed`.
- Append a `cycle_accept` entry to `.pipeline/log.yaml`.
- Update `.pipeline/PROGRESS.md` with a compact board row.
- Archive only when the Cycle close/archive flow is explicitly requested or configured; accepting the gate itself is not a separate runner.

Do not store full review notes in `state.yaml`.
