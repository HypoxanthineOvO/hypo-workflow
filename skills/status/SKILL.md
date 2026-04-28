---
name: status
description: Show current Hypo-Workflow progress when the user wants a concise status summary without mutating pipeline state.
---

# /hypo-workflow:status

Use this skill to inspect pipeline progress only.

## Preconditions

- none; if `.pipeline/state.yaml` is missing, report that no active pipeline exists

## Execution Flow

1. Read `~/.hypo-workflow/config.yaml` if present.
2. Read `.pipeline/config.yaml` if present.
3. Read `.pipeline/state.yaml` if present.
4. Resolve effective defaults as project > global > defaults without mutating either config file.
5. Prefer `scripts/state-summary.sh` for a quick summary when shell access is available.
6. Report:
   - pipeline name
   - overall status
   - current milestone or prompt
   - current step and step index
   - effective execution mode and subagent provider
   - active Cycle when `.pipeline/cycle.yaml` exists
   - latest completed milestone
   - deferred items if any
   - `last_heartbeat` and watchdog state when present
7. If `.pipeline/PROGRESS.md` exists, use it as a human-facing summary source, but do not rewrite it during status inspection.
8. If project-root `PROJECT-SUMMARY.md` exists, include its top summary line and Open Patches / Deferred counts.

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
