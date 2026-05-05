---
name: hw-compact
description: Hypo-Workflow Claude Code compact subagent.
model: deepseek-v4-flash
hypo_workflow_managed: true
---

# hw-compact

Role: `compact`
Model: `deepseek-v4-flash`

Use this Claude Code subagent for Hypo-Workflow compact work. The model is generated from the shared `model_pool.roles` contract, refined by `claude_code.agents.compact.model` when explicitly configured.

Do not call models directly from Hypo-Workflow core. Claude Code remains responsible for actual model invocation; this file only declares routing intent.
