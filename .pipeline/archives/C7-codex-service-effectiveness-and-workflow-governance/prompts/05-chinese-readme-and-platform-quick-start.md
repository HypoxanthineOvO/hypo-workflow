# M06 / F001 - Chinese README and Platform Quick Start

## Objective

Rewrite README as a Chinese-first user entrypoint with all platform install/import paths and Quick Start at the top.

## 需求

- README must be fully Chinese except stable terms, paths, commands, and product names.
- The first screen must show:
  - what Hypo-Workflow is
  - install/import repository `HypoxanthineOvO/Hypo-Workflow`
  - platform-specific entry points for Codex, Claude Code, OpenCode, Cursor, GitHub Copilot, and Trae
  - `/hw:init -> /hw:plan -> /hw:start`
  - `/hw:status -> /hw:resume`
- Keep README concise; move long internals to docs.
- Update README freshness checks so they validate the Chinese entrypoint and platform coverage.
- Preserve version/license/platform badge correctness.
- README should include the high-level quality rule: non-trivial Codex work should use Subagents where available, while testing/review stays separate from implementation.
- Use a docs/review Subagent to challenge README structure and wording if available.

## Boundaries

- In scope:
  - `README.md`
  - `core/src/readme/index.js`
  - `core/src/docs/index.js`
  - `templates/readme-spec.md` if present
  - docs references that describe README policy
  - README tests
- Do not include long release history in README.
- Do not remove links to full docs.
- Do not put detailed internal test checklists in README.
- Do not describe external model selection for Codex Subagents.

## Implementation Plan

1. Ask a docs/review Subagent to propose a concise README structure and identify wording risks, if available.
2. Add failing README freshness tests for Chinese entrypoint and six platform entries.
3. Update README renderer/checker to understand the new structure.
4. Rewrite README in Chinese.
5. Run a challenger pass against the first screen:
   - can a user install/import quickly?
   - are all six platforms visible?
   - is `/hw:init -> /hw:plan -> /hw:start` obvious?
   - is the text too long?
6. Update docs policy to keep README concise and platform-first.
7. Run README-focused and full validation.

## 预期测试

- README contains Codex, Claude Code, OpenCode, Cursor, GitHub Copilot, and Trae top-level entries.
- README contains shared repository install/import wording.
- README contains Quick Start and resume flow.
- README freshness no longer expects old English-first wording.
- README does not include internal implementation checklists.
- README mentions Subagent/test separation at the product-guidance level without turning into an implementation manual.

## Validation Commands

- `node --test core/test/readme-spec.test.js`
- `node --test core/test/readme-update.test.js`
- `node --test core/test/docs-governance.test.js`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Include before/after README structure summary.
- Include freshness checker output.
- Include docs/review or challenger findings for README clarity.

## 预期产出

- Chinese-first README.
- Updated README freshness tests and docs.
- `.pipeline/reports/05-chinese-readme-and-platform-quick-start.report.md`
