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
