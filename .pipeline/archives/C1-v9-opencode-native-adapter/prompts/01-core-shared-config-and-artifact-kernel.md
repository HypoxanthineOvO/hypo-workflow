# M1 — core/ 共享配置与产物生成内核

## 需求

- 新增平台无关 `core/`，作为确定性配置与产物生成内核。
- `core/` 不执行 pipeline step，不替 Agent plan/start/resume。
- 第一批能力：
  - global config 读写
  - profile schema 与 profile selection
  - platform capability map
  - command map
  - rules summary/config generation
  - OpenCode artifact generation API
- 提供 CLI helper，供 Codex/Claude/OpenCode 统一调用确定性逻辑。

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- `core` 单元测试：
  - 能读取/写入 `~/.hypo-workflow/config.yaml` 风格数据
  - 能解析 profile
  - 能生成 OpenCode command map
  - 能输出 rules summary
- 现有 shell helper 仍可运行，尤其 `scripts/rules-summary.sh` 不退化。

## 预期产出

- `core/`
- `core/src/config/`
- `core/src/profile/`
- `core/src/platform/`
- `core/src/commands/`
- `core/src/rules/`
- `core/src/artifacts/`
- `core/bin/hw-core`
- core package metadata 与测试
- 回归场景：`tests/scenarios/v9/s52-core-config-artifacts/`

## 约束

- 不把 HW 改成独立 runner。
- 不引入会破坏现有 shell/python 测试环境的重依赖。
- Codex / Claude Skill 仍可不用 core 直接运行；core 是共享 helper，不是硬依赖断点。
