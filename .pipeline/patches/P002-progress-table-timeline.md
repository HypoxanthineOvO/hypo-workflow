# P002: 恢复 PROGRESS 表格和时间点格式
- 严重级: minor
- 状态: closed
- 发现于: C1
- 创建时间: 30日 16:55
- 修复时间: 30日 16:59
- 改动: `.pipeline/PROGRESS.md` 恢复为顶部状态 + Milestone 表 + 时间线 + Patch 表；`references/progress-spec.md` 和相关 Skill 约束改为刷新看板而非追加流水账；新增 s60 回归锁定版式
- 测试: ✅ `bash tests/scenarios/v9/s60-progress-board-format/run.sh`; `claude plugin validate .`; `python3 tests/run_regression.py` (60/60); `git diff --check`
- commit: `本提交`
- 关联: (无)
- resolved_by: null
- related: []
- supersedes: []

## 描述

当前 `.pipeline/PROGRESS.md` 退化为连续追加的单行事件列表，阅读体验接近 `log.yaml`，缺少早期版本更清晰的顶部状态、Milestone 表格和时间点视图。

需要恢复为人类可读的进度看板格式，并同步更新写入 PROGRESS 的规则说明，避免后续 Patch、Showcase、Stop 等流程继续追加松散流水账。
