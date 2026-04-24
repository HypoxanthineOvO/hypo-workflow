---
name: plan
description: Enter Hypo-Workflow planning mode when the user wants to design milestones before execution starts.
---

# /hypo-workflow:plan

Use this skill for the full P1-P4 planning flow.

## Preconditions

- planning should happen before normal execution begins
- if `.pipeline/` already exists, treat planning as revise-or-append, not necessarily greenfield

## Plan Modes

- `plan.mode=interactive` (default)
  - user participates at each checkpoint
  - P1 Discover asks targeted questions until the user says the requirement interview is sufficient
  - P4 Confirm must wait for explicit user confirmation
- `plan.mode=auto`
  - Claude completes P1-P4 without stopping for user answers unless blocked by missing critical information
  - P4 Confirm becomes a summary pass-through, not a hard gate

## Execution Flow

1. Read `plan.mode` and `plan.interaction_depth` from `.pipeline/config.yaml` when present.
2. Run P1 Discover:
   - collect goals, constraints, stack, users, and architecture expectations
3. Run P2 Decompose:
   - split work into reviewable milestones with validation points
4. Run P3 Generate:
   - generate `.pipeline/` artifacts and architecture baseline
5. Run P4 Confirm:
   - interactive mode waits for user confirmation
   - auto mode summarizes and moves on
6. Set `current.phase` to the matching planning phase during each stage.

## Interactive Checkpoints

- Discover, Decompose, Generate, and Confirm can all surface follow-up questions
- in interactive mode, hook behavior should allow turn end during planning checkpoints
- in auto mode, planning should continue unattended

## Reference Files

- `plan/PLAN-SKILL.md` — detailed P1-P4 planning system
- `references/commands-spec.md` — command routing semantics
- `SKILL.md` — overall pipeline context
