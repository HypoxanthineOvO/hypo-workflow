# M07 / F002 - Ink TUI Foundation

## 结果

通过。

## 交付内容

- 新增全局 TUI deterministic helper：
  - `buildGlobalTuiModel`
  - `renderGlobalTuiSnapshot`
- 新增 `core/src/tui/index.js` 并从 core public API 导出。
- `hypo-workflow` 无命令行为更新：
  - 首次运行仍创建全局配置
  - 已存在全局配置时进入 TUI
  - `tui --snapshot` 和 `HW_TUI_SNAPSHOT=1` 提供非交互测试输出
- 新增 CLI package metadata：
  - `cli/package.json`
  - `cli/package-lock.json`
  - `bin.hw` alias 指向 `bin/hypo-workflow`
  - 锁定 `ink` 和 `react`
- TUI 第一版展示：
  - project registry
  - project detail
  - global config
  - model pool
  - sync/actions menu
- 更新 `cli/README.md`。
- 修复 v9 s55/s56/s58 回归场景，使用临时 HOME，避免 `init-project` 测试污染真实 `~/.hypo-workflow/projects.yaml`。

## 验证

- `node --test core/test/ink-tui.test.js`：4/4
- `node --test core/test/ink-tui.test.js core/test/global-config-registry.test.js core/test/config.test.js`
- `npm install --package-lock-only --ignore-scripts --dry-run` in `cli/`
- `node --test core/test/*.test.js`：132/132
- `python3 tests/run_regression.py`：62/62
- `bash tests/scenarios/v9/s55-opencode-command-map/run.sh`
- `bash tests/scenarios/v9/s56-agents-ask-todo-plan-discipline/run.sh`
- `bash tests/scenarios/v9/s58-opencode-full-v84-parity/run.sh`
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `claude plugin validate .`
- JSON parse：OpenCode JSON 和 CLI package JSON
- `opencode debug config`
- `git diff --check`
- 真实 `~/.hypo-workflow/projects.yaml` 已确认无 `/tmp/tmp.*` 测试污染项

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

当前 TUI 不执行 pipeline，只提供 read-only global management surface 和显式 action menu。交互式 Ink 渲染在 TTY 中尝试加载 `ink/react`；非 TTY 或缺少依赖时输出 deterministic snapshot，保证 CLI 和测试可脚本化。
