# M08 / F002 - Model Pool And Project Actions

## 结果

通过。

## 交付内容

- 新增 model pool action helper：
  - `updateModelPoolRole`
  - `saveGlobalModelPoolEdit`
  - fallback chain 去重、去 primary、空 primary 校验
  - 保存时通过 lazy migration backup 写入全局配置
- 新增项目 action helper：
  - `addProjectAction`
  - `scanProjectsAction`
  - `refreshProjectRegistryAction`
  - `syncSelectedProjectAction`
  - `inspectProject`
- 项目 registry 现在保留 `selected_project_id`，同步项目后 TUI 会优先展示最近同步项目，避免 registry 排序导致 detail 不稳定。
- selected project sync 会合并全局配置和项目本地 `.pipeline/config.yaml`，项目本地 OpenCode agent override 仍优先。
- TUI detail 现在展示 acceptance 和 knowledge 状态，并暴露 model pool/project action entries。
- 更新 M07 TUI 测试，使 action list 和 detail 状态覆盖 M08 行为。

## 验证

- `node --test core/test/model-pool-actions.test.js`：3/3
- `node --test core/test/ink-tui.test.js`：4/4
- `node --test core/test/*.test.js`：135/135
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh`
- `claude plugin validate .`
- `opencode debug config`
- JSON parse：OpenCode JSON 和 CLI package lock
- `git diff --check`

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

Action helper 只在显式调用时写入全局 config、project registry 或 selected project adapter artifacts；TUI model 构建仍保持 read-only。`npm test` 在 `core/` cwd 下会触发既有测试的仓库根路径 ENOENT，项目有效验证命令是从仓库根运行 `node --test core/test/*.test.js`。
