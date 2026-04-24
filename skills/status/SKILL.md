---
name: status
description: Show current Hypo-Workflow progress when the user wants a concise status summary without mutating pipeline state.
---

# /hypo-workflow:status

Use this skill to inspect pipeline progress only.

## Preconditions

- none; if `.pipeline/state.yaml` is missing, report that no active pipeline exists

## Execution Flow

1. Read `.pipeline/config.yaml` if present.
2. Read `.pipeline/state.yaml` if present.
3. Prefer `scripts/state-summary.sh` for a quick summary when shell access is available.
4. Report:
   - pipeline name
   - overall status
   - current milestone or prompt
   - current step and step index
   - latest completed milestone
   - deferred items if any
5. If `.pipeline/PROGRESS.md` exists, use it as a human-facing summary source, but do not rewrite it during status inspection.

## Safety Rules

- do not mutate `state.yaml`
- do not mutate logs or reports
- do not advance any step or milestone

## Reference Files

- `references/state-contract.md` — state layout
- `references/progress-spec.md` — progress summary layout
- `references/commands-spec.md` — status command semantics
- `SKILL.md` — broader system reference if needed
