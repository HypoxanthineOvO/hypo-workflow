<div align="center">

# Hypo-Workflow

**面向 AI Agent 的本地工作流协议**

规划 -> 执行 -> 审查 -> 报告 -> 恢复

[![Version](https://img.shields.io/badge/version-11.1.0-blue)](.claude-plugin/plugin.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Codex%20%7C%20Claude%20Code%20%7C%20OpenCode%20%7C%20Cursor%20%7C%20Copilot%20%7C%20Trae-purple)](docs/reference/platforms.md)

</div>

Hypo-Workflow 把长周期 AI 编程工作组织成可规划、可恢复、可审查的本地流程。它不是任务运行器，也不是后台服务；实际编码、测试和审查由你当前使用的智能体完成，`.pipeline/` 保存状态、周期、补丁、规则、进度、提示、报告和日志。

## 快速开始

把仓库 `HypoxanthineOvO/Hypo-Workflow`（或 `https://github.com/HypoxanthineOvO/Hypo-Workflow`）交给你的 IDE / 智能体，让它阅读本 README 和对应平台入口完成安装或导入。

主路径：

```text
/hw:init -> /hw:plan -> /hw:start
```

查看状态并继续：

```text
/hw:status -> /hw:resume
```

## 平台入口

| 平台 | 接入方式 | 入口 |
|---|---|---|
| Codex | 安装或同步 Skill 后，直接使用 `/hw:*` 指令 | [Codex Guide](docs/platforms/codex.md) |
| Claude Code | 安装 plugin / skill，使用 `/hw:*` 指令和 Claude Code Hooks | [Claude Code Guide](docs/platforms/claude-code.md) |
| OpenCode | 在项目中生成原生 commands、agents、plugins | `hypo-workflow init-project --platform opencode --project .` |
| Cursor | 生成仓库规则 `.cursor/rules/hypo-workflow.mdc` | `hypo-workflow sync --platform cursor --project .` |
| GitHub Copilot | 生成 `.github/copilot-instructions.md` | `hypo-workflow sync --platform copilot --project .` |
| Trae | 生成 `.trae/rules/project_rules.md` | `hypo-workflow sync --platform trae --project .` |

第三方 IDE 的规则文件是仓库指令：它们帮助智能体学会读取 Hypo-Workflow 的 README、命令语义和 `.pipeline/` 文件协议，但不声明平台会自动安装、自动执行钩子或强制生命周期。

## 工作原则

- `.pipeline/state.yaml`、`.pipeline/cycle.yaml`、`.pipeline/rules.yaml` 是受保护 authority 文件。
- Codex Subagents 优先用于非平凡 Codex 工作；实现与测试/审查要尽量分离，Codex Subagents 保持在 Codex/GPT 运行时内。
- 完成前做交付前检查：格式、派生产物、README/文档新鲜度、secret marker、测试证据和报告证据。
- 自动化等级由 `.pipeline/config.yaml` 的 `automation.level` 决定；发布、破坏性操作和外部副作用仍按配置确认点执行。

当前版本提供 **36 个用户指令**，另有 **1 个内部 watchdog** skill。

## 常用命令

| 场景 | 命令 |
|---|---|
| 初始化或重新扫描项目 | `/hw:init` |
| 规划一个功能 | `/hw:plan` |
| 规划多个 Feature | `/hw:plan --batch` |
| 开始或继续执行 | `/hw:start` / `/hw:resume` |
| 查看状态和最近事件 | `/hw:status` |
| 查看报告 | `/hw:report` |
| 小修复不进完整 Milestone | `/hw:patch` / `/hw:patch fix P001` |
| 修复派生上下文 | `/hw:sync --repair` |
| 检查或修复文档 | `/hw:docs check` / `/hw:docs repair` |
| 压缩长上下文 | `/hw:compact` |
| 引导下一步 | `/hw:guide` |
| 查看或调整规则 | `/hw:rules` |
| 隔离探索 | `/hw:explore` |
| 接受或拒绝交付 | `/hw:accept` / `/hw:reject` |

## 命令概览

| 类别 | 命令 |
|---|---|
| Pipeline | `/hw:start`, `/hw:resume`, `/hw:status`, `/hw:skip`, `/hw:stop`, `/hw:report`, `/hw:chat` |
| Plan | `/hw:plan`, `/hw:plan:discover`, `/hw:plan:decompose`, `/hw:plan:generate`, `/hw:plan:confirm`, `/hw:plan:extend`, `/hw:plan:review` |
| Lifecycle | `/hw:init`, `/hw:cycle`, `/hw:accept`, `/hw:reject`, `/hw:patch`, `/hw:patch fix`, `/hw:release` |
| Analysis/Review | `/hw:check`, `/hw:audit`, `/hw:debug` |
| Utility | `/hw:sync`, `/hw:docs`, `/hw:compact`, `/hw:knowledge`, `/hw:guide`, `/hw:showcase`, `/hw:rules`, `/hw:help`, `/hw:reset`, `/hw:log`, `/hw:setup`, `/hw:explore` |

完整映射见 [Commands Reference](docs/reference/commands.md) 和 [OpenCode Command Map](references/opencode-command-map.md)。

## 文档入口

| 文档 | 用途 |
|---|---|
| [User Guide](docs/user-guide.md) | 常见流程、恢复、Feature Queue |
| [Developer Guide](docs/developer.md) | 核心 helper、权限边界、派生产物和测试约定 |
| [Commands Reference](docs/reference/commands.md) | 36 个标准命令和 OpenCode 映射 |
| [Platforms Reference](docs/reference/platforms.md) | 六个平台能力表 |
| [Generated Artifacts](docs/reference/generated-artifacts.md) | OpenCode、第三方适配、压缩视图和文档引用的生成来源 |
| [OpenCode Guide](docs/platforms/opencode.md) | OpenCode 指令、智能体角色、模型矩阵和边界 |
| [Cursor Guide](docs/platforms/cursor.md) | Cursor 仓库规则 |
| [GitHub Copilot Guide](docs/platforms/copilot.md) | GitHub Copilot 仓库指令 |
| [Trae Guide](docs/platforms/trae.md) | Trae 项目规则 |

## 许可证

Hypo-Workflow 使用 MIT License，详见 [LICENSE](LICENSE)。
