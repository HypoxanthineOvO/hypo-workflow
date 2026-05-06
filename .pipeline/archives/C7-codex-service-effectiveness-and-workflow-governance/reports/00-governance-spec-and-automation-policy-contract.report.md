# M01 Report - Governance Spec and Automation Policy Contract

## 摘要

M01 已完成自动化策略与平台能力合同：新增 `automation` policy 默认值、schema 合同、normalize helper、第三方 IDE capability target，并把 Codex Subagent 合同明确限制在 Codex/GPT runtime worker 范围内。

## Step 状态

| Step | 状态 | 证据 |
|---|---|---|
| write_tests | done | 新增 config/profile focused tests，先红后绿 |
| review_tests | done | Subagent review 返回必测断言、schema 缺口和错误假设清单 |
| run_tests_red | done | 初始失败：缺少 `normalizeAutomationPolicy`、third-party capabilities、Codex runtime contract |
| implement | done | 更新 config defaults/schema、platform capabilities、Codex/config refs |
| run_tests_green | done | focused tests、log evidence、config validation 通过 |
| review_code | done | 检查 hard gates、Codex/GPT 限制、third-party target 文档和生命周期日志状态 |

## 关键变更

- `core/src/config/index.js`
  - 新增 `automation.level=balanced`
  - 新增 `manual/balanced/full` 三档及中文标签
  - 新增 `normalizeAutomationPolicy`
  - 强制 planning 与 destructive/external gates 保持 `confirm`
  - 固定 `automation.codex.external_model_routing=false`
- `core/src/platform/index.js`
  - Codex `subagents` 改为 `codex-gpt-runtime`
  - 新增 Cursor/Copilot/Trae capability entries
- `config.schema.yaml`
  - 新增 automation schema
  - v11.0.0 global config version 可通过 schema
- `references/config-spec.md`
  - 记录 automation policy 与 legacy `evaluation.auto_continue`、`batch.auto_chain`、`opencode.auto_continue` 的兼容关系
- `references/platform-capabilities.md`
  - 更新为多平台 capability matrix
  - 明确 third-party adapters 是 instruction surfaces，不是 runners/hooks
- `references/platform-codex.md`
  - 明确 Codex Subagents 是 Codex/GPT runtime workers
  - 强调测试/审查与实现分离、Subagent 使用和 proposer/challenger pass

## RED

```bash
node --test core/test/config.test.js core/test/profile-platform.test.js
```

结果：失败符合预期，原因是缺少 `normalizeAutomationPolicy` export、Cursor/Copilot/Trae capability entries，以及 Codex Subagent runtime contract。

## GREEN

```bash
node --test core/test/config.test.js core/test/profile-platform.test.js core/test/log-evidence.test.js
bash scripts/validate-config.sh .pipeline/config.yaml
```

结果：17/17 focused tests passed，config validation passed。

## Full Suite Note

```bash
node --test core/test/*.test.js
```

结果：260/261 passed。唯一失败来自当前 lifecycle log 中历史状态 `prepared` 与新计划状态 `plan_confirm` 不在允许枚举内。已修正为 `completed` 与 `waiting_confirmation`，focused log evidence 随后通过。完整 suite 将在后续 Milestone 或 M07 再跑。

## Subagent / Challenger Evidence

- 使用 Subagent `019dfbcb-b5f9-7481-86fe-7e0928774e61` 做只读 focused review。
- Subagent 指出必须覆盖 hard gates、legacy auto-continue compatibility、Codex hook 降级、third-party adapter 不可冒充 runner/hook enforcer、Codex 不得引入外部模型路由。
- 本实现按该 review 补齐 schema、config spec 和 platform refs。

## 评估

| Check | 结果 |
|---|---|
| tests_pass | pass |
| no_regressions | warning |
| matches_plan | pass |
| code_quality | pass |

- `diff_score`: 1
- `code_quality`: 4
- `test_coverage`: 2
- `complexity`: 2
- `architecture_drift`: 1
- `overall`: 2

## 后续

进入 M02，强化 shared/Codex Subagent 与执行纪律指令。
