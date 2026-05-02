# M14 / F004 - `/hw:sync` Standardization

## 需求

- Add `/hw:sync` as an explicit project sync entrypoint.
- Merge semantics with existing CLI `hypo-workflow sync`.
- Provide modes:
  - `--light`
  - default standard
  - `--deep`
- SessionStart runs only a light external-change detection and prompts when needed.

## 实施计划

1. Define sync contract and command map.
2. Implement light sync:
   - refresh registry status
   - refresh knowledge index/compact when sources changed
   - detect external changes
   - report without heavy mutation
3. Implement standard sync:
   - light sync
   - OpenCode adapter sync
   - config/schema check
   - compact refresh
4. Implement deep sync:
   - standard sync
   - architecture rescan hints or refresh
   - dependency scan
5. Update CLI `sync` to share core logic where feasible.
6. Add SessionStart light check behavior.
7. Add TUI action for sync.

## 预期测试

- CLI tests for `hypo-workflow sync`.
- Command map tests for `/hw:sync`.
- Sync mode fixture tests.
- OpenCode artifact actual smoke.
- SessionStart light detection tests.

## 预期产出

- `skills/sync/SKILL.md`
- core sync helpers
- updated CLI sync path
- OpenCode command artifact
- docs and regression scenario

## 约束

- `/hw:sync` must not execute pipeline milestones.
- SessionStart light sync must avoid heavy writes.
- Deep sync must make heavier scans explicit.
