---
agent: hw-build
description: Hypo-Workflow mapping for /hw:patch fix
---

# /hw-patch-fix

Canonical command: `/hw:patch fix`
Route: `fix`
Skill: `skills/patch/SKILL.md`

Load the corresponding Hypo-Workflow skill instructions from `skills/patch/SKILL.md`, then execute the canonical command semantics with any user-provided arguments.
Patch Fix lane:
- Step 1: Read Patch
- Step 2: Locate Code
- Step 3: Apply Minimal Fix
- Step 4: Run Tests
- Step 5: Commit
- Step 6: Close Patch

do not run Plan Discover, do not enter full TDD pipeline, and do not mutate `state.yaml` for Patch Fix.

Before acting, inspect the relevant context when present:

- `.pipeline/config.yaml`
- `.pipeline/cycle.yaml`
- `.pipeline/state.yaml`
- `.pipeline/rules.yaml`
- current prompt/report files for pipeline commands
- open patches for Patch commands

Keep this command as an OpenCode-native slash mapping, not a separate runner. The OpenCode Agent performs the work and Hypo-Workflow files remain the source of truth.
