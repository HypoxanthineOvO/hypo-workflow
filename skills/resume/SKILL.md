---
name: resume
description: Resume Hypo-Workflow execution from the saved state when the user wants to continue an interrupted or stopped pipeline.
---

# /hypo-workflow:resume
## Output Language Rules

📌 输出语言规则：
读取 config.yaml → output.language
- zh-CN / zh：所有用户可见的输出使用中文（PROGRESS、报告、状态提示、错误消息、交互提问）
- en：使用英文
- auto：跟随用户对话语言
内部日志（log.yaml、state.yaml）始终英文。

Use this skill to continue from `.pipeline/state.yaml` without restarting completed work.

## Preconditions

- `.pipeline/state.yaml` exists
- the saved pipeline is unfinished, usually `pipeline.status=running` or `pipeline.status=stopped`

## Execution Flow

1. Read `~/.hypo-workflow/config.yaml` if present.
2. Read `.pipeline/config.yaml` and `.pipeline/state.yaml`.
3. Resolve effective execution and subagent defaults as project > global > defaults before selecting the next step.
4. Validate that `current.prompt_file`, `current.step`, and `current.step_index` still point to a valid prompt and step.
5. If `.pipeline/.lock` exists, stop and report that another execution is active.
6. Create `.pipeline/.lock` before resuming active execution.
7. Set `current.phase=executing` and update top-level `last_heartbeat`.
8. Continue from the next runnable step instead of replaying completed steps.
9. Use the same serial orchestration model as `/hypo-workflow:start`:
   - Claude coordinates
   - subagent tasks execute concrete work
   - Claude validates, scores, and updates artifacts
10. Update `.pipeline/PROGRESS.md`, `.pipeline/log.yaml`, `.pipeline/state.yaml`, and `last_heartbeat` after each meaningful transition.
11. After a Milestone report is generated and the Milestone reaches a final state, run `/hw:compact` automatically when `compact.auto=true`; skip it when `compact.auto=false`.
12. Apply the same `retry` / `deferred` / `stop` decision model on failures.
13. Remove `.pipeline/.lock` when the resume turn completes, stops, blocks, aborts, or finishes.
14. If the pipeline completes or stops intentionally, unregister the watchdog cron entry.

## Safety Rules

- never silently discard saved work
- never resume when `.pipeline/.lock` says another execution is active
- if state references a missing prompt, stop and explain the inconsistency
- if the current step is already complete, advance to the next runnable step rather than rerunning it blindly

## Watchdog Integration

Watchdog-triggered resumes follow the same safety rules as user-triggered resumes. They must update `last_heartbeat`, honor `.pipeline/.lock`, and write a concise note to `.pipeline/watchdog.log` when the triggering script provides context.

## Reference Files

- `references/state-contract.md` — resume semantics and required fields
- `references/commands-spec.md` — command behavior
- `references/progress-spec.md` — progress summary rules
- `references/config-spec.md` — global/project config fallback rules
- `SKILL.md` — full execution context if needed
