# M14 / F004 - `/hw:sync` Standardization

## 结果

通过。

## 交付内容

- 新增 `/hw:sync` canonical command 与 OpenCode `/hw-sync` artifact。
- 新增 `skills/sync/SKILL.md`，定义 light / standard / deep 三种同步模式。
- 新增 core sync helper：
  - `runProjectSync`
  - `runSessionStartLightSyncCheck`
- CLI `hypo-workflow sync` 改为复用 core sync helper，并支持：
  - `--light`
  - default standard
  - `--deep`
- light sync：
  - external-change detection
  - registry refresh
  - Knowledge Ledger compact/index refresh
  - 不写 OpenCode adapter
- standard sync：
  - light sync
  - OpenCode adapter sync
  - config loading check
  - compact refresh
- deep sync：
  - standard sync
  - dependency scan
  - architecture rescan hint
- SessionStart hook 增加只读 light sync detection，只提示 `/hw:sync --light`，不执行 heavy writes。
- Global TUI action 文案更新为 `Sync Project`。
- command/skill/readme/spec/regression 计数从 35 更新到 36。
- 当前仓库 OpenCode generated artifacts 已同步，包含 `.opencode/commands/hw-sync.md`。

## 验证

- `node --test core/test/sync-standardization.test.js`：4/4
- 受影响测试：commands/artifacts、skill-quality、TUI、hooks、sync：19/19
- `node --test core/test/*.test.js`：156/156
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- JSON parse：`.opencode/hypo-workflow.json`、`.opencode/opencode.json`、`opencode.json`、`tui.json`
- `git diff --check`

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

`/hw:sync` 是项目同步入口，不是 runner。它不会执行 pipeline milestone。SessionStart 只做只读 external-change detection，避免在会话启动阶段进行 adapter generation、compact refresh 或 dependency scan。
