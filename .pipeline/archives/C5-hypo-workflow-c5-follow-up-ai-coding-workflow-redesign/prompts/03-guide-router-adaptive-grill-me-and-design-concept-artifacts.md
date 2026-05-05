# M03 - Guide Router, Adaptive Grill-Me, and Design Concept Artifacts

## 需求

- Upgrade `/hw:guide` into an intent router that recommends one next path based on project state and user intent.
- Upgrade Plan Discover with adaptive Grill-Me: start with broad questions, then escalate to design-concept alignment only when risk warrants it.
- Add durable design concept artifacts:
  - `.pipeline/design-concepts.yaml` for machine-readable concepts.
  - `.pipeline/glossary.md` for human-readable terms, examples, non-examples, and common misunderstandings.
- Keep discussion, decisions, glossary, architecture, prompt inputs, and Knowledge Ledger indexes as separate layers.

## 设计输入

- D-20260503-05 and D-20260503-06 discussion decisions.
- Audit finding C-02 and M-02.
- Existing Guide, Plan Discover, Knowledge Ledger, and architecture contracts.

## 执行计划

1. Inspect current `skills/guide/SKILL.md`, Plan Discover rules, command specs, and Knowledge Ledger helpers.
2. Define Guide routing inputs: current Cycle state, lifecycle phase, continuation, dirty worktree, lease/lock state, rejected work, batch intent, patch/explore suitability, and docs/config/sync intent.
3. Define routing outputs: ordinary plan, deep Grill-Me plan, batch/DAG plan, follow-up plan, patch, explore, resume/revision, sync/repair, docs, config TUI.
4. Update Plan Discover rules to decide light vs deep Grill-Me after the broad initial questions.
5. Add design concept and glossary artifact schemas/templates.
6. Ensure confirmed decisions are indexed by Knowledge Ledger without copying full artifact bodies into every context.
7. Add fixtures for common routing and Discover paths.

## 预期测试

- Guide routes ordinary plan, follow-up plan, batch/DAG, patch, explore, rejected Cycle revision, stale lease recovery, docs, and config TUI intents.
- Low-risk task uses light Discover; architecture-shaping task enters Grill-Me.
- Design concepts/glossary artifacts are generated or updated without replacing Knowledge Ledger or `.pipeline/architecture.md`.
- Output language remains zh-CN for user-facing prompts.

## 预期产出

- Updated Guide and Plan Discover skill contracts.
- `.pipeline/design-concepts.yaml` and `.pipeline/glossary.md` schemas/templates or examples.
- Guide router fixtures/tests.
- Knowledge Ledger indexing guidance for design decisions.

## 约束

- Do not force deep Grill-Me for every small task.
- Do not introduce a monolithic repo-root `CONTEXT.md` as the new source of truth.
- Do not let raw conversation become authoritative without confirmed decision extraction.
