# P006: V4 报告和 Slides 全面重写
- 严重级: normal
- 状态: closed
- 发现于: C4
- 创建时间: 05-02 20:40
- 修复时间: 05-02 20:40
- 改动: docs/showcase/v4-report/report.tex (1236行, 11章, 45页); docs/showcase/v4-report/slides.tex (475行, 29页); docs/showcase/v4-report/Makefile
- 测试: ✅ `make report` + `make slides` 编译通过
- 关联: docs/showcase/v4-report/, .plan-state/report-v4-structure.md, .plan-state/report-v4-milestones.md
- resolved_by: P006
- commit: `cdc62f7`, `3d74cbe`, `1bbf57a`
- related: [P004]
- supersedes: []

## 问题

C2 报告和 Slides 存在叙事问题：
1. 独立的 "V9 OpenCode Native Adapter Case Study" 章节像是开发日志
2. 功能按"问题驱动"排列，缺少版本时间线维度
3. 命令参考表是扁平列表，没有按开发顺序展开
4. 缺少 C3（多 Agent、分析预设）和 C4（Knowledge Ledger、Acceptance Loop、Explore）内容
5. 核心命令缺少独立小节和出生场景/设计决策/关键迭代/用法说明

## 期望

- 去掉 V9 Case Study 独立章节，关键架构决策融入 C1 叙事
- 按版本时间线（V4.5→C4d）重组叙事，展示指令如何随需求长出来
- 14 条核心命令有独立小节（出生场景 + 设计决策 + 关键迭代 + 用法）
- Slides 与 Report 结构一致，为 Report 缩略版
- 可编译（`make report` + `make slides`）

## 解决方案

### 新报告结构（11章）

**Part I — 核心思想（保留扩展）**
- 第1章：引言（保留 + 补充 C3/C4 认知）
- 第2章：问题定义（保留）
- 第3章：Harness Engineering（保留）
- 第4章：总体架构（保留 + 更新资产数字）

**Part II — 指令按版本演进（全新）**
- 第5章：V4.5–V6 基础工作流（start/plan/init/audit/release 等）
- 第6章：V7–V9.0 工程质量与 OpenCode 适配（dashboard/patch/compact/C1）
- 第7章：C2–C4 复杂需求驱动（batch/chat/accept/explore/knowledge/sync）

**Part III — 讨论与展望（保留更新）**
- 第8章：工具对比（保留更新）
- 第9章：局限性与未来工作（保留 + Harness 对模型工程智力的讨论）
- 第10章：样例（更新到 C4 状态 + 32 条命令按版本时间线排列）

### 核心命令（14条独立小节）

| # | 命令 | 出生 |
|---|------|------|
| 1 | /hw:start | V4.5 |
| 2 | /hw:plan | V5 |
| 3 | /hw:init | V6 |
| 4 | /hw:audit | V6 |
| 5 | /hw:release | V6 |
| 6 | /hw:dashboard | V7 |
| 7 | /hw:patch | V8 |
| 8 | /hw:compact | V8.2 |
| 9 | /hw:plan --batch | C2 |
| 10 | /hw:chat | C3 |
| 11 | /hw:accept + /hw:reject | C4b |
| 12 | /hw:explore | C4c |
| 13 | /hw:knowledge | C4d |
| 14 | /hw:sync | C4d |

### LaTeX 编译修复

- Unicode 箭头 `→` 替换为 `$\rightarrow$` 避免 `Missing $ inserted`
- 添加 `\usepackage{underscore}` 处理普通文本中的 `_`（如 `in_progress`）
- Makefile 改用手动双次 xelatex 编译解决 longtblr 跨页表格引用问题

### 执行方式

- 创建 Worktree 分支 `c4-report-v4`，与 C4 并行执行
- Worktree 完成后合并到 main 并删除
- 通过 /hw:plan 规划（P1-P4），/hw:patch 跟踪

## 规划文件

- `.plan-state/report-v4-structure.md` — 新报告章节结构
- `.plan-state/report-v4-milestones.md` — M1-M6 执行计划
