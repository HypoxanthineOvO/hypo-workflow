# C7 Design Spec - Codex Service Effectiveness and Workflow Governance

## Product Scope

C7 upgrades Hypo-Workflow's Codex-facing and shared behavior. The Cycle focuses on stronger subagent discipline, safe automatic execution continuation, Codex-compatible preflight checks, init automation policy, third-party IDE adapter files, and Chinese-first onboarding.

## Primary Experience

1. A user installs or imports `HypoxanthineOvO/Hypo-Workflow` from any supported host.
2. The README immediately shows platform install/import paths and a shared `/hw:init -> /hw:plan -> /hw:start` quick start.
3. `/hw:init` works in non-git folders, asks for an automation level, and stores clear configuration.
4. Planning confirmations remain explicit user gates.
5. Ordinary execution continues automatically when the selected automation level allows it.
6. Codex runs stronger completion checks before ending work and records continuation state when there is more work to do.
7. Cursor, GitHub Copilot, and Trae receive generated project instruction files that point back to the repository and explain `/hw:*` usage.

## Confirmed Decisions

- Treat Codex guidance as shared/global guidance because Codex primarily consumes `SKILL.md`.
- Codex must be explicitly encouraged to use Subagents for substantial work.
- Codex delegation must keep testing/review and implementation separated when practical.
- Codex subagents should be treated as Codex/GPT runtime workers; do not require external model routing for Codex.
- Keep planning gates interactive.
- Add automation levels:
  - `manual` / 稳妥模式
  - `balanced` / 自动模式
  - `full` / 全自动模式
- Strengthen instructions and add file-backed runtime support instead of relying on instructions only.
- Preflight checks should cover protected authority files, format/schema contracts, stale derived artifacts, README freshness, output language, secret safety, and release documentation.
- Normal init must not require git; only `--import-history` remains git-bound.
- Generate third-party adapter files by default with managed blocks and user-content preservation.
- README is fully Chinese except stable terms, commands, file paths, and product names.
- Include a lightweight proposer/challenger quality pass in C7 where it naturally fits; defer a full adversarial debate framework to C8 or later.

## Gate Policy

Must ask:

- P2 milestone split confirmation.
- P4 final plan confirmation.
- Destructive commands and external side effects.
- Release tag/push unless explicitly confirmed.

Should continue automatically when safe:

- Milestone-to-milestone execution.
- Resume from continuation state.
- Safe derived artifact repair.
- Skip/defer behavior when the configured failure policy allows it.

## Third-Party Adapter Targets

| Platform | Target file | Strategy |
|---|---|---|
| Cursor | `.cursor/rules/hypo-workflow.mdc` | Project rule with managed content and install/import guidance. |
| GitHub Copilot | `.github/copilot-instructions.md` | Repository custom instructions with `/hw:*` workflow contract. |
| Trae | `.trae/rules/project_rules.md` | Conservative Markdown rule file with MCP/rules guidance and repository import path. |

## Validation Strategy

Every implementation Milestone follows TDD:

1. write tests
2. review tests
3. run red
4. implement
5. run green
6. review code and evidence

For C7, each Milestone should also apply Codex quality discipline:

- Use a Subagent for a focused test, review, docs, or challenger task when available.
- Keep implementation separate from validation.
- Record a concise reason when no Subagent is used for substantial work.
- Treat Codex Subagents as Codex/GPT runtime workers; do not add external model routing requirements for Codex.
- Use lightweight proposer/challenger checks where the Milestone changes instructions, runtime gates, adapters, or onboarding language.

Final validation must include:

- `node --test core/test/*.test.js`
- `python3 tests/run_regression.py`
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- generated adapter checks for Codex/Cursor/Copilot/Trae surfaces
- README freshness and Chinese entrypoint checks
- `git diff --check`

## Open Risks

- Codex currently lacks Claude-style Stop hooks, so continuation must combine instructions, notification hooks, and file-backed state.
- Cursor and Copilot adapter targets are well documented; Trae rules behavior is less formally specified and should stay conservative.
- README full rewrite can invalidate freshness tests unless tests and managed block behavior are updated together.
