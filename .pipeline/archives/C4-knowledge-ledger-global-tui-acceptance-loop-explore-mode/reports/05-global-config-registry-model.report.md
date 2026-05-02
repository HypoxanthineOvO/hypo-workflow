# M06 / F002 - Global Config And Registry Model

## 结果

通过。

## 交付内容

- 扩展 `DEFAULT_GLOBAL_CONFIG`：
  - `model_pool.roles.plan / implement / review / evaluate / chat`
  - `acceptance.mode / require_user_confirm / default_state`
  - `sync.project_registry / register_projects / platforms.opencode`
  - 保留现有 `knowledge.*` 默认值并纳入全局配置合同
- 新增全局配置 helper：
  - `buildModelPoolOpenCodeAgents`
  - `loadGlobalConfigForSave`
  - `saveMigratedGlobalConfig`
  - `migrateGlobalConfigShape`
  - `projectRegistryId`
  - `loadProjectRegistry`
  - `saveProjectRegistry`
  - `registerProject`
- OpenCode artifact 生成接入 model pool：
  - 无 explicit override 时从 `model_pool.roles` 派生 agent matrix
  - explicit `opencode.agents.*.model` 仍可覆盖对应 agent
  - `.opencode/hypo-workflow.json` 携带 `model_pool`，root `opencode.json` 不泄露 HW-private matrix
- `cli/bin/hypo-workflow init-project` 自动写入 `~/.hypo-workflow/projects.yaml` 项目注册表。
- 更新 `config.schema.yaml` 和 `references/config-spec.md`，记录 model pool、lazy migration、project registry、sync defaults。
- 新增 `core/test/global-config-registry.test.js` 覆盖默认值、迁移、注册表、OpenCode mapping、CLI 自动注册和文档/schema。

## 验证

- `node --test core/test/global-config-registry.test.js`：6/6
- `node --test core/test/config.test.js core/test/commands-rules-artifacts.test.js core/test/opencode-panels.test.js core/test/profile-platform.test.js`
- `node --test core/test/*.test.js`：128/128
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `claude plugin validate .`
- OpenCode JSON parse：`.opencode/hypo-workflow.json`、`opencode.json`、`.opencode/opencode.json`
- `opencode debug config`：plugin 加载成功，`edit=ask`，`hw-build` model 可解析
- `git diff --check`

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

普通 `loadConfig` 仍保持 read-only merge 行为；只有显式调用 `saveMigratedGlobalConfig` 才会创建 timestamped backup 并写入迁移后的全局配置。
