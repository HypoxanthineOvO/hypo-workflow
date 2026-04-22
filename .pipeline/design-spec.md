# V5 Design Spec

## Objective

Implement Plan Mode for Hypo-Workflow so `/hw:plan` becomes a real planning entry point rather than a reserved placeholder.

V5 must add:

- a dedicated plan sub-skill
- four explicit planning phases:
  `discover`, `decompose`, `generate`, `confirm`
- plan review and architecture tracking
- reusable planning templates
- explicit slash-command registration for the new planning and review commands

## Scope

In scope:

- `plan/PLAN-SKILL.md`
- `plan/templates/`
- `plan/assets/`
- `references/commands-spec.md`
- `references/plan-review-spec.md`
- `SKILL.md`
- `README.md`
- `.claude-plugin/plugin.json`
- self-bootstrap planning artifacts under `.pipeline/`

Out of scope:

- executable runtime code beyond the existing shell helper surface
- remote orchestration or external services
- automatic hook-driven plan execution

## Existing Architecture Snapshot

- runtime behavior is primarily defined in `SKILL.md`
- detailed semantics live in `references/*.md`
- deterministic helpers live in `scripts/*.sh`
- Claude packaging lives in `.claude-plugin/plugin.json`
- examples and system scenarios are repo-local and file-driven

Implication:

- V5 should stay documentation-driven and file-based
- Plan Mode should mirror Progressive Disclosure:
  main `SKILL.md` routes to `plan/PLAN-SKILL.md`, which routes to plan templates and plan references

## Functional Requirements

### Slash Commands

Need explicit support for:

- `/hw:plan`
- `/hw:plan:discover`
- `/hw:plan:decompose`
- `/hw:plan:generate`
- `/hw:plan:confirm`
- `/hw:review`
- `/hw:review --full`

### Plan Mode Flow

1. Discover
   - inspect current repository when present
   - capture goals, constraints, tech stack, and delivery shape
   - write `.pipeline/design-spec.md`
2. Decompose
   - split the plan into milestones
   - include test specs and boundary coverage per milestone
3. Generate
   - write `.pipeline/config.yaml`
   - write `.pipeline/prompts/*.md`
   - write `.pipeline/architecture.md`
   - choose a preset and template
4. Confirm
   - summarize the generated plan
   - wait for explicit start confirmation

### Plan Review

- add a review phase after milestone completion
- record architecture deltas in `architecture.md`
- expose `/hw:review` and `/hw:review --full`
- detect downstream prompt impact and suggest updates

### Template Library

Need initial templates:

- `tdd-python-cli`
- `tdd-typescript-web`
- `docs-writing`
- `research`
- `refactor`

Each template must include:

- `config.yaml`
- at least three prompt files

## Non-Functional Requirements

- preserve V4.5 natural-language compatibility
- do not change existing TDD execution semantics
- keep Plan Mode file-first and auditable
- keep `SKILL.md` roughly within 560-600 lines
- use conventional commits, one commit per milestone

## Milestone Proposal

### M0

Plan sub-skill skeleton and command registration.

### M1

Discover phase logic, design-spec template, and `.plan-state` scaffolding.

### M2

Decompose, generate, confirm flow plus prompt/config generation assets.

### M3

Plan review, architecture tracking, `/hw:review`, and main pipeline integration.

### M4

Template library, docs polish, version bump, and self-bootstrap validation report.

## Risks

- command sprawl may bloat `SKILL.md`
- `history.completed_prompts` is legacy naming and may complicate skipped/review semantics
- `.pipeline/` is both runtime workspace and dogfooding workspace, so state artifacts must stay ignored
- architecture review semantics can overlap with V4 architecture drift evaluation unless clearly separated

## Success Criteria

- `/hw:plan` loads a dedicated plan sub-skill
- all four `/hw:plan:*` phase commands are defined
- `/hw:review` semantics are documented
- templates exist and are selectable
- plugin version is `5.0.0`
- self-bootstrap report captures friction and design feedback
