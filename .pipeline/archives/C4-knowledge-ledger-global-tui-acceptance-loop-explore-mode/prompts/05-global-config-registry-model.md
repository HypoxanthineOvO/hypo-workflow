# M06 / F002 - Global Config And Registry Model

## 需求

- Extend global configuration for model pool, fallback chains, project registry, acceptance defaults, knowledge defaults, sync defaults, and OpenCode profile defaults.
- Implement lazy migration for existing `~/.hypo-workflow/config.yaml`.
- Add project registry persistence under `~/.hypo-workflow/projects.yaml`.

## 实施计划

1. Extend config specs and defaults:
   - `model_pool.roles.plan`
   - `model_pool.roles.implement`
   - `model_pool.roles.review`
   - `model_pool.roles.evaluate`
   - `model_pool.roles.chat`
   - fallback chains for each role
   - `acceptance.mode`
   - `knowledge.*`
   - `sync.*`
2. Define mapping from model pool roles to OpenCode agent matrix.
3. Add lazy migration helpers:
   - read old config without rewriting
   - on save, create timestamped backup
   - write merged new shape
4. Add project registry helpers:
   - project ID
   - display name
   - path
   - platform/profile summary
   - current Cycle and pipeline status
   - open patch count
   - acceptance state
5. Update CLI `init-project` or `/hw:init` integration so initialized projects register automatically.

## 预期测试

- Config default tests.
- Lazy migration fixture tests.
- Registry read/write tests.
- Project ID stability tests.
- Model pool to OpenCode matrix mapping tests.

## 预期产出

- updated `core/src/config/`
- new registry/model-pool helpers
- updated `config.schema.yaml`
- updated `references/config-spec.md`
- tests for migration and registry behavior

## 约束

- Do not eagerly rewrite user global config during ordinary reads.
- Preserve existing profiles.
- Keep project config override behavior intact.
