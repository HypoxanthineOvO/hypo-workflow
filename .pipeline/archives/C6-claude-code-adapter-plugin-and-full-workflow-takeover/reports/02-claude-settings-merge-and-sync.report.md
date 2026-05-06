# M03 Report - Claude Settings Merge and Sync

## 摘要

M03 已完成 `hypo-workflow sync --platform claude-code` 的安全 settings merge：标准 sync 会刷新 Claude plugin alias artifacts，安全写入 `.claude/settings.local.json`，保留用户配置，创建 timestamped backup，阻断冲突覆盖，并在 result 中返回 changed、backups、conflicts、manual confirmation 和 managed keys。

## Step 状态

| Step | 状态 | 证据 |
|---|---|---|
| write_tests | done | 新增 `core/test/claude-settings-sync.test.js` |
| review_tests | done | 覆盖空 settings、用户配置保留、managed 替换、冲突阻断、备份、幂等和 CLI |
| run_tests_red | done | 初始失败：`mergeClaudeCodeSettings` 未导出 |
| implement | done | 实现 merge helper、写入/备份、sync 接入、CLI path、docs |
| run_tests_green | done | M03 聚焦测试、sync 回归、配置校验、完整 core suite 和 diff check 通过 |
| review_code | done | 写入边界清晰，无 silent overwrite；OpenCode sync 行为保持 |

## 新增测试

- `core/test/claude-settings-sync.test.js`
  - 空项目生成 `.claude/settings.local.json` 与 root `skills/hw-*`
  - 已有 `env`、custom plugin、user hook 保留
  - 修改已有 settings 前创建 `.claude/settings.local.json.bak.YYYYMMDDHHMMSS`
  - rerun idempotent，不重复备份
  - 已有 Hypo-managed hook block 可替换
  - user-owned hook command conflict 阻断写入并要求人工确认
  - CLI 支持 `hypo-workflow sync --platform claude-code --project <dir>`

## RED

命令：

```bash
node --test core/test/claude-settings-sync.test.js
```

结果：失败符合预期，原因是 `../src/index.js` 尚未导出 `mergeClaudeCodeSettings`。

## GREEN

命令：

```bash
node --test core/test/claude-settings-sync.test.js core/test/sync-standardization.test.js
bash scripts/validate-config.sh .pipeline/config.yaml
node --test core/test/*.test.js
git diff --check
```

结果：

- `core/test/claude-settings-sync.test.js core/test/sync-standardization.test.js`: 9/9 passed
- `scripts/validate-config.sh .pipeline/config.yaml`: passed
- `core/test/*.test.js`: 230/230 passed
- `git diff --check`: passed

## 产出

- `mergeClaudeCodeSettings(existing, options)`
- `syncClaudeCodeSettings(projectRoot, options)`
- `runProjectSync(..., { platform: "claude-code" })`
- Claude-specific drift check for `.claude/settings.local.json`
- CLI `sync --platform claude-code`
- Docs:
  - `docs/platforms/claude-code.md`
  - `references/platform-claude.md`
  - `references/commands-spec.md`
  - `cli/README.md`

## 评估

| Check | 结果 |
|---|---|
| tests_pass | pass |
| no_regressions | pass |
| matches_plan | pass |
| code_quality | pass |

- `diff_score`: 1
- `code_quality`: 4
- `test_coverage`: 1
- `complexity`: 2
- `architecture_drift`: 1
- `overall`: 2

## 后续

继续 M04：实现 Claude Hook runtime wrapper，把 Stop、SessionStart、Compact、Permission、Tool/Progress refresh 接入到 M03 已建立的 settings merge 基础上。
