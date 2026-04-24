---
name: reset
description: Reset Hypo-Workflow runtime artifacts when the user wants to clear state safely without deleting core project instructions by mistake.
---

# /hypo-workflow:reset

Use this skill for safe, full, or hard reset behavior.

## Preconditions

- clearly identify what will be removed before deletion

## Execution Flow

1. `/hypo-workflow:reset`
   - reinitialize `state.yaml`
   - preserve config, prompts, architecture, and logs
2. `/hypo-workflow:reset --full`
   - remove state, reports, and lifecycle logs
   - preserve config, prompts, and architecture
3. `/hypo-workflow:reset --hard`
   - show the delete list
   - require explicit `YES`
   - remove the whole `.pipeline/` workspace

## Safety Rules

- never skip the delete preview
- never run hard reset without explicit confirmation

## Reference Files

- `references/commands-spec.md`
- `references/log-spec.md`
- `SKILL.md`
