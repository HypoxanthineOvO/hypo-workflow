---
name: plan-decompose
description: Split discovered work into milestones when the user wants Hypo-Workflow to produce a serial, reviewable delivery plan.
---

# /hypo-workflow:plan-decompose

Use this skill for P2 Decompose only.

## Preconditions

- P1 Discover has already clarified the project enough to define milestones

## Execution Flow

1. Read the current design summary and repo context.
2. Split work into serial milestones.
3. Each milestone must include:
   - objective
   - implementation scope
   - test spec
   - expected artifacts
4. Prefer narrow milestones when architecture may shift later prompts.
5. Preserve append-mode safety:
   - do not silently renumber executed prompts
   - append new prompts after the highest safe sequence number

## Interactive Behavior

- in interactive mode, show the proposed milestone split and ask follow-up questions if dependencies or scope boundaries are still ambiguous
- after P2 produces the split, stop at a checkpoint before P3
- the checkpoint must show:
  - milestone number and name
  - objective
  - implementation scope
  - test spec
  - expected artifacts
  - unresolved assumptions
- wait for explicit user confirmation before entering P3 Generate
- do not generate `.pipeline/` files, prompt files, or architecture files from P2 directly
- if the user asks for changes, revise the split and present the checkpoint again
- in auto mode, finalize the milestone split directly unless blocked

## P2 Checkpoint Gate

Interactive P2 completion is not permission to write files. The only valid next step is to display the proposed decomposition and ask the user to confirm it. P3 may start only after the user explicitly approves the milestone split.

## Reference Files

- `plan/PLAN-SKILL.md` — Decompose phase rules
- `references/commands-spec.md` — command routing
- `SKILL.md` — broader planning context
