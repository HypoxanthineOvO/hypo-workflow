# Architecture Baseline

## Current Baseline

- `SKILL.md` is the primary runtime contract and L2 instruction source.
- `references/` holds detailed policy and state/evaluation semantics.
- `scripts/` provides deterministic helper behavior.
- `.claude-plugin/plugin.json` packages the skill and hook metadata.
- `tests/scenarios/` is the regression matrix for behavior changes.

## Planned V5 Additions

### ADDED

- `plan/PLAN-SKILL.md` as a dedicated planning sub-skill
- `plan/templates/` as reusable plan-generation templates
- `plan/assets/` for shared planning templates
- `references/plan-review-spec.md` for architecture review behavior

### CHANGED

- `SKILL.md` command surface to include real Plan Mode and review commands
- `references/commands-spec.md` to include planning and review subcommands
- `README.md` to document Plan Mode and template selection

### REASON

- `/hw:plan` is currently only a placeholder in V4.5
- architecture review is needed to keep future prompts aligned after milestone changes

### IMPACT

- main skill must route to a sub-skill without bloating the core execution path
- planning artifacts must remain compatible with existing `.pipeline/` runtime expectations
- plan review must complement, not replace, V4 architecture drift evaluation

## Review History

### Milestone M0 / Prompt 00-plan-skeleton

#### ADDED

- `plan/PLAN-SKILL.md`
- explicit `/hw:plan:*` and `/hw:review` command routing

#### CHANGED

- main `SKILL.md` now delegates planning commands to a sub-skill
- `references/commands-spec.md` now distinguishes pipeline execution commands from planning commands

#### REASON

- `/hw:plan` needed to move from placeholder to a real entry surface

#### IMPACT

- later milestones can focus on phase behavior instead of command registration
- downstream prompts remained valid without changes

### Milestone M1 / Prompt 01-discover-state

#### ADDED

- `plan/assets/design-spec-template.md`
- `.plan-state/` discover-state contract

#### CHANGED

- Discover is now defined as a two-pass planning discussion rather than a single free-form brainstorm

#### REASON

- self-bootstrap showed that requirements capture needs more structure before decomposition starts

#### IMPACT

- downstream generation prompts now depend on `design-spec.md` quality
- no prompt rewrite required

### Milestone M2 / Prompt 02-plan-generation

#### ADDED

- `plan/assets/prompt-template.md`
- append-mode and preset-selection rules for plan generation

#### CHANGED

- Generate and Confirm now have explicit output contracts

#### REASON

- self-bootstrap required deterministic `.pipeline/` generation and confirmation criteria

#### IMPACT

- Prompt 03 must define how Plan Review reacts to generated architecture baselines
- Prompt 04 can build templates on top of the standardized prompt shape
