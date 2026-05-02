# M10 / F003 - Patch Acceptance

## 结果

通过。

## 交付内容

- 新增 Patch acceptance helper：
  - `readPatch`
  - `requestPatchAcceptance`
  - `acceptPatch`
  - `rejectPatch`
  - `buildPatchFixContext`
- Patch metadata 支持：
  - `status: open | pending_acceptance | closed | rejected`
  - `iteration`
  - `acceptance_requested_at`
  - `accepted_at`
  - `rejection_refs`
- `/hw:patch accept P001` 和 `/hw:patch reject P001 "feedback"` 已写入 `skills/patch/SKILL.md`。
- rejected Patch 会重新打开、递增 iteration、写入 `.pipeline/patches/feedback/*.yaml`，并保留 `rejection_refs`。
- repeated rejection 到 iteration 3 起给出升级 Cycle 建议。
- Patch fix context 会读取 `rejection_refs`，为下一轮轻量修复注入结构化反馈。
- Patch acceptance helper 不写 `.pipeline/state.yaml`，保持 Patch lane 独立于 Milestone/TDD pipeline。

## 验证

- `node --test core/test/patch-acceptance.test.js`：3/3
- `node --test core/test/*.test.js`：141/141
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh`
- `claude plugin validate .`
- `opencode debug config`
- JSON parse：OpenCode JSON 和 CLI package lock
- `git diff --check`

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

Patch acceptance 不新增顶层 slash command；它扩展现有 `/hw:patch` 子命令语义。Patch fix 仍然是轻量 lane，不启动 Plan Discover，不走完整 TDD，不写 `state.yaml`，不生成 Milestone report。
