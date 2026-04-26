---
name: hypo-workflow-plan
version: 7.0.0
description: Plan Mode sub-skill for Hypo-Workflow. Use this file when the user invokes `/hw:plan`, `/hw:plan:*`, `/hw:plan:review`, or the compatibility alias `/hw:review`.
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
| `/hw:plan:review` | Review architecture and downstream prompt impact for the current milestone or all milestones with `--full` |

If the user invokes `/hw:plan:xxx` and `xxx` is not recognized, return:

`Unknown command: /hw:plan:xxx. Available: /hw:plan, /hw:plan:discover, /hw:plan:decompose, /hw:plan:generate, /hw:plan:confirm, /hw:plan:review`

## Progressive Disclosure

Load planning resources in layers:

1. this file as the planning L2 entry point
2. `plan/assets/` for shared plan-generation templates
3. `plan/templates/` for reusable scenario presets
4. `references/commands-spec.md` and `references/plan-review-spec.md` for detailed semantics

## Plan Modes

Read `plan.mode` from `.pipeline/config.yaml` when present. If it is missing, fall back to `~/.hypo-workflow/config.yaml` `plan.default_mode`, then `interactive`.

- `interactive` is the default:
  - Discover asks targeted questions in rounds
  - the user participates at checkpoints
  - Confirm must wait for explicit approval
- `auto` is unattended:
  - Claude completes P1-P4 without pausing unless blocked by missing critical information
  - Confirm is a summary checkpoint, not a hard gate

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

Interactive questioning rules:

- ask 2-3 targeted questions per round
- move from broad framing to detailed drilling
- summarize what was learned after each round
- do not leave Discover until the user signals that the requirement interview is sufficient

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

Append conflict rules:

- never silently renumber an existing executed prompt
- when generated prompt numbers collide with existing prompts:
  - preserve already-executed prompt filenames
  - append new prompts after the highest existing sequence number by default
  - create a patch proposal instead of rewriting history
- if a full resequence is truly needed, summarize the proposed renumbering and require explicit approval before mutating prompt files

### Generate

- write `.pipeline/config.yaml`
- write `.pipeline/prompts/*.md`
- write `.pipeline/architecture.md`
- choose a preset and template
- draft a detailed implementation plan for each milestone before converting it into prompt text

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
- for each milestone, write a concrete implementation plan with ordered steps, dependencies, verification points, test spec, and constraints before rendering the prompt file
- convert that implementation plan into the final prompt file format instead of freehand summary text
- preserve the validation intent from the milestone plan in the generated prompt's `预期测试` and constraints sections

Required Generate outputs:

- `.pipeline/config.yaml`
- `~/.hypo-workflow/config.yaml`
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

Interactive mode must wait for explicit `/hw:start`. Auto mode may treat Confirm as a pass-through summary and continue.

### Review

- inspect architecture deltas after a milestone
- identify downstream prompt impact
- propose prompt updates before the next milestone runs

Review rules:

- default `/hw:plan:review` inspects the latest completed milestone
- `/hw:plan:review --full` summarizes all completed milestones
- append review notes to `.pipeline/architecture.md`
- use `ADDED`, `CHANGED`, `REASON`, and `IMPACT` headings
- never silently rewrite future prompts; propose edits first
- write downstream prompt edits to `.plan-state/prompt-patch-queue.yaml`
- use `plan/assets/prompt-patch-queue-template.yaml` as the default queue shape

Compatibility:

- `/hw:review` should not run the review directly anymore
- it should print `⚠️ \`/hw:review\` 已迁移到 \`/hw:plan:review\`。请使用新命令。此兼容提示将在 V7 中移除。`
- keep `/hw:review --full` documented as a compatibility reminder until V7

## Shared Planning Artifacts

Use these files when relevant:

- `plan/assets/design-spec-template.md`
- `plan/assets/prompt-template.md`
- `plan/assets/prompt-patch-queue-template.yaml`
- `plan/templates/`
- `.plan-state/discover.yaml`
- `references/plan-review-spec.md`

`.plan-state/` is runtime planning state and should not be committed. Use it for resumable planning phases in the same spirit as `.pipeline/state.yaml`.
