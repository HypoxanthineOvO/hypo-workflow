---
name: setup
description: Configure Hypo-Workflow itself when the user is installing the plugin for the first time or wants to choose plan mode, execution mode, subagent backend, and dashboard preferences.
---

# /hypo-workflow:setup

Use this skill as the plugin-level setup wizard. It configures Hypo-Workflow itself, not a specific project pipeline.

## What This Skill Configures

- environment detection:
  - Claude Code
  - Codex
  - manual override when auto-detection is wrong
- planning defaults:
  - `plan.mode`
  - `plan.interaction_depth`
- execution defaults:
  - `execution.mode`
  - subagent backend (`codex` or `claude`) when subagent mode is chosen
- dashboard defaults:
  - whether the WebUI is enabled
  - whether dependencies should be installed
  - whether dashboard auto-start is preferred

## Configuration File Location

- project-local plugin install:
  - write `.hypo-workflow-config.yaml` in the project root
- global plugin install:
  - write `~/.hypo-workflow/config.yaml`

Choose the location based on where the plugin is installed.

## Execution Flow

1. Detect the runtime environment:
   - Claude Code if `CLAUDE_CODE` or `.claude-plugin/` markers are present
   - Codex if `.codex-plugin/` or Codex-specific markers are present
2. Ask the user to confirm or override the detected environment.
3. Ask for planning preferences:
   - `plan.mode`: `auto` or `interactive`
   - `plan.interaction_depth`: `low`, `medium`, or `high`
4. Ask for execution preferences:
   - `execution.mode`: `self` or `subagent`
   - if subagent mode is chosen, ask for backend: `codex` or `claude`
5. Ask whether Dashboard should be enabled.
6. If Dashboard is enabled, instruct installation of dependencies with:
   - `uv pip install -r dashboard/requirements.txt`
7. Write the resulting configuration file in YAML form.
8. Explain that:
   - `setup` configures the plugin
   - `init` configures a specific project pipeline

## Default Values

- `plan.mode=interactive`
- `plan.interaction_depth=medium`
- `execution.mode=self`
- subagent backend default = `codex`
- `dashboard.enabled=false`

## Example Config Shape

```yaml
environment: claude
plan:
  mode: interactive
  interaction_depth: medium
execution:
  mode: self
  subagent: codex
dashboard:
  enabled: false
  auto_start: false
```

## Reference Files

- `config.schema.yaml` — supported project-level config keys
- `dashboard/requirements.txt` — dashboard dependency set
- `SKILL.md` — full system reference if broader context is needed
