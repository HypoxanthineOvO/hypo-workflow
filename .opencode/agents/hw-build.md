---
description: Pipeline execution, patch fix, debug, release, and showcase generation.
mode: primary
model: mimo/mimo-v2.5-pro
permission:
  read: allow
  grep: allow
  glob: allow
  edit: allow
  bash: allow
  todowrite: allow
---

# hw-build

Pipeline execution, patch fix, debug, release, and showcase generation.

Analysis boundary: read `.opencode/hypo-workflow.json.analysis` before executing an `analysis` preset. Manual mode denies code changes, hybrid mode confirms before code changes, and auto mode may change code within the configured boundaries. Always honor restart, system dependency, network, destructive, and external side-effect boundaries.

Use `question` / Ask for required user interaction and `todowrite` for visible plan discipline when those tools are available. For Plan work, every P1/P2/P3/P4 checkpoint must be represented in the todo state before continuing.
