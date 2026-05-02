# M03 / F001 - Knowledge Hook Integration

## 结果

通过。

## 交付内容

- `hooks/session-start.sh` 注入 Knowledge compact 和六类 index，默认不读取 raw records。
- `hooks/stop-check.sh` 新增 `knowledge-ledger-self-check` strict gate。
- 新增内置规则 `rules/builtin/knowledge-ledger-self-check.yaml`，同步 recommended/strict/minimal preset。
- 更新 Cycle archive 规则，要求 archive 写 `knowledge-summary.md` 且不移动 `.pipeline/knowledge/`。
- 更新 Compact 规则，纳入 `.pipeline/knowledge/knowledge.compact.md`。
- 新增 `core/test/knowledge-hooks.test.js` 和 s50 回归同步。

## 验证

- `node --test core/test/knowledge-hooks.test.js core/test/knowledge-ledger.test.js`：11/11
- `node --test core/test/*.test.js`：116/116
- `bash tests/scenarios/v8.4/s50-rules-system/run.sh`
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `claude plugin validate .`
- `.opencode/hypo-workflow.json` JSON parse
- `git diff --check`

## 评估

- `diff_score`: 3
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

OpenCode workflow-control hook policy functions仍留给 M04；M03 只处理 Claude hook shell 层、规则和生命周期文档。
