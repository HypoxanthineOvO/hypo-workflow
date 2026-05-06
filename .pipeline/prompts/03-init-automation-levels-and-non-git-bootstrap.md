# M04 / F001 - Init Automation Levels and Non-Git Bootstrap

## Objective

Update init so normal bootstrap works without git, history import remains git-bound, and init asks for an automation level with clear Chinese labels and stable config keys.

## 需求

- Normal `/hw:init` must not require git.
- `/hw:init --import-history` must still require git and fail clearly outside git.
- Init should ask for automation level in interactive contexts:
  - 稳妥模式 (`manual`)
  - 自动模式 (`balanced`)
  - 全自动模式 (`full`)
- Store project config so later commands can resolve the automation policy.
- Keep existing rules preset interaction compatible.
- Update init docs and reference specs.
- Use a separate validation pass for init behavior so the code path that changes prompts/config is not the only judge of correctness.

## Boundaries

- In scope:
  - `skills/init/SKILL.md`
  - `references/init-spec.md`
  - `references/config-spec.md`
  - `core/src/config/index.js`
  - `config.schema.yaml`
  - init tests/scenarios
- Do not change history import splitting behavior except the error wording when non-git.
- Do not start a Cycle during init unless existing documented behavior already does so for history import.
- Do not add external model configuration to init's Codex automation prompts.

## Implementation Plan

1. Ask a test/review Subagent to inspect init edge cases and expected prompts, if available.
2. Add tests for non-git init behavior.
3. Add tests for `--import-history` non-git failure.
4. Add automation-level config defaults and interactive prompt guidance.
5. Update init skill/reference text so git is only required for history import.
6. Run a challenger pass against the three automation labels and confirm they map to stable keys.
7. Update config validation and examples.
8. Run focused and regression validation.

## 预期测试

- Init docs no longer say normal init requires git.
- History import docs still require git.
- Config schema accepts automation level.
- Invalid automation level fails.
- Existing init scenarios remain green.
- Init prompt text does not imply Codex can choose non-GPT external Subagent models.

## Validation Commands

- `node --test core/test/config.test.js`
- `python3 tests/run_regression.py`
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `git diff --check`

## Evidence

- Report the exact prompt labels.
- Report non-git init behavior and history-import failure behavior.
- Report whether test/review was separated from implementation and whether a Subagent was used.

## 预期产出

- Updated init contract and docs.
- Updated config/schema/examples.
- `.pipeline/reports/03-init-automation-levels-and-non-git-bootstrap.report.md`
