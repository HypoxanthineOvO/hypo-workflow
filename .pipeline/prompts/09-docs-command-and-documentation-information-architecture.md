# M09 - Docs Command and Documentation Information Architecture

## 需求

- Add an explicit `/hw:docs` workflow for documentation generation, checks, repairs, and sync.
- Split documentation ownership across concise README, full user guide, developer guide, platform docs, generated references, changelog, and license.
- Keep README user-facing. It should explain what the tool is, fastest start, common workflows, examples, recovery, docs links, and license.
- Move test-running, release validation, internal architecture, adapter runtime details, and long changelog out of README main narrative.
- Release must fact-check human-readable narrative docs for stale or false claims.

## 设计输入

- D-20260503-14 docs governance decisions.
- Audit findings H-01, H-02, L-01, and L-04.
- Existing README, templates/readme-spec.md, readme freshness helper, release docs checks, command registry, and platform docs.

## 执行计划

1. Define `/hw:docs` command semantics: generate, check, repair, sync.
2. Define docs map with role, sources, managed blocks, generated references, narrative update policy, and must-not-include constraints.
3. Add generated reference targets for commands, config, state schema, platform matrix, and generated artifacts.
4. Rewrite README as a concise user entrypoint.
5. Create or refresh `docs/user-guide.md`, `docs/developer.md`, and platform docs for Codex, Claude Code, and OpenCode.
6. Ensure LICENSE exists or document the current license gap with a clear user-facing link policy.
7. Split README freshness into user-doc quality and developer/release metadata checks.
8. Add release-time narrative fact check that blocks or requests docs repair on factual drift.

## 预期测试

- README quality check rejects full test matrix, release internals, long changelog, and adapter implementation details in main narrative.
- `/hw:docs check` detects stale commands, stale platform claims, missing license links, and broken docs references.
- Managed blocks and generated references auto-refresh without silently rewriting narrative docs.
- Release fixture blocks on factual drift in narrative docs.

## 预期产出

- New `/hw:docs` skill/command and command registry entry.
- Docs map contract.
- Reworked README, user guide, developer guide, platform docs, and generated references.
- Updated README freshness and release docs fact-check tests.

## 约束

- Do not make README a developer test checklist.
- Do not silently rewrite narrative docs during sync/release.
- Do not hide docs generation inside sync or release only; docs must be an explicit workflow.
