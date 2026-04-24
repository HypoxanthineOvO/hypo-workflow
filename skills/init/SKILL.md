---
name: init
description: Initialize or rescan a Hypo-Workflow project when the user wants architecture-aware setup before planning or execution.
---

# /hypo-workflow:init

Use this skill to bootstrap `.pipeline/` and the architecture baseline.

## Preconditions

- the repo is either empty, already contains source code, or already contains a partial pipeline

## Execution Flow

1. Detect which of the three cases applies:
   - empty project
   - existing project without `.pipeline/`
   - existing pipeline
2. Run the four exploration phases:
   - environment sensing
   - structure scan
   - deep reading when needed
   - output generation
3. Generate architecture in single-file or folder mode based on project size unless forced.
4. Use `--rescan` to refresh architecture for an existing pipeline.
5. Set `current.phase=lifecycle_init` when tracking this command through state.

## Reference Files

- `references/init-spec.md` — init behavior and architecture strategy
- `references/commands-spec.md`
- `SKILL.md`
