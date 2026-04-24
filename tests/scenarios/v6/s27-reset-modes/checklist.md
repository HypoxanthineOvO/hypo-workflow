# System Test Checklist: s27-reset-modes

## Metadata
- Scenario: `s27-reset-modes`
- Version: `V6`
- Goal: 验证 `/hw:reset` 的三级重置模式

## Execution Checks
- [ ] 默认 reset 保留 config / prompts / architecture / logs
- [ ] `--full` 清理 state 与生成产物
- [ ] `--hard` 要求 `YES`
