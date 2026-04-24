# Scenario: s14 — 多维评分 + 自适应阈值

## 初始 Prompt
> 请按照 prompt-pipeline/SKILL.md 的规则，在当前目录执行 Pipeline。
> 读取 .pipeline/config.yaml，开始执行。
> 注意：evaluation.adaptive_threshold=true，请严格按照 references/evaluation-spec.md 中的多维评分和自适应阈值规则执行。

## 验证清单

### 多维评分
- [ ] 每轮 Prompt 的 review_code 产出了 6 个维度的评分：diff_score / code_quality / test_coverage / complexity / architecture_drift / overall
- [ ] overall 使用了 TDD 模式公式（0.3/0.2/0.2/0.15/0.15 权重）
- [ ] 评分被写入 state.yaml 的 evaluation 块
- [ ] 评分被写入报告的 Scores 表格

### 自适应阈值
- [ ] state.yaml 中有 pipeline.adaptive_threshold 字段
- [ ] 初始值 = base_max_diff_score = 3
- [ ] 如果 Prompt 00 和 01 的 diff_score 都 <= 2，阈值暂不变（需要连续 3 个）
- [ ] 报告的 Adaptive Threshold History 表格正确记录每轮阈值变化

### 架构漂移检测（Prompt 02 重点）
- [ ] Prompt 02 是重构操作，architecture_drift 评分应 >= 2
- [ ] 报告的 Architecture Drift Detail 章节包含目录结构变化（单文件 → 多文件包）
- [ ] Agent 在评估时引用了 scripts/diff-stats.sh 的输出

### 阻塞决策
- [ ] STOP 条件正确判断（diff_score > threshold 或 architecture_drift >= 4 或 overall > threshold+1）
- [ ] WARN 条件被记录（complexity >= 4 或 test_coverage <= 2）
- [ ] Decision 结果（CONTINUE / STOP / WARN+CONTINUE）在报告中正确标注

### 向后兼容
- [ ] 如果把 adaptive_threshold 改为 false 重跑 Prompt 00，行为与 V3 一致（只看 diff_score）

## 结果
- 测试日期：____
- 总体结果：PASS / FAIL
- 备注：____
