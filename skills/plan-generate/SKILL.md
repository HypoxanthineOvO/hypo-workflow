---
name: plan-generate
description: Generate Hypo-Workflow artifacts from the approved milestone plan when the user wants prompts, config, and architecture outputs.
---

# /hypo-workflow:plan-generate

Use this skill for P3 Generate only.

## Preconditions

- milestones have been defined well enough to produce `.pipeline/` artifacts

## Execution Flow

1. Read `~/.hypo-workflow/config.yaml` if present.
2. Generate `.pipeline/config.yaml` with project-specific values and only the overrides that should beat global defaults.
3. Generate `.pipeline/prompts/*.md`.
4. Generate architecture baseline files.
5. Before writing each prompt, create a detailed implementation plan containing:
   - ordered steps
   - dependencies
   - verification points
   - test spec
   - constraints
6. Convert that implementation plan into the final prompt file.
7. Detect append mode and preserve already executed numbering.

## Interactive Behavior

- in interactive mode, surface any major append-mode conflict or architecture uncertainty before finalizing
- in auto mode, proceed unless blocked by a structural conflict that would rewrite history

## Reference Files

- `plan/PLAN-SKILL.md` — Generate phase behavior
- `references/commands-spec.md` — command semantics
- `references/config-spec.md` — project/global config split
- `SKILL.md` — full system context
