---
name: plan-generate
description: Generate Hypo-Workflow artifacts from the approved milestone plan when the user wants prompts, config, and architecture outputs.
---

# /hypo-workflow:plan-generate

Use this skill for P3 Generate only.

## Preconditions

- milestones have been defined well enough to produce `.pipeline/` artifacts

## Execution Flow

1. Generate `.pipeline/config.yaml`.
2. Generate `.pipeline/prompts/*.md`.
3. Generate architecture baseline files.
4. Before writing each prompt, create a detailed implementation plan containing:
   - ordered steps
   - dependencies
   - verification points
   - test spec
   - constraints
5. Convert that implementation plan into the final prompt file.
6. Detect append mode and preserve already executed numbering.

## Interactive Behavior

- in interactive mode, surface any major append-mode conflict or architecture uncertainty before finalizing
- in auto mode, proceed unless blocked by a structural conflict that would rewrite history

## Reference Files

- `plan/PLAN-SKILL.md` — Generate phase behavior
- `references/commands-spec.md` — command semantics
- `SKILL.md` — full system context
