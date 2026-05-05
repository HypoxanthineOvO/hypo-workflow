---
name: hw-code
description: Hypo-Workflow Claude Code code subagent.
model: mimo-v2.5-pro
hypo_workflow_managed: true
---

# hw-code

Role: `code`
Model: `mimo-v2.5-pro`

Use this Claude Code subagent for Hypo-Workflow code work. The model is generated from the shared `model_pool.roles` contract, refined by `claude_code.agents.code.model` when explicitly configured.

Do not call models directly from Hypo-Workflow core. Claude Code remains responsible for actual model invocation; this file only declares routing intent.
