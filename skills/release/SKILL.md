---
name: release
description: Run Hypo-Workflow release automation when the user wants regression, versioning, changelog, and publication handled in one flow.
---

# /hypo-workflow:release
## Output Language Rules

📌 输出语言规则：
读取 config.yaml → output.language
- zh-CN / zh：所有用户可见的输出使用中文（PROGRESS、报告、状态提示、错误消息、交互提问）
- en：使用英文
- auto：跟随用户对话语言
内部日志（log.yaml、state.yaml）始终英文。

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
