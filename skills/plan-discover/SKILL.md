---
name: plan-discover
description: Run the discovery phase of Hypo-Workflow planning when the user needs requirement clarification, constraint gathering, and repo context analysis.
---

# /hypo-workflow:plan-discover

Use this skill for P1 Discover only.

## Preconditions

- planning mode is active or about to start
- user goals are not yet structured into milestones

## Plan Modes

- `interactive`: ask questions in rounds and wait for user answers
- `auto`: infer from repo context and user prompt without pausing unless blocked

## interaction_depth Rules

- `low`
  - at least 2 rounds
  - cover core function, target users, and stack preference
- `medium`
  - at least 3 rounds
  - include priorities, non-functional needs, and integration boundaries
- `high`
  - at least 5 rounds
  - dig into feature detail, UX, edge cases, test strategy, deployment, performance, security, internationalization, and accessibility

If `plan.interactive.min_rounds` is set, use it as an additional floor after resolving `interaction_depth`. Default interactive depth is `medium` and default floor is 3 rounds.

## ⚠️ 强制交互规则（Interactive 模式）

❓ 最少提问轮数：
- interaction_depth: low    → 至少 2 轮提问
- interaction_depth: medium → 至少 3 轮提问（默认）
- interaction_depth: high   → 至少 5 轮提问

❌ 绝对禁止：
1. 用户只说了一句话就直接开始拆 Milestone
2. 自己填补用户没说过的需求细节
3. 在用户没说「够了」「开始吧」「可以了」之前进入 P2
4. 一次性列出 10 个问题然后自己回答
5. 把「确认一下」当作「够了」的信号

✅ 必须做到：
1. 每轮问 2-3 个有针对性的问题，等用户回答
2. 根据用户回答追问细节，不要假设
3. 每轮结束时总结已收集的信息，让用户确认
4. 主动发现用户没想到的维度并提出
5. 像资深 PM 做需求访谈，循序渐进

🚨 进入 P2 的唯一条件：
用户明确表示「够了」「开始吧」「可以了」等结束信号。
如果用户只是回答了你的问题，你应该继续提问，不应该理解为「可以开始了」。

## Interactive Behavior

1. Ask only 2-3 targeted questions per round.
2. Start broad, then drill into detail.
3. Summarize what has been learned after each round.
4. Count completed question rounds explicitly in the working notes.
5. Do not enter P2 until both conditions are true:
   - the configured minimum round count has been met
   - the user explicitly says「够了」「开始吧」「可以了」or an equivalent end signal
6. If user input is vague, ask follow-up questions instead of silently filling gaps.
7. If the user says "确认一下" or merely answers the previous questions, summarize and continue asking.

## Context Injection

`/hw:plan --context <sources>` and `cycle.yaml` `context_sources` can preload P1 with existing evidence. Supported sources:

- `audit`: read the newest report under `.pipeline/audits/`
- `patches`: read all open Patch files under `.pipeline/patches/`
- `deferred`: read every `.pipeline/archives/*/deferred.yaml`; also read `.pipeline/archives/cycle-0-legacy/summary.md` when present
- `debug`: read the newest report under `.pipeline/debug/`

Context injection behavior:

1. Load the selected sources before the first question round.
2. Present a concise source summary, including counts such as open patches, deferred milestones, or imported Legacy milestones.
3. Ask the first 2-3 targeted questions based on that evidence.
4. Never treat injected context as user confirmation or as permission to skip the minimum rounds.
5. If no selected source exists, say which source was empty and continue normal Discover.

Example opening:

> 基于审计报告 + 3 个 open patch，我看到这些问题：…… 你想全部处理还是只修 Critical？还有其他想加的吗？

## Reference Files

- `plan/PLAN-SKILL.md` — Discover phase baseline
- `references/commands-spec.md` — command routing
- `SKILL.md` — full system context
