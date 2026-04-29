<div align="center">

# ⚙️ Hypo-Workflow

**Serialized Prompt Execution Engine for AI Agents**

TDD Pipeline · Self-Review · Interrupt Recovery · Multi-Dimensional Evaluation

[![Version](https://img.shields.io/badge/version-8.3.0-blue)](.claude-plugin/plugin.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Claude%20Code%20%7C%20Codex-purple)](#platform-support)

</div>

---

## What is Hypo-Workflow?

Hypo-Workflow turns multi-step development tasks into an automated pipeline that an AI agent executes autonomously:

```

Read Prompt → [Write Tests → Review → Run RED → Implement → Run GREEN → Review Code] → Report → Evaluate → Next / Stop

```

It ships as a **SKILL.md** file — not a service, not a CLI tool. Any AI agent that supports Skills (Claude Code, Codex CLI) can use it directly.

### Key Features

| Feature | Description |
|---------|-------------|
| 🔄 **TDD Pipeline** | Built-in test-driven sub-steps: write tests → review → red → implement → green → review code |
| 🧭 **Native Skills** | 29 user-facing Claude Code skills exposed as `/hypo-workflow:*` plus `/hw:*` compatibility for Codex |
| 🗺️ **Plan Mode** | Auto and Interactive planning modes with enforced discovery gates, context injection, extend, decompose / generate / confirm / review phases |
| 🧩 **Notion Adapter** | Read prompts from Notion and/or write reports back to Notion with graceful degradation |
| ⏸️ **Interrupt Recovery** | `state.yaml` tracks progress to the sub-step level — resume exactly where you left off |
| 🤖 **Subagent Delegation** | Offload code reviews to a subagent (Claude ↔ Codex), with automatic fallback |
| 🪨 **Hook Integration** | Claude Code hooks for stop-check (`decision:block`) and session context injection (`additionalContext`) |
| 📊 **Multi-Dim Evaluation** | 5 scoring dimensions + adaptive threshold + architecture drift detection |
| 🔁 **Lifecycle Closure** | `/hw:init` → `/hw:check` → `/hw:audit` → `/hw:debug` → `/hw:release` completes the project loop |
| 📝 **Unified Logging** | `.pipeline/log.yaml` records milestones, fixes, audits, debug sessions, plan reviews, and releases |
| 📈 **Progress Summary** | `.pipeline/PROGRESS.md` gives a human-readable milestone and step summary |
| 🔄 **Cycles** | Delivery Cycles archive state, prompts, reports, deferred work, and summaries across project history |
| 🩹 **Patch Track** | Persistent lightweight `P001` style patches stay outside Cycle archives, can feed future plans, and can be fixed directly |
| 📦 **Context Compact** | `.compact` views reduce SessionStart context while preserving full source files |
| 🧭 **Interactive Guide** | `/hw:guide` senses project state and recommends the next command flow |
| 🎨 **Showcase** | `/hw:showcase` generates project intro docs, technical docs, slides, and an optional poster |
| ⏱️ **Auto Resume Watchdog** | Optional heartbeat + cron watchdog resumes stale executing pipelines safely |
| 🛠️ **Setup Wizard** | `/hypo-workflow:setup` configures environment, execution defaults, subagent backend, and dashboard preferences |
| 🌐 **Dashboard** | `/hypo-workflow:dashboard` launches a live WebUI for state, config, progress, reports, and log activity |
| 📦 **Plugin Ready** | Ships official `.claude-plugin` and `.codex-plugin` manifests plus marketplace metadata |
| 📁 **Progressive Disclosure** | 3-layer loading: metadata → SKILL.md → references/scripts/assets (on demand) |

---

## Installation

### Claude Code

In Claude Code, add the repository marketplace and install the plugin:

```bash
/plugin marketplace add HypoxanthineOvO/Hypo-Workflow
/plugin install hypo-workflow@hypoxanthine-hypo-workflow

# Verify:
/hypo-workflow:help
/hypo-workflow:setup
```

This repository publishes its Claude marketplace metadata from the repo root at [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json).

### Codex CLI

The repository ships official Codex plugin metadata in [`.codex-plugin/plugin.json`](./.codex-plugin/plugin.json) and a repo marketplace at [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json). OpenAI's plugin docs currently describe public self-serve publishing as "coming soon", so the most reliable install path today is the built-in `skill-installer` against the repository root that already contains the full skill:

```text
Use $skill-installer to install the GitHub repo HypoxanthineOvO/Hypo-Workflow with path . as skill name hypo-workflow

# Then restart Codex and verify:
/hw:help
/hw:setup
```

This installs the full repository root as one self-contained skill so the canonical [`SKILL.md`](./SKILL.md) can keep its existing Progressive Disclosure layout.

### Manual Install

If marketplace-based installation is unavailable:

```bash
git clone https://github.com/HypoxanthineOvO/Hypo-Workflow.git
claude --plugin-dir ./hypo-workflow
```

If your local checkout nests the repo under another workspace, point `--plugin-dir` at that nested repository root instead.

---

## Platform-Specific Setup

### Claude Code Installation and Use

#### Install

```bash
# Option 1: clone as a global skill/plugin checkout
git clone https://github.com/HypoxanthineOvO/Hypo-Workflow.git ~/.claude/skills/hypo-workflow

# Option 2: use the Claude Code plugin marketplace
/plugin marketplace add HypoxanthineOvO/Hypo-Workflow
/plugin install hypo-workflow@hypoxanthine-hypo-workflow
```

For a project-local reference, add the checkout path in the project `.claude/settings.json`.

#### First Setup

```bash
# In Claude Code:
/hypo-workflow:setup
```

The setup wizard creates `~/.hypo-workflow/config.yaml`. Project config in `.pipeline/config.yaml` overrides global defaults.

#### Daily Commands

```bash
/hypo-workflow:init
/hypo-workflow:plan
/hypo-workflow:start
/hypo-workflow:dashboard
```

#### Configure Codex as a Subagent

```bash
# 1. Ensure Codex CLI is installed
npm i -g @openai/codex

# 2. Configure environment variables when using a custom API endpoint
export OPENAI_BASE_URL=https://api.vsplab.cn
export OPENAI_API_KEY=your-key

# 3. In /hypo-workflow:setup choose:
#    execution mode -> subagent
#    subagent provider -> codex
#    subagent model -> gpt-5.4
#    base URL -> https://api.vsplab.cn

# 4. Review the global config
cat ~/.hypo-workflow/config.yaml
```

### Codex Installation and Use

#### Install

```bash
git clone https://github.com/HypoxanthineOvO/Hypo-Workflow.git
cd your-project
codex
```

Inside Codex, use the root skill compatibility commands:

```text
/hw:setup
/hw:init
/hw:plan
/hw:start
```

#### Configure Claude as a Subagent

```bash
# Ensure Claude Code is installed
npm i -g @anthropic-ai/claude-code

# In setup choose:
#    execution mode -> subagent
#    subagent provider -> claude
#    subagent model -> claude-sonnet-4-20250514
```

### Mixed Mode Examples

#### Claude Code Plans and Reviews, Codex Implements

```yaml
# .pipeline/config.yaml
execution:
  mode: self
step_overrides:
  implement:
    executor: subagent
    subagent: codex
  review_code:
    reviewer: self
```

#### Codex Runs Automatically, Claude Reviews Code

```yaml
# .pipeline/config.yaml
execution:
  mode: self
step_overrides:
  review_code:
    reviewer: subagent
    subagent: claude
```

---

## Quick Start

### 1. Install the Skill

Use one of the installation methods above, then open a project where you want to run Hypo-Workflow.

```
/hypo-workflow:help
/hypo-workflow:dashboard
```

### 2. Initialize a Pipeline

Create a `.pipeline/` directory in your project with a config and prompts:

```

mkdir -p .pipeline/prompts .pipeline/reports

```

**`.pipeline/config.yaml`:**
```

pipeline:

name: "My Project"

source: local

output: local

prompts_dir: .pipeline/prompts

reports_dir: .pipeline/reports

execution:

mode: self

steps:

preset: tdd         # tdd | implement-only | custom

evaluation:

auto_continue: false  # true = auto-advance, false = ask before next prompt

max_diff_score: 3     # 1-5, higher = more lenient

```

### 3. Write Prompts

Add numbered prompt files:

```

.pipeline/prompts/

├── [00-scaffold.md](http://00-scaffold.md)

├── [01-core-feature.md](http://01-core-feature.md)

├── [02-ui-polish.md](http://02-ui-polish.md)

└── [03-export.md](http://03-export.md)

```

Each prompt describes what to build in that iteration. Example:

```

# Prompt 00: Scaffold

Create the project skeleton:

- pyproject.toml with dependencies
- src/myapp/**init**.py
- tests/[conftest.py](http://conftest.py)

```

### 4. Run

Open your AI agent (Claude Code or Codex) and say:

```

Please follow [SKILL.md](http://SKILL.md) to execute the pipeline.

Read .pipeline/config.yaml and start.

```

Or use an explicit slash command:

```

/hw:start

```

Or plan a new pipeline first:

```

/hw:plan --template tdd-python-cli

```

The agent will:
1. Read your config and prompts
2. Execute each prompt through the TDD sub-step chain
3. Generate a report with evaluation scores
4. Decide whether to continue or stop based on the scores

---

## Directory Structure

```

hypo-workflow/

├── [SKILL.md](http://SKILL.md)                     # ⭐ Main entry point (the Skill)

├── config.schema.yaml           # Configuration schema

├── .claude-plugin/

│   └── plugin.json              # Claude Code plugin manifest

├── .codex-plugin/

│   └── plugin.json              # Codex plugin manifest

├── plan/

│   ├── PLAN-SKILL.md            # Plan Mode sub-skill

│   ├── assets/                  # Planning templates

│   └── templates/               # Reusable planning presets

├── hooks/

│   ├── [stop-check.sh](http://stop-check.sh)            # Prevents accidental session termination

│   ├── [session-start.sh](http://session-start.sh)         # Injects pipeline context on session start

│   ├── [instructions-loaded.sh](http://instructions-loaded.sh)   # Logs [CLAUDE.md](http://CLAUDE.md) load events

│   ├── [codex-notify.sh](http://codex-notify.sh)          # Codex agent-turn-complete handler

│   ├── hooks.json               # Claude hook manifest

│   └── [README.md](http://README.md)

├── scripts/

│   ├── [state-summary.sh](http://state-summary.sh)         # Print pipeline state summary

│   ├── [log-append.sh](http://log-append.sh)            # Append structured log entries

│   ├── [diff-stats.sh](http://diff-stats.sh)            # Git diff statistics

│   ├── [validate-config.sh](http://validate-config.sh)       # Validate config.yaml

│   └── notion_api.py             # Notion auth / fetch / render / upsert helper

├── references/

│   ├── [tdd-spec.md](http://tdd-spec.md)              # Detailed TDD sub-step rules

│   ├── [commands-spec.md](http://commands-spec.md)         # Slash command parsing & semantics

│   ├── [plan-review-spec.md](http://plan-review-spec.md)      # Plan Review + architecture tracking

│   ├── log-spec.md              # Unified lifecycle log schema

│   ├── check-spec.md            # Health check contract

│   ├── init-spec.md             # Project initialization + architecture scanning

│   ├── release-spec.md          # Automated publishing flow

│   ├── audit-spec.md            # Deep audit dimensions + grading

│   ├── debug-spec.md            # Symptom-driven debug workflow

│   ├── [evaluation-spec.md](http://evaluation-spec.md)       # Scoring dimensions & thresholds

│   ├── [subagent-spec.md](http://subagent-spec.md)         # Subagent delegation protocol

│   ├── [state-contract.md](http://state-contract.md)        # state.yaml field reference

│   ├── [platform-claude.md](http://platform-claude.md)       # Claude Code specifics

│   └── [platform-codex.md](http://platform-codex.md)        # Codex CLI specifics

├── assets/

│   ├── state-init.yaml          # Initial state template

│   ├── [report-template.md](http://report-template.md)       # Report format template

│   └── config-examples/         # Example configurations

├── examples/

│   ├── hypo-todo/               # Basic TDD example

│   ├── hypo-todo-subagent/      # Subagent delegation example

│   └── hypo-todo-adaptive/      # Adaptive threshold example

├── skills/                    # 29 user-facing skills + internal watchdog

└── tests/

└── scenarios/               # System test scenarios (s01-s30)

```

Repository root distribution metadata is included directly in this flattened layout:

- [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json)
- [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json)

---

## Configuration Reference

### Config Layers

| Layer | Path | Created By | Purpose |
|-------|------|------------|---------|
| Global | `~/.hypo-workflow/config.yaml` | `/hypo-workflow:setup` | Agent platform, default execution mode, subagent provider, dashboard, plan, output, and watchdog defaults |
| Project | `.pipeline/config.yaml` | `/hypo-workflow:init` | Project name, prompt source/output, reports, preset, evaluation rules, optional Cycle/output/watchdog overrides |

Priority is project > global > defaults. For example, `.pipeline/config.yaml` `execution.mode` overrides global `execution.default_mode`.

### Presets

| Preset | Steps | Use Case |
|--------|-------|----------|
| `tdd` | write_tests → review_tests → run_red → implement → run_green → review_code | Engineering projects (default) |
| `implement-only` | implement → run_tests → review_code | Docs, LaTeX, no-TDD tasks |
| `custom` | User-defined sequence | Any combination |

### Execution Modes

| Mode | Behavior |
|------|----------|
| `self` | Agent executes everything directly |
| `subagent` | Agent delegates to a subagent (with fallback to self) |

### Adapters

| Adapter | Modes |
|---------|-------|
| Source | `local`, `notion` |
| Output | `local`, `notion` |

Notion source and output are independently configurable, so mixed mode is supported.

### Native Skills

Claude Code users should use `/hypo-workflow:<command>`.
Codex users keep the compatible `/hw:*` path via the root `SKILL.md`.

#### Setup

| Command | Behavior |
|---------|----------|
| `/hypo-workflow:setup` | Create or update `~/.hypo-workflow/config.yaml` for platform, plan mode, execution mode, subagent backend, and dashboard |

### Slash Commands

#### Pipeline

| Command | Behavior |
|---------|----------|
| `/hw:start` | Start the implementation pipeline |
| `/hw:resume` | Resume the current run |
| `/hw:status` | Show current progress; `--full` bypasses compact context |
| `/hw:skip` | Skip the current prompt |
| `/hw:stop` | Gracefully stop and save state |
| `/hw:report` | Show compact report summaries, latest report, or `--view M<N>` full report |

#### Plan

| Command | Behavior |
|---------|----------|
| `/hw:plan` | Enter Plan Mode |
| `/hw:plan --context audit,patches,deferred,debug` | Start Discover with injected evidence from prior reports, open patches, deferred work, or debug output |
| `/hw:plan:discover` | Discover repo context, goals, and constraints |
| `/hw:plan:decompose` | Split work into milestones with test specs |
| `/hw:plan:generate` | Generate `.pipeline/` artifacts from the plan |
| `/hw:plan:confirm` | Summarize the generated plan and wait for `/hw:start` |
| `/hw:plan:extend` | Append milestones to the active Cycle without reopening planning from scratch |
| `/hw:plan:review` | Review architecture deltas and downstream prompt impact |

#### Lifecycle

| Command | Behavior |
|---------|----------|
| `/hw:init` | Initialize or rescan `.pipeline/` with architecture awareness; supports `--import-history` |
| `/hw:check` | Run health checks on config, state, prompts, Notion, and architecture |
| `/hw:audit` | Run graded preventive code audits |
| `/hw:release` | Run the automated publishing flow |
| `/hw:debug` | Investigate a symptom and propose or apply a verified fix |
| `/hw:cycle` | Create, list, view, close, and archive delivery Cycles |
| `/hw:patch` | Create, list, close, and fix persistent lightweight Patches |
| `/hw:patch fix` | Run the lightweight six-step Patch repair lane |

#### Utility

| Command | Behavior |
|---------|----------|
| `/hypo-workflow:dashboard` | Launch the WebUI dashboard in the background and open the browser |
| `/hw:help` | Show grouped help, quick help, or per-command usage |
| `/hw:reset` | Reset state, generated artifacts, or the entire `.pipeline/` workspace |
| `/hw:log` | Read and filter `.pipeline/log.yaml`; `--full` bypasses compact log context |
| `/hw:compact` | Generate compact context views for PROGRESS, state, log, reports, and closed patches |
| `/hw:guide` | Start an interactive guide that recommends the next command flow |
| `/hw:showcase` | Generate project showcase docs, slides, and an optional poster |

Compatibility note: `/hw:review` now shows a migration warning and redirects users to `/hw:plan:review`.

### Plan Context

`/hw:plan --context <sources>` preloads P1 Discover with existing evidence. It does not skip the interactive interview.

| Source | Reads From | Use |
|--------|------------|-----|
| `audit` | newest `.pipeline/audits/` report | turn audit findings into milestones |
| `patches` | open `.pipeline/patches/P*.md` files | batch small fixes into a Cycle |
| `deferred` | `.pipeline/archives/*/deferred.yaml` | revive unfinished work from older Cycles |
| `debug` | newest `.pipeline/debug/` report | plan from a confirmed root cause |

Example:

```text
/hw:plan --context audit,patches,deferred
```

### Plan Extend

Use `/hw:plan:extend` when a Cycle is already active and you need to append milestones without closing or recreating it. It lists current milestones, asks at least one focused question round, then appends new prompt files and state entries after explicit confirmation.

Relationship to `/hw:plan`:

- `/hw:plan` creates or revises a full plan before execution.
- `/hw:plan:extend` appends to the current active Cycle and never renumbers completed milestones.

### History Import

Use `/hw:init --import-history` to import pre-Workflow Git history into Cycle 0 before normal pipeline work starts.

```text
/hw:init --import-history
/hw:init --import-history --interactive
```

Import behavior:

- scans only the current branch with `git log --first-parent`
- chooses the first useful split signal: tags, milestone keywords, merge commits, then time gaps
- writes `.pipeline/archives/cycle-0-legacy/cycle.yaml`, `summary.md`, and one `report.md` per imported milestone
- creates or preserves the active `.pipeline/cycle.yaml` as Cycle 1
- `--interactive` previews the split plan and waits for confirmation before writing files

Legacy reports use `templates/legacy-report.md` and summarize commits and diff stats; they do not include TDD step fields.

### Lifecycle Logging

- `.pipeline/log.yaml` is the lifecycle ledger
- `/hw:log --all`, `--type <type>`, and `--since <milestone>` filter that ledger
- legacy `log.md` remains the step trace for backward compatibility

### Progress Summary

- `.pipeline/PROGRESS.md` is the human-readable companion to `log.yaml`
- it tracks current milestone, recent activity, and deferred work
- it is updated during execution and failure triage
- output obeys `output.language` and `output.timezone`; default is English + UTC
- Chinese projects can set:

```yaml
output:
  language: zh-CN
  timezone: Asia/Shanghai
```

### Cycles And Patches

- `.pipeline/cycle.yaml` describes the active Cycle
- `.pipeline/archives/C{N}-{slug}/` stores closed Cycle artifacts
- `.pipeline/patches/P001-*.md` stores persistent lightweight patches
- project-root `PROJECT-SUMMARY.md` summarizes Cycle history, open patches, and deferred items

Cycle commands:

```text
/hw:cycle new "V8 implementation" --type feature --context audit,patches
/hw:cycle list
/hw:cycle view C1
/hw:cycle close --paused
/hw:cycle close --reason "superseded by upstream rewrite"
```

Cycle options:

| Option | Values | Notes |
|--------|--------|-------|
| `--type` | `feature`, `bugfix`, `refactor`, `spike`, `hotfix` | maps to a default preset |
| `--context` | `audit`, `patches`, `deferred`, `debug` | saved in `cycle.context_sources` for later planning |
| `--paused` | flag | closes the Cycle as paused |
| `--reason` | text | closes the Cycle as abandoned and records lessons |

Default preset mapping:

| Cycle Type | Default Preset |
|------------|----------------|
| `feature`, `refactor` | `tdd` |
| `bugfix`, `spike`, `hotfix` | `implement-only` |

Patch commands:

```text
/hw:patch "Fix login layout" --severity normal
/hw:patch "Production payment failure" --severity critical
/hw:patch list --open
/hw:patch list --severity critical
/hw:patch close P001
/hw:patch fix P001
/hw:patch fix P001 P003 P007
```

Patch rules:

- Patch IDs are global and monotonic: `P001`, `P002`, `P003`, and so on.
- Severity is `critical`, `normal`, or `minor`; default is `normal`.
- Patches are not archived with Cycles.
- Use `/hw:plan --context patches` to promote open patches into Cycle milestones.

Patch Fix is a direct six-step lane for small repairs:

1. Step 1: 读取 Patch
2. Step 2: 定位代码
3. Step 3: 修复
4. Step 4: 测试
5. Step 5: 提交
6. Step 6: 关闭

It does not start Plan Discover, does not run the full TDD pipeline, does not write `state.yaml`, and does not generate `report.md`. If one Patch needs more than 5 changed files, stop and upgrade it to a Milestone. Successful fixes commit as `fix(P001): <Patch title>`, close the Patch file, append one `PROGRESS.md` line, and add a `patch_fix` event to `log.yaml`.

### Context Compact

Use `/hw:compact` to generate derived context views next to the original files:

```text
.pipeline/PROGRESS.compact.md
.pipeline/state.compact.yaml
.pipeline/log.compact.yaml
.pipeline/reports.compact.md
.pipeline/patches.compact.md
```

SessionStart loads compact files first and falls back to full files when compact files are missing. It still loads `config.yaml`, `architecture.md`, `cycle.yaml`, the current prompt, the current report, and open Patch files in full. Closed Patch details are summarized by `patches.compact.md`.

Use full views when needed:

```text
/hw:status --full
/hw:log --full
/hw:report --view M3
```

### Interactive Guide

Use `/hw:guide` when you are unsure what to run next. It gives a short introduction, senses whether `.pipeline/` exists, reads current Cycle/state/open Patch context, asks what you want to do, recommends a 1-3 command flow, and executes the first command only after confirmation.

Typical recommendations:

| Intent | Flow |
|--------|------|
| New project | `/hw:init` → `/hw:plan` → `/hw:start` |
| Continue work | `/hw:resume` or `/hw:cycle new` |
| Fix a bug | `/hw:patch "description"` → `/hw:patch fix P<N>` |
| Code quality review | `/hw:audit` → `/hw:plan --context audit` |
| Legacy Git project | `/hw:init --import-history` |
| Reduce context usage | `/hw:compact` |
| Release | `/hw:release` |

### Showcase

Use `/hw:showcase` to generate public-facing project material under `.pipeline/showcase/`.

```text
/hw:showcase
/hw:showcase --all
/hw:showcase --doc
/hw:showcase --slides
/hw:showcase --poster
/hw:showcase --new --all
```

Generated artifacts:

- `PROJECT-INTRO.md`: user-friendly project overview
- `TECHNICAL-DOC.md`: developer-oriented architecture and extension guide
- `slides.md`: Markdown slides separated by `---`, with Mermaid support
- `poster.png`: optional GPT Image poster when the configured API key exists

Showcase always runs `analyze` first and `review` last. Without flags it asks which artifacts to generate and waits for the user; it must not assume `--all`. `--new` archives the previous version into `.pipeline/showcase/history/v<N>/` and increments `showcase.yaml` version.

### Auto Resume Watchdog

The watchdog is opt-in and disabled by default:

```yaml
watchdog:
  enabled: false
  interval: 300
  heartbeat_timeout: 300
  max_retries: 5
  max_consecutive_milestones: 10
  notify: true
```

Manual cron setup:

```bash
*/5 * * * * /path/to/hypo-workflow/scripts/watchdog.sh /path/to/project >> /tmp/hypo-watchdog.log 2>&1
```

Runtime behavior:

- `/hw:start` and `/hw:resume` update `last_heartbeat` in `.pipeline/state.yaml`.
- `.pipeline/.lock` prevents watchdog reentry while an agent is already running.
- stale execution triggers `/hw:resume` after `heartbeat_timeout`.
- after 3 consecutive failures the watchdog backs off; after `max_retries` it stops retrying and logs the failure.
- when `watchdog.enabled=false`, no cron entry should be registered.

Use `scripts/watchdog.sh /path/to/project --dry-run` to test detection without resuming.

### V8 Configuration

Project config can override these V8 defaults:

```yaml
plan:
  mode: interactive
  interaction_depth: medium
  interactive:
    min_rounds: 3
    require_explicit_confirm: true

output:
  language: en
  timezone: UTC

watchdog:
  enabled: false
  interval: 300
  heartbeat_timeout: 300
  max_retries: 5
  max_consecutive_milestones: 10
  notify: true
```

Terminology note: V8 design notes may call these `plan.interactive.min_question_rounds` and `plan.interactive.checkpoints`. In the shipped schema, use `plan.interactive.min_rounds` and `plan.interactive.require_explicit_confirm`; checkpoints are enforced by Discover, Decompose, and Confirm.

### V8.1 History Import Configuration

```yaml
history_import:
  split_method: auto           # auto | tag | keyword | merge | time_gap
  time_gap_threshold: 24h
  max_milestones: 20
  keyword_patterns:
    - 'feat\(M(\d+)\):'
    - 'M(\d+)-'
    - 'milestone-(\d+)'
```

### V8.2 Compact Configuration

```yaml
compact:
  auto: true
  progress_recent: 15
  state_history_full: 1
  log_recent: 20
  reports_summary_lines: 3
```

### V8.3 Showcase And i18n Configuration

```yaml
showcase:
  language: auto          # auto | zh | en | bilingual
  poster:
    api_key_env: OPENAI_API_KEY
    size: "1024x1536"
    quality: high         # high | standard
    style: auto           # auto | minimal | tech | marketing
```

Template loading follows `output.language`: `zh-CN` and `zh` use `templates/zh/`, `en` and `en-US` use `templates/en/`, and missing localized templates fall back to root `templates/`.

### Evaluation

```

evaluation:

auto_continue: false       # Auto-advance to next prompt?

max_diff_score: 3          # Base threshold (1-5)

adaptive_threshold: false  # Enable dynamic threshold adjustment?

base_max_diff_score: 3     # Starting threshold when adaptive=true

weights:                   # Custom scoring weights (optional)

diff_score: 0.3

code_quality: 0.2

test_coverage: 0.2

complexity: 0.15

architecture_drift: 0.15

```

### Notion Configuration

```yaml

pipeline:
  source: notion
  output: local

notion:
  token_file: ./Notion-API.md
  source_database_id: "..."
  # or source_page_id: "..."
  output_parent_page_id: "..."
  # or output_database_id: "..."

```

Token resolution order:

1. `NOTION_TOKEN`
2. `notion.token_file`

#### Scoring Dimensions (V4)

| Dimension | Range | Description |
|-----------|-------|-------------|
| `diff_score` | 1-5 | Deviation from prompt requirements |
| `code_quality` | 1-5 | Code quality assessment |
| `test_coverage` | 1-5 | Test coverage (TDD mode only) |
| `complexity` | 1-5 | Implementation complexity |
| `architecture_drift` | 1-5 | Structural deviation from design |
| `overall` | 1-5 | Weighted composite score |

#### Decision Rules

- **STOP** (any triggers): `diff_score > threshold` \| `architecture_drift >= 4` \| `overall > threshold + 1`
- **WARN** (logged, non-blocking): `complexity >= 4` \| `test_coverage <= 2`

---

## Platform Support

### Claude Code ✨

- Full Hook support (23+ events)
- `decision:block` stop-check prevents accidental session termination during pipeline
- `additionalContext` session-start injects pipeline state on resume/compact
- Marketplace installation via `.claude-plugin/marketplace.json`
- Subagent definitions in `.claude/agents/`

### Codex CLI

- Works via the canonical `SKILL.md` plus plugin and marketplace metadata
- The repo includes `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`
- Current public install guidance is the built-in `skill-installer`; public self-serve plugin publishing is still documented as upcoming
- `notify` hook (agent-turn-complete) for logging
- No Hook-based stop/session features (graceful degradation)
- Subagent definitions in `.codex/agents/` (experimental)

---

## Examples

### Basic TDD Pipeline

```

cd examples/hypo-todo

# Then tell your agent:

# "Follow [SKILL.md](http://SKILL.md), read .pipeline/config.yaml, start."

```

This runs a 4-prompt pipeline building a Python CLI TODO app:
- `00-scaffold.md` — Project skeleton
- `01-core-crud.md` — CRUD + SQLite
- `02-rich-ui.md` — Rich library UI
- `03-export.md` — JSON/CSV/Markdown export

### Subagent Delegation

```

cd examples/hypo-todo-subagent

# Config has step_overrides with reviewer: subagent

```

### Adaptive Threshold

```

cd examples/hypo-todo-adaptive

# Config has evaluation.adaptive_threshold: true

```

### Plan Mode Templates

Built-in templates:

- `tdd-python-cli`
- `tdd-typescript-web`
- `docs-writing`
- `research`
- `refactor`

Example:

```

/hw:plan --template tdd-python-cli

```

### Notion Adapter

Example mixed modes:

```yaml
# Read prompts from Notion, write reports locally
pipeline:
  source: notion
  output: local

# Read prompts locally, write reports to Notion
pipeline:
  source: local
  output: notion
```

If the Notion integration does not have access to the target page or database, Hypo-Workflow should fail explicitly for that adapter path while preserving local artifacts.

---

## How It Works

### Progressive Disclosure (3-Layer Loading)

```

L1  Agent discovers Skill     →  reads [SKILL.md](http://SKILL.md) frontmatter (name, version)

L2  Agent activates Skill     →  reads [SKILL.md](http://SKILL.md) full text (~520 lines)

L3  Agent needs details       →  reads references/*.md, runs scripts/*.sh

```

This keeps the main file lean while providing full detail on demand.

### Plan Mode

```

/hw:plan
  -> plan/PLAN-SKILL.md
  -> discover
  -> decompose
  -> generate
  -> confirm
  -> /hw:start

```

Plan Mode reuses the same file-first philosophy as the main pipeline, but focuses on generating `.pipeline/` artifacts before implementation begins.

### State Machine

```

idle → running → [per-prompt: step chain] → evaluate → continue/stop → completed

│

interrupted ←┘ (Ctrl+C / crash)

│

resume →┘

```

All state is persisted in `.pipeline/state.yaml`. You can interrupt at any point and resume later.

### Hook Safety Net (Claude Code)

```

Stop event   →  hooks/[stop-check.sh](http://stop-check.sh)  →  pipeline running?  →  decision:block

Session start →  hooks/[session-start.sh](http://session-start.sh) →  has state.yaml?  →  inject context

```

Hooks act as a passive safety net — they don’t drive the pipeline, but prevent accidental data loss.

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
|---------|-----------|
| V0 | Core state machine + TDD pipeline |
| V0.5 | Skip cascade + evaluation blocking |
| V1 | Subagent delegation with fallback |
| V2.5 | Progressive Disclosure + Plugin packaging |
| V3 | Claude Code Hook integration (stop-check, session-start) |
| V4 | Multi-dimensional evaluation + adaptive threshold + architecture drift |
| V4.5 | Namespaced `/hw:*` slash commands for explicit pipeline control |
| V5 | Plan Mode + Plan Review + template library |
| V5.1 | Notion source/output adapters + mixed mode |
| V6 | Lifecycle commands, unified `log.yaml`, `/hw:plan:review` migration, full 20-command namespace |
| V6.1 | Claude marketplace distribution, Codex plugin metadata, and official installation docs |
| V6.2 | 20 native skills, smart stop hooks, plan auto/interactive modes, PROGRESS.md, and failure triage |
| V7 | Setup wizard, WebUI dashboard, and 22 native skills |
| V7.1 | Global setup config, config fallback priority, and platform-specific subagent tutorials |
| V8 | Interactive planning hard gates, Cycle archives, Patch track, context-injected planning, output language/timezone, project summary, plan extend, and Auto Resume watchdog |
| V8.1 | History Import for Git legacy history, Cycle 0 reports, interactive split preview, and `history_import` config |
| V8.2 | Patch Fix execution lane, Context Compact views, compact-aware SessionStart, full-view flags, and Interactive Guide |
| V8.3 | Showcase preset, project intro materials, Markdown slides, optional poster generation, and i18n template loading |

---

## Contributing

This is a personal project by [Hypoxanthine](https://github.com/Hypoxanthine). Issues and PRs are welcome.

## License

MIT
