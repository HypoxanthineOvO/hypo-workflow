# M10 - Interactive Configuration TUI and Read-Only Progress Dashboard

## 需求

- Make the TUI useful for configuration management.
- Do not build a full workflow action center in C5.
- Support editing global defaults and current project `.pipeline/config.yaml` through interactive controls.
- Provide diff preview, schema validation, confirmation, and clear global-vs-project target selection.
- Preserve or add a read-only progress/dashboard view for phase, next action, lease, recent events, derived health, and active config summary.

## 设计输入

- D-20260503-15 TUI decision.
- Audit finding M-08 and status/lease/sync/docs policy decisions.
- Existing dashboard, setup, config spec, and TUI status code.

## 执行计划

1. Inspect current dashboard/TUI/setup/config helpers and platform constraints.
2. Define the config domains editable in TUI: platform, model/model pool, approval, sandbox, plan mode, interaction depth, watchdog, compact, sync, docs automation, lifecycle defaults, output language/timezone, and subagent defaults.
3. Define target selection: global defaults vs current project config.
4. Implement or adapt TUI controls with diff preview and schema validation.
5. Ensure invalid values are rejected before writes.
6. Ensure protected lifecycle files are not modified by config TUI.
7. If changes affect adapters/platform artifacts, suggest or trigger safe `/hw:sync --light`.
8. Add read-only progress/dashboard summary tied to the canonical status model.

## 预期测试

- Config write fixtures validate schema and reject invalid values before writing.
- Global vs project target selection cannot silently write the wrong file.
- Protected lifecycle files are not modified by config TUI.
- Adapter-affecting changes produce sync guidance.
- Read-only progress dashboard renders phase, next action, lease, recent events, derived health, and active config summary from the canonical status model.

## 预期产出

- Interactive config TUI flow/components or CLI TUI helpers.
- Updated dashboard/setup/config specs.
- Config validation and no-protected-write tests.
- Read-only progress dashboard updates.

## 约束

- Do not implement start/resume/accept/reject/sync/repair action dispatch in TUI for C5.
- Do not silently change global defaults when the user intended project config, or vice versa.
- Do not bypass schema validation.
