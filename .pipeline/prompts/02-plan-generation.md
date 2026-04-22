# Prompt 02: Plan Generation

## 需求

完成 Decompose、Generate、Confirm 三阶段：

- Milestone 拆分规则
- `.pipeline/config.yaml` 与 prompts 生成规则
- `architecture.md` 基线生成
- 确认摘要格式

## 预期测试

- Decompose 产出包含 Test Spec 的 Milestone 大纲
- Generate 产出 `config.yaml`、prompt 文件、`architecture.md`
- Confirm 输出项目名、技术栈、preset、Milestone 数量、测试点数量、文件清单
- 追加模式会读取已有 `.pipeline/`

## 预期产出

- `plan/PLAN-SKILL.md`
- `plan/assets/prompt-template.md`
- 相关规范更新
