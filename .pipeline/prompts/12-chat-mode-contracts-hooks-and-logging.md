# M13 / F006 — Chat Mode Contracts, Hooks, and Logging

## 实施计划

1. 为 `/hw:chat` 定义轻量追加对话模式合同，明确它与 Cycle / Milestone / Patch 的边界。
2. 在 `state.yaml` 设计 `chat:` 结构，至少覆盖 active、session_id、started_at、last_activity_at、summary_policy、related_cycle、recent_files 等恢复所需字段。
3. 定义 `.pipeline/log.yaml` 中 `type: chat_entry` / `chat_session` 的写入规范，以及 `PROGRESS.md` 中 `💬 Chat` 时间线条目的展示规则。
4. 设计 SessionStart / Stop Hook 的增强判断：
   - 无 active Milestone 时提示用户可进入 `/hw:chat`
   - `chat.active == true` 时自动恢复 chat 上下文
   - Stop Hook 在 chat 模式下判断是否需要自动摘要落盘
5. 约束 chat 模式下的修改升级策略：支持显式结束落摘要、Hook 自动判断是否生成摘要、否则至少记录 chat + 修改痕迹。

## 依赖

- `skills/start/SKILL.md`
- `skills/resume/SKILL.md`
- `references/commands-spec.md`
- `references/state-contract.md`
- `.pipeline/state.yaml`
- `.pipeline/log.yaml`
- `.pipeline/PROGRESS.md`

## 验证点

- `state.yaml` 的 `chat:` 结构不会破坏现有 Cycle / Milestone / Patch 状态机。
- chat 日志与普通 milestone report 分流，避免混入 Milestone 完整报告语义。
- Hook 增强复用现有 SessionStart / Stop Hook，不新增新的 Hook 类型。
- “只记录 chat+修改” 与 “生成 session 摘要” 两种落盘路径边界清晰。

## 约束

- 不在本 Milestone 直接实现全部命令；先把合同、状态字段、日志格式、Hook 边界说清楚。
- `/hw:chat` 的用户可见说明必须保持中文骨架，保留 English technical terms。
- 超过一定规模的修改只要求给出升级 Patch 的判断接口或启发式，不在本 Milestone 固定死单一阈值。

## 需求

- 新增 `/hw:chat` 设计合同。
- 新增 `state.yaml.chat` 数据结构设计。
- 新增 `chat_entry` / `chat_session` 日志规则。
- 新增 `PROGRESS.md` 中 Chat 时间线展示规则。
- 新增 Hook 联动判断规范与 Patch 升级策略说明。

## 预期测试

- 合同文档中明确列出 `/hw:chat` 进入、恢复、结束、异常退出四种路径。
- `rg` 检查 chat 状态字段、日志类型、Hook 判断条件、Patch 升级边界都已落入文档或 schema 说明。
- 设计中明确说明 chat 模式不替代 Patch / Cycle。

## 预期产出

- `/hw:chat` 合同文档或规范更新。
- `state.yaml.chat` 字段设计说明。
- chat 日志 / PROGRESS 展示规则。
- Hook 联动与 Patch 升级策略说明。
