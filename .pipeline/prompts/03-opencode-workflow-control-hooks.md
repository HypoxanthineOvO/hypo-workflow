# M04 / F001 - OpenCode Workflow-Control Hooks

## 需求

- Upgrade OpenCode plugin behavior from scaffold to usable workflow control.
- Implement safe auto-continue policy, permission.ask decisions, file guard coverage, stop-equivalent checks, and event serialization.
- Validate against official OpenCode plugin and permission APIs.

## 实施计划

1. Review local plugin types in `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts` and official OpenCode docs.
2. Extract pure policy helpers into `core/src/opencode-hooks/` or a similarly named module:
   - file guard
   - permission decision
   - auto-continue decision
   - stop-equivalent status check
   - permission event serialization
3. Support tool args including `file`, `path`, `filePath`, and common nested shapes.
4. Implement permission policy:
   - protected `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, `.pipeline/rules.yaml` deny unless explicit workflow mutation is active
   - `.pipeline/knowledge/**` allow through controlled helpers
   - `~/.hypo-workflow/worktrees/**` allow for Explore worktrees
   - `~/.hypo-workflow/secrets.yaml` deny/redact
5. Implement auto-continue policy modes:
   - `safe` for published default
   - `aggressive` for local automation
   - `ask` for strict/team
6. Implement session idle/status handling in the actual exported plugin path, not only in dead legacy scaffolding.
7. Write permission and workflow-control events to project log or a dedicated plugin event log when safe.

## 预期测试

- Pure function fixture tests for file guard, permission, auto-continue, and stop-equivalent checks.
- Generated plugin tests proving exported server hook contains runtime behavior.
- Scenario regression replacing grep-only s57 coverage with behavior checks where feasible.
- Actual OpenCode smoke checklist for command mapping, permission ask, file guard, and auto-continue.

## 预期产出

- core helper module for OpenCode hook policy
- updated `plugins/opencode/templates/plugin.ts`
- updated generated `.opencode/plugins/hypo-workflow.ts` after sync tests
- tests and docs in `references/opencode-spec.md`

## 约束

- Do not claim exact Claude Stop Hook parity if OpenCode cannot hard-block session completion.
- Prefer warning/toast/prompt and status checks for stop-equivalent behavior.
- Do not broaden default external directory access beyond HW-owned worktrees.
