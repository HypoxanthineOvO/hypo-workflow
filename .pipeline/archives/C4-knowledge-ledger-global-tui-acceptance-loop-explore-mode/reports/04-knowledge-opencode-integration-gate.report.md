# M05 / F001 - Knowledge And OpenCode Integration Gate

## 结果

通过，且按 gate 约束暂停在 F002 之前，等待用户确认。

## 交付内容

- 新增 `core/test/knowledge-opencode-gate.test.js`，覆盖真实 F001 gate Knowledge record、compact/index 输出、OpenCode permission/auto-continue policy smoke。
- 写入真实 Knowledge Ledger 记录：
  - `.pipeline/knowledge/records/C4-M05-f001-knowledge-and-opencode-integration-gate-18c2eaab.yaml`
- 重建 Knowledge Ledger 生成物：
  - `.pipeline/knowledge/knowledge.compact.md`
  - `.pipeline/knowledge/index/*.yaml`
- 执行 `hypo-workflow sync --platform opencode --project .`，将 OpenCode sidecar 恢复为 standard/safe policy：
  - `.opencode/hypo-workflow.json` 显示 `profile=standard`、`auto_continue.mode=safe`
  - `opencode.json` 和 `.opencode/opencode.json` 对 `edit` / `bash` 使用 `ask`
- 加固 `tests/scenarios/v9/s61-opencode-model-matrix-sync/run.sh`，避免回归测试读取真实 HOME 下的用户全局模型配置。

## 验证

- `node --test core/test/knowledge-opencode-gate.test.js`：2/2
- `node --test core/test/*.test.js`：122/122
- `bash tests/scenarios/v9/s57-opencode-events-auto-continue-file-guard/run.sh`
- `bash tests/scenarios/v8.4/s50-rules-system/run.sh`
- `bash tests/scenarios/v9/s61-opencode-model-matrix-sync/run.sh`
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `claude plugin validate .`
- OpenCode JSON parse：`.opencode/hypo-workflow.json`、`opencode.json`、`.opencode/opencode.json`
- `opencode debug config`：本机 OpenCode 可加载 plugin，`edit`/`bash` 为 `ask`
- policy smoke：protected `.pipeline/state.yaml` 为 `deny`，Knowledge path 为 `allow`，ordinary `.pipeline/config.yaml` 为 `ask`，permission event redaction 通过
- `git diff --check`

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 2
- `architecture_drift`: 1
- `overall`: 1

## 备注

Gate 发现并修复了一处运行态不一致：`current` 已进入 M05，但 `prompt_state` 仍残留 M04 review 状态。已在继续前修复 state / PROGRESS / lifecycle log。

按 M05 约束，本轮不自动进入 F002。下一步需要用户确认 F001 gate 后，再从 M06 / F002 继续。
