# M03 / F001 - Claude Settings Merge and Sync

## Objective

- Implement `hypo-workflow sync --platform claude-code` with safe, idempotent `.claude/settings.local.json` merge behavior.

## 需求

- Sync should generate or refresh Claude Code project artifacts without overwriting existing `.claude/` configuration.
- The main auto-write target is `.claude/settings.local.json`.
- First mutation must create a timestamped backup.
- Re-running sync should be idempotent.
- Hypo-Workflow managed entries must be identifiable and replaceable without disturbing user entries.
- Conflicts with existing hooks, agents, plugins, or managed keys must produce a diff/conflict report rather than silent overwrite.
- Sync should surface what it changed and what needs manual confirmation.

## Boundaries

- In scope:
  - `core/src/sync/index.js`
  - Claude artifact writer from M02
  - settings merge helper
  - `.claude/settings.local.json` fixtures
  - CLI sync path if needed
  - docs for safe merge and backup behavior
- Preserve existing `sync --platform opencode` behavior.
- Preserve light/standard/deep sync semantics.

## Non-Goals

- Do not implement hook policy logic yet beyond registering placeholder hook commands.
- Do not implement status monitor behavior yet.
- Do not write user-global Claude config.
- Do not delete existing `.claude/` files.

## Implementation Plan

1. Add fixture tests for empty settings, existing user settings, existing Hypo managed block, and hook/agent/plugin conflict cases.
2. Implement a deterministic merge helper that can:
   - read missing or existing JSON
   - add plugin references
   - add hook entries
   - write managed metadata
   - preserve unrelated user entries
   - create timestamped backups
3. Wire the helper into `runProjectSync` when `platform=claude-code`.
4. Make sync result include changed files, backups, conflicts, and repair guidance.
5. Update docs and generated architecture notes.

## 预期测试

- Empty project gets `.claude/settings.local.json` and Claude adapter artifacts.
- Existing settings keep unrelated user entries.
- Existing Hypo managed entries are replaced idempotently.
- Conflicts are reported and do not silently overwrite user-owned entries.
- Backup files are created before first mutation.
- OpenCode sync tests still pass.

## Validation Commands

- `node --test core/test/claude-settings-sync.test.js`
- `node --test core/test/sync-standardization.test.js`
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Record before/after fixture snapshots.
- Record a conflict result example.
- Record backup filename format.

## Human QA

- Confirm generated settings are acceptable for local developer use.
- Confirm conflict wording clearly tells the user how to proceed.

## 预期产出

- Claude settings merge helper and tests.
- `sync --platform claude-code` integration.
- Updated sync docs.
- `.pipeline/reports/02-claude-settings-merge-and-sync.report.md`
