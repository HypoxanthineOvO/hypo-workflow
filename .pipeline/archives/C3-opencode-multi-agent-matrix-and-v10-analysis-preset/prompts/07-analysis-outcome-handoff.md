# M08 / F003 — Outcome Semantics and Follow-up Handoff

## 实施计划

1. 基于 M06-M07，定义 hypothesis status 和 milestone outcome 的完整语义。
2. 固化 hypothesis statuses：
   - `pending`
   - `confirmed`
   - `disproved`
   - `partial`
3. 固化 analysis milestone outcomes：
   - `confirmed`
   - `partial`
   - `disproved`
   - `inconclusive`
   - `blocked`
4. 明确 outcome 与 auto-chain 的关系：
   - confirmed/partial/disproved/inconclusive 是 analysis 可完成终态；
   - blocked 才表示需要停止或等待外部条件；
   - disproved hypothesis 不应中断 Milestone。
5. 定义 follow-up proposal 结构，使 analysis report 可以转成后续 Build Cycle 输入。
6. 定义同 Milestone fix/validate 规则：
   - manual: only report/proposal
   - hybrid: proposal then confirmation before changes
   - auto: may patch and validate directly
7. 更新 report/evaluation/state/queue docs，保持 outcome 命名一致。

## 依赖

- M05
- M06
- M07
- `references/feature-queue-spec.md`
- `references/evaluation-spec.md`
- `references/progress-spec.md`

## 验证点

- `disproved` 不被 batch failure policy 当成 failed Feature。
- outcome 枚举在 state、ledger、report、evaluation 中一致。
- follow-up proposal 具有足够信息生成后续 build Milestone。
- code-change validation 只在确实改代码时要求。

## 约束

- 不把所有 inconclusive 结果都自动标 blocked。
- 不强制所有 fix 都另开 Build Cycle；按 mode 和 boundary 决定。

## 需求

- Outcome semantics spec。
- Follow-up proposal schema。
- Queue/evaluation/report 关系说明。

## 预期测试

- `node --test core/test/*.test.js`
- outcome fixture tests。
- docs/spec enum consistency checks。
- `git diff --check`

## 预期产出

- analysis outcome docs
- follow-up proposal examples
- tests/fixtures
