# M12 / F004 - Explore Contract And Worktree

## 结果

通过。

## 交付内容

- 新增 Explore contract helper：
  - `createExploration`
  - `decideExploreDirtyWorktree`
  - `buildExploreWorktreePath`
- `/hw:explore "topic"` contract 已加入 command map，并同步 OpenCode `/hw-explore` artifact。
- Explore metadata 写入 `.pipeline/explorations/E001-slug/`：
  - `exploration.yaml`
  - `notes.md`
  - `summary.md`
- Explore code worktree 写入全局隔离路径：
  - `~/.hypo-workflow/worktrees/<project-id>/E001-slug/`
- dirty main worktree 默认阻断，需要显式 `allowDirty` 决策才会创建 metadata/worktree。
- exploration start 写入 lifecycle log，并追加 Knowledge Ledger record 后重建 compact/index。
- OpenCode hook runtime 只授权 Hypo-Workflow owned worktree root，不放开整个 `~/.hypo-workflow`。
- 新增 `skills/explore/SKILL.md`，记录 metadata/worktree contract、dirty-worktree gate 和 lifecycle 边界。

## 验证

- `node --test core/test/explore-contract.test.js`：3/3
- `node --test core/test/*.test.js`：148/148
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh .pipeline/config.yaml`

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

M12 只建立 exploration contract 和隔离 worktree 起点，不自动合并 exploration code，不删除 worktree，也不默认授权整个全局 Hypo-Workflow 目录。后续 lifecycle、archive 和 upgrade 语义留给 M13。
