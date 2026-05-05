<div align="center">

# Hypo-Workflow

**面向 AI Agent 的本地工作流协议**

Plan -> Execute -> Review -> Report -> Recover

[![Version](https://img.shields.io/badge/version-11.0.0-blue)](.claude-plugin/plugin.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Claude%20Code%20%7C%20Codex%20%7C%20OpenCode-purple)](docs/reference/platforms.md)

</div>

Hypo-Workflow 把长周期 AI coding 工作拆成可规划、可恢复、可审查的本地流程。它不是 runner，也不是后台服务；实际编码、测试、审查仍由 Codex、Claude Code 或 OpenCode Agent 执行，`.pipeline/` 是项目内的状态、prompt、报告、日志和派生上下文来源。

当前版本提供 **36 个用户指令**，另有 **1 个内部 watchdog** skill。

## 快速开始

安装或接入后，在目标项目中按这条主路径使用：

```text
/hw:init
/hw:plan
/hw:start
```

中断后继续：

```text
/hw:status
/hw:resume
```

OpenCode 项目先生成原生适配文件：

```bash
hypo-workflow init-project --platform opencode --project .
```

之后在 OpenCode 中使用短横线命令，例如 `/hw-plan`、`/hw-start`、`/hw-status`、`/hw-docs`。

## 常用流程

| 场景 | 命令 |
|---|---|
| 初始化或重新扫描项目 | `/hw:init` |
| 规划一个功能 | `/hw:plan` |
| 规划多个 Feature | `/hw:plan --batch` |
| 调整已有 Feature Queue | `/hw:plan --insert "..."` |
| 开始或继续执行 | `/hw:start` / `/hw:resume` |
| 查看状态和最近事件 | `/hw:status` |
| 查看报告 | `/hw:report` |
| 小修复不进完整 Milestone | `/hw:patch` / `/hw:patch fix P001` |
| 修复派生上下文 | `/hw:sync --repair` |
| 检查或修复文档 | `/hw:docs check` / `/hw:docs repair` |
| 接受或拒绝交付 | `/hw:accept` / `/hw:reject` |

Feature Queue 用于长规划和 AFK/HITL 协调。核心文件是 `.pipeline/feature-queue.yaml`，指标放在 `.pipeline/metrics.yaml`；常见字段包括 `upfront`、`just_in_time`、`gate: confirm`、`auto_chain` 和 `failure_policy: skip_defer`。完整说明见 [User Guide](docs/user-guide.md) 和 [Feature Queue Spec](references/feature-queue-spec.md)。

## 文档入口

| 文档 | 用途 |
|---|---|
| [User Guide](docs/user-guide.md) | 常见工作流、恢复、Feature Queue、使用建议 |
| [Developer Guide](docs/developer.md) | 核心 helper、权限边界、派生物和测试约定 |
| [Commands Reference](docs/reference/commands.md) | 36 个 canonical 命令和 OpenCode 映射 |
| [Platforms Reference](docs/reference/platforms.md) | Codex、Claude Code、OpenCode 能力表 |
| [Generated Artifacts](docs/reference/generated-artifacts.md) | OpenCode 适配、compact、docs reference 的生成来源 |
| [OpenCode Guide](docs/platforms/opencode.md) | OpenCode 命令、Agent roles、model matrix 和边界 |
| [Codex Guide](docs/platforms/codex.md) | Codex 使用方式 |
| [Claude Code Guide](docs/platforms/claude-code.md) | Claude Code 使用方式 |

## 命令概览

| 类别 | 命令 |
|---|---|
| Pipeline | `/hw:start`, `/hw:resume`, `/hw:status`, `/hw:skip`, `/hw:stop`, `/hw:report`, `/hw:chat` |
| Plan | `/hw:plan`, `/hw:plan:discover`, `/hw:plan:decompose`, `/hw:plan:generate`, `/hw:plan:confirm`, `/hw:plan:extend`, `/hw:plan:review` |
| Lifecycle | `/hw:init`, `/hw:cycle`, `/hw:accept`, `/hw:reject`, `/hw:patch`, `/hw:patch fix`, `/hw:release` |
| Analysis/Review | `/hw:check`, `/hw:audit`, `/hw:debug` |
| Utility | `/hw:sync`, `/hw:docs`, `/hw:compact`, `/hw:knowledge`, `/hw:guide`, `/hw:showcase`, `/hw:rules`, `/hw:help`, `/hw:reset`, `/hw:log`, `/hw:setup`, `/hw:explore` |

完整表见 [Commands Reference](docs/reference/commands.md) 和 [OpenCode Command Map](references/opencode-command-map.md)。

## 恢复与边界

- `.pipeline/state.yaml`、`.pipeline/cycle.yaml`、`.pipeline/rules.yaml` 是受保护 authority 文件。
- Compact、PROJECT-SUMMARY、OpenCode adapter、docs references 是可重建派生物。
- `/hw:sync --check-only` 只检查不写入；`/hw:sync --repair` 只刷新声明为安全的派生物。
- Recent Events 是从 `.pipeline/log.yaml` 派生出的用户活动 feed；完整审计历史用 `/hw:log --full` 查看。
- secret-safe evidence 会在日志、报告、状态、dashboard 和 Knowledge surfaces 中保守脱敏。

## License

Hypo-Workflow 使用 MIT License，详见 [LICENSE](LICENSE)。
