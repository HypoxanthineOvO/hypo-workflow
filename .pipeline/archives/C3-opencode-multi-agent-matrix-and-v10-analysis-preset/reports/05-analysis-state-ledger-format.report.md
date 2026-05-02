# M06 / F003 — Analysis State Summary and Ledger Format Report

## 结果

- Result: pass
- Diff score: 2
- Code quality: 4

## 完成内容

- 新增 analysis ledger contract：
  - `references/analysis-ledger-spec.md`
  - canonical path: `.pipeline/analysis/<milestone-id>-analysis-ledger.yaml`
  - required evidence fields and `environment_snapshot` minimum fields
- 扩展 `references/state-contract.md`，新增 `prompt_state.analysis_summary`，并明确 `state.yaml` 不保存完整 hypotheses / experiments / observations。
- 扩展 `references/analysis-spec.md`，把 analysis ledger 与 state summary 边界接入 analysis preset。
- 新增 core analysis helpers：
  - `analysisLedgerPath`
  - `validateAnalysisLedger`
  - `buildAnalysisStateSummary`
  - ledger required-field constants
- 增强 `parseYaml`，支持 `- id: ...` 形式的 object arrays，使 ledger fixtures 可解析。
- 新增 ledger fixture 和当前 M06 runtime ledger：
  - `core/test/fixtures/analysis/M06-analysis-ledger.yaml`
  - `.pipeline/analysis/M06-analysis-ledger.yaml`

## 验证

- 红灯测试：
  - `node --test core/test/analysis-state-ledger.test.js` 初始失败，原因是 `analysisLedgerPath` 等 API 尚未导出，且 ledger spec 尚不存在。
- 绿灯测试：
  - `node --test core/test/analysis-state-ledger.test.js`：3/3 passed
  - `node --test core/test/config.test.js core/test/analysis-preset.test.js core/test/analysis-interaction.test.js`：12/12 passed
  - `bash scripts/validate-config.sh .pipeline/config.yaml`：passed
  - `git diff --check`：passed

## 已知限制

- `node --test core/test/*.test.js` 当前为 94/97 passed；3 个失败仍来自 active C3 与旧 C2 artifact/fixture 断言不一致：
  - `core/test/feature-queue-metrics.test.js` 仍期望旧 `just_in_time` fixture。
  - `core/test/showcase-report-refresh.test.js` 仍读取旧 C2 prompt `19-book-report-slides-imagegen-and-showcase-packaging.md`。
  - `core/test/showcase-report-refresh.test.js` 仍期望旧 C2 report narrative marker。
- M06 只定义 ledger/state summary 形状；真实 experiment execution 语义由 M07 继续补齐。
