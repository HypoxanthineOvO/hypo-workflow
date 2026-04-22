---
name: prompt-pipeline-plan
version: 5.0.0
description: Plan Mode sub-skill for Hypo-Workflow. Use this file when the user invokes `/hw:plan`, `/hw:plan:*`, or `/hw:review`.
---

# Plan Mode

Use this sub-skill when the user wants to design or revise a pipeline before implementation starts, or when a completed milestone requires plan review.

## Commands

| Command | Description |
|---------|-------------|
| `/hw:plan` | Enter the Discover-first planning flow |
| `/hw:plan:discover` | Collect requirements, constraints, stack, and current repo context |
| `/hw:plan:decompose` | Split the work into milestones with test specs |
| `/hw:plan:generate` | Generate `.pipeline/` config, prompts, and architecture baseline |
| `/hw:plan:confirm` | Summarize the plan and wait for explicit execution approval |
| `/hw:review` | Review architecture and downstream prompt impact for the current milestone |

If the user invokes `/hw:plan:xxx` and `xxx` is not recognized, return:

`Unknown command: /hw:plan:xxx. Available: /hw:plan, /hw:plan:discover, /hw:plan:decompose, /hw:plan:generate, /hw:plan:confirm, /hw:review`

## Progressive Disclosure

Load planning resources in layers:

1. this file as the planning L2 entry point
2. `plan/assets/` for shared plan-generation templates
3. `plan/templates/` for reusable scenario presets
4. `references/commands-spec.md` and `references/plan-review-spec.md` for detailed semantics

## Phase Skeleton

### Discover

- inspect the current repository when applicable
- capture goals, constraints, tech stack, and deliverables
- write or update `.pipeline/design-spec.md`

### Decompose

- split work into milestones
- attach test specs and boundary coverage expectations
- keep milestones serial and reviewable

### Generate

- write `.pipeline/config.yaml`
- write `.pipeline/prompts/*.md`
- write `.pipeline/architecture.md`
- choose a preset and template

### Confirm

- summarize generated artifacts
- confirm project name, stack, preset, prompt count, and file list
- wait for explicit `/hw:start` or natural-language equivalent

### Review

- inspect architecture deltas after a milestone
- identify downstream prompt impact
- propose prompt updates before the next milestone runs

Detailed behavior is filled in by later V5 milestones.
