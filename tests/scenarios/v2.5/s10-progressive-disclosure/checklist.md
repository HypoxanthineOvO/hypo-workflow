# Scenario: s10 — Progressive Disclosure 结构验证

## 初始 Prompt
> 请按照 prompt-pipeline/SKILL.md 的规则，在当前目录执行 Pipeline。
> 读取 .pipeline/config.yaml，开始执行。

## 验证清单

### Progressive Disclosure
- [ ] Agent 首先读取了 SKILL.md（L2）
- [ ] 在 review_code 步骤中，Agent 读取了 references/evaluation-spec.md（L3）
- [ ] Agent 没有跳过 📎 引用，而是真正去加载了对应文件
- [ ] 在 TDD 步骤中，Agent 读取了 references/tdd-spec.md（L3）

### 结构完整性
- [ ] references/ 目录下 6 个文件都可被 Agent 正常读取
- [ ] scripts/ 目录下 4 个脚本都可被 Agent 正常执行
- [ ] assets/ 目录下模板和示例可被 Agent 正常读取

### Pipeline 正常完成
- [ ] TDD 6 步正常执行
- [ ] state.yaml 正确生成
- [ ] report 正确生成
- [ ] log.md 正确记录

## 结果
- 测试日期：____
- 总体结果：PASS / FAIL
- 备注：____
