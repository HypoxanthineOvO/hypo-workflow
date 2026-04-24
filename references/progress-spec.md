# Progress Spec

Use this reference for the human-readable progress summary file at `.pipeline/PROGRESS.md`.

## Goal

`PROGRESS.md` is the human-facing companion to `log.yaml`.

- `log.yaml` is machine-readable and structured
- `PROGRESS.md` is narrative and quick to scan

## File Location

- canonical path: `.pipeline/PROGRESS.md`

## Format

```markdown
# <project name> — 开发进度

> 最后更新：2026-04-24 15:30 | 状态：进行中 | 进度：3/5 Milestone

## 当前状态
🔄 **M3: Rich UI** — 实现中（step: run_green）

## Milestone 进度

| # | Milestone | 状态 | 摘要 |
|---|-----------|------|------|
| M0 | 项目骨架 | ✅ 完成 | pyproject.toml + 目录结构 + CI 配置 |
| M1 | 核心 CRUD | ✅ 完成 | SQLite 持久化 + 5 个 CRUD 操作 + 100% 测试覆盖 |
| M2 | CLI 交互 | ✅ 完成 | Click CLI + 交互式菜单 + 彩色输出 |
| M3 | Rich UI | 🔄 进行中 | Rich 表格渲染 + 进度条 + 过滤排序 |
| M4 | 导出功能 | ⏳ 待执行 | — |

## 最近活动
- **15:30** M3 implement 完成，进入 run_green
- **15:15** M3 write_tests 完成（12 个测试用例）
- **14:50** M2 完成 ✅ — commit `a1b2c3d`

## Deferred 项
- M1/step3: 跳过了 SQLite WAL 模式测试 — 原因：测试环境不支持
```

## Update Timing

Update `PROGRESS.md`:

- when a milestone starts
- when a step completes
- when a milestone completes
- when a milestone is deferred, failed, skipped, or stopped
- when the overall pipeline completes

## Required Content

- last update timestamp
- overall status
- completed vs total milestone count
- current milestone and step
- milestone table
- recent activity list
- deferred section when applicable

## Relationship To State

`PROGRESS.md` should stay consistent with:

- `.pipeline/state.yaml`
- `.pipeline/log.yaml`
- current milestone report files

It is a summary surface, not a replacement for state or lifecycle logs.
