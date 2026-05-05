# M01 / F001 - Claude Adapter Contract and Config

## Objective

- Establish the Claude Code adapter contract, config schema, safety profiles, and platform capability baseline that the rest of C6 will implement.

## 需求

- Treat this as the foundation milestone for C6.
- Add first-class Claude Code adapter configuration without degrading Codex or OpenCode behavior.
- Define `developer`, `standard`, and `strict` safety profiles for Claude Code adapter behavior.
- Add or update the shared config/model role contract so Claude Code can derive role models from the same model pool used elsewhere.
- Document the Claude Code platform boundary: plugin skills drive commands; hooks reinforce lifecycle correctness; Hypo-Workflow is not a runner.
- Update platform capability references and user/developer docs where they describe Claude Code support.

## Boundaries

- In scope:
  - `core/src/platform/index.js`
  - `core/src/config/index.js`
  - `core/src/profile/index.js` or a shared profile helper if existing profile semantics should be generalized
  - `config.schema.yaml`
  - `references/config-spec.md`
  - `references/platform-claude.md`
  - `references/platform-capabilities.md`
  - `docs/platforms/claude-code.md`
  - focused tests under `core/test/`
- Preserve OpenCode defaults and generated artifact behavior.
- Preserve current global config migration behavior.

## Non-Goals

- Do not generate `.claude/` files yet.
- Do not implement hook scripts in this milestone.
- Do not implement `/hw:*` alias files yet.
- Do not perform marketplace publishing.

## Implementation Plan

1. Add failing tests for Claude Code config/profile defaults and platform capability exposure.
2. Review the existing OpenCode model matrix and profile defaults to avoid duplicating incompatible concepts.
3. Add a Claude Code adapter config shape with safe defaults:
   - default safety profile: `standard`
   - local developer override support: `developer`
   - strict/team profile: `strict`
   - role model mapping derived from `model_pool.roles`
4. Add config/schema validation for the new fields.
5. Update docs/specs to explain the adapter contract and lifecycle boundaries.
6. Run focused and full validation.

## 预期测试

- Config schema accepts the new Claude Code adapter fields.
- Defaults preserve current OpenCode and Codex behavior.
- `developer`, `standard`, and `strict` normalize deterministically.
- Model role defaults include docs, code/test, report/compact, and fallback role behavior.
- Platform capability matrix identifies Claude Code as plugin-skill + hooks + Claude settings.

## Validation Commands

- `node --test core/test/claude-adapter-config.test.js`
- `node --test core/test/profile-platform.test.js`
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Record red/green output for the focused config/profile tests.
- Mention any compatibility notes for existing global config files.
- Note the final normalized Claude Code defaults in the report.

## Human QA

- Confirm the new config names are understandable:
  - `developer`
  - `standard`
  - `strict`
- Confirm the docs clearly state that Hypo-Workflow is not a runner.

## 预期产出

- New or updated config/profile tests.
- Updated config schema and defaults.
- Updated platform/config documentation.
- `.pipeline/reports/00-claude-adapter-contract-and-config.report.md`
