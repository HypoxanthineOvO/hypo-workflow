# System Test Checklist: s24-audit-report

## Metadata
- Scenario: `s24-audit-report`
- Version: `V6`
- Goal: 验证 `/hw:audit` 的分级报告与落盘路径

## Execution Checks
- [ ] 六个审计维度存在
- [ ] 报告模板包含 Critical / Warning / Info
- [ ] 审计结果写入 `.pipeline/audits/`
