---
name: hypo-workflow
description: Serialized prompt execution workflow for `.pipeline/` projects. Use when the user invokes `/hw:*` commands or asks to initialize, plan, resume, audit, debug, release, reset, or inspect a Hypo-Workflow pipeline.
---

# Hypo-Workflow

This wrapper exists for Claude Code and Codex plugin packaging.

1. Immediately read `../../SKILL.md` and treat it as the canonical instructions.
2. Keep all relative references anchored to `../../SKILL.md`, not this wrapper.
3. When `/hw:plan` or `/hw:plan:*` is invoked, follow the canonical routing rules to load `../../plan/PLAN-SKILL.md`.
4. Do not duplicate the full canonical skill body here unless packaging constraints force a future split.
