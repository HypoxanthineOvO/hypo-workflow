# V5 Self-Bootstrap Report

## Summary

This report records the first manual simulation of `/hw:plan` while implementing V5 itself.

## Checklist

- [x] Plan Mode 的四阶段是否顺畅？
  Discover → Decompose → Generate → Confirm can be simulated cleanly once the planning artifacts live beside the main skill.
- [x] Design Spec 模板是否覆盖了足够的信息？
  Mostly yes. It covers goals, constraints, context, testing, and milestone strategy.
- [x] Milestone 拆分粒度是否合适？
  Yes. `M0-M4` kept command routing, planning flow, review flow, and template library separated enough to review.
- [x] Prompt 模板格式是否好用？
  Yes for markdown-first planning. It is lightweight and compatible with the existing pipeline prompt shape.
- [x] Plan Review 的手动模拟中发现了什么问题？
  The system needs an explicit prompt-patch approval step; silent downstream edits would be risky.
- [x] 追加模式的设计是否合理？
  Reasonable, but numbering-conflict handling and merge strategy should stay explicit.

## What Worked

- The existing `.pipeline/` workflow was reusable for self-bootstrap.
- Progressive Disclosure extends naturally to a planning sub-skill.
- Architecture tracking fits cleanly as a post-milestone review instead of a replacement for V4 evaluation.

## Friction Found

1. `.pipeline/` is both a runtime workspace and a self-hosted planning workspace, which makes artifact ownership slightly ambiguous.
2. The command surface now spans two L2 files: `SKILL.md` and `plan/PLAN-SKILL.md`. The routing contract must stay explicit.
3. Append mode still needs a stronger conflict policy when an existing prompt sequence must be partially regenerated.

## Improvements Suggested

1. Add a machine-readable prompt patch queue for Plan Review so downstream prompt edits can be proposed and approved systematically.
2. Add conflict rules for append mode when existing prompt numbering collides with newly generated milestones.
3. Promote the new V5 scenario skeletons (`s16-s18`) into executable regression runs in the next test cycle.
