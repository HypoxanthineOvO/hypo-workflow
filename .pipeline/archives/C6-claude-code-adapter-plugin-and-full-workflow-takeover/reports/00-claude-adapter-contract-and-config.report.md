# M01 Report - Claude Adapter Contract and Config

## 摘要

M01 已完成 Claude Code adapter 的基础合同层：新增 `claude_code` 默认配置、Claude Code 安全 profile、从共享 model pool 派生 Claude agent role 的 helper、平台能力矩阵字段，以及 schema/docs 合同说明。

## Step 状态

| Step | 状态 | 证据 |
|---|---|---|
| write_tests | done | 新增 `core/test/claude-adapter-config.test.js` |
| review_tests | done | 覆盖 defaults、profiles、model routing、platform capability、schema/docs |
| run_tests_red | done | 初始失败：`buildModelPoolClaudeAgents` 未导出 |
| implement | done | 实现配置/profile/helper/docs/schema |
| run_tests_green | done | 聚焦测试、配置校验、完整 core suite 和 diff check 通过 |
| review_code | done | 合同层改动低风险，无运行时副作用 |

## 新增测试

- `core/test/claude-adapter-config.test.js`
  - 默认 `claude_code` adapter 配置
  - `developer` / `standard` / `strict` profile normalization
  - `buildModelPoolClaudeAgents` role mapping
  - Claude Code platform capability fields
  - schema 与 Claude platform docs contract

## RED

命令：

```bash
node --test core/test/claude-adapter-config.test.js
```

结果：失败符合预期，原因是 `../src/index.js` 尚未导出 `buildModelPoolClaudeAgents`。

## GREEN

命令：

```bash
node --test core/test/claude-adapter-config.test.js
node --test core/test/profile-platform.test.js
bash scripts/validate-config.sh .pipeline/config.yaml
node --test core/test/config.test.js core/test/global-config-registry.test.js
node --test core/test/*.test.js
git diff --check
```

结果：

- `core/test/claude-adapter-config.test.js`: 5/5 passed
- `core/test/profile-platform.test.js`: 3/3 passed
- `core/test/config.test.js core/test/global-config-registry.test.js`: 10/10 passed
- `core/test/*.test.js`: 222/222 passed
- `scripts/validate-config.sh .pipeline/config.yaml`: passed
- `git diff --check`: passed

## 产出

- `DEFAULT_GLOBAL_CONFIG.claude_code`
- `buildModelPoolClaudeAgents(config)`
- `CLAUDE_CODE_PROFILE_DEFAULTS`
- `normalizeClaudeCodeProfile(input)`
- `selectClaudeCodeProfile(config)`
- Claude Code capability fields:
  - `model_routing: claude-agents-from-model-pool`
  - `settings_merge: managed-settings-local-json`
- `config.schema.yaml` 中的 `claude_code_config`
- Claude Code adapter docs in:
  - `references/config-spec.md`
  - `references/platform-claude.md`
  - `docs/platforms/claude-code.md`

## 评估

| Check | 结果 |
|---|---|
| tests_pass | pass |
| no_regressions | pass |
| matches_plan | pass |
| code_quality | pass |

- `diff_score`: 1
- `code_quality`: 4
- `test_coverage`: 1
- `complexity`: 2
- `architecture_drift`: 1
- `overall`: 2

## 后续

继续 M02：在现有 Claude plugin/Skill 基础上生成 `/hw:*` 轻量 alias，并补齐 marketplace-ready package validation。
