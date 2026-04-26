# Config Spec

Use this reference whenever a command needs Hypo-Workflow configuration defaults.

## Files

| Layer | Path | Owner | Purpose |
|---|---|---|---|
| Global | `~/.hypo-workflow/config.yaml` | `/hypo-workflow:setup` | Agent platform, default execution mode, subagent backend, dashboard defaults, plan defaults |
| Project | `.pipeline/config.yaml` | `/hypo-workflow:init` or `/hypo-workflow:plan-generate` | Project name, prompt source/output, reports, preset, evaluation rules, project-specific overrides |

`setup` must never create project config. `init` and `plan-generate` must not overwrite global config.

## Priority

Resolve every configurable value in this order:

1. project config
2. global config
3. built-in default

## Field Mapping

| Effective value | Project key | Global key | Default |
|---|---|---|---|
| agent platform | `platform` | `agent.platform` | `auto` |
| execution mode | `execution.mode` | `execution.default_mode` | `self` |
| subagent provider | `execution.subagent_tool` | `subagent.provider` | `auto` |
| plan mode | `plan.mode` | `plan.default_mode` | `interactive` |
| dashboard enabled | `dashboard.enabled` | `dashboard.enabled` | `false` |
| dashboard port | `dashboard.port` | `dashboard.port` | `7700` |

Normalize global `agent.platform=claude-code` to the runtime platform value `claude` when applying existing project-platform logic.

For step-specific delegation, resolve in this order:

1. top-level `step_overrides.<step_name>.subagent_tool`
2. top-level `step_overrides.<step_name>.subagent`
3. legacy `execution.step_overrides.<step_name>.subagent_tool`
4. legacy `execution.step_overrides.<step_name>.subagent`
5. project `execution.subagent_tool`
6. global `subagent.provider`
7. `auto`

For step executor selection, accept both `executor` and the older `reviewer` field:

- `executor: self | subagent`
- `reviewer: self | subagent`

When both appear, `executor` wins.

## Global Config Shape

```yaml
agent:
  platform: claude-code
  model: claude-sonnet-4-20250514
execution:
  default_mode: self
subagent:
  provider: codex
  codex:
    model: gpt-5.4
    base_url: https://api.vsplab.cn
  claude:
    model: claude-sonnet-4-20250514
dashboard:
  enabled: true
  port: 7700
plan:
  default_mode: interactive
version: "7.1.0"
created: "2026-04-26T14:00:00+08:00"
updated: "2026-04-26T14:00:00+08:00"
```

`subagent.codex.base_url` is optional.

## Validation Notes

- Project config remains validated by the project schema at the root of `config.schema.yaml`.
- Global config is defined under `$defs.global_config` in the same schema file.
- A missing global config is valid; use built-in defaults.
- A malformed global config should be reported by `/hypo-workflow:check` but should not prevent reading project config.
