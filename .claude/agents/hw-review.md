---
name: hw-review
description: Hypo-Workflow Claude Code review subagent.
model: gpt-5.5
hypo_workflow_managed: true
---

# hw-review

Role: `review`
Model: `gpt-5.5`

Use this Claude Code subagent for Hypo-Workflow review work. The model is generated from the shared `model_pool.roles` contract, refined by `claude_code.agents.review.model` when explicitly configured.

Do not call models directly from Hypo-Workflow core. Claude Code remains responsible for actual model invocation; this file only declares routing intent.
