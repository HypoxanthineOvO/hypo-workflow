# M05 Report - Claude Subagent Model Routing

## 摘要

M05 已完成 Claude Code subagent 模型路由增强：新增 `.claude/agents/hw-*.md` 生成器、`.claude/hypo-workflow-agents.json` 路由元数据、动态角色选择 helper，并把 `sync --platform claude-code` 接入 agent artifact 写入。默认映射保持用户确认的策略：docs 使用 `deepseek-v4-pro`，code/test 使用 `mimo-v2.5-pro`，report/compact 使用轻量 DeepSeek；显式 `claude_code.agents.*.model` override 会优先于 shared model pool。

## Step 状态

| Step | 状态 | 证据 |
|---|---|---|
| write_tests | done | 新增 `core/test/claude-model-routing.test.js` |
| review_tests | done | 覆盖 defaults、override、metadata、dynamic selection、user-owned conflict |
| run_tests_red | done | 初始失败：`buildClaudeAgentRoutingMetadata` 未导出 |
| implement | done | 实现 Claude agent writer、routing metadata、dynamic selection、sync integration 和 docs |
| run_tests_green | done | 聚焦测试、模型回归、Claude adapter/settings 回归、完整 core suite 和 diff check 通过 |
| review_code | done | 生成文件 marker-managed，用户自有 agent 不会被覆盖；模型路由保持声明优先 |

## 新增测试

- `core/test/claude-model-routing.test.js`
  - 默认路由保留 DeepSeek docs 与 Mimo code/test
  - agent Markdown 暴露可检查的 `model` frontmatter
  - 写入 `.claude/agents/hw-*.md` 时保留 user-owned agent，并记录 conflict
  - 显式 `claude_code.agents` override 优先
  - dynamic role selection 覆盖 docs、test、debug、report、code
  - `runProjectSync(... platform: "claude-code")` 写入 subagent artifacts 和 routing metadata

## RED

命令：

```bash
node --test core/test/claude-model-routing.test.js
```

结果：失败符合预期，原因是 `buildClaudeAgentRoutingMetadata` 尚未导出。

## GREEN

命令：

```bash
node --test core/test/claude-model-routing.test.js core/test/model-pool-actions.test.js core/test/opencode-model-matrix-docs.test.js
node --test core/test/claude-settings-sync.test.js core/test/claude-adapter-config.test.js
node --test core/test/*.test.js
git diff --check
```

结果：

- Claude model routing/model pool docs tests: 12/12 passed
- Claude settings/adapter regressions: 10/10 passed
- `core/test/*.test.js`: 242/242 passed
- `git diff --check`: passed

## 证据样例

Generated docs agent:

```yaml
name: hw-docs
model: deepseek-v4-pro
hypo_workflow_managed: true
```

Generated code agent:

```yaml
name: hw-code
model: mimo-v2.5-pro
hypo_workflow_managed: true
```

Routing metadata:

```json
{
  "source": "model_pool+claude_code",
  "routing": "declaration-first",
  "dynamic_selection": {
    "task_category": { "documentation": "docs", "implementation": "code", "testing": "test" }
  }
}
```

## 产出

- `writeClaudeCodeAgentArtifacts(outDir, options)`
- `buildClaudeAgentRoutingMetadata(config)`
- `renderClaudeCodeAgent(role, agent)`
- `selectClaudeAgentRole(context)`
- `.claude/agents/hw-{plan,code,test,review,debug,docs,report,compact}.md`
- `.claude/hypo-workflow-agents.json`
- `runProjectSync(..., { platform: "claude-code" })` now includes `claude_code_agents`
- Docs:
  - `docs/platforms/claude-code.md`
  - `references/platform-claude.md`
  - `references/config-spec.md`

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

继续 M06：实现 Claude Progress-style status surface，优先验证 Claude Code monitor 能力；如果 monitor 不足，则提供 `/hw:status`、SessionStart/Stop summary 和 dashboard guidance 等清晰 fallback。
