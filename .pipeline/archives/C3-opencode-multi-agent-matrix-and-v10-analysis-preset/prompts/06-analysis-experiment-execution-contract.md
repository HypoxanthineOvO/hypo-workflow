# M07 / F003 — Experiment Execution Contract

## 实施计划

1. 基于 M06 ledger，定义 `experiment` step 的真实执行语义。
2. 明确 experiment 可执行动作：
   - run commands/scripts/tests/benchmarks
   - read logs/config/source
   - collect metrics and before/after data
   - add temporary instrumentation
   - modify code for fix/validation when mode permits
3. 明确受 boundary 控制的动作：
   - code changes
   - service restart
   - system-level dependency install
   - network/proxy/remote resources
   - destructive/external side effects
4. 设计 execution result 如何写入 ledger：
   - command/script
   - inputs
   - output summary
   - artifacts/evidence refs
   - metric before/after/delta
   - failure or blocked reason
5. 更新 step templates/spec，使 agent 在 `experiment` 中必须记录实验设计、执行和结果。
6. 增加 tests/fixtures，覆盖 confirmed、disproved、partial、blocked 实验结果。

## 依赖

- M05
- M06
- `references/analysis-spec.md`
- `skills/start/SKILL.md`
- `templates/tdd/`
- future `templates/analysis/`

## 验证点

- experiment 不是只写计划，必须能记录真实执行。
- `manual/hybrid/auto` 改代码行为清晰。
- temporary instrumentation 和 final fix 都能被 `code_change_refs` 追踪。
- blocked/ask/confirm 类边界能写入 ledger/report。

## 约束

- 不绕过用户确认去做系统依赖安装或服务重启。
- 不把实验失败等同于 Milestone 失败；失败可能只是证伪证据。

## 需求

- 定义 experiment execution contract。
- 更新 analysis spec 和 step guidance。
- 增加 ledger/result examples。

## 预期测试

- `node --test core/test/*.test.js`
- analysis experiment fixture tests。
- docs consistency checks。
- `git diff --check`

## 预期产出

- experiment contract docs
- ledger examples/tests
- step guidance updates
