# M01 / F001 - Governance Spec and Automation Policy Contract

## Objective

Define the shared C7 contract for automation levels, gate behavior, Codex continuation, preflight checks, and third-party adapter targets.

## 需求

- Add a stable automation-level contract:
  - `manual` / 稳妥模式
  - `balanced` / 自动模式
  - `full` / 全自动模式
- Preserve hard planning gates.
- Define which execution gates can auto-continue under each level.
- Define Codex continuation and preflight responsibilities without pretending Codex has Claude-style Stop hooks.
- Define Codex Subagent policy:
  - Codex should be explicitly encouraged to use Subagents for substantial tasks.
  - Testing/review and implementation should be assigned to separate roles where practical.
  - Codex Subagents use Codex/GPT runtime capabilities; do not introduce external model routing requirements for Codex.
- Define the lightweight proposer/challenger quality pass as a shared execution pattern.
- Define adapter targets for Cursor, GitHub Copilot, and Trae.
- Keep the contract portable across Codex, Claude Code, OpenCode, and third-party IDE surfaces.

## Boundaries

- In scope:
  - `core/src/config/index.js`
  - `config.schema.yaml`
  - `references/config-spec.md`
  - `references/commands-spec.md`
  - `references/platform-capabilities.md`
  - `references/platform-codex.md`
  - focused tests under `core/test/`
- Do not implement full runtime continuation yet.
- Do not rewrite README yet.
- Do not generate third-party adapter files yet.
- Do not add a full debate framework in C7; only define the lightweight proposer/challenger pattern.

## Implementation Plan

1. Ask a test/review Subagent to inspect this prompt and identify missing contract assertions before implementation, if a Subagent is available.
2. Add failing tests for automation-level normalization and gate-policy defaults.
3. Add failing fixture/spec checks for Codex Subagent policy wording and no external model routing.
4. Add or update config defaults/schema for automation policy using stable internal keys.
5. Document gate semantics:
   - planning confirmation always asks
   - destructive/external side effects ask
   - ordinary execution can continue when configured
6. Document Codex hook limitations and the planned file-backed continuation/preflight strategy.
7. Document the lightweight proposer/challenger pattern:
   - proposer writes the contract or implementation
   - challenger checks missing cases and risky assumptions
   - main agent resolves conflicts and records the decision
8. Document third-party adapter targets and managed-block expectations.
9. Run focused validation, then broader config/platform tests.

## 预期测试

- Default config resolves to a conservative but useful automation policy.
- `manual`, `balanced`, and `full` normalize deterministically.
- Invalid automation levels fail schema/config validation.
- Planning gates are never downgraded by full automation.
- Codex Subagent policy says to strongly prefer Subagents for substantial work.
- Codex policy says testing/review is separate from implementation where practical.
- Codex policy does not require external model routing.
- Platform capability docs list Cursor, Copilot, and Trae adapter target files.

## Validation Commands

- `node --test core/test/config.test.js`
- `node --test core/test/profile-platform.test.js`
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Record red/green focused test output.
- Note final automation-level config shape in the report.
- Note how proposer/challenger is defined without becoming a full C8 debate framework.
- Note any compatibility migration for existing global configs.

## 预期产出

- Updated config/schema/spec contract.
- Updated platform capability references.
- `.pipeline/reports/00-governance-spec-and-automation-policy-contract.report.md`
