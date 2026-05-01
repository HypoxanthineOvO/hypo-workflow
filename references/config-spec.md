# Config Spec

Use this reference whenever a command needs Hypo-Workflow configuration defaults.

## Files

| Layer | Path | Owner | Purpose |
|---|---|---|---|
| Global | `~/.hypo-workflow/config.yaml` | `/hypo-workflow:setup` | Agent platform, default execution mode, subagent backend, dashboard defaults, plan defaults, output defaults, watchdog defaults, history import defaults, compact defaults, showcase defaults, rules defaults |
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
| plan interaction depth | `plan.interaction_depth` | `plan.interaction_depth` | `medium` |
| plan interactive min rounds | `plan.interactive.min_rounds` | `plan.interactive.min_rounds` | `3` |
| plan explicit confirm | `plan.interactive.require_explicit_confirm` | `plan.interactive.require_explicit_confirm` | `true` |
| dashboard enabled | `dashboard.enabled` | `dashboard.enabled` | `false` |
| dashboard port | `dashboard.port` | `dashboard.port` | `7700` |
| output language | `output.language` | `output.language` | `zh-CN` |
| output timezone | `output.timezone` | `output.timezone` | `Asia/Shanghai` |
| watchdog enabled | `watchdog.enabled` | `watchdog.enabled` | `false` |
| watchdog interval | `watchdog.interval` | `watchdog.interval` | `300` |
| watchdog heartbeat timeout | `watchdog.heartbeat_timeout` | `watchdog.heartbeat_timeout` | `300` |
| history import split method | `history_import.split_method` | `history_import.split_method` | `auto` |
| history import time gap | `history_import.time_gap_threshold` | `history_import.time_gap_threshold` | `24h` |
| history import max milestones | `history_import.max_milestones` | `history_import.max_milestones` | `20` |
| history import keyword patterns | `history_import.keyword_patterns` | `history_import.keyword_patterns` | built-in V8.1 patterns |
| compact auto generation | `compact.auto` | `compact.auto` | `true` |
| compact recent progress lines | `compact.progress_recent` | `compact.progress_recent` | `15` |
| compact full state history | `compact.state_history_full` | `compact.state_history_full` | `1` |
| compact recent log events | `compact.log_recent` | `compact.log_recent` | `20` |
| compact report summary lines | `compact.reports_summary_lines` | `compact.reports_summary_lines` | `3` |
| showcase language | `showcase.language` | `showcase.language` | `auto` |
| showcase poster API key env | `showcase.poster.api_key_env` | `showcase.poster.api_key_env` | `OPENAI_API_KEY` |
| showcase poster size | `showcase.poster.size` | `showcase.poster.size` | `1024x1536` |
| showcase poster quality | `showcase.poster.quality` | `showcase.poster.quality` | `high` |
| showcase poster style | `showcase.poster.style` | `showcase.poster.style` | `auto` |
| release README mode | `release.readme.mode` | `release.readme.mode` | `loose` |
| release README full regeneration | `release.readme.full_regen` | `release.readme.full_regen` | `auto` |
| batch decompose mode | `batch.decompose_mode` | `batch.decompose_mode` | `upfront` |
| batch failure policy | `batch.failure_policy` | `batch.failure_policy` | `skip_defer` |
| batch auto-chain | `batch.auto_chain` | `batch.auto_chain` | `true` |
| batch default gate | `batch.default_gate` | `batch.default_gate` | `auto` |
| test profile enabled | `execution.test_profiles.enabled` | `execution.test_profiles.enabled` | `true` |
| test profile selection mode | `execution.test_profiles.selection` | `execution.test_profiles.selection` | `auto` |
| test profile compose | `execution.test_profiles.compose` | `execution.test_profiles.compose` | `true` |
| test profile defaults | `execution.test_profiles.profiles` | `execution.test_profiles.profiles` | `[]` |
| rules extends | `rules.extends` or `.pipeline/rules.yaml extends` | `rules.extends` | `recommended` |
| rules overrides | `rules.rules` or `.pipeline/rules.yaml rules` | `rules.rules` | `{}` |

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
  test_profiles:
    enabled: true
    selection: auto
    compose: true
    profiles: []
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
  interaction_depth: medium
  interactive:
    min_rounds: 3
    require_explicit_confirm: true
output:
  language: zh-CN
  timezone: Asia/Shanghai
watchdog:
  enabled: false
  interval: 300
  heartbeat_timeout: 300
  max_retries: 5
  max_consecutive_milestones: 10
  notify: true
history_import:
  split_method: auto
  time_gap_threshold: 24h
  max_milestones: 20
  keyword_patterns:
    - 'feat\(M(\d+)\):'
    - 'M(\d+)-'
    - 'milestone-(\d+)'
compact:
  auto: true
  progress_recent: 15
  state_history_full: 1
  log_recent: 20
  reports_summary_lines: 3
showcase:
  language: auto
  poster:
    api_key_env: OPENAI_API_KEY
    size: "1024x1536"
    quality: high
    style: auto
release:
  readme:
    mode: loose
    full_regen: auto
batch:
  decompose_mode: upfront
  failure_policy: skip_defer
  auto_chain: true
  default_gate: auto
rules:
  extends: recommended
  rules: {}
version: "8.4.0"
created: "2026-04-26T14:00:00+08:00"
updated: "2026-04-26T14:00:00+08:00"
```

`subagent.codex.base_url` is optional.

## Validation Notes

- Project config remains validated by the project schema at the root of `config.schema.yaml`.
- Global config is defined under `$defs.global_config` in the same schema file.
- A missing global config is valid; use built-in defaults.
- A malformed global config should be reported by `/hypo-workflow:check` but should not prevent reading project config.
- New V8 fields are optional and must not break older project configs.

## Rules Config

Rules may be declared in either `.pipeline/rules.yaml` or the optional `rules:` block of project/global config. `.pipeline/rules.yaml` is the primary project-local rules file and takes precedence for rule behavior.

```yaml
extends: recommended

rules:
  git-clean-check: error
  commit-format: off
  prefer-chinese-comments: warn
```

Supported built-in presets are `recommended`, `strict`, and `minimal`. External rule packs use string references such as `github:owner/repo`.

Test Profiles live under `execution.test_profiles` so they stay close to `execution.steps.preset`. Preset controls step order; Test Profile controls validation policy.
