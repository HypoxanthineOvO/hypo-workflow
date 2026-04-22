# Hypo-Workflow

Serialized prompt execution engine for AI agents.

Hypo-Workflow turns a local `.pipeline/` workspace into a resumable implementation pipeline with:

- TDD, implement-only, and custom step presets
- explicit state management through `.pipeline/state.yaml`
- self-review or subagent-assisted review
- interrupt recovery at prompt and sub-step granularity
- Claude Code hook integration
- V4 multi-dimensional evaluation, adaptive thresholding, and architecture drift detection

## What It Solves

Most agent sessions are stateless and fragile. Once the context drifts or the session stops, it is easy to lose:

- which prompt is currently active
- which sub-step has already finished
- why a change was blocked
- whether the implementation still matches the plan

Hypo-Workflow keeps the run serialized and observable. The agent always works on one prompt at a time, persists state after every meaningful transition, and can resume from the exact step recorded in `.pipeline/state.yaml`.

## Core Features

- `SKILL.md` as the single entry point
- Progressive Disclosure:
  `SKILL.md` for runtime rules, `references/` for detailed policy, `scripts/` for deterministic helpers, `assets/` for stable templates
- step presets:
  `tdd`, `implement-only`, `custom`
- recovery commands:
  `开始执行`, `继续`, `执行下一步`, `pipeline status`, `跳过当前步骤`, `abort`
- subagent delegation with fallback:
  route review steps to Claude or Codex when available, fall back to self without blocking
- Claude plugin packaging:
  `.claude-plugin/plugin.json`
- Claude hooks:
  `hooks/stop-check.sh`, `hooks/session-start.sh`, `hooks/instructions-loaded.sh`
- V4 evaluation:
  `diff_score`, `code_quality`, `test_coverage`, `complexity`, `architecture_drift`, `overall`
- adaptive threshold:
  tighten after repeated low-drift prompts, relax after a stop

## Repository Layout

```text
.
├── SKILL.md
├── config.schema.yaml
├── adapters/
├── assets/
├── examples/
├── hooks/
├── references/
├── scripts/
├── templates/
└── tests/
```

## Quick Start

### 1. Put the skill where your agent can load it

For Codex or Claude-style skill bundles, copy `prompt-pipeline/` into your skills directory or project workspace.

### 2. Create a local pipeline workspace

```text
your-project/
└── .pipeline/
    ├── config.yaml
    └── prompts/
        ├── 00-scaffold.md
        └── 01-feature.md
```

Minimal config:

```yaml
pipeline:
  name: "Example Pipeline"
  source: local
  output: local

execution:
  mode: self
  steps:
    preset: tdd

evaluation:
  auto_continue: false
  max_diff_score: 3
```

### 3. Ask the agent to run

Typical commands:

- `开始执行`
- `继续`
- `执行下一步`
- `pipeline status`

The agent should follow `SKILL.md`, validate `.pipeline/config.yaml`, initialize or resume `.pipeline/state.yaml`, and execute exactly one serialized pipeline flow.

## Step Presets

### TDD

```text
write_tests -> review_tests -> run_tests_red -> implement -> run_tests_green -> review_code
```

### Implement-only

```text
implement -> run_tests -> review_code
```

### Custom

Provide `execution.steps.sequence` explicitly in `config.yaml`.

## State Model

Hypo-Workflow persists runtime state after:

- pipeline initialization
- prompt start
- step start
- step finish
- skip cascade updates
- prompt finish or prompt blocked
- abort and restart actions

The state contract is documented in [references/state-contract.md](references/state-contract.md).

Key files:

- `.pipeline/state.yaml`
- `.pipeline/log.md`
- `.pipeline/reports/*.report.md`

## Evaluation Model

V4 extends the original diff-based gate into a multi-dimensional review model.

Scored dimensions:

- `diff_score`
- `code_quality`
- `test_coverage`
- `complexity`
- `architecture_drift`
- `overall`

Blocking rules:

- `diff_score > threshold`
- `architecture_drift >= 4`
- `overall > threshold + 1`

Detailed rules live in [references/evaluation-spec.md](references/evaluation-spec.md).

## Hooks And Plugin Packaging

Claude Code can use packaged hooks through [.claude-plugin/plugin.json](.claude-plugin/plugin.json).

Included hooks:

- `Stop`
  block session end when the pipeline is still running and required state/report updates are missing
- `SessionStart`
  inject current pipeline context on startup, resume, or compact
- `InstructionsLoaded`
  optional observability hook

Hook behavior and platform differences are summarized in [hooks/README.md](hooks/README.md).

## Scripts

Helper scripts are intentionally small and deterministic:

- `scripts/validate-config.sh`
- `scripts/state-summary.sh`
- `scripts/log-append.sh`
- `scripts/diff-stats.sh`

These are used both by the skill runtime and by regression scenarios.

## Examples

Included example pipelines:

- `examples/hypo-todo/`
- `examples/hypo-todo-subagent/`
- `examples/hypo-todo-adaptive/`

They cover:

- baseline TDD flow
- subagent-assisted review
- adaptive threshold behavior

## Testing

Regression scenarios live under `tests/scenarios/`.

Coverage currently includes:

- V0 baseline pipeline behavior
- V0.5 multi-prompt workflow
- V1 subagent review and fallback
- V2.5 Progressive Disclosure and script executability
- V3 hook behavior
- V4 multi-dimensional scoring and architecture drift detection

Scenario result artifacts are intentionally ignored from git.

## Version

Current public release target:

- `v4.0.0`

Highlights:

- serialized prompt pipeline
- interrupt recovery via `state.yaml`
- subagent delegation with safe fallback
- Progressive Disclosure resource model
- Claude plugin packaging
- hook-based stop protection and session context injection
- adaptive threshold and architecture drift detection

## License

MIT
