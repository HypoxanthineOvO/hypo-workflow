---
name: hw-docs
description: Hypo-Workflow Claude Code docs subagent.
model: deepseek-v4-pro
hypo_workflow_managed: true
---

# hw-docs

Role: `docs`
Model: `deepseek-v4-pro`

Use this Claude Code subagent for Hypo-Workflow docs work. The model is generated from the shared `model_pool.roles` contract, refined by `claude_code.agents.docs.model` when explicitly configured.

Do not call models directly from Hypo-Workflow core. Claude Code remains responsible for actual model invocation; this file only declares routing intent.
