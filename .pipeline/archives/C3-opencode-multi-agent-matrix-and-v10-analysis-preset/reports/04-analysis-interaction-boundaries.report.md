# M05 / F002 — Analysis Interaction Model and Boundaries Report

## 结果

- Result: pass
- Diff score: 2
- Code quality: 4

## 完成内容

- 新增 Analysis interaction normalization：
  - `DEFAULT_ANALYSIS_INTERACTION`
  - `normalizeAnalysisInteraction`
  - `renderAnalysisBoundaryGuidance`
- 增加默认配置：
  - `execution.analysis.interaction_mode: hybrid`
  - `manual` code changes = `deny`
  - `hybrid` code changes = `confirm`
  - `auto` code changes = `allow`
  - service restart = `confirm`
  - system dependency install = `ask`
  - network/remote resources = `manual/hybrid ask`, `auto allow`
  - destructive or external side effects = `ask`
- 扩展 `config.schema.yaml`，加入 reusable analysis interaction schema。
- 扩展 `.opencode/hypo-workflow.json` metadata，暴露 analysis boundary effective policy。
- 更新生成的 OpenCode agent guidance 和 `AGENTS.md` 模板，使 agent 能读取并执行 analysis boundary。
- 更新 `references/analysis-spec.md` 和 `references/config-spec.md`。

## 验证

- 红灯测试：
  - `node --test core/test/analysis-interaction.test.js` 初始失败，原因是 `normalizeAnalysisInteraction` 尚未导出。
- 绿灯测试：
  - `node --test core/test/analysis-interaction.test.js`：4/4 passed
  - `node --test core/test/analysis-interaction.test.js core/test/analysis-preset.test.js core/test/config.test.js core/test/commands-rules-artifacts.test.js core/test/opencode-panels.test.js core/test/profile-platform.test.js`：24/24 passed
  - `bash scripts/validate-config.sh .pipeline/config.yaml`：passed
  - YAML parse check for `config.schema.yaml`：passed
  - `git diff --check`：passed

## 已知限制

- M05 只实现配置、normalization 和 agent guidance，不执行真实服务重启、系统依赖安装或 destructive operation。
- `node --test core/test/*.test.js` 仍有 3 个旧 active fixture 失败。
- `python3 tests/run_regression.py` 当前为 58/61 passed，失败仍为 `s18-template-library`、`s49-showcase-bootstrap`、`s52-core-config-artifacts`，原因是旧场景读取 active C3 artifacts。
