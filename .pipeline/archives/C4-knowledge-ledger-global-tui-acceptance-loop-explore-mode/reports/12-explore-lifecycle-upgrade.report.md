# M13 / F004 - Explore Lifecycle And Upgrade

## 结果

通过。

## 交付内容

- 新增 Explore lifecycle helper：
  - `listExplorations`
  - `readExploration`
  - `endExploration`
  - `archiveExploration`
  - `buildExplorePlanContext`
  - `createExploreAnalysisContext`
- `/hw:explore status` contract 可列出多个 parallel explorations，并保持各自 metadata/worktree 隔离。
- `/hw:explore end E001` 生成结构化 summary，包含 outcome、findings、changed files、commits，并写入 `exploration_end` log 与 Knowledge Ledger record。
- `/hw:explore archive E001` 默认保留 metadata、summary、branch 和 worktree；删除 worktree 必须显式确认。
- `/hw:plan --context explore:E001` context injection 已在 plan/Discover 文档中声明，并可读取 summary、notes、metadata evidence refs。
- `/hw:explore upgrade analysis E001` 生成 `.pipeline/analysis/explore-E001-context.yaml`，保留 topic、summary、hypotheses、evidence、refs、branch 和 worktree path。
- 更新 `skills/explore/SKILL.md`，补齐 status/end/archive/upgrade 生命周期语义。

## 验证

- `node --test core/test/explore-lifecycle.test.js`：4/4
- `node --test core/test/explore-contract.test.js core/test/explore-lifecycle.test.js`：7/7
- `node --test core/test/*.test.js`：152/152
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- JSON parse：`.opencode/hypo-workflow.json`、`.opencode/opencode.json`、`opencode.json`
- `git diff --check`

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

M13 没有自动合并 exploration branch，也没有默认删除 worktree。Plan/Analysis upgrade 只生成 context source，让后续 `/hw:plan` 或 analysis flow 显式消费证据。
