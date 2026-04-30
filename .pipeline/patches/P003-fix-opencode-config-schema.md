# P003: 修复 OpenCode 配置 schema 兼容性

- 严重级: critical
- 状态: closed
- 发现于: C1
- 创建时间: 30日 16:53
- 修复时间: 30日 17:04
- 改动: core/src/artifacts/opencode.js — 拆分 OpenCode 官方配置与 HW metadata，并生成 schema-valid agent permissions；opencode.json/.opencode artifacts — 重新生成合法配置
- 测试: ✅ `opencode debug config` 通过；`python3 tests/run_regression.py` 60/60；`claude plugin validate .` 通过；`node --test core/test/*.test.js` 通过；`git diff --check` 通过
- commit: `本提交`
- 关联: (无)
- resolved_by: null
- related: []
- supersedes: []

## 描述

`opencode` 在项目根启动时报错：

```text
Configuration is invalid at /home/heyx/Hypo-Workflow/opencode.json
↳ Unrecognized keys: experimental.session.compacting, hypoWorkflow
```

需要让生成的 `opencode.json` 只包含 OpenCode 官方 schema 支持的字段，把 Hypo-Workflow 私有 metadata 移到独立文件，并用真实 `opencode debug config` 验证。
