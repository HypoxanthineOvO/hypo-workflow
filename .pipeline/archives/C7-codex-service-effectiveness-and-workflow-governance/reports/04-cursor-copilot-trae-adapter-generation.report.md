# M05 / F001 - Cursor Copilot Trae Adapter Generation

## 结果

通过。Cursor、GitHub Copilot、Trae 三类第三方 IDE 的仓库级规则适配器已落地，并接入 `sync --platform cursor|copilot|trae`。适配器只声明 repository instructions，不夸大自动安装、Hook 或 lifecycle enforcement 能力。

## 改动

- `core/src/artifacts/third-party.js`：新增第三方适配器生成器、managed block 合并、平台选择和 Cursor `.mdc` frontmatter。
- `core/src/sync/index.js`、`core/src/index.js`：接入并导出 `writeThirdPartyAdapterArtifacts`；`runProjectSync` 可按平台写入目标规则文件。
- `core/test/platform-adapters.test.js`：覆盖三平台文件生成、保守文案、Codex/GPT runtime 约束、managed block 用户内容保留、平台选择写入。
- `core/src/docs/index.js`、`docs/platforms/{cursor,copilot,trae}.md`、`docs/reference/platforms.md`、`docs/reference/generated-artifacts.md`：补充第三方平台 guide 和派生产物引用。
- `cli/bin/hypo-workflow`：`sync` 帮助文本展示 `cursor|copilot|trae`。

## 平台适配目标

- Cursor: `.cursor/rules/hypo-workflow.mdc`
- GitHub Copilot: `.github/copilot-instructions.md`
- Trae: `.trae/rules/project_rules.md`

## Subagent 使用

已使用 Subagent Archimedes 做只读文案/边界审查。审查建议要求避免 `auto-install`、`guaranteed hook`、`lifecycle enforcement` 等夸大表达，并把 README 首屏共享 repo import 入口留到 M06；实现和测试已采纳。

## 验证

- `node --test core/test/sync-standardization.test.js`：4/4 pass
- `node --test core/test/platform-adapters.test.js`：3/3 pass
- `node --test core/test/*.test.js`：278/278 pass
- `git diff --check`：pass

## 评估

- diff_score: 2
- code_quality: 4
- test_coverage: 4
- complexity: 2
- architecture_drift: 1
- overall: 2

## 风险

第三方 IDE 的真实读取/采纳行为依赖宿主产品能力，当前交付的是仓库级规则文件和同步生成能力，不包含平台原生 Hook 或安装器。README 首屏中文 Quick Start 将在 M06 统一处理。
