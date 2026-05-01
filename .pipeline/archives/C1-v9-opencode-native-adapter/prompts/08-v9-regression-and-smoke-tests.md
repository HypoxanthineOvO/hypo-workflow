# M8 — V9 回归与 Smoke Tests

## 需求

- 为 V9 主要能力补齐回归场景和 smoke tests。
- 覆盖：
  - core config/profile/artifact generation
  - CLI setup/doctor/init-project
  - OpenCode plugin scaffold
  - OpenCode command mapping 30/30
  - OpenCode agents config
  - Ask/todowrite/plan discipline
  - event handlers auto continue/context/file guard
  - full V8.4 parity command smoke
  - Codex/Claude 不退化
- 更新 `tests/run_regression.py` 场景列表。

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- `git diff --check`
- 新增 V9 场景全部通过。
- 原 V0-V8.4 场景全部通过。

## 预期产出

- `tests/scenarios/v9/s51-*` 到 `s5x-*`
- core/CLI/plugin 单元或静态测试
- regression runner 更新
- 测试文档更新

## 约束

- OpenCode runtime 不一定在 CI 可用；优先做静态、模板和 pure-function smoke。
- 测试不能依赖真实 OpenAI/OpenCode 网络服务。
- 保持测试快速，避免拖慢常规 regression。
