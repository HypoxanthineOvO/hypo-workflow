# M02 / F001 - Plugin Skill Alias and Marketplace Package

## Objective

- Enhance the existing Claude Code plugin package with thin `/hw:*` skill aliases and marketplace-ready metadata without forking the existing `/hypo-workflow:*` skills.

## 需求

- Keep existing `/hypo-workflow:*` skills as the authoritative implementation.
- Generate lightweight `/hw:*` alias skills for high-frequency and canonical commands.
- Alias skills must load and delegate to the matching existing Hypo-Workflow skill semantics.
- Avoid duplicated business logic in alias files.
- Harden `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` so `claude plugin validate .` passes.
- Add docs explaining that `/hw:*` is a convenience alias and `/hypo-workflow:*` remains valid.

## Boundaries

- In scope:
  - `.claude-plugin/`
  - new Claude artifact rendering helper if needed
  - `core/src/commands/index.js`
  - `core/src/artifacts/` Claude package writer
  - skill packaging tests
  - `references/commands-spec.md`
  - `docs/platforms/claude-code.md`
- Existing Codex skill files should not be rewritten.
- Existing OpenCode command generation should remain unchanged.

## Non-Goals

- Do not implement settings merge yet.
- Do not implement hooks yet.
- Do not add model routing agents yet.
- Do not publish the marketplace package.

## Implementation Plan

1. Add failing tests that assert Claude alias artifacts map canonical `/hw:*` commands to existing skill files.
2. Decide the alias artifact layout accepted by Claude Code plugin validation.
3. Implement alias rendering as a generated adapter artifact, not hand-maintained duplicated prompts.
4. Update plugin and marketplace metadata only as needed for validation and clear packaging.
5. Add validation around alias count, command mapping consistency, and non-duplication of core instructions.
6. Run `claude plugin validate .` and record the result when available.

## 预期测试

- Each generated `/hw:*` alias points to the matching existing skill.
- Alias text does not redefine workflow rules beyond a short delegation instruction.
- Plugin metadata stays valid JSON and includes marketplace-ready fields.
- `claude plugin validate .` passes or, if the local CLI is unavailable, the report states the local blocker and keeps schema/JSON checks green.

## Validation Commands

- `node --test core/test/claude-plugin-alias.test.js`
- `node --test core/test/commands-rules-artifacts.test.js`
- `claude plugin validate .`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Record generated alias paths and a sample alias body.
- Record plugin validation output or explicit local CLI unavailability.
- Record that OpenCode command artifact tests still pass.

## Human QA

- Confirm alias naming feels natural in Claude Code.
- Confirm the docs make it clear that `/hw:*` is an alias, not a separate workflow implementation.

## 预期产出

- Claude alias generation tests.
- Generated or source alias artifacts.
- Updated `.claude-plugin` metadata.
- Updated Claude platform docs.
- `.pipeline/reports/01-claude-plugin-skill-alias-and-marketplace-package.report.md`
