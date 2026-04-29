---
name: guide
description: Interactive onboarding guide that senses the current project state and recommends a short Hypo-Workflow command path.
---

# /hypo-workflow:guide

Use this skill when the user invokes `/hw:guide` or `/hypo-workflow:guide`.

Guide is an interactive entrypoint for users who are unsure which Hypo-Workflow command to run next. It recommends a short command flow, asks for confirmation, and then executes the first recommended command when the user agrees.

## Step 1: Short Introduction

Print at most 5 lines:

- Hypo-Workflow is a serialized Pipeline execution engine for AI development work.
- It manages planning, execution, Cycle archives, lightweight Patches, audits, release flow, and automation.
- This guide will inspect the current project and suggest the next command path.

Do not list all commands in the introduction.

## Step 2: Sense Project State

Check the current working directory:

- If `.pipeline/` is missing, say this project is not initialized.
- If `.pipeline/` exists:
  - read `.pipeline/state.yaml` or `.pipeline/state.compact.yaml` for current phase, prompt, step, and status
  - read `.pipeline/cycle.yaml` for active Cycle number/name when present
  - scan `.pipeline/patches/` and count open Patches only
  - summarize in one short sentence, for example: `你在 C3/M2 implement 步骤，有 2 个 open patch`

Do not mutate any file during sensing.

## Step 3: Ask What The User Wants

Ask one open question:

```text
你现在想做什么？
```

Wait for the user's answer.

## Step 4: Intent Matching

Match the answer to one of the supported scenarios and recommend a 1-3 command path. If the answer is vague, ask 1-2 follow-up questions such as:

- 项目现在是刚开始、开发中，还是准备发布？
- 你是想修 Bug、规划新功能、查看进度，还是减少上下文占用？

## Scenario Table

| User intent | Recommended command flow |
| --- | --- |
| Start a new project from zero | `/hw:init` → `/hw:plan` → `/hw:start` |
| Continue an existing managed project | `/hw:resume` when interrupted, or `/hw:cycle new` for a new Cycle |
| Fix a bug | `/hw:patch "描述"` → `/hw:patch fix P<N>` |
| Review code quality | `/hw:audit` → `/hw:plan --context audit` |
| Check current progress | `/hw:status` or `/hw:dashboard` |
| Bring a legacy Git project under management | `/hw:init --import-history` |
| Reduce token/context usage | `/hw:compact` |
| Release a finished project | `/hw:release` |

## Step 5: Confirm And Execute

After recommending a flow, ask:

```text
要我帮你开始吗？
```

If the user explicitly confirms, execute the first command in the recommended flow. Do not execute later commands until the first one completes and the user or command flow permits continuation.

If the user declines, leave the recommended command flow visible and stop.

## Safety Rules

- recommend command flows, not a single isolated command, unless the scenario naturally has one command
- do not initialize, plan, resume, compact, audit, release, or patch-fix before user confirmation
- do not write `.pipeline/state.yaml` from Guide itself
- use `output.language` for all guide prose when config is available

## Reference Files

- `skills/init/SKILL.md`
- `skills/plan/SKILL.md`
- `skills/start/SKILL.md`
- `skills/resume/SKILL.md`
- `skills/patch/SKILL.md`
- `skills/compact/SKILL.md`
- `skills/audit/SKILL.md`
- `skills/release/SKILL.md`
- `SKILL.md`
