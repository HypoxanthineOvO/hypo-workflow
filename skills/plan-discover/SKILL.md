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
  - 1-2 rounds
  - cover core function, target users, and stack preference
- `medium`
  - 3-5 rounds
  - include priorities, non-functional needs, and integration boundaries
- `high`
  - 5-10 rounds
  - dig into feature detail, UX, edge cases, test strategy, deployment, performance, security, internationalization, and accessibility

## Interactive Behavior

1. Ask only 2-3 targeted questions per round.
2. Start broad, then drill into detail.
3. Summarize what has been learned after each round.
4. Do not enter P2 until the user says the discovery is sufficient.
5. If user input is vague, ask follow-up questions instead of silently filling gaps.

## Reference Files

- `plan/PLAN-SKILL.md` — Discover phase baseline
- `references/commands-spec.md` — command routing
- `SKILL.md` — full system context
