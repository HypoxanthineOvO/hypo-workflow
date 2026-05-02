# M09 / F003 — OpenCode Sidebar and Footer Panels

## 实施计划

1. 基于 M08 数据适配层，确认 OpenCode 1.14.30 TUI plugin API 可用 slot：`sidebar_content`、`sidebar_footer`、`home_footer`、`session_prompt_right` 等。
2. 扩展 `plugins/opencode/templates/plugin.ts` 或新增 TUI template，使生成的 `.opencode/plugins/hypo-workflow.ts` 注册 sidebar/footer UI。
3. 设计 sidebar 内容：Cycle、Feature Queue、current Feature、Milestone list、blocked/deferred、recent 10 events、duration/tokens/cost。
4. 设计 footer 内容：current step、pipeline progress、latest score、heartbeat、gate/failure、latest event。
5. 绑定刷新触发：command executed、tool after、todo updated、permission asked/replied、session idle/compacted，以及安全轮询/heartbeat。
6. 更新 artifact tests，必要时手动 smoke OpenCode。

## 依赖

- M08 status adapter。
- `.opencode/node_modules/@opencode-ai/plugin/dist/tui.d.ts`
- `plugins/opencode/templates/plugin.ts`
- `core/src/artifacts/opencode.js`
- `core/test/commands-rules-artifacts.test.js`

## 验证点

- 生成的 plugin 包含 TUI sidebar/footer 注册。
- commandMap、fileGuard、autoContinue、compact context 行为不回退。
- UI slot 不可用时有 fallback 策略记录。
- OpenCode 1.14.30 smoke notes 记录实际可用性。

## 约束

- 不在 UI 中直接修改 workflow 状态。
- 不阻塞 OpenCode 正常命令执行。
- 如果 TUI API 与类型文件不一致，优先保留数据适配层并退到可用 slot。

## 需求

- 实现 OpenCode sidebar + footer 状态面板。
- Sidebar 和 footer 分别展示不同信息：
  - sidebar 偏全局状态和历史；
  - footer 偏当前步骤、进度和最近事件。
- 支持 duration/token/cost 和 latest evaluation score。
- 生成 OpenCode artifacts 后仍保持 30 命令映射。

## 预期测试

- TypeScript syntax check 或等价生成物检查。
- Artifact tests 覆盖 plugin output。
- `node --test core/test/*.test.js`
- 手动 OpenCode smoke test：记录可用 slot、截图/说明或 blocker。

## 预期产出

- 更新的 OpenCode plugin template/generated plugin。
- OpenCode TUI status docs。
- Tests/smoke notes。
