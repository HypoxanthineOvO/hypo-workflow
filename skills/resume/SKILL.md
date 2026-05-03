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
4. If `current.phase=needs_revision`, resume the revision path using `acceptance.feedback_ref` as input; do not continue from a previously completed step.
5. If `current.phase=follow_up_planning`, start the active `continuation` or the matching `cycle.continuations[]` follow-up plan.
6. Validate that `current.prompt_file`, `current.step`, and `current.step_index` still point to a valid prompt and step for ordinary execution phases.
7. If `.pipeline/.lock` exists, parse it as an execution lease.
   - fresh foreign lease: stop and report that another execution is active
   - expired lease: take over, write `lease_takeover` evidence, and record `inferred_stall`
   - lease with `reported_failure`: take over and preserve the failure evidence
   - malformed lease: stop with repair guidance instead of deleting it silently
8. Create or refresh the structured execution lease before resuming active execution.
9. Set `current.phase=executing` and update top-level `last_heartbeat`.
10. Use the workflow commit helper for any protected lifecycle write so authority facts commit atomically before derived refreshes.
10. Continue from the next runnable step instead of replaying completed steps.
11. Use the same serial orchestration model as `/hypo-workflow:start`:
   - Claude coordinates
   - subagent tasks execute concrete work
   - Claude validates, scores, and updates artifacts
12. Update `.pipeline/PROGRESS.md`, `.pipeline/log.yaml`, `.pipeline/state.yaml`, and `last_heartbeat` after each meaningful transition.
13. If a derived refresh fails after authority commits, keep the authoritative fact committed, write `.pipeline/derived-refresh.yaml`, and surface repair guidance instead of rolling back the lifecycle write.
14. After a Milestone report is generated and the Milestone reaches a final state, run `/hw:compact` automatically when `compact.auto=true`; skip it when `compact.auto=false`.
15. If `.pipeline/feature-queue.yaml` exists, resume batch auto-chain from the saved state:
   - honor `gate: confirm` by pausing before the next Feature
   - when a queued Feature uses `just_in_time`, decompose it only after it becomes current
   - sync queue duration, token/cost, and metric summaries from `.pipeline/metrics.yaml`, preserving `n/a` for unavailable telemetry
16. When Test Profiles are active, do not treat missing profile evidence as a soft warning; block until the required evidence contract is satisfied or an explicit blocker is recorded.
17. Apply the same `retry` / `deferred` / `stop` decision model on failures.
18. Remove `.pipeline/.lock` when the resume turn completes, stops, blocks, aborts, or finishes.
19. If the pipeline completes or stops intentionally, unregister the watchdog cron entry.

## Safety Rules

- never silently discard saved work
- never resume when a fresh `.pipeline/.lock` lease says another execution is active
- if state references a missing prompt, stop and explain the inconsistency
- if the current step is already complete, advance to the next runnable step rather than rerunning it blindly

## Watchdog Integration

Watchdog-triggered resumes follow the same safety rules as user-triggered resumes. They must update `last_heartbeat`, honor fresh execution leases, take over expired leases with evidence, and write a concise note to `.pipeline/watchdog.log` when the triggering script provides context.

## Reference Files

- `references/state-contract.md` — resume semantics and required fields
- `references/commands-spec.md` — command behavior
- `references/progress-spec.md` — progress summary rules
- `references/config-spec.md` — global/project config fallback rules
- `SKILL.md` — full execution context if needed
