# Prompt 04: Template Library

## 需求

实现 V5 模板库与最终文档收尾：

- 新增 5 个模板目录
- 每个模板包含 `config.yaml` 与至少 3 个 prompt 文件
- 支持 `/hw:plan --template <name>`
- 更新 README、plugin 版本与自举验证报告

## 预期测试

- 5 个模板目录存在
- 每个模板都有 `config.yaml` 与至少 3 个 prompt
- `/hw:plan --template tdd-python-cli` 语义明确
- README 记录 Plan Mode、模板库和新指令
- `plugin.json` 版本为 `5.0.0`

## 预期产出

- `plan/templates/*`
- `README.md`
- `.claude-plugin/plugin.json`
- 自举验证报告
