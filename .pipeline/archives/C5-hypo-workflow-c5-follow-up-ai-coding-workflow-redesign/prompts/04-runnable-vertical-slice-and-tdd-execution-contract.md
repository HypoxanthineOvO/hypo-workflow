# M05 - Runnable Vertical Slice and TDD Execution Contract

## 需求

- Encode engineering fundamentals into Decompose, prompt templates, and TDD semantics.
- Replace user-facing “tracer bullet” terminology with “runnable vertical slice”.
- Prefer narrow end-to-end behaviors over horizontal schema/core/docs-only milestones.
- Tighten the TDD preset to one behavior at a time: failing test, minimal implementation, refactor/cleanup, and real feedback.
- Clarify that Compact is recovery/index context, not a substitute for stable prompt/design artifacts.

## 设计输入

- Matt Pocock article decisions captured in D-20260503-04.
- D-20260503-05 terminology correction.
- Existing `plan/PLAN-SKILL.md`, `references/tdd-spec.md`, prompt templates, and compact rules.

## 执行计划

1. Audit current Decompose and prompt-generation rules for horizontal slicing incentives.
2. Update planning language to use “runnable vertical slice”.
3. Add Decompose checks that flag pure DB/API/UI/schema-only splits when they do not produce a runnable behavior.
4. Update TDD spec and prompt templates to require one behavior per red/green/refactor loop.
5. Add prompt fields for objective, boundaries, non-goals, validation commands, evidence, and human QA expectations.
6. Update Compact guidance so Agents restart from stable artifacts instead of treating compressed conversation as design authority.
7. Add fixtures that compare weak horizontal plans against acceptable vertical-slice plans.

## 预期测试

- Decompose fixture flags horizontal-only plans as weak.
- Decompose fixture accepts a thin runnable vertical slice that touches multiple layers minimally.
- TDD prompt fixture does not batch many unrelated tests and implementation changes into one step.
- Generated prompt fixture includes non-goals and real validation evidence requirements.

## 预期产出

- Updated Plan/Decompose rules.
- Updated TDD spec and prompt templates.
- Compact guidance update.
- Vertical-slice planning fixtures/tests.

## 约束

- Do not turn Hypo-Workflow into a test runner.
- Do not require every milestone to touch every layer; require a runnable behavior when implementation is involved.
- Do not expose confusing “tracer bullet” terminology to users.
