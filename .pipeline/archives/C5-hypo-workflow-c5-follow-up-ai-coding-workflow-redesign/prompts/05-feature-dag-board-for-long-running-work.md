# M06 - Feature DAG Board for Long-Running Work

## 需求

- Upgrade Feature Queue into a Feature-level dependency DAG/board for long-running, batch, AFK, and HITL work.
- Keep ordinary AI Coding flows simple. Users should not need DAG concepts for single-feature work.
- Use Feature nodes for the first DAG design. Milestones remain serial inside each Feature by default.
- Record dependencies, gates, HITL/AFK hints, ready/blocked status, and parallel candidates.

## 设计输入

- D-20260503-02 and D-20260503-05 decisions.
- Audit findings C-02, M-02, and C-03.
- Existing Feature Queue spec and batch planning artifacts.

## 执行计划

1. Inspect current Feature Queue schema, helper code, batch plan output, status readers, and docs.
2. Define Feature DAG fields: `depends_on`, `unlocks`, `blocked_by`, `gate`, `execution_hint`, `handoff_hint`, `ready_reason`, and stable status values.
3. Add cycle detection and ready/blocked computation helpers.
4. Update batch planning to emit a Feature table and Mermaid dependency graph.
5. Update Guide so only long-running/batch/multi-feature work routes into DAG mode.
6. Update status/dashboard to show a concise board summary without overwhelming ordinary users.
7. Add fixtures for ready/blocked computation and dependency graph rendering.

## 预期测试

- DAG fixtures compute ready and blocked Features correctly.
- Dependency cycle fixture reports a clear planning error.
- Batch plan fixture renders a table and Mermaid graph.
- Ordinary single-feature plan does not require or display Feature DAG concepts.

## 预期产出

- Updated Feature Queue spec/schema helpers.
- Batch planning DAG output and tests.
- Guide/status integration for the long-running board lane.
- Documentation updates that keep DAG out of the ordinary main path.

## 约束

- Do not implement Milestone-level DAG scheduling in this version.
- Do not turn Feature DAG into an automatic runner.
- Do not make Feature Queue mandatory for ordinary `/hw:plan`.
