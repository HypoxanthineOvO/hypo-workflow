# System Test Checklist: s30-init-rescan

## Metadata
- Scenario: `s30-init-rescan`
- Version: `V6`
- Goal: 验证 `/hw:init --rescan` 的架构刷新语义

## Execution Checks
- [ ] `references/init-spec.md` 包含 `--rescan`
- [ ] `--rescan` 说明会和现有 architecture baseline 做 diff
