# M04 / F001 - OpenCode Workflow-Control Hooks

## 结果

通过。

## 交付内容

- 新增 `core/src/opencode-hooks/index.js`，实现 OpenCode workflow-control 纯策略：
  - `collectOpenCodeToolPaths`
  - `evaluateOpenCodeFileGuard`
  - `decideOpenCodePermission`
  - `shouldOpenCodeAutoContinue`
  - `isOpenCodeStopEquivalent`
  - `serializeOpenCodePermissionEvent`
- `writeOpenCodeArtifacts` 生成 `.opencode/runtime/hypo-workflow-hooks.js`。
- OpenCode plugin template 改为导入 runtime helper，并在 `permission.ask`、`tool.execute.before`、auto-continue 和 stop-equivalent status 路径使用。
- 同步生成 `.opencode/plugins/hypo-workflow.ts` 和 `.opencode/runtime/hypo-workflow-hooks.js`。
- 更新 `references/opencode-spec.md` 和 s57 回归场景。

## 验证

- `node --test core/test/opencode-hooks.test.js core/test/commands-rules-artifacts.test.js core/test/opencode-panels.test.js`
- `node --test core/test/*.test.js`：120/120
- `bash tests/scenarios/v9/s57-opencode-events-auto-continue-file-guard/run.sh`
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

OpenCode 无 Claude Stop Hook 的完全等价能力；M04 将 stop-equivalent 定义为 idle/status 策略、permission 决策和日志事件，不宣称硬阻断 session completion。
