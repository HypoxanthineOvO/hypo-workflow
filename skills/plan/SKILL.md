---
name: plan
description: Enter Hypo-Workflow planning mode when the user wants to design milestones before execution starts.
---

# /hypo-workflow:plan

Use this skill for the full P1-P4 planning flow.

## Preconditions

- planning should happen before normal execution begins
- if `.pipeline/` already exists, treat planning as revise-or-append, not necessarily greenfield

## Plan Modes

- `plan.mode=interactive` (default)
  - user participates at each checkpoint
  - P1 Discover asks targeted questions until the user says the requirement interview is sufficient
  - P4 Confirm must wait for explicit user confirmation
  - read `plan.interaction_depth` and convert it to the minimum question rounds:
    - `low` -> 2 rounds
    - `medium` -> 3 rounds
    - `high` -> 5 rounds
  - if `plan.interactive.min_rounds` is present, use it as an additional floor
  - if `plan.interactive.require_explicit_confirm` is missing, treat it as `true`
- `plan.mode=auto`
  - Claude completes P1-P4 without stopping for user answers unless blocked by missing critical information
  - P4 Confirm becomes a summary pass-through, not a hard gate

## 强制交互规则（Interactive 模式）

Interactive planning is a hard conversational gate, not a suggestion.

❓ 最少提问轮数：
- `interaction_depth: low` -> 至少 2 轮提问
- `interaction_depth: medium` -> 至少 3 轮提问（默认）
- `interaction_depth: high` -> 至少 5 轮提问

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

🚨 P1 -> P2 的唯一过渡条件：
用户明确表示「够了」「开始吧」「可以了」等结束信号。用户只是回答问题、补充信息、或说「确认一下」时，继续 P1 追问，不得进入 P2。

When `--context` is present, injected context can sharpen the first questions but must not skip the required interaction rounds.

## Execution Flow

1. Read `~/.hypo-workflow/config.yaml` if present.
2. Read `plan.mode` and `plan.interaction_depth` from `.pipeline/config.yaml` when present.
3. Parse `--context <sources>` when present. Split comma-separated values and allow only `audit`, `patches`, `deferred`, and `debug`.
4. If no `--context` flag is given, read `cycle.yaml` and use `cycle.context_sources` when present.
5. Resolve plan mode as project `plan.mode` > global `plan.default_mode` > `interactive`.
6. In interactive mode, resolve minimum rounds from `plan.interaction_depth`, then apply `plan.interactive.min_rounds` as a floor.
7. Run P1 Discover:
   - collect goals, constraints, stack, users, and architecture expectations
   - if context sources were resolved, load them first, present the injected findings to the user, then start interactive questioning
8. Run P2 Decompose:
   - split work into reviewable milestones with validation points
   - in interactive mode, stop after showing the proposed split and wait for user confirmation before P3
9. Run P3 Generate:
   - generate `.pipeline/` artifacts and architecture baseline
10. Run P4 Confirm:
   - interactive mode waits for user confirmation
   - auto mode summarizes and moves on
11. Set `current.phase` to the matching planning phase during each stage.

## Interactive Checkpoints

- Discover, Decompose, Generate, and Confirm can all surface follow-up questions
- in interactive mode, hook behavior should allow turn end during planning checkpoints
- in interactive mode, P2 may not begin until the user has met the configured minimum rounds and explicitly ended discovery
- in interactive mode, P3 may not begin until the user confirms the P2 milestone split
- in interactive mode, P4 is a hard gate and must wait for explicit confirmation
- in auto mode, planning should continue unattended

## Reference Files

- `plan/PLAN-SKILL.md` — detailed P1-P4 planning system
- `references/commands-spec.md` — command routing semantics
- `references/config-spec.md` — plan-mode fallback rules
- `SKILL.md` — overall pipeline context
