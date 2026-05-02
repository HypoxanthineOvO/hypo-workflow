# M12 / F005 — Queue Defaults, Auto-Continue, and Docs

## 实施计划

1. 检查 C3 active queue/config/state，确认所有 Feature 使用 `gate: auto`。
2. 更新 Feature Queue/Batch Plan docs，明确 C3 no-gate auto-chain 不是 analysis preset 的内在属性，而是本 Cycle 的 queue policy。
3. 补充 Analysis Preset 总文档：
   - preset vs Test Profile vs interaction mode；
   - state vs ledger；
   - analysis report to build follow-up；
   - manual/hybrid/auto 行为边界。
4. 增加 regression，验证：
   - C3 queue 没有 `gate: confirm`；
   - `default_gate: auto`；
   - `auto_chain: true`；
   - analysis preset/schema/templates/evaluation/planning path 均可被发现。
5. 运行 full or targeted regression，并记录未运行项原因。
6. 更新 README / CHANGELOG / release readiness notes as appropriate。

## 依赖

- M01-M11
- `.pipeline/feature-queue.yaml`
- `references/feature-queue-spec.md`
- `README.md`
- `CHANGELOG.md`
- `tests/run_regression.py`

## 验证点

- C3 没有任何 Feature gate 设置为 confirm。
- Analysis Preset 文档闭环，用户能理解如何从 analysis 进入 build follow-up。
- Existing C1/C2 behaviors remain compatible.
- Final regression produces a clear pass/fail report.

## 约束

- 不修改 compact 文件，除非用户后续明确要求。
- 不把 C3 no-gate policy 写成全局永久默认，除非 config/default 已经明确应该如此。

## 需求

- 固化 C3 queue policy。
- 补 docs/regression。
- 给出最终 C3 readiness report。

## 预期测试

- `node --test core/test/*.test.js`
- `python3 tests/run_regression.py`
- C3 queue no-confirm-gate check。
- `git diff --check`

## 预期产出

- docs updates
- regression/scenario updates
- final C3 planning/execution readiness report
