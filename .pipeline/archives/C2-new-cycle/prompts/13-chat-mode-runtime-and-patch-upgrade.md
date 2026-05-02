# M14 / F006 — Chat Mode Runtime, Recovery, and Patch Escalation

## 实施计划

1. 实现 `/hw:chat` / `/hw:chat end` 的命令行为和上下文恢复入口。
2. 让 chat 进入时重新加载 Workflow 关键上下文：`state.yaml`、`cycle.yaml`、`PROGRESS.md`、最近 report、必要日志摘要。
3. 实现 chat session 落盘：
   - 显式 `/hw:chat end` 生成摘要并写入日志
   - Stop Hook 自动判断是否需要补写摘要
   - 若未达到摘要条件，至少写入 chat entry 与修改记录
4. 实现 Patch 升级提示：
   - 基于文件数、修改规模、会话持续时长、用户显式意图等信号给出升级建议
   - 保持为提示/确认，不直接替用户开启 Patch
5. 补充回归测试，验证 chat 模式不会影响普通 `/hw:start`、`/hw:resume`、`/hw:patch`、`/hw:plan` 流程。

## 依赖

- M13 `/hw:chat` 合同
- `core/` 中现有命令 / 状态 / 日志 helper
- `hooks/`
- `.opencode/commands/`
- `.pipeline/state.yaml`
- `.pipeline/log.yaml`

## 验证点

- chat 模式可进入、可恢复、可显式退出、可异常退出后自动收尾。
- chat 模式的摘要与普通 milestone report 分离。
- Patch 升级提示不会破坏用户的轻量讨论体验。
- 未进入 chat 模式时，现有命令和 Hook 行为保持兼容。

## 约束

- 不引入新的顶层状态机类型；chat 作为现有 state 的附加段存在。
- CLI / 文档 / OpenCode 命令提示要与当前命令风格一致。
- 任何自动摘要都必须允许保底退化为仅记录 chat + 修改。

## 需求

- 实现 `/hw:chat` 与 `/hw:chat end`。
- 实现 chat 上下文恢复与异常退出自动收尾。
- 实现 chat summary / chat entry / 修改记录落盘。
- 实现 Patch 升级建议逻辑与用户提示。

## 预期测试

- chat 命令进入/退出/恢复 smoke 测试。
- Stop Hook 自动收尾测试。
- 超大修改触发 Patch 升级建议测试。
- `node --test core/test/*.test.js`

## 预期产出

- chat runtime 实现代码。
- 命令文档和状态/日志适配更新。
- 回归测试。
- 必要的使用说明或示例。
