<div align="center">

# Hypo-Workflow

**Serialized workflow engine for AI agents**

Plan -> Execute -> Review -> Report -> Recover -> Showcase

[![Version](https://img.shields.io/badge/version-8.3.0-blue)](.claude-plugin/plugin.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Claude%20Code%20%7C%20Codex-purple)](#platform-support)

</div>

---

## Overview

Hypo-Workflow turns long AI-agent work into a local, inspectable workflow. Instead of asking an agent to "finish everything" in one fragile session, you give it a `.pipeline/` workspace with prompts, state, logs, reports, and lifecycle metadata.

The agent then works through a structured loop:

```text
Plan -> Prompt -> Step Chain -> Tests -> Review -> Report -> Evaluate -> Next / Stop
```

It is not a SaaS service and not a daemon. It is a Skill-based repository that Claude Code or Codex can read directly.

### What It Gives You

| Area | What it does |
|---|---|
| Pipeline execution | Runs prompts through TDD, implement-only, or custom step presets |
| Recovery | Persists `state.yaml`, heartbeat, logs, and progress so interrupted work can resume |
| Planning | Interactive and auto Plan Mode with discovery, decomposition, generation, confirmation, review, and extension |
| Lifecycle | Initializes projects, checks health, audits code, debugs issues, releases versions, and archives Cycles |
| Patch track | Records `P001` style lightweight issues and can fix them outside the main Milestone flow |
| Context Compact | Generates `.compact` views so session startup loads less history |
| Showcase | Generates project intro docs, technical docs, Markdown slides, and optional posters |
| Multi-platform | Claude Code uses `/hypo-workflow:*`; Codex uses `/hw:*` compatibility commands |

Hypo-Workflow currently exposes **29 user-facing commands** plus one internal watchdog skill.

---

## Quick Start

### 1. Install

Claude Code:

```bash
/plugin marketplace add HypoxanthineOvO/Hypo-Workflow
/plugin install hypo-workflow@hypoxanthine-hypo-workflow
```

Codex:

```text
Use $skill-installer to install the GitHub repo HypoxanthineOvO/Hypo-Workflow with path . as skill name hypo-workflow
```

Manual checkout:

```bash
git clone https://github.com/HypoxanthineOvO/Hypo-Workflow.git ~/.claude/skills/hypo-workflow
```

### 2. Configure Once

```text
/hw:setup
```

This creates `~/.hypo-workflow/config.yaml` for platform, execution mode, subagent provider, dashboard, output language, and default behavior. Project-level `.pipeline/config.yaml` overrides global defaults.

### 3. Initialize A Project

```text
/hw:init
```

For an existing Git project that predates Hypo-Workflow:

```text
/hw:init --import-history
/hw:init --import-history --interactive
```

### 4. Plan And Run

```text
/hw:plan
/hw:start
```

If the session stops later:

```text
/hw:resume
/hw:status
```

### 5. Generate Showcase Material

```text
/hw:showcase --all
```

This writes project material under `.pipeline/showcase/`.

---

## Command Summary

Claude Code users can call `/hypo-workflow:<command>`. Codex users can call `/hw:<command>`.

#### Setup

| Command | Use |
|---|---|
| `/hw:setup` | Create or update global defaults in `~/.hypo-workflow/config.yaml` |

#### Pipeline

| Command | Use |
|---|---|
| `/hw:start` | Start or continue execution from the first runnable prompt |
| `/hw:resume` | Resume an interrupted or stopped pipeline |
| `/hw:status` | Show concise progress; use `--full` to bypass compact context |
| `/hw:skip` | Skip the current prompt or step safely |
| `/hw:stop` | Gracefully stop and persist state |
| `/hw:report` | Show report summaries; use `--view M<N>` for a full report |

#### Plan

| Command | Use |
|---|---|
| `/hw:plan` | Start Plan Mode |
| `/hw:plan --context audit,patches,deferred,debug` | Inject existing evidence into discovery |
| `/hw:plan:discover` | Gather requirements, constraints, and repo context |
| `/hw:plan:decompose` | Split work into Milestones |
| `/hw:plan:generate` | Generate `.pipeline/` prompts and config |
| `/hw:plan:confirm` | Confirm the generated plan |
| `/hw:plan:extend` | Append Milestones to an active Cycle |
| `/hw:plan:review` | Review architecture drift and downstream prompt impact |

#### Lifecycle

| Command | Use |
|---|---|
| `/hw:init` | Initialize or rescan `.pipeline/` |
| `/hw:check` | Validate config, state, prompts, and architecture health |
| `/hw:audit` | Run preventive code audit |
| `/hw:debug` | Investigate a concrete failure |
| `/hw:release` | Run release automation |
| `/hw:cycle` | Manage delivery Cycles and archives |
| `/hw:patch` | Create, list, close, and fix lightweight Patches |
| `/hw:patch fix` | Run the six-step Patch Fix lane |

#### Utility

| Command | Use |
|---|---|
| `/hw:help` | Show grouped or per-command help |
| `/hw:reset` | Reset runtime state or generated artifacts |
| `/hw:log` | Read lifecycle log; use `--full` to bypass compact log |
| `/hw:compact` | Generate compact context files |
| `/hw:guide` | Ask an interactive guide what to do next |
| `/hw:showcase` | Generate project introduction material |
| `/hw:dashboard` | Launch the WebUI dashboard |

`/hw:review` is a compatibility alias and redirects to `/hw:plan:review`.

---

## Common Workflows

### New Project

```text
/hw:setup
/hw:init
/hw:plan
/hw:start
```

Use this when the repository has no pipeline yet and you want Hypo-Workflow to help discover the project shape.

### Existing Project With Git History

```text
/hw:init --import-history --interactive
/hw:cycle list
/hw:plan --context deferred
```

History Import creates Cycle 0 Legacy under `.pipeline/archives/cycle-0-legacy/` and keeps current work in Cycle 1.

### Continue Work After Interruption

```text
/hw:status
/hw:resume
```

`state.yaml` stores the current prompt, step, and heartbeat. SessionStart hooks can reinject the current state for Claude Code.

### Fix A Small Bug Without Opening A Milestone

```text
/hw:patch "Fix login layout regression" --severity normal
/hw:patch fix P001
```

Patch Fix is intentionally small:

1. Step 1: 读取 Patch
2. Step 2: 定位代码
3. Step 3: 修复
4. Step 4: 测试
5. Step 5: 提交
6. Step 6: 关闭

It does not start Plan Discover, does not run the full TDD pipeline, does not write `state.yaml`, and does not generate `report.md`.

### Audit Then Plan

```text
/hw:audit
/hw:plan --context audit
```

Use this when you want findings to become a structured implementation plan.

### Reduce Context Load

```text
/hw:compact
/hw:status
/hw:log --full
```

Compact files are derived views. They reduce startup context but never replace canonical source files.

### Generate Project Materials

```text
/hw:showcase --all
/hw:showcase --new --doc
```

Showcase creates `.pipeline/showcase/PROJECT-INTRO.md`, `TECHNICAL-DOC.md`, `slides.md`, and optionally `poster.png`.

### Close A Delivery Cycle

```text
/hw:cycle close
/hw:cycle new "Next release" --type feature --context patches,deferred
```

Closing archives Cycle-local state, prompts, reports, progress, deferred items, and summaries.

---

## Command Reference

### `/hw:init`

Initializes `.pipeline/` for empty repos, existing repos, or existing pipelines.

Key flags:

| Flag | Behavior |
|---|---|
| `--rescan` | Refresh architecture baseline for an existing pipeline |
| `--folder` | Force folder-style architecture output |
| `--single` | Force single-file architecture output |
| `--import-history` | Import current Git first-parent history into Cycle 0 Legacy |
| `--interactive` | With `--import-history`, preview split plan and wait for confirmation |

History Import split signals are tried in this order: tags, milestone keywords, merge commits, then time gaps.

### `/hw:plan`

Plan Mode creates implementation-ready Milestones before execution.

Main phases:

```text
discover -> decompose -> generate -> confirm
```

Interactive mode enforces discovery question rounds and explicit confirmation. Auto mode proceeds unless blocked by missing critical information.

Context injection:

| Source | Reads |
|---|---|
| `audit` | latest `.pipeline/audits/` report |
| `patches` | open `.pipeline/patches/P*.md` files |
| `deferred` | archived `deferred.yaml` and Legacy summary |
| `debug` | latest `.pipeline/debug/` report |

### `/hw:start` and `/hw:resume`

Execution uses the configured preset:

| Preset | Sequence |
|---|---|
| `tdd` | write_tests -> review_tests -> run_tests_red -> implement -> run_tests_green -> review_code |
| `implement-only` | implement -> run_tests -> review_code |
| `custom` | user-defined step sequence |

State updates happen after meaningful transitions:

- `.pipeline/state.yaml`
- `.pipeline/log.yaml`
- `.pipeline/PROGRESS.md`
- `.pipeline/reports/`
- `last_heartbeat`

### `/hw:cycle`

Cycles group a sequence of Milestones and archive them as a delivery unit.

```text
/hw:cycle new "V8 implementation" --type feature --context audit,patches
/hw:cycle list
/hw:cycle view C1
/hw:cycle close --paused
/hw:cycle close --reason "superseded by upstream rewrite"
```

Cycle type maps to preset:

| Type | Default preset |
|---|---|
| `feature`, `refactor` | `tdd` |
| `bugfix`, `spike`, `hotfix` | `implement-only` |

### `/hw:patch`

Patches are persistent small issues under `.pipeline/patches/`.

```text
/hw:patch "Fix X" --severity critical
/hw:patch list --open
/hw:patch close P001
/hw:patch fix P001 P003
```

Patch IDs are global and do not reset across Cycles.

### `/hw:compact`

Generates derived compact files:

```text
.pipeline/PROGRESS.compact.md
.pipeline/state.compact.yaml
.pipeline/log.compact.yaml
.pipeline/reports.compact.md
.pipeline/patches.compact.md
```

SessionStart loads compact versions first and falls back to full files.

### `/hw:showcase`

Generates project-facing material.

```text
/hw:showcase
/hw:showcase --all
/hw:showcase --doc
/hw:showcase --slides
/hw:showcase --poster
/hw:showcase --new --all
```

Without flags, it asks which artifacts to generate and waits for the user. `--new` archives the previous version under `.pipeline/showcase/history/v<N>/`.

### `/hw:release`

Runs release automation. Typical release flow includes regression, validation, version updates, changelog checks, commits, and publication steps. Use `--dry-run` to preview.

---

## Architecture And Internals

### Repository Layout

```text
Hypo-Workflow/
├── SKILL.md                    # Root command router and runtime rules
├── skills/                     # 29 user-facing skills plus internal watchdog
├── plan/PLAN-SKILL.md          # Plan Mode L2 entrypoint
├── references/                 # Detailed behavior specs
├── templates/                  # Root fallback templates
├── templates/en/               # English templates
├── templates/zh/               # Chinese templates
├── assets/                     # State/report assets and config examples
├── scripts/                    # Helper scripts
├── hooks/                      # Claude Code hook integration
├── adapters/                   # Source/output adapter contracts
├── dashboard/                  # WebUI dashboard
└── tests/scenarios/            # Regression scenarios
```

### `.pipeline/` Workspace

```text
.pipeline/
├── config.yaml                 # Project config
├── state.yaml                  # Runtime state, ignored by git
├── log.yaml                    # Lifecycle log
├── PROGRESS.md                 # Human-readable progress
├── architecture.md             # Architecture baseline
├── prompts/                    # Milestone prompts
├── reports/                    # Milestone reports
├── archives/                   # Closed Cycle archives
├── patches/                    # Persistent Patch track
└── showcase/                   # Generated project materials
```

### State Model

`state.yaml` tracks:

- pipeline status
- current prompt and step
- step index
- milestone statuses
- prompt state
- completed history
- heartbeat

`log.yaml` tracks lifecycle events such as milestone completion, patch fixes, audits, debug sessions, releases, and plan reviews. `PROGRESS.md` is optimized for humans.

### Progressive Disclosure

Hypo-Workflow keeps context usage controlled:

1. Read root `SKILL.md` for command routing.
2. Load only the relevant `skills/<command>/SKILL.md`.
3. Read references, templates, assets, and scripts only when needed.
4. Use `.compact` files for large runtime context.

### Hooks

Claude Code hooks provide a passive safety net:

| Hook | Purpose |
|---|---|
| `stop-check.sh` | Blocks accidental stop while the pipeline is running |
| `session-start.sh` | Injects state and compact context on startup/resume/compact |
| `instructions-loaded.sh` | Observes instruction reloads |
| `codex-notify.sh` | Codex turn-complete notification fallback |

Codex works without Claude hook semantics. Recovery still works through files.

### i18n

User-facing output follows `output.language`:

| Config | Template path |
|---|---|
| `zh-CN`, `zh` | `templates/zh/` |
| `en`, `en-US` | `templates/en/` |
| missing localized file | root `templates/` fallback |

Internal `state.yaml` and `log.yaml` keys remain English.

---

## Configuration

### Minimal Project Config

```yaml
pipeline:
  name: "My Project"
  source: local
  output: local
  prompts_dir: .pipeline/prompts
  reports_dir: .pipeline/reports

execution:
  mode: self
  steps:
    preset: tdd

evaluation:
  auto_continue: false
  max_diff_score: 3
  checks:
    - tests_pass
    - no_regressions
    - matches_plan
    - code_quality
```

### Useful Optional Config

```yaml
output:
  language: zh-CN
  timezone: Asia/Shanghai

plan:
  mode: interactive
  interaction_depth: medium
  interactive:
    min_rounds: 3
    require_explicit_confirm: true

watchdog:
  enabled: false
  interval: 300
  heartbeat_timeout: 300
  max_retries: 5

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
```

### Notion Adapter

```yaml
pipeline:
  source: notion
  output: local

notion:
  token_file: ./Notion-API.md
  source_database_id: "..."
  output_parent_page_id: "..."
```

Token resolution order:

1. `NOTION_TOKEN`
2. `notion.token_file`

---

## Platform Support

### Claude Code

- Native `/hypo-workflow:*` skills
- Marketplace metadata in `.claude-plugin/marketplace.json`
- Stop and SessionStart hooks
- Can use Codex as a subagent

### Codex

- Uses root `SKILL.md` and `/hw:*`
- Metadata in `.codex-plugin/plugin.json`
- Can use Claude as a subagent when configured
- Hook behavior degrades gracefully

### Subagent Example

```yaml
execution:
  mode: self

step_overrides:
  implement:
    executor: subagent
    subagent: codex
  review_code:
    reviewer: self
```

---

## Validation

Run the same checks used by this repository:

```bash
claude plugin validate .
python3 tests/run_regression.py
git diff --check
```

Current expected regression count is `49/49`.

---

## Changelog

### v8.3.0

- Added `/hw:showcase` for project intro docs, technical docs, Markdown slides, and optional GPT Image posters.
- Added the `showcase` preset and `.pipeline/showcase/` lifecycle with reuse, `--new` archive history, `showcase.yaml`, and review summaries.
- Added localized template directories under `templates/en/` and `templates/zh/`, with root template fallback.
- Strengthened i18n rules so user-facing output, reports, PROGRESS, and PROJECT-SUMMARY follow `output.language`.
- Bootstrapped Hypo-Workflow's own Chinese showcase artifacts under `.pipeline/showcase/`.
- Updated the public command set to 29 user-facing commands.

### v8.2.0

- Added `/hw:patch fix P<N>` for direct lightweight Patch repairs with independent commits, Patch closure, PROGRESS updates, and `patch_fix` log events.
- Added `/hw:compact` and compact context views for progress, state, log, reports, and closed Patches.
- Updated SessionStart to prefer `.compact` files, fallback to full files, and keep current prompt/report plus open Patches complete.
- Added `/hw:status --full`, `/hw:log --full`, and `/hw:report --view <M>` for on-demand full data loading.
- Added `/hw:guide` as an interactive project-aware command guide.
- Updated the public command set to 28 user-facing commands.

### v8.1.0

- Extended `/hw:init` with `--import-history` for importing Git first-parent history into Cycle 0 Legacy.
- Added `--interactive` preview mode for History Import split plans.
- Added `templates/legacy-report.md` for non-TDD legacy milestone reports.
- Added `history_import.*` config for split method, time-gap threshold, milestone cap, and keyword patterns.
- Updated Cycle and Plan context behavior so Cycle 0 Legacy appears in `/hw:cycle list`, `/hw:cycle view 0`, and deferred context.

### v8.0.0

- Added `/hw:cycle new|list|view|close` for explicit delivery Cycles, archives, deferred items, and project summaries.
- Added `/hw:patch` for persistent lightweight fixes with global `P001` numbering and severity filtering.
- Added `/hw:plan:extend` for appending milestones to an active Cycle.
- Added `/hw:plan --context audit,patches,deferred,debug` to preload Discover with existing evidence.
- Added optional Auto Resume watchdog support with heartbeat, lockfile, cron, and retry backoff.
- Added `output.language` and `output.timezone` for reports and `PROGRESS.md`.
- Strengthened Interactive Plan gates with minimum question rounds and explicit P2/P4 confirmation.
- Updated the public command set to 25 user-facing commands.

| Version | Milestone |
|---|---|
| V0 | Core state machine and TDD pipeline |
| V0.5 | Skip cascade and evaluation blocking |
| V1 | Subagent delegation with fallback |
| V2.5 | Progressive Disclosure and plugin packaging |
| V3 | Claude Code Hook integration |
| V4 | Multi-dimensional evaluation and architecture drift |
| V4.5 | Namespaced `/hw:*` commands |
| V5 | Plan Mode and Plan Review |
| V5.1 | Notion source/output adapters |
| V6 | Lifecycle commands and unified `log.yaml` |
| V6.1 | Claude marketplace and Codex plugin metadata |
| V6.2 | Native skills, hooks, PROGRESS, and failure triage |
| V7 | Setup wizard and WebUI dashboard |
| V7.1 | Global config and platform-specific subagent docs |
| V8 | Interactive gates, Cycles, Patches, Plan Extend, Watchdog |
| V8.1 | History Import and Cycle 0 Legacy |
| V8.2 | Patch Fix, Context Compact, full-view flags, Interactive Guide |
| V8.3 | Showcase preset and i18n template loading |

---

## License

MIT
