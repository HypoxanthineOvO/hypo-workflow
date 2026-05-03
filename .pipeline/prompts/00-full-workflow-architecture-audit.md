# M01 / F001 - Full Workflow Architecture Audit

## 需求

- Run a full-repository Hypo-Workflow architecture audit as the first milestone of C5.
- Treat this milestone as analysis work, not repair work.
- Produce `.pipeline/audits/audit-001.md` as the primary deliverable.
- Cover code, documentation, `.pipeline` lifecycle artifacts, skills/adapters, generated artifacts, and tests.
- Use first principles and a critical design review posture. If a core assumption is weak, say so directly and propose replacement-level architecture options.
- Do not implement fixes in this milestone. Candidate remediation work belongs in a later Plan cycle after manual acceptance of the audit report.

## 审计原则

Use these first principles as the baseline:

1. Workflow state must be single-source, recoverable, and auditable.
2. Documentation, command contracts, generated adapters, and implementation must make the same promises.
3. Codex, OpenCode, and Claude Code support must not depend on undocumented semantic drift.
4. Automation must explain failure and must not hide side effects.
5. Security and user-decision boundaries must be explicit.
6. Status surfaces must tell a user what happened and what to do next.
7. Tests must protect real user workflows, not only isolated helper functions.

## 审计范围

Review at least these areas:

- Lifecycle/state: Cycle, Feature, Milestone, Patch, accept/reject, archive, state, log, progress, reports, and queue consistency.
- Architecture/contracts: architecture baseline, command specs, config specs, state/log schemas, generated artifacts, and runtime contracts.
- Platform parity: Codex, OpenCode, and Claude Code command behavior, adapter generation, model/agent routing, ask/question/todowrite semantics, and analysis boundaries.
- Security/secrets: debug output, redaction, Knowledge Ledger records, config handling, logs, generated artifacts, and user-facing docs.
- Testing/regression: unit tests, regression scenarios, fixture coverage, smoke commands, and missing end-to-end workflow checks.
- Docs/user guidance: README, setup/help skills, command maps, release docs, and stale version/platform instructions.
- UX/TUI/status: global TUI, dashboard/status surfaces, action labels, acceptance/explore/sync visibility, and whether a user can recover from confusing states.
- Maintainability: duplicated contracts, implicit conventions, cross-language drift, generated-vs-source ownership, and hard-to-evolve boundaries.

## 执行计划

1. Inventory repository structure, tracked/untracked `.pipeline` artifacts, generated adapters, skills, docs, and tests.
2. Map the intended architecture from README, `SKILL.md`, `references/`, `.pipeline/architecture.md`, skill files, and generated OpenCode artifacts.
3. Map the implemented architecture from `core/`, `plugins/`, scripts, tests, generated fixtures, and command routing.
4. Compare state/log/progress/feature queue/cycle artifacts for lifecycle consistency, especially C4 archive to C5 active transition.
5. Compare platform contracts across Codex, OpenCode, and Claude Code surfaces.
6. Review security boundaries, especially secret redaction, debug/config output, logs, and Knowledge Ledger records.
7. Run allowed local validation commands and record exact commands and outcomes.
8. Classify findings by severity and by type: mandatory fix vs architecture/productization recommendation.
9. For every Medium or higher finding, include file evidence, impact, a user-centered usage example, recommended handling, and a candidate follow-up Plan bucket.
10. For every High or Critical finding, include a reproduction path or verification command.
11. Write `.pipeline/audits/audit-001.md` and stop for manual acceptance.

## 分级规则

- Critical: can corrupt workflow state, leak secrets, or make normal recovery impossible.
- High: can mislead users, break core workflow commands, invalidate platform parity, or create serious operational risk.
- Medium: creates real user confusion, stale contract drift, weak coverage, or maintainability risk likely to affect future work.
- Low: localized inconsistency, minor documentation drift, or narrow quality issue.
- Info: useful context, positive evidence, or non-blocking observation.

Each Medium or higher finding must include:

- severity
- category
- type: mandatory_fix or architecture_recommendation
- evidence with file paths and commands where applicable
- why it matters
- user impact example
- recommendation
- candidate follow-up Plan bucket

Each High or Critical finding must additionally include:

- reproduction steps or verification command
- acceptance criteria for the eventual fix

## 允许的验证

Allowed without additional confirmation:

- local tests
- regression scripts
- config/schema validation
- JSON/YAML parsing
- generated artifact dry-run or sync smoke that stays inside project/local config boundaries
- local help/status/debug inspection when output is summarized safely
- `git diff --check`

Requires explicit confirmation before use:

- network or remote resources
- service restarts
- system-level dependency installation
- destructive commands
- commands with external side effects
- commands that would print secrets into a persistent/public report

## 预期产出

- `.pipeline/audits/audit-001.md`
- A concise validation command list inside the report.
- A follow-up Plan candidate section that groups findings into possible future milestones.
- A manual acceptance checklist at the end of the report.

## 约束

- Do not repair audited issues in this milestone.
- Do not rewrite protected workflow files except for lifecycle bookkeeping that the user has explicitly accepted.
- Do not include raw secret values in the report, logs, Knowledge Ledger, or generated artifacts.
- Prefer evidence over speculation. When making an inference, label it as an inference.
