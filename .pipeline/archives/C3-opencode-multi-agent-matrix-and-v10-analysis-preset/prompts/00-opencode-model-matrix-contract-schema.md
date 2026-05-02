# M01 / F001 — Matrix Contract and Schema

## 实施计划

1. 阅读 `references/opencode-spec.md`、`references/config-spec.md`、`config.schema.yaml`、`core/src/config/index.js`、`core/src/artifacts/opencode.js` 和现有 OpenCode tests。
2. 定义 OpenCode agent model matrix 的配置表面，覆盖 plan、compact、test、code-a、code-b、debug/review、report 等角色。
3. 定义 agent-level compaction 配置，至少支持有效上下文目标约 900K tokens，并保留平台不支持时的降级说明。
4. 明确 project config 与 global config 的合并顺序，以及非 OpenCode 平台的兼容行为。
5. 先写 schema/default/config tests，再实现 schema/default/normalization。
6. 更新 spec/docs，明确哪些路由由 OpenCode artifact 保证，哪些仍属于 prompt discipline。

## 依赖

- `references/opencode-spec.md`
- `references/config-spec.md`
- `config.schema.yaml`
- `core/src/config/index.js`
- `core/src/artifacts/opencode.js`
- `core/test/*.test.js`

## 验证点

- 新 matrix 配置可以表达 GPT-5.5 planning、Flash-class compaction、test/code/debug/report 分工。
- 缺省配置不破坏现有 C1/C2 config。
- 非 OpenCode 平台不会因为 matrix 字段产生行为变化。
- 当前 active `.pipeline/config.yaml` 在 schema 扩展后仍可解析。

## 约束

- Hypo-Workflow 仍然是 setup/sync 层，不直接调用模型。
- 不把 provider API key 或具体私密 endpoint 写入项目默认配置。
- 不把 OpenCode runtime 不支持的能力伪装成已强制执行。

## 需求

- 扩展配置 schema 与 config normalization。
- 定义 OpenCode agent/model matrix 和 compaction contract。
- 增加覆盖 matrix 默认值、override、兼容性的测试。

## 预期测试

- `node --test core/test/*.test.js`
- 新增或更新 OpenCode config/schema 测试。
- `git diff --check`

## 预期产出

- 更新 `config.schema.yaml`
- 更新 `core/src/config/index.js`
- 更新 OpenCode/config references
- 新增或更新 tests
