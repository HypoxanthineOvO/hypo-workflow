# M06 / F001 - Chinese README and Platform Quick Start

## 结果

通过。README 已重写为中文优先入口，首屏包含 Hypo-Workflow 定位、`HypoxanthineOvO/Hypo-Workflow` 导入方式、六个平台入口、主执行路径和恢复路径。

## 改动

- `README.md`：改为中文首屏 Quick Start；平台入口覆盖 Codex、Claude Code、OpenCode、Cursor、GitHub Copilot、Trae；明确第三方 IDE 仅是仓库指令，不声明自动安装、钩子或生命周期强制能力。
- `core/src/readme/index.js`：README freshness 新增六平台入口、仓库导入、首屏位置、中文 prose、Codex Subagents 优先、外部模型路由禁用检查；平台显示名从 `PLATFORM_CAPABILITIES` 派生。
- `core/test/readme-update.test.js`：新增中文 Quick Start、六平台、首屏、英文叙述、Codex 外部模型路由断言。
- `templates/readme-spec.md`、`core/test/readme-spec.test.js`：README 治理契约改为中文优先和六平台入口。

## Before / After

- Before：README 已有中文基础和三平台入口，但首屏没有统一仓库导入、Cursor/Copilot/Trae 入口，也未用 freshness 强制中文首屏。
- After：首屏即说明导入仓库、两条最短路径和六平台入口；长篇内部细节继续留在 docs/reference。

## Subagent 使用

已使用 Subagent James 做只读 README 结构和措辞挑战。它指出中文严格度、Codex Subagents 优先力度、spec 滞后和 renderer 英文回流风险；实现已采纳并增加测试门。

## 验证

- `node --test core/test/readme-spec.test.js`：3/3 pass
- `node --test core/test/readme-update.test.js`：9/9 pass
- `node --test core/test/docs-governance.test.js`：5/5 pass
- `readme-freshness`：fresh true
- `node --test core/test/*.test.js`：280/280 pass
- `git diff --check`：pass

## 评估

- diff_score: 2
- code_quality: 4
- test_coverage: 4
- complexity: 2
- architecture_drift: 1
- overall: 2

## 风险

中文 prose 检查是面向 README 入口的保守启发式，不是通用自然语言检测器；它重点拦截已知会破坏中文首屏的英文叙述和 Codex 外部模型路由表述。
