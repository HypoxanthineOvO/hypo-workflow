# 执行报告：{prompt_name}

## 概要
- Prompt：{prompt_id} — {prompt_name}
- 开始时间：{started_at}
- 完成时间：{finished_at}
- 耗时：{duration}
- 结果：{result}
- Diff Score：{diff_score}/5

## 步骤
| 步骤 | 状态 | 耗时 | 备注 |
|------|------|------|------|
| {step_name} | {step_status} | {step_duration} | {step_notes} |

## 测试结果
- 本轮新增测试：{new_tests_count}
- 回归测试规模：{regression_suite_count}
- RED 阶段：{red_summary}
- GREEN 阶段：{green_summary}
- 回归问题：{regressions}

## 代码审查
- 质量评分：{quality_score}/5
- 发现的问题：{issues_found}
- 架构差异：{architecture_diff}

## 评估
- tests_pass：{tests_pass}
- no_regressions：{no_regressions}
- matches_plan：{matches_plan}
- code_quality：{code_quality}
- **总体 diff_score：{diff_score}/5**
- **决策：{decision}**

## 下一步
{next_action}
