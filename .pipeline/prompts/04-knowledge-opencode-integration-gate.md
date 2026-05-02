# M05 / F001 - Knowledge And OpenCode Integration Gate

## 需求

- Validate F001 end to end before continuing to Global TUI.
- Use real or realistic milestone/patch flows to ensure knowledge records, compact/index generation, SessionStart context, Cycle archive hooks, and OpenCode workflow-control hooks work together.
- Stop at the F001 gate and summarize what was proven.

## 实施计划

1. Run targeted unit tests for Knowledge helpers and OpenCode hook policies.
2. Run hook script tests.
3. Run OpenCode artifact sync.
4. Execute an actual OpenCode smoke where available:
   - generated command map loads
   - protected file write is denied
   - ordinary `.pipeline` write warns or follows policy
   - permission event is recorded
   - auto-continue policy mode is visible
5. Create a real Knowledge Ledger record for the F001 work itself.
6. Regenerate knowledge compact and indexes.
7. Update `PROGRESS.md`, `log.yaml`, and relevant docs.
8. Prepare a gate summary for user confirmation before F002.

## 预期测试

- `node --test core/test/*.test.js`
- focused hook tests
- focused OpenCode artifact tests
- actual OpenCode smoke when the binary and local environment allow it

## 预期产出

- F001 gate summary in `.pipeline/reports/` or equivalent milestone report
- Knowledge record proving the mechanism is being used
- updated compact/index files
- OpenCode smoke notes

## 约束

- Do not continue into F002 until the F001 gate is confirmed.
- If actual OpenCode smoke cannot run, document the blocker and keep a fixture-backed validation trail.
