---
agent: hw-plan
description: Hypo-Workflow mapping for /hw:guide
---

# /hw-guide

Canonical command: `/hw:guide`
Route: `plan`
Skill: `skills/guide/SKILL.md`

Load the corresponding Hypo-Workflow skill instructions from `skills/guide/SKILL.md`, then execute the canonical command semantics with any user-provided arguments.
Plan discipline: use `question` / Ask for every hard interactive gate unless automation is explicitly configured, and keep `todowrite` synchronized for P1/P2/P3/P4 checkpoint state.

Before acting, inspect the relevant context when present:

- `.pipeline/config.yaml`
- `.pipeline/cycle.yaml`
- `.pipeline/state.yaml`
- `.pipeline/rules.yaml`
- current prompt/report files for pipeline commands
- open patches for Patch commands

Keep this command as an OpenCode-native slash mapping, not a separate runner. The OpenCode Agent performs the work and Hypo-Workflow files remain the source of truth.
