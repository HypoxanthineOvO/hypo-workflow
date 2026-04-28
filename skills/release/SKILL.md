---
name: release
description: Run Hypo-Workflow release automation when the user wants regression, versioning, changelog, and publication handled in one flow.
---

# /hypo-workflow:release

Use this skill for the seven-step release workflow.

## Preconditions

- worktree should be ready for release
- no unfinished milestone should remain in state

## Execution Flow

1. Preflight:
   - verify clean worktree
   - verify correct branch
   - verify no unfinished milestone
2. Run regression unless the user explicitly confirms skipping tests.
3. Calculate the next version unless an explicit bump flag is given.
4. Update versioned files.
5. Resolve `output.language` and `output.timezone`.
6. Generate changelog content in `output.language` with timestamps in `output.timezone`.
7. Commit, tag, and push.
8. Optionally create the remote release entry.
9. Append a lifecycle log entry.
10. Set `current.phase=lifecycle_release` when state tracking is used.

## Reference Files

- `references/release-spec.md`
- `references/log-spec.md`
- `SKILL.md`
