# M18 / F008 — Test Profile Runtime for WebApp and Agent-Service

## 实施计划

1. 实现 `webapp` Profile 的运行时约束：
   - 必须走 E2E / 浏览器交互验证
   - 必须检查截图或可视结果
   - 不允许只跑 TDD 单元测试就宣称通过
2. 接入一个可复用的 WebAPP Test Skill / framework 映射位，例如 Playwright / Cypress 的实际测试落点。
3. 实现 `agent/service` Profile 的运行时约束：
   - Design 阶段必须规划 agent-friendly CLI
   - CLI 与人类 UI 共用核心接口，不允许两套核心逻辑分叉
   - 验证时 Agent 必须真实调用 CLI 跑场景
4. 将 Profile 选择与验收流程接入现有 execution / evaluation / report 路径。

## 依赖

- M17 Test Profile 合同
- `skills/start/SKILL.md`
- `skills/resume/SKILL.md`
- `references/evaluation-spec.md`
- 现有测试与文档生成 helper

## 验证点

- `webapp` Profile 会强制要求真实交互验证。
- `agent/service` Profile 会强制要求 CLI 规划与真实 CLI 调用。
- 未设置 Profile 的旧项目仍保持现有行为。
- 报告中能看出是哪个 Profile 驱动了验收方式。

## 约束

- 不在本 Milestone 实现 research 指标对比，留给 M19。
- CLI 约束强调“共用核心接口”，避免文档只停在口头要求。
- 若 repo 中没有现成 Web 测试框架，至少要给出 Skill / 接口接入点与阻塞说明。

## 需求

- 实现 `webapp` Profile runtime。
- 实现 `agent/service` Profile runtime。
- 更新执行/验收/报告接线。

## 预期测试

- `webapp` Profile 的 E2E 强制逻辑测试。
- `agent/service` Profile 的 CLI 规划与调用验证测试。
- 兼容旧 Preset 的回归测试。
- `node --test core/test/*.test.js`

## 预期产出

- Profile runtime 实现代码。
- WebApp / agent-service 验收文档与接线更新。
- 回归测试。
