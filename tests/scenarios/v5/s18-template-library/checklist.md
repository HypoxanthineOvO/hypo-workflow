# System Test Checklist: s18-template-library

## Metadata
- Scenario: `s18-template-library`
- Version: `V5`
- Goal: 验证模板库与 `/hw:plan --template`

## Execution Checks
- [ ] `plan/templates/` 下有 5 个模板目录
- [ ] 每个模板包含 `config.yaml`
- [ ] 每个模板包含至少 3 个 prompt 文件
- [ ] `/hw:plan --template tdd-python-cli` 语义明确

## Exit Criteria
- [ ] README 记录了模板库
- [ ] Generate 阶段支持模板选择
