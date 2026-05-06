# M02 / F001 - Codex Subagent and Execution Discipline

## Objective

Strengthen shared and Codex-facing instructions so Codex strongly prefers concrete subagent delegation, keeps testing and implementation separated, and records rationale when delegation is not used.

## 需求

- Codex service-effectiveness guidance should live in shared `SKILL.md` and Codex references where appropriate.
- Codex must be explicitly encouraged to use Subagents for non-trivial work because observed behavior improves when the prompt says so directly.
- Keep testing and implementation as separate responsibilities in execution behavior:
  - test design/review/validation should be delegated separately from implementation when subagents are available
  - implementation subagents should not be the sole validator of their own changes
  - the main agent remains responsible for integration and final judgment
- Codex subagents use Codex/GPT runtime capabilities only; do not design Codex delegation around external model routing.
- Encourage docs-specific assistance when documentation or README changes are part of the task.
- Require a short rationale when a substantial task is completed without delegation.
- Add a lightweight "left/right brain" quality pass inside this Cycle:
  - one side proposes or implements
  - another side tests, reviews, or challenges assumptions
  - the main agent resolves the result
- Defer a full adversarial multi-agent debate framework to a later Cycle unless the lightweight pass exposes a blocking design gap.
- Preserve existing Claude and OpenCode behavior.

## Execution Discipline

- For this milestone itself, use a Subagent for at least one focused review task when available.
- Keep implementation and validation separated:
  - one pass edits the instruction/spec surfaces
  - a separate pass checks that the language is enforceable and testable
- Do not configure or mention external model choices for Codex Subagents.
- If no Subagent is used, the report must state the reason.

## Boundaries

- In scope:
  - `SKILL.md`
  - `skills/start/SKILL.md`
  - `skills/resume/SKILL.md`
  - `skills/patch/SKILL.md`
  - `references/subagent-spec.md`
  - `references/platform-codex.md`
  - relevant generated platform docs
  - tests or fixtures that assert instruction content
- Do not add new runtime continuation files in this milestone.
- Do not require subagents for trivial one-file tasks.

## Implementation Plan

1. Ask a review/test Subagent to critique the current delegation language and list enforceable assertions, if a Subagent is available.
2. Add failing tests or fixture checks for required subagent-discipline language.
3. Update shared execution guidance:
   - split testing and implementation roles
   - explicitly tell Codex to use Subagents for substantial tasks
   - prefer docs assistance for README/docs work
   - add a lightweight proposer/challenger quality pass where useful
   - record executor/subagent evidence in reports
4. Update Codex-specific fallback guidance:
   - prefer available Codex subagents
   - do not mention non-GPT/external model selection for Codex
   - use explicit self-execution fallback when delegation is unavailable
5. Add report requirements for non-delegation rationale.
6. Ensure Claude/OpenCode instructions remain compatible and not weakened.
7. Run focused and full validation.

## 预期测试

- Skill/spec quality tests detect the new subagent guidance.
- Codex guidance explicitly requires separating test/review work from implementation work where practical.
- Codex guidance does not imply external model routing.
- Subagent spec still accepts `codex`, `claude`, and `auto` aliases.
- No command map or generated artifact count regresses.

## Validation Commands

- `node --test core/test/skill-spec.test.js`
- `node --test core/test/commands-rules-artifacts.test.js`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Report which instruction surfaces changed.
- Report how trivial-task fallback is preserved.
- Report how test/implementation separation is represented.
- Report whether the lightweight proposer/challenger quality pass was added and where.
- Report whether a Subagent was used during this milestone; if not, include the reason.
- Include any test gaps if instruction content has limited direct coverage.

## 预期产出

- Stronger shared/Codex subagent discipline.
- Updated subagent references.
- `.pipeline/reports/01-codex-subagent-and-execution-discipline.report.md`
