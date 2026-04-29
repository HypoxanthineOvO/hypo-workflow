# 评估标准

只应用 `evaluation.checks` 中启用的检查项。

## 检查项

### tests_pass
当 GREEN 阶段结束且所有相关测试通过时为通过。
如果任何必需测试仍失败或报错，则为失败。

### no_regressions
当前 Prompt 实现后，之前已通过的测试仍然通过时为通过。
如果已有行为发生回归，则为失败。

### matches_plan
实现的文件、接口和可观察行为与 Prompt 的 `预期产出` 大体一致时为通过。
如果产出明显不完整、位置错误，或结构无正当理由地偏离，则为失败。

### code_quality
审查结论可接受且代码审查评分至少为 `3/5` 时为通过。
如果可读性、结构、命名或明显缺陷导致评分低于 `3/5`，则为失败。

## Diff Score 公式

- 基础分 = `1`
- 每个失败检查项 + `1`
- 最终分 = `min(1 + failed_checks, 5)`

## 决策规则

- 如果 `diff_score <= evaluation.max_diff_score`，Pipeline 可以继续。
- 如果 `diff_score > evaluation.max_diff_score`，停止 Pipeline 并报告阻塞检查项。
