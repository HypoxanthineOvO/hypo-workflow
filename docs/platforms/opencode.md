# OpenCode Guide

Commands: native-slash.
Ask gates: question-tool.
Plan support: todowrite.

Hypo-Workflow does not run project work itself; the host agent performs the work using `.pipeline/` files.

## Model Matrix

OpenCode 负责实际模型调用；Hypo-Workflow only writes role-aware agent metadata and config defaults.

```yaml
opencode:
  compaction:
    effective_context_target: 900000
  agents:
    plan:
      model: gpt-5.5
    compact:
      model: deepseek-v4-flash
    test:
      model: deepseek-v4-pro
    code-a:
      model: mimo-v2.5-pro
    code-b:
      model: deepseek-v4-pro
    debug:
      model: gpt-5.5
    docs:
      model: deepseek-v4-pro
    report:
      model: deepseek-v4-flash
```

| Agent | Role | 发布默认 |
|---|---|---|
| `hw-compact` | context compaction | `deepseek-v4-flash` |
| `hw-test` | test design and validation | `deepseek-v4-pro` |
| `hw-code-a` | primary implementation | `mimo-v2.5-pro` |
| `hw-code-b` | secondary implementation | `deepseek-v4-pro` |
| `hw-docs` | documentation and release notes | `deepseek-v4-pro` |
| `hw-report` | report synthesis | `deepseek-v4-flash` |
