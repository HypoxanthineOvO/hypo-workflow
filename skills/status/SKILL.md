---
name: status
description: Show current Hypo-Workflow progress when the user wants a concise status summary without mutating pipeline state.
---

# /hypo-workflow:status
## Output Language Rules

📌 输出语言规则：
读取 config.yaml → output.language
- zh-CN / zh：所有用户可见的输出使用中文（PROGRESS、报告、状态提示、错误消息、交互提问）
- en：使用英文
- auto：跟随用户对话语言
内部日志（log.yaml、state.yaml）始终英文。

Use this skill to inspect pipeline progress only.

## Preconditions

- none; if `.pipeline/state.yaml` is missing, report that no active pipeline exists

## Execution Flow

1. Read `~/.hypo-workflow/config.yaml` if present.
2. Read `.pipeline/config.yaml` if present.
3. If the user passed `--full`, read `.pipeline/state.yaml` and `.pipeline/PROGRESS.md` directly and print `加载完整版 state.yaml` / `加载完整版 PROGRESS.md` with line counts when possible.
4. If `--full` is absent, prefer `.pipeline/state.compact.yaml` and `.pipeline/PROGRESS.compact.md` when they exist; otherwise fall back to `.pipeline/state.yaml` and `.pipeline/PROGRESS.md`.
5. Resolve effective defaults as project > global > defaults without mutating either config file.
6. Prefer `scripts/state-summary.sh` for a quick summary when shell access is available; use compact files only as supplemental context because canonical state mutations still belong to `state.yaml`.
7. Report:
   - pipeline name
   - overall status
   - current milestone or prompt
   - current step and step index
   - effective execution mode and subagent provider
   - active Cycle when `.pipeline/cycle.yaml` exists
   - latest completed milestone
   - deferred items if any
   - `last_heartbeat` and watchdog state when present
8. If `.pipeline/PROGRESS.md` or `.pipeline/PROGRESS.compact.md` exists, use it as a human-facing summary source, but do not rewrite it during status inspection.
9. If project-root `PROJECT-SUMMARY.md` exists, include its top summary line and Open Patches / Deferred counts.

## Flags

- `/hw:status --full`: ignore compact files and load the complete `.pipeline/state.yaml` and `.pipeline/PROGRESS.md`.
- `/hw:status`: use compact files when available, with full-file fallback when compact files are absent.

## Safety Rules

- do not mutate `state.yaml`
- do not mutate logs or reports
- do not advance any step or milestone

## Reference Files

- `references/state-contract.md` — state layout
- `references/progress-spec.md` — progress summary layout
- `references/commands-spec.md` — status command semantics
- `references/config-spec.md` — config priority and fallback rules
- `SKILL.md` — broader system reference if needed
