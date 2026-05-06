# M05 / F001 - Cursor Copilot Trae Adapter Generation

## Objective

Generate first-class project instruction files for Cursor, GitHub Copilot, and Trae so third-party IDEs can import the repository and learn Hypo-Workflow usage.

## 需求

- Add platform adapter generation targets:
  - Cursor: `.cursor/rules/hypo-workflow.mdc`
  - GitHub Copilot: `.github/copilot-instructions.md`
  - Trae: `.trae/rules/project_rules.md`
- Use managed blocks and preserve user-owned content where feasible.
- Each adapter should teach:
  - install/import repository `HypoxanthineOvO/Hypo-Workflow`
  - Hypo-Workflow is not a runner
  - `.pipeline/` is source of truth
  - `/hw:init`, `/hw:plan`, `/hw:start`, `/hw:resume`, `/hw:status`
  - protected files and preflight expectations
  - substantial Codex work should use Subagents when available, with testing/review separate from implementation
- Add platform capability metadata and docs.
- Use a docs/review Subagent to challenge adapter wording where available; these files are instructions, so wording quality is part of correctness.

## Boundaries

- In scope:
  - `core/src/artifacts/` new or extended platform adapter helpers
  - `core/src/sync/index.js`
  - `core/src/platform/index.js`
  - `docs/platforms/`
  - `docs/reference/platforms.md`
  - generated artifact references
  - tests under `core/test/`
- Do not implement IDE-specific plugin marketplaces unless official, stable behavior exists.
- Treat Trae conservatively because public rule syntax is less formal.
- Do not claim Cursor/Copilot/Trae can enforce hooks or lifecycle state unless the adapter actually implements that behavior.
- Do not mention external model routing for Codex Subagents.

## Implementation Plan

1. Ask a docs/review Subagent to review target adapter wording and platform-specific risks, if available.
2. Add failing artifact generation tests for Cursor/Copilot/Trae.
3. Implement shared managed-block renderer.
4. Implement platform-specific artifact renderers.
5. Add sync support for `--platform cursor`, `--platform copilot`, and `--platform trae` if the sync command model supports platform selection.
6. Run a challenger pass against generated content to catch false capability claims.
7. Preserve existing OpenCode/Claude artifact behavior.
8. Update docs/reference platform matrix.
9. Run focused and full validation.

## 预期测试

- Cursor output has valid `.mdc` frontmatter or conservative format accepted by docs.
- Copilot output writes `.github/copilot-instructions.md`.
- Trae output writes conservative Markdown rules.
- Existing user content outside managed blocks is preserved.
- Re-running sync is idempotent.
- Generated adapter text includes Subagent/test-implementation separation guidance without overclaiming enforcement.

## Validation Commands

- `node --test core/test/sync-standardization.test.js`
- `node --test core/test/platform-adapters.test.js`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Include generated file paths.
- Include managed-block preservation behavior.
- Note Trae documentation limitations and conservative strategy.
- Include wording-review/challenger findings for false claims or unsupported platform behavior.

## 预期产出

- Cursor/Copilot/Trae adapter generation.
- Updated platform docs and generated artifact references.
- `.pipeline/reports/04-cursor-copilot-trae-adapter-generation.report.md`
