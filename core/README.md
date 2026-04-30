# Hypo-Workflow Core

`core/` contains deterministic helper code shared by platform adapters. It is not a runner: it never executes Milestones, calls models, or replaces the host Agent.

The first V9 slice covers:

- global/project config load and write
- profile normalization
- platform capability lookup
- canonical command mapping
- rules summary generation
- OpenCode command/agent/config artifact rendering
