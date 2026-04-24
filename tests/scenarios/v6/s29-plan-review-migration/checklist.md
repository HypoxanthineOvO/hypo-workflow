# System Test Checklist: s29-plan-review-migration

## Metadata
- Scenario: `s29-plan-review-migration`
- Version: `V6`
- Goal: 验证 `/hw:review` 到 `/hw:plan:review` 的兼容迁移

## Execution Checks
- [ ] 新命令 `/hw:plan:review` 已在各规范中注册
- [ ] 旧命令 `/hw:review` 输出迁移提示
- [ ] `/hw:review --full` 仍保留兼容文案
