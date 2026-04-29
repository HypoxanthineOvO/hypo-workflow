---
name: plan-confirm
description: Confirm the generated Hypo-Workflow plan when the user wants a final milestone summary before execution starts.
---

# /hypo-workflow:plan-confirm
## Output Language Rules

📌 输出语言规则：
读取 config.yaml → output.language
- zh-CN / zh：所有用户可见的输出使用中文（PROGRESS、报告、状态提示、错误消息、交互提问）
- en：使用英文
- auto：跟随用户对话语言
内部日志（log.yaml、state.yaml）始终英文。

Use this skill for P4 Confirm only.

## Preconditions

- planning artifacts already exist or have just been generated

## Execution Flow

1. Resolve plan mode as project `plan.mode` > global `plan.default_mode` > `interactive`.
2. Summarize:
   - project name
   - stack
   - preset
   - milestone count
   - generated files
   - greenfield vs append mode
3. In `plan.mode=interactive`, treat Confirm as a hard gate and wait for explicit approval before execution.
4. In `plan.mode=auto`, treat confirm as a summary checkpoint and continue without requiring approval.
5. Set `current.phase=plan_confirm` while this checkpoint is active.

## Interactive Hard Gate

Interactive Confirm must not be collapsed into a passive summary. The agent must stop and wait until the user explicitly says「确认」or an unambiguous equivalent approval such as「确认，开始执行」. A vague acknowledgement, a request to "check once more", or silence is not approval.

When `plan.interactive.require_explicit_confirm=true` or the field is missing, this gate is mandatory.

## Reference Files

- `plan/PLAN-SKILL.md` — Confirm phase rules
- `references/commands-spec.md`
- `references/config-spec.md`
- `SKILL.md`
