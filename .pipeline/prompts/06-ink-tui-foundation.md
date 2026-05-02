# M07 / F002 - Ink TUI Foundation

## 需求

- Add an Ink-based true terminal UI for global Hypo-Workflow management.
- `hypo-workflow` with no command and `hw` alias should enter the TUI when global config exists.
- Provide a usable first version with project list, status overview, navigation, and read-only detail panels.

## 实施计划

1. Add and lock the Ink dependency in the appropriate CLI package context.
2. Add CLI entry routing:
   - first run still creates config
   - subsequent no-command invocation opens TUI
   - `hw` alias works when installed or linked
3. Build TUI screens:
   - home/project registry
   - project detail
   - global config summary
   - model pool summary
   - sync/actions menu
4. Reuse deterministic registry/status helpers from core.
5. Keep TUI side effects explicit and confirm destructive or heavy actions.

## 预期测试

- CLI routing tests.
- TUI render smoke tests.
- Snapshot or text output tests where practical.
- Dependency lock validation.
- Manual smoke: open TUI, move between screens, view a project.

## 预期产出

- Ink TUI source under `cli/` or `core/cli` as appropriate
- package metadata and lockfile updates
- README/CLI docs update
- tests for no-command behavior

## 约束

- Do not use Python Textual unless Node TUI becomes clearly unsuitable.
- Do not run pipeline execution from the TUI.
- Keep scriptable CLI subcommands available.
