# M02 Report - Plugin Skill Alias and Marketplace Package

## 摘要

M02 已完成 Claude Code plugin alias/package 增强：新增 Claude alias artifact writer，生成 36 个 `skills/hw-*` thin wrapper skill，保留现有 `/hypo-workflow:*` skills 作为权威实现，并刷新 `.claude-plugin/plugin.json` 与 `.claude-plugin/marketplace.json` metadata。

复查时对照 Claude Code 官方插件文档，修正了 alias 输出位置：插件组件应位于 plugin root，因此 alias 生成到根 `skills/` 目录，而不是 `.claude-plugin/skills/`。

## Step 状态

| Step | 状态 | 证据 |
|---|---|---|
| write_tests | done | 新增 `core/test/claude-plugin-alias.test.js` |
| review_tests | done | 覆盖 alias delegation、plugin metadata、marketplace metadata、docs contract |
| run_tests_red | done | 初始失败：`renderClaudeCodeAliasSkill` 未导出 |
| implement | done | 实现 `core/src/artifacts/claude.js` 并生成 36 个 alias skills |
| run_tests_green | done | 聚焦测试、Skill 质量门、Claude plugin validate、完整 core suite 和 diff check 通过 |
| review_code | done | Alias 保持 thin wrapper；metadata 可验证；OpenCode artifact regression 未受影响 |

## 新增测试

- `core/test/claude-plugin-alias.test.js`
  - `renderClaudeCodeAliasSkill` 生成 thin wrapper
  - `writeClaudeCodePluginArtifacts` 写入 root `skills/hw-*` alias 与 `.claude-plugin` metadata
  - Claude platform docs 说明 `/hw:*` alias 不替代 `/hypo-workflow:*`
- `core/test/skill-quality.test.js`
  - 本地 Skill 总数更新为原有 37 个加 36 个 Claude alias wrapper

## RED

命令：

```bash
node --test core/test/claude-plugin-alias.test.js
```

结果：失败符合预期，原因是 `renderClaudeCodeAliasSkill` / Claude alias artifact writer 尚未实现导出。

## GREEN

命令：

```bash
node --test core/test/claude-plugin-alias.test.js core/test/commands-rules-artifacts.test.js core/test/skill-quality.test.js
claude plugin validate .
node --test core/test/*.test.js
git diff --check
```

结果：

- `core/test/claude-plugin-alias.test.js core/test/commands-rules-artifacts.test.js core/test/skill-quality.test.js`: 11/11 passed
- `claude plugin validate .`: passed
- `core/test/*.test.js`: 225/225 passed
- `git diff --check`: passed

## 产出

- `core/src/artifacts/claude.js`
  - `claudeCodeAliasName(command)`
  - `renderClaudeCodeAliasSkill(command)`
  - `writeClaudeCodePluginArtifacts(outDir, options)`
  - `renderClaudeCodePluginManifest(options)`
  - `renderClaudeCodeMarketplaceManifest(options)`
- `skills/hw-*/SKILL.md`: 36 个 Claude Code alias wrapper
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- Docs:
  - `docs/platforms/claude-code.md`
  - `references/commands-spec.md`

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

继续 M03：实现 `sync --platform claude-code` 的安全 `.claude/settings.local.json` merge、备份、冲突报告和自动写入入口，为 hooks、agents 和状态 surface 后续接入打底。
