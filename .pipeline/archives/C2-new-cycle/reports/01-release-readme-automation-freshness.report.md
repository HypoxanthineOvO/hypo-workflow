# 执行报告：M02 / F001 — Release README Automation and Freshness Rule

## 概要

- Prompt：01 — Release README Automation and Freshness Rule
- 开始时间：2026-05-01T02:27:00+08:00
- 完成时间：2026-05-01T02:52:00+08:00
- 结果：pass
- Diff Score：1/5

## 变更

- 新增 `core/src/readme/index.js`，提供 README block rendering、marker replacement、`updateReadme` 编排 helper 和 `checkReadmeFreshness`。
- 导出 README helper 到 `core/src/index.js`。
- 增加 `release.readme.mode` 和 `release.readme.full_regen` 默认配置、schema 和 config spec。
- 更新 `/hw:release` skill/spec/OpenCode command guidance，加入 `update_readme` 和 `readme-freshness`。
- 新增 `rules/builtin/readme-freshness.yaml`，并加入 recommended/strict/minimal presets。
- 对 `README.md` 做最小 freshness 修正：release 描述明确包含 `tag` 和 `push`。

## 测试结果

- RED 阶段：目标测试按预期失败，原因是 README helper、release guidance 和 release.readme defaults 尚未实现。
- GREEN 阶段：
  - `node --test core/test/*.test.js` — 17/17 passed
  - `node --input-type=module ... checkReadmeFreshness("README.md")` — fresh=true
  - YAML parse：config schema、readme-freshness rule、presets、state/log 通过
  - `git diff --check` — passed for M02 files
- 回归问题：无

## 代码审查

- 质量评分：4/5
- 发现的问题：无阻塞问题。
- 架构差异：新增 README helper 是 release/check 工具体系能力，不执行 git release，不替代 Agent runner；OpenCode command guidance 与 generator 保持一致。

## 评估

- tests_pass：pass
- no_regressions：pass
- matches_plan：pass
- code_quality：pass
- 总体 diff_score：1/5
- 决策：继续 M03

## 下一步

执行 M03：审计 Skill 资产，创建 `references/skill-spec.md`，记录当前问题和平台映射关系，不合并或删除 Skill。
