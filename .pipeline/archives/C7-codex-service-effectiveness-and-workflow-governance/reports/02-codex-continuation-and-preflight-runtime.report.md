# M03 / F001 - Codex Continuation and Preflight Runtime

## 结果

通过。已新增 Codex/file-first continuation contract 与完成前 preflight runtime，使 Codex 在没有 Stop Hook 的情况下也能留下可恢复指针并在完成前做确定性自检。

## 改动

- `core/src/continuation/index.js`：新增 `.pipeline/continuation.yaml` build/read/write/resolve helpers；active continuation 优先于 generic `state.current`；`safe_resume_command` 只允许 `/hw:resume` 和文档化自然语言恢复别名。
- `core/src/preflight/index.js`：新增 `runCodexPreflight`，覆盖 protected authority writes、YAML/JSON/Markdown 格式、derived artifacts、README freshness、output language、secret markers、completion evidence、Codex notify。
- `core/src/index.js`：导出 continuation/preflight helpers。
- `hooks/codex-notify.sh`：明确 `observability, not a runner`；可读取 continuation 的 `next_action` 和 `safe_resume_command` 作为提示，但不执行恢复命令。
- `skills/start/SKILL.md`、`skills/resume/SKILL.md`、`references/commands-spec.md`、`references/platform-codex.md`：补充 continuation 优先级、preflight blocking/warning 分类、Codex notify 降级说明。
- `core/test/codex-continuation-preflight.test.js`：新增 6 个 continuation/preflight/content contract 测试。

## Subagent 使用

已使用 Subagent Beauvoir 做只读 test/review。它建议将 continuation 独立为 `.pipeline/continuation.yaml` 而不是复用 lease 或 `state.continuation`，并补充了 safe command allowlist、secret 不回显、notify not runner 等断言；实现已采纳。

## Preflight 分类

Blocking：

- protected authority writes 未经 lifecycle commit
- YAML/JSON/Markdown 关键格式错误
- secret markers
- 缺 report/progress/log completion evidence
- malformed lease / invalid resume pointer

Warning：

- stale or missing derived artifacts
- README/docs freshness gaps
- missing optional `hooks/codex-notify.sh`
- non-final output language mismatch
- adapter staleness

## 验证

- `node --test core/test/codex-continuation-preflight.test.js`：6/6 pass
- `node --test core/test/codex-continuation-preflight.test.js core/test/execution-lease.test.js core/test/sync-derived-map.test.js core/test/docs-governance.test.js`：20/20 pass
- `node --test core/test/codex-subagent-discipline.test.js core/test/config.test.js core/test/profile-platform.test.js`：16/16 pass
- `node --test core/test/*.test.js`：271/271 pass
- `python3 tests/run_regression.py`：62/62 pass
- `bash scripts/validate-config.sh .pipeline/config.yaml`：pass
- `git diff --check`：pass

## 评估

- diff_score: 2
- code_quality: 4
- test_coverage: 4
- complexity: 3
- architecture_drift: 1
- overall: 2

## 风险

当前 preflight helper 是 deterministic core API，尚未接入独立 CLI 命令；M07 做 cross-platform smoke 时应确认真实平台入口如何调用或展示这些结果。
