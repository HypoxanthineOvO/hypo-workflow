# User Guide

Hypo-Workflow organizes long-running AI coding work around `.pipeline/` state, prompts, reports, logs, and recovery files.

## Common Workflows

- Plan work with `/hw:plan`, then execute with `/hw:start` or `/hw:resume`.
- Check progress with `/hw:status` and inspect reports with `/hw:report`.
- Repair derived context with `/hw:sync --repair` and documentation with `/hw:docs repair`.
- Use `/hw:accept` or `/hw:reject` at lifecycle gates.

## Feature Queue

Feature Queue supports long-range planning without turning Hypo-Workflow into a runner.

- Use `/hw:plan --batch` to discover multiple Features and create a queue.
- Use `/hw:plan --insert` to stage a natural-language queue edit before confirmation.
- `.pipeline/feature-queue.yaml` stores Features, dependencies, gates, and scheduling metadata.
- `.pipeline/metrics.yaml` stores duration, token, cost, and telemetry fallback summaries.
- `upfront` decomposition writes milestones for the whole queue early.
- `just_in_time` decomposition materializes milestones when a Feature becomes current.
- `gate: confirm` pauses before work that requires explicit human review.
- `auto_chain` can advance ready Features when gates and failure policy allow it.
- `failure_policy: skip_defer` defers failed Features instead of blocking the whole queue.

## Recovery

Structured execution leases and lifecycle logs preserve enough context for safe resume or handoff across supported platforms.
