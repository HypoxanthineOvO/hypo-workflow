<div align="center">

# ⚙️ Hypo-Workflow

**Serialized Prompt Execution Engine for AI Agents**

TDD Pipeline · Self-Review · Interrupt Recovery · Multi-Dimensional Evaluation

[![Version](https://img.shields.io/badge/version-4.5.0-blue)](.claude-plugin/plugin.json)
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
| 🧭 **Slash Commands** | Explicit `/hw:*` commands for start / resume / status / skip / stop / report |
| ⏸️ **Interrupt Recovery** | `state.yaml` tracks progress to the sub-step level — resume exactly where you left off |
| 🤖 **Subagent Delegation** | Offload code reviews to a subagent (Claude ↔ Codex), with automatic fallback |
| 🪨 **Hook Integration** | Claude Code hooks for stop-check (`decision:block`) and session context injection (`additionalContext`) |
| 📊 **Multi-Dim Evaluation** | 5 scoring dimensions + adaptive threshold + architecture drift detection |
| 📦 **Plugin Ready** | `.claude-plugin/plugin.json` for one-click installation in Claude Code |
| 📁 **Progressive Disclosure** | 3-layer loading: metadata → SKILL.md → references/scripts/assets (on demand) |

---

## Quick Start

### 1. Install the Skill

Copy (or symlink) the `prompt-pipeline/` directory into your project:

```

# Option A: Copy

cp -r /path/to/hypo-workflow/prompt-pipeline/ ./prompt-pipeline/

# Option B: Symlink

ln -s /path/to/hypo-workflow/prompt-pipeline/ ./prompt-pipeline

# Option C: Claude Code Plugin (if supported)

# The .claude-plugin/plugin.json handles auto-discovery

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

Please follow prompt-pipeline/[SKILL.md](http://SKILL.md) to execute the pipeline.

Read .pipeline/config.yaml and start.

```

Or use an explicit slash command:

```

/hw:start

```

The agent will:
1. Read your config and prompts
2. Execute each prompt through the TDD sub-step chain
3. Generate a report with evaluation scores
4. Decide whether to continue or stop based on the scores

---

## Directory Structure

```

prompt-pipeline/

├── [SKILL.md](http://SKILL.md)                     # ⭐ Main entry point (the Skill)

├── config.schema.yaml           # Configuration schema

├── .claude-plugin/

│   └── plugin.json              # Claude Code plugin manifest

├── hooks/

│   ├── [stop-check.sh](http://stop-check.sh)            # Prevents accidental session termination

│   ├── [session-start.sh](http://session-start.sh)         # Injects pipeline context on session start

│   ├── [instructions-loaded.sh](http://instructions-loaded.sh)   # Logs [CLAUDE.md](http://CLAUDE.md) load events

│   ├── [codex-notify.sh](http://codex-notify.sh)          # Codex agent-turn-complete handler

│   └── [README.md](http://README.md)

├── scripts/

│   ├── [state-summary.sh](http://state-summary.sh)         # Print pipeline state summary

│   ├── [log-append.sh](http://log-append.sh)            # Append structured log entries

│   ├── [diff-stats.sh](http://diff-stats.sh)            # Git diff statistics

│   └── [validate-config.sh](http://validate-config.sh)       # Validate config.yaml

├── references/

│   ├── [tdd-spec.md](http://tdd-spec.md)              # Detailed TDD sub-step rules

│   ├── [commands-spec.md](http://commands-spec.md)         # Slash command parsing & semantics

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

└── tests/

└── scenarios/               # System test scenarios (s01-s15)

```

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
- Plugin installation via `.claude-plugin/plugin.json`
- Subagent definitions in `.claude/agents/`

### Codex CLI

- Works via SKILL.md + AGENTS.md discipline
- `notify` hook (agent-turn-complete) for logging
- No Hook-based stop/session features (graceful degradation)
- Subagent definitions in `.codex/agents/` (experimental)

---

## Examples

### Basic TDD Pipeline

```

cd examples/hypo-todo

# Then tell your agent:

# "Follow prompt-pipeline/[SKILL.md](http://SKILL.md), read .pipeline/config.yaml, start."

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

---

## How It Works

### Progressive Disclosure (3-Layer Loading)

```

L1  Agent discovers Skill     →  reads [SKILL.md](http://SKILL.md) frontmatter (name, version)

L2  Agent activates Skill     →  reads [SKILL.md](http://SKILL.md) full text (~520 lines)

L3  Agent needs details       →  reads references/*.md, runs scripts/*.sh

```

This keeps the main file lean while providing full detail on demand.

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

---

## Contributing

This is a personal project by [Hypoxanthine](https://github.com/Hypoxanthine). Issues and PRs are welcome.

## License

MIT
