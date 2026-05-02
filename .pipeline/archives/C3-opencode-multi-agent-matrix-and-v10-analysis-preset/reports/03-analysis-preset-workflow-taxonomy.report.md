# M04 / F002 — Analysis Preset and Workflow Taxonomy Report

## 结果

- Result: pass
- Diff score: 2
- Code quality: 4

## 完成内容

- 新增 `references/analysis-spec.md`，定义 `analysis` 是独立 preset，不是 Test Profile。
- 定义 analysis step chain：
  - `define_question`
  - `gather_context`
  - `hypothesize`
  - `experiment`
  - `interpret`
  - `conclude`
- 新增 preset helper：
  - `PRESET_STEP_SEQUENCES`
  - `normalizePreset`
  - `stepSequenceForPreset`
- 扩展 Discover taxonomy：
  - `workflow_kind: build | analysis | showcase`
  - `analysis_kind: root_cause | metric | repo_system`
- 更新 Batch Plan artifact，使 Feature Queue 和 Markdown 预览携带 `workflow_kind` / `analysis_kind`。
- 更新 config schema 和 `scripts/validate-config.sh`，允许 `execution.steps.preset: analysis`。
- 更新 Plan Discover guidance、Progressive Discover spec、Config spec、TDD spec、Plan reference 和 Commands spec。
- 保持 Test Profile 语义不变：Preset 控制 step order，Test Profile 控制 validation policy。

## 验证

- 红灯测试：
  - `node --test core/test/analysis-preset.test.js` 初始失败，原因是 `stepSequenceForPreset` 和 analysis spec 尚不存在。
- 绿灯测试：
  - `node --test core/test/analysis-preset.test.js`：4/4 passed
  - `node --test core/test/analysis-preset.test.js core/test/progressive-discover.test.js core/test/batch-plan.test.js core/test/test-profile.test.js core/test/config.test.js`：24/24 passed
  - 临时 `preset: analysis` config 通过 `bash scripts/validate-config.sh`
  - `bash scripts/validate-config.sh .pipeline/config.yaml`：passed
  - `git diff --check`：passed

## 已知限制

- 本 Milestone 只建立 Analysis Preset core contract，不实现 interaction mode、autonomy boundary、analysis ledger 或 report/evaluation runtime。
- `node --test core/test/*.test.js` 仍有 3 个旧 active fixture 失败：
  - active C3 queue 与旧 `just_in_time` fixture 断言冲突；
  - active C3 prompts 不包含 C2 M20 showcase prompt；
  - active C3 不保留 C2 showcase report narrative fixture。
- `python3 tests/run_regression.py` 当前为 58/61 passed，失败仍为 `s18-template-library`、`s49-showcase-bootstrap`、`s52-core-config-artifacts`，原因同 active fixture 差异。
