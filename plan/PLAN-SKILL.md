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
- persist intermediate state in `.plan-state/discover.yaml`

Discover should use a two-pass discussion shape:

1. global framing
   - project type
   - target users
   - delivery artifact
   - constraints
2. focused drilling
   - architecture expectations
   - testing expectations
   - integration boundaries
   - migration or compatibility constraints

Repository scan rules:

- if the repo already contains source files, summarize the current structure before proposing milestones
- if `.pipeline/` already exists, treat the plan as append-or-revise rather than greenfield
- if the repo is effectively empty, skip structural scan and say that the plan is greenfield

Required Discover outputs:

- `.pipeline/design-spec.md`
- `.plan-state/discover.yaml`
- a concise list of unresolved questions, if any

### Decompose

- split work into milestones
- attach test specs and boundary coverage expectations
- keep milestones serial and reviewable

Decompose output rules:

- each milestone should map to one generated prompt file
- every milestone must include:
  - objective
  - implementation scope
  - test spec
  - expected artifacts
- prefer 3-6 milestones for medium projects
- prefer narrower milestones when architecture review is likely to change downstream prompts

Persist milestone planning state in `.plan-state/decompose.yaml` when possible.

### Generate

- write `.pipeline/config.yaml`
- write `.pipeline/prompts/*.md`
- write `.pipeline/architecture.md`
- choose a preset and template

Generate rules:

- use `plan/assets/prompt-template.md` as the default prompt shape
- detect append mode when `.pipeline/config.yaml` or `.pipeline/prompts/` already exists
- in append mode:
  - read the existing config and prompt list first
  - preserve numbering unless the user explicitly wants a re-sequence
  - summarize what is being appended versus revised

Preset selection rules:

- choose `tdd` for engineering projects with executable tests
- choose `implement-only` for documentation, research, or planning-heavy work
- choose `custom` only when the user explicitly needs a non-standard sequence

Required Generate outputs:

- `.pipeline/config.yaml`
- `.pipeline/prompts/*.md`
- `.pipeline/architecture.md`
- `.plan-state/generate.yaml`

### Confirm

- summarize generated artifacts
- confirm project name, stack, preset, prompt count, and file list
- wait for explicit `/hw:start` or natural-language equivalent

Confirm summary must include:

- project name
- tech stack
- selected preset
- milestone count
- test point count
- generated file list
- whether the plan is greenfield or append mode

Do not auto-start execution from Confirm. Wait for an explicit `/hw:start`.

### Review

- inspect architecture deltas after a milestone
- identify downstream prompt impact
- propose prompt updates before the next milestone runs

Review rules:

- default `/hw:review` inspects the latest completed milestone
- `/hw:review --full` summarizes all completed milestones
- append review notes to `.pipeline/architecture.md`
- use `ADDED`, `CHANGED`, `REASON`, and `IMPACT` headings
- never silently rewrite future prompts; propose edits first

## Shared Planning Artifacts

Use these files when relevant:

- `plan/assets/design-spec-template.md`
- `plan/assets/prompt-template.md`
- `.plan-state/discover.yaml`
- `references/plan-review-spec.md`

`.plan-state/` is runtime planning state and should not be committed. Use it for resumable planning phases in the same spirit as `.pipeline/state.yaml`.
