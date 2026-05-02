# M03 / F001 — Model Matrix Validation and Docs

## 实施计划

1. 汇总 M01-M02 的配置、renderer、artifact 变更。
2. 增加 scenario regression，覆盖 matrix config、sync output、agent count/model mapping、compaction target 和旧配置兼容。
3. 更新 README / OpenCode spec / parity docs，解释推荐模型矩阵和边界：
   - plan 使用高能力模型；
   - compact 使用低成本 Flash-class 模型；
   - test/code/debug/report 使用不同 role agents；
   - 哪些能力由 OpenCode 强制，哪些依赖 agent prompt discipline。
4. 检查 C3 F001 所有测试和文档一致性。
5. 为后续 Analysis Preset integration 留出 agent role 扩展说明。

## 依赖

- M01
- M02
- `README.md`
- `references/opencode-spec.md`
- `references/opencode-parity.md`
- `tests/scenarios/v9/`

## 验证点

- Scenario regression 能在没有真实 OpenCode 服务调用的情况下验证生成结果。
- 文档中的字段名、agent 名、默认值与 schema/renderer 一致。
- 不新增任何 `gate: confirm` 到 C3 queue。

## 约束

- 不在文档里承诺当前 OpenCode 无法保证的运行时调度能力。
- 不把用户私有模型配置写成发布默认。

## 需求

- 补齐 model matrix regression。
- 更新 OpenCode 使用文档。
- 记录 owner/private 推荐和 published/default 推荐的差异。

## 预期测试

- `node --test core/test/*.test.js`
- 相关 scenario `run.sh`
- `python3 tests/run_regression.py`，若耗时过长至少运行受影响 scenario 并说明未跑全集。
- `git diff --check`

## 预期产出

- scenario tests
- README/spec docs
- F001 完成报告
