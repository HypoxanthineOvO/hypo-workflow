import test from "node:test";
import assert from "node:assert/strict";
import { parseProgressTables } from "../src/index.js";

test("parseProgressTables extracts milestone table, settings, current state, and recent timeline", () => {
  const model = parseProgressTables(`# Demo - 开发进度

> 最后更新：16:00 | 状态：执行中 | 进度：5/7 Milestone

## 当前状态

🔄 **M06 Claude Progress Status Surface** — \`write_tests\` 执行中。

## 基本设置

| 项目 | 值 |
|---|---|
| Automation | \`evaluation.auto_continue=true\`，\`batch.auto_chain=true\` |
| Safety Profiles | local \`developer\`；发布默认 \`standard\` |

## Milestone 进度

| # | Feature | Milestone | 状态 | 摘要 |
|---|---|---|---|---|
| M05 | F001 | Claude Subagent Model Routing | ✅ 完成 | agent routing 已完成 |
| M06 | F001 | Claude Progress Status Surface | 🔄 进行中 | 状态面板测试 |

## 时间线

| 时间 | 类型 | 事件 | 结果 |
|---|---|---|---|
| 16:00 | Milestone | M05 completed | 报告已生成 |
| 15:58 | Step | M05 run_tests_green | 242/242 passed |
`);

  assert.equal(model.metadata.progress, "5/7 Milestone");
  assert.match(model.current.summary, /M06/);
  assert.equal(model.settings[0].key, "Automation");
  assert.equal(model.milestones.length, 2);
  assert.deepEqual(model.milestones[1], {
    id: "M06",
    feature: "F001",
    milestone: "Claude Progress Status Surface",
    status: "🔄 进行中",
    summary: "状态面板测试",
  });
  assert.equal(model.recent_events[0].event, "M05 completed");
});

test("parseProgressTables redacts secret-looking values from rendered tables", () => {
  const model = parseProgressTables(`
## 基本设置

| 项目 | 值 |
|---|---|
| Token | OPENAI_API_KEY=sk-secret-value |

## 时间线

| 时间 | 类型 | 事件 | 结果 |
|---|---|---|---|
| 12:00 | Step | fetch | api_key: abcdefghijklmnop |
`);

  assert.equal(model.settings[0].value, "OPENAI_API_KEY=[redacted]");
  assert.equal(model.recent_events[0].result, "api_key=[redacted]");
});
