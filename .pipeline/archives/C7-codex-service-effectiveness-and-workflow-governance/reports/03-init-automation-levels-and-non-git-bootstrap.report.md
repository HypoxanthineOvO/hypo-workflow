# M04 / F001 - Init Automation Levels and Non-Git Bootstrap

## 结果

通过。普通 init/CLI bootstrap 已明确支持非 Git 目录，history import 仍是 Git-bound；init 自动化档位以中文标签展示、以稳定 key 写入项目配置。

## 改动

- `skills/init/SKILL.md`、`references/init-spec.md`、`references/commands-spec.md`：明确 normal `/hw:init` does not require git；`/hw:init --import-history` requires git；新增三档自动化提示。
- `cli/bin/hypo-workflow`：`init-project` 支持 `--automation manual|balanced|full`，非交互默认 `balanced`，项目配置只写 `automation.level`。
- `core/src/config/index.js`：`release_publish` 与 planning/destructive_external 一样强制保持 `confirm`，全自动也不能降级发布 Gate。
- `scripts/validate-config.sh`：新增 `automation.level` 校验。
- `cli/README.md`：补充 `init-project --automation` 用法和非 Git bootstrap 说明。
- `core/test/init-automation-contract.test.js`、`core/test/config.test.js`：覆盖非 Git init、稳定 key 写入、非法 level、validator、release gate。
- `tests/scenarios/v11/s63-init-automation-non-git/`、`tests/run_regression.py`：新增真实 regression 场景。

## 自动化标签

- 稳妥模式 (`manual`)
- 自动模式 (`balanced`)
- 全自动模式 (`full`)

## Subagent 使用

已使用 Subagent Boole 做只读 test/review。它指出 release publish gate、项目配置瘦身、validator 覆盖三个缺口；实现已全部采纳并回归通过。

## 验证

- `node --test core/test/config.test.js core/test/init-automation-contract.test.js`：11/11 pass
- `bash tests/scenarios/v11/s63-init-automation-non-git/run.sh`：pass
- `node --test core/test/*.test.js`：275/275 pass
- `python3 tests/run_regression.py`：63/63 pass
- `bash scripts/validate-config.sh .pipeline/config.yaml`：pass
- `git diff --check`：pass

## 评估

- diff_score: 2
- code_quality: 4
- test_coverage: 4
- complexity: 2
- architecture_drift: 1
- overall: 2

## 风险

真实 `/hw:init --import-history` 仍主要由 Skill 文档和历史 regression 约束；当前没有独立 runner 去实际执行 import-history。普通 init 和 CLI bootstrap 的非 Git 路径已有可执行测试。
