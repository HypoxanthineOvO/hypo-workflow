# M05 / F002 — Analysis Interaction Model and Boundaries

## 实施计划

1. 基于 M04 的 `analysis` preset，设计 `execution.analysis` 配置表面。
2. 先写 config/default tests，覆盖 `manual`、`hybrid`、`auto` 和 boundary fallback。
3. 实现配置 schema 和 normalization：
   - `interaction_mode: manual | hybrid | auto`
   - `boundaries.code_changes`
   - `boundaries.restart_services`
   - `boundaries.install_system_dependencies`
   - `boundaries.network_remote_resources`
   - `boundaries.destructive_or_external_side_effects`
4. 固化默认行为：
   - published/project default: `hybrid`
   - owner/global default may be `auto`
   - `manual` denies code changes
   - `hybrid` confirms before code changes
   - `auto` allows code changes
   - system-level dependency installation asks
   - service restart confirms
5. 更新 OpenCode/Codex/Claude instruction surfaces，使 analysis boundary 能被 agent prompt 消费。

## 依赖

- M04
- `config.schema.yaml`
- `core/src/config/index.js`
- `references/config-spec.md`
- `core/src/artifacts/opencode.js`
- `AGENTS.md` generation docs if present

## 验证点

- 默认发布配置是 hybrid，不会无提示改代码。
- owner/global auto override 可表达但不会污染项目发布默认。
- 系统依赖安装和服务重启边界能明确写入 agent guidance。
- 旧配置缺少 `execution.analysis` 时稳定 fallback。

## 约束

- 不在当前仓库主动重启服务或安装系统依赖。
- 不把 boundary 做成无法被用户 override 的硬编码。

## 需求

- 新增 interaction mode 和 boundary config。
- 更新 config spec/schema/defaults。
- 更新 agent/platform guidance。

## 预期测试

- `node --test core/test/*.test.js`
- config normalization tests。
- OpenCode artifact guidance tests。
- `git diff --check`

## 预期产出

- schema/config updates
- docs/spec updates
- tests for mode/boundary behavior
