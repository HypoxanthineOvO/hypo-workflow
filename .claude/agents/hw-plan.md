---
name: hw-plan
description: Hypo-Workflow Claude Code plan subagent.
model: gpt-5.5
hypo_workflow_managed: true
---

# hw-plan

Role: `plan`
Model: `gpt-5.5`

Use this Claude Code subagent for Hypo-Workflow plan work. The model is generated from the shared `model_pool.roles` contract, refined by `claude_code.agents.plan.model` when explicitly configured.

Do not call models directly from Hypo-Workflow core. Claude Code remains responsible for actual model invocation; this file only declares routing intent.
