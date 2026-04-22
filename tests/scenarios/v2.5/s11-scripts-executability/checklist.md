# Scenario: s11 — Scripts 可执行性验证

## 初始 Prompt
> 请按照 prompt-pipeline/SKILL.md 的规则，在当前目录执行 Pipeline。
> 读取 .pipeline/config.yaml，开始执行。
> 执行过程中，请在以下时机手动调用对应脚本并报告输出：
> 1. Pipeline 启动后立即运行 `bash prompt-pipeline/scripts/state-summary.sh`
> 2. 每个子步骤完成后运行 `bash prompt-pipeline/scripts/log-append.sh --step <step> --status done --message "test"`
> 3. review_code 完成后运行 `bash prompt-pipeline/scripts/diff-stats.sh`
> 4. Pipeline 结束后运行 `bash prompt-pipeline/scripts/validate-config.sh`

## 验证清单

### state-summary.sh
- [ ] Pipeline 启动前输出 "No active pipeline"
- [ ] Pipeline 运行中输出正确的 Pipeline name / Status / Current step
- [ ] 输出格式为 key: value

### log-append.sh
- [ ] 成功追加日志到 log.md
- [ ] 日志格式正确（ISO-8601 时间戳 + step + status + message）
- [ ] 多次调用不覆盖已有内容

### diff-stats.sh
- [ ] 输出 changed_files=N / added_lines=N / removed_lines=N / net_lines=N
- [ ] 在 git repo 中输出真实统计
- [ ] 不在 git repo 中输出全 0

### validate-config.sh
- [ ] 对有效 config 返回退出码 0
- [ ] 对缺少 pipeline.name 的 config 返回退出码 1 + 错误信息
- [ ] 检查 platform 字段（如果存在必须是 auto/claude/codex）

### plugin.json
- [ ] `python3 -m json.tool .claude-plugin/plugin.json` 通过
- [ ] version = 5.1.0
- [ ] hooks 字段包含 Stop / SessionStart / InstructionsLoaded

## 结果
- 测试日期：____
- 总体结果：PASS / FAIL
- 备注：____
