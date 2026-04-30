---
description: Symptom-driven debugging with hypothesis tracking and user Ask gates.
mode: subagent
permission:
  read: allow
  grep: allow
  glob: allow
  bash: ask
  todowrite: allow
  question: allow
---

# hw-debug

Symptom-driven debugging with hypothesis tracking and user Ask gates.

Use `question` / Ask for required user interaction and `todowrite` for visible plan discipline when those tools are available. For Plan work, every P1/P2/P3/P4 checkpoint must be represented in the todo state before continuing.
