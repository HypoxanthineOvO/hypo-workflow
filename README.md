<div align="center">

# ⚙️ Hypo-Workflow

**Serialized Prompt Execution Engine for AI Agents**

TDD Pipeline · Self-Review · Interrupt Recovery · Multi-Dimensional Evaluation

[![Version](https://img.shields.io/badge/version-6.1.0-blue)](.claude-plugin/plugin.json)
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
| 🧭 **Slash Commands** | 20 canonical `/hw:*` commands covering Pipeline / Plan / Lifecycle / Utility surfaces |
| 🗺️ **Plan Mode** | `/hw:plan` sub-skill with discover / decompose / generate / confirm / review phases |
| 🧩 **Notion Adapter** | Read prompts from Notion and/or write reports back to Notion with graceful degradation |
| ⏸️ **Interrupt Recovery** | `state.yaml` tracks progress to the sub-step level — resume exactly where you left off |
| 🤖 **Subagent Delegation** | Offload code reviews to a subagent (Claude ↔ Codex), with automatic fallback |
| 🪨 **Hook Integration** | Claude Code hooks for stop-check (`decision:block`) and session context injection (`additionalContext`) |
| 📊 **Multi-Dim Evaluation** | 5 scoring dimensions + adaptive threshold + architecture drift detection |
| 🔁 **Lifecycle Closure** | `/hw:init` → `/hw:check` → `/hw:audit` → `/hw:debug` → `/hw:release` completes the project loop |
| 📝 **Unified Logging** | `.pipeline/log.yaml` records milestones, fixes, audits, debug sessions, plan reviews, and releases |
| 📦 **Plugin Ready** | Ships official `.claude-plugin` and `.codex-plugin` manifests plus marketplace metadata |
| 📁 **Progressive Disclosure** | 3-layer loading: metadata → SKILL.md → references/scripts/assets (on demand) |

---

## Installation

### Claude Code

In Claude Code, add the repository marketplace and install the plugin:

```bash
/plugin marketplace add HypoxanthineOvO/hypo-workflow
/plugin install hypo-workflow@hypoxanthine-hypo-workflow

# Verify:
/hw:help
```

This repository publishes its Claude marketplace metadata from the repo root at [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json).

### Codex CLI

The repository ships official Codex plugin metadata in [`.codex-plugin/plugin.json`](./.codex-plugin/plugin.json) and a repo marketplace at [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json). OpenAI's plugin docs currently describe public self-serve publishing as "coming soon", so the most reliable install path today is the built-in `skill-installer` against the repository root that already contains the full skill:

```text
Use $skill-installer to install the GitHub repo HypoxanthineOvO/hypo-workflow with path . as skill name hypo-workflow

# Then restart Codex and verify:
/hw:help
```

This installs the full repository root as one self-contained skill so the canonical [`SKILL.md`](./SKILL.md) can keep its existing Progressive Disclosure layout.

### Manual Install

If marketplace-based installation is unavailable:

```bash
git clone https://github.com/HypoxanthineOvO/hypo-workflow.git
claude --plugin-dir ./hypo-workflow
```

If your local checkout nests the repo under another workspace, point `--plugin-dir` at that nested repository root instead.

---

## Quick Start

### 1. Install the Skill

Use one of the installation methods above, then open a project where you want to run Hypo-Workflow.

```
/hw:help

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

├── skills/

│   └── hypo-workflow/

│       └── [SKILL.md](http://SKILL.md)            # Plugin wrapper entry point

└── tests/

└── scenarios/               # System test scenarios (s01-s30)

```

Repository root distribution metadata is included directly in this flattened layout:

- [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json)
- [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json)

---

## Configuration Reference

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

### Slash Commands

#### Pipeline

| Command | Behavior |
|---------|----------|
| `/hw:start` | Start the implementation pipeline |
| `/hw:resume` | Resume the current run |
| `/hw:status` | Show current progress |
| `/hw:skip` | Skip the current prompt |
| `/hw:stop` | Gracefully stop and save state |
| `/hw:report` | Summarize the latest report |

#### Plan

| Command | Behavior |
|---------|----------|
| `/hw:plan` | Enter Plan Mode |
| `/hw:plan:discover` | Discover repo context, goals, and constraints |
| `/hw:plan:decompose` | Split work into milestones with test specs |
| `/hw:plan:generate` | Generate `.pipeline/` artifacts from the plan |
| `/hw:plan:confirm` | Summarize the generated plan and wait for `/hw:start` |
| `/hw:plan:review` | Review architecture deltas and downstream prompt impact |

#### Lifecycle

| Command | Behavior |
|---------|----------|
| `/hw:init` | Initialize or rescan `.pipeline/` with architecture awareness |
| `/hw:check` | Run health checks on config, state, prompts, Notion, and architecture |
| `/hw:audit` | Run graded preventive code audits |
| `/hw:release` | Run the automated publishing flow |
| `/hw:debug` | Investigate a symptom and propose or apply a verified fix |

#### Utility

| Command | Behavior |
|---------|----------|
| `/hw:help` | Show grouped help, quick help, or per-command usage |
| `/hw:reset` | Reset state, generated artifacts, or the entire `.pipeline/` workspace |
| `/hw:log` | Read and filter `.pipeline/log.yaml` |

Compatibility note: `/hw:review` now shows a migration warning and redirects users to `/hw:plan:review`.

### Lifecycle Logging

- `.pipeline/log.yaml` is the V6 lifecycle ledger
- `/hw:log --all`, `--type <type>`, and `--since <milestone>` filter that ledger
- legacy `log.md` remains the step trace for backward compatibility

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

## Versioning

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

---

## Contributing

This is a personal project by [Hypoxanthine](https://github.com/Hypoxanthine). Issues and PRs are welcome.

## License

MIT
