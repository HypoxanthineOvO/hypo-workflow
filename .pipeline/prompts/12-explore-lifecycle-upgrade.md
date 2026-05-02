# M13 / F004 - Explore Lifecycle And Upgrade

## 需求

- Complete exploration lifecycle commands:
  - status
  - end
  - archive
  - upgrade to Build Cycle context
  - upgrade to Analysis context
- Generate structured notes and summaries.
- Keep explore branches/worktrees unless deletion is explicitly confirmed.

## 实施计划

1. Implement `/hw:explore status`.
2. Implement `/hw:explore end`:
   - summarize findings
   - list changed files and commits
   - record outcome
   - update knowledge
3. Implement archive path:
   - preserve metadata and summary
   - optionally retain or delete worktree with confirmation
4. Implement upgrade to Build Cycle:
   - `/hw:plan --context explore:E001`
   - inject summary and evidence into Discover
5. Implement upgrade to Analysis:
   - create analysis context source
   - preserve hypotheses/evidence if present
6. Support multiple parallel explorations.

## 预期测试

- Explore lifecycle fixture tests.
- Summary generation tests.
- Plan context injection tests.
- Analysis context injection tests.
- Multiple exploration isolation tests.

## 预期产出

- updated explore skill/helpers
- `.pipeline/explorations/` contract docs
- context-source support in planning skills
- tests and examples

## 约束

- Do not merge exploration code into main automatically.
- Do not delete branches/worktrees without explicit confirmation.
- Keep exploration records useful even when the resulting feature is not built.
