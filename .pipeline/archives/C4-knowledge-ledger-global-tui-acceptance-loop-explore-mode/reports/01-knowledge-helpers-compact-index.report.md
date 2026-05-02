# M02 / F001 - Knowledge Helpers And Compact Index

## 结果

通过。

## 交付内容

- 扩展 `core/src/knowledge/index.js`，新增 Knowledge Ledger helper API：
  - `normalizeKnowledgeRecord`
  - `normalizeKnowledgeSourceRef`
  - `appendKnowledgeRecord`
  - `loadKnowledgeRecords`
  - `rebuildKnowledgeIndexes`
  - `renderKnowledgeCompact`
  - `rebuildKnowledgeLedger`
- 扩展 `core/test/knowledge-ledger.test.js`，覆盖 normalization、redaction、append、index、compact 和 state boundary。
- 更新 `references/knowledge-spec.md`，记录 helper API 分层和 M02/M03 边界。

## 验证

- `node --test core/test/knowledge-ledger.test.js`：8/8
- `node --test core/test/*.test.js`：113/113
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `claude plugin validate .`
- `.opencode/hypo-workflow.json` JSON parse
- `git diff --check`

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

M02 只实现 deterministic helper API 和 generated surface，不实现 hook capture 或 OpenCode SessionStart 注入；这些留给 M03/M04。
