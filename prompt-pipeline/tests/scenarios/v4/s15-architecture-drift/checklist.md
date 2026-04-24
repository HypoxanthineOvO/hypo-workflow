# Scenario: s15 — 架构漂移检测专项

## 初始 Prompt
> 请按照 prompt-pipeline/SKILL.md 的规则，在当前目录执行 Pipeline。
> 读取 .pipeline/config.yaml，开始执行。

## 验证清单

### Prompt 00（正常 Scaffold）
- [ ] architecture_drift = 1（全新项目，无偏移基线）
- [ ] Pipeline 正常 CONTINUE

### Prompt 01（Breaking Refactor）
- [ ] architecture_drift >= 3（目录重构 + 新依赖 + 接口变更）
- [ ] 报告的 Architecture Drift Detail 包含：
  - [ ] 目录结构：单文件 → 多目录包
  - [ ] 依赖图：新增 sqlalchemy, flask-sqlalchemy
  - [ ] 接口变化：GET /hello → GET /api/hello
- [ ] scripts/diff-stats.sh 输出的 changed_files >= 5
- [ ] 如果 architecture_drift >= 4，Pipeline 应该 STOP
- [ ] 如果 STOP，reason 中明确提到架构漂移

### 阻塞边界
- [ ] architecture_drift = 3 时不 STOP（阈值是 >= 4）
- [ ] architecture_drift >= 4 时 STOP（即使 diff_score 在阈值内）
- [ ] STOP 时 state.yaml 的 status 被标记为对应状态

## 结果
- 测试日期：____
- 总体结果：PASS / FAIL
- 备注：____
