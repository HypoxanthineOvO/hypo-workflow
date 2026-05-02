# M12 / F004 - Explore Contract And Worktree

## 需求

- Add Explore Mode contract and isolated global worktree creation.
- `/hw:explore "topic"` starts an exploration without dirtying the main worktree.
- Dirty main worktree requires a user decision.
- Explore metadata lives in `.pipeline/explorations/E001-slug/`.
- Code worktree lives in `~/.hypo-workflow/worktrees/<project-id>/E001-slug/`.

## 实施计划

1. Define exploration metadata:
   - id
   - topic
   - status
   - source project
   - base branch and commit
   - explore branch
   - worktree path
   - notes path
   - summary path
2. Add `/hw:explore` command and skill contract.
3. Implement project ID resolution from registry helpers.
4. Implement worktree creation:
   - branch `explore/E001-slug`
   - global worktree directory
   - safe dirty-worktree prompt
5. Add OpenCode permission policy for HW-owned worktree root.
6. Record exploration start in log and knowledge.

## 预期测试

- Git worktree fixture tests.
- Dirty worktree decision tests.
- Metadata creation tests.
- Permission policy tests for `~/.hypo-workflow/worktrees/**`.
- Command map and OpenCode artifact tests.

## 预期产出

- `skills/explore/SKILL.md`
- explore helpers
- command map updates
- OpenCode agent/permission updates
- docs/spec updates

## 约束

- Do not default-authorize the whole `~/.hypo-workflow` directory.
- Do not store real secrets in exploration metadata.
- Do not mutate main worktree when starting exploration except for metadata/log files after confirmation.
