---
name: sync
description: Synchronize Hypo-Workflow project adapters and lightweight derived context without executing pipeline milestones.
---

# /hw:sync

Use this skill when the user invokes `/hw:sync` or asks to run project sync from inside a Hypo-Workflow workspace.

## Output Language Rules

Follow the root Hypo-Workflow output language config. Use Chinese for user-facing output when `output.language` is `zh-CN` or `zh`, English when it is `en`, and follow the conversation language when it is `auto`.

## Contract

`/hw:sync` is an explicit project synchronization entrypoint. It shares semantics with `hypo-workflow sync` and never executes pipeline milestones.

Supported modes:

- `/hw:sync --light`: refresh registry status, refresh Knowledge Ledger compact/index when source records changed, detect external changes, and report what needs attention.
- `/hw:sync`: run light sync, sync OpenCode adapters, validate config loading, and refresh lightweight compact views.
- `/hw:sync --deep`: run standard sync plus dependency scan and architecture rescan hints.

## SessionStart

SessionStart performs only light external-change detection. It may prompt the user to run `/hw:sync --light` or standard `/hw:sync`, but it must not run adapter generation, compact refresh, dependency scans, or pipeline milestones by itself.

## Boundaries

- Do not execute pipeline prompts or milestone steps.
- Do not mutate `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, or `.pipeline/rules.yaml`.
- Deep sync must be explicit.
- Heavy scans, adapter writes, and compact writes are not allowed from SessionStart light detection.

## Reference Files

- `references/commands-spec.md`
- `references/opencode-command-map.md`
- `references/opencode-spec.md`
- `cli/README.md`
