# M07 - Layered Global Sync and Derived Artifact Map

## 需求

- Upgrade `/hw:sync` into a layered global sync command.
- Preserve existing `--light` behavior for config, registry, adapter, context, Knowledge index, and compact refresh.
- Add authority/derived map checks and safe derived artifact refresh for declared derived views.
- Respect protected authority boundaries for `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, and `.pipeline/rules.yaml`.

## 设计输入

- D-20260503-08 sync decision.
- Audit findings C-03 and M-03.
- Existing sync skill, compact skill, OpenCode adapter generation, README freshness, and status/check behavior.

## 执行计划

1. Inventory authoritative files, derived views, generated references, and refresh triggers.
2. Define a derived artifact map contract with authority, derived_from, writer commands, refresh triggers, staleness severity, and repair behavior.
3. Keep `/hw:sync --light` compatible with current config/registry/adapter/context refresh.
4. Add standard sync checks for declared stale derived artifacts.
5. Add safe refresh for PROGRESS, metrics mirrors, compact views, PROJECT-SUMMARY, OpenCode status inputs, generated references, and managed doc blocks.
6. Add `--check-only` and `--repair` or `--deep` semantics.
7. Ensure authority conflicts route to repair/confirmation instead of being guessed.
8. Update check/status to surface derived health.

## 预期测试

- Sync light preserves current adapter/context behavior.
- Standard sync detects and refreshes stale PROGRESS, metrics mirrors, compact, PROJECT-SUMMARY, OpenCode status inputs, and managed doc blocks.
- Check-only mode reports stale artifacts without writing.
- Authority conflict fixture reports repair needed without mutating protected files.
- Existing sync and OpenCode generation tests continue to pass.

## 预期产出

- Derived artifact map contract and examples.
- Updated sync/check/status behavior.
- Drift fixture regression.
- Documentation of sync modes and protected-file boundaries.

## 约束

- Do not make sync a runner.
- Do not casually mutate protected authority files.
- Do not remove existing adapter/config/context refresh behavior.
