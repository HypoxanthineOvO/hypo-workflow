# M04 / F002 — Analysis Preset and Workflow Taxonomy

## 实施计划

1. 阅读 `references/tdd-spec.md`、`references/test-profile-spec.md`、`references/progressive-discover-spec.md`、`skills/plan-discover/SKILL.md`、`core/src/progressive-discover/index.js` 和 config schema。
2. 新增 `references/analysis-spec.md`，定义 `analysis` 是 preset，不是 Test Profile。
3. 定义 step chain：
   - `define_question`
   - `gather_context`
   - `hypothesize`
   - `experiment`
   - `interpret`
   - `conclude`
4. 定义 planning taxonomy：
   - `workflow_kind: build | analysis | showcase`
   - `analysis_kind: root_cause | metric | repo_system`
5. 更新 schema/spec/docs，使 `execution.steps.preset` 支持 `analysis`，并保持 `tdd / implement-only / custom` 兼容。
6. 先写 tests，证明 preset selection、taxonomy docs、legacy behavior 都正确。

## 依赖

- F001 完成后当前 config/test baseline 应为绿色
- `references/tdd-spec.md`
- `references/test-profile-spec.md`
- `references/progressive-discover-spec.md`
- `config.schema.yaml`
- `core/src/test-profile/index.js`
- `core/src/progressive-discover/index.js`

## 验证点

- `analysis` 作为 preset 被明确列入 spec/schema。
- Test Profile 仍是 validation policy，不和 preset 混淆。
- `analysis_kind` 能覆盖 root-cause、metric/research、repo/system analysis。
- 旧项目 preset 仍正常。

## 约束

- 本 Milestone 不实现完整 runtime ledger，只建立 core contract。
- 不把 analysis 简化成 `implement-only` 的别名。

## 需求

- 新增 analysis spec。
- 扩展 preset/taxonomy schema。
- 更新 Plan Discover guidance。
- 增加兼容测试。

## 预期测试

- `node --test core/test/*.test.js`
- 新增 preset/taxonomy tests。
- `git diff --check`

## 预期产出

- `references/analysis-spec.md`
- schema/spec/runtime helper 更新
- tests 更新
