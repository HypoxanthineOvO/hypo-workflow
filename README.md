<div align="center">

# Hypo-Workflow

**面向 AI Agent 的串行工作流引擎**

Plan -> Execute -> Review -> Report -> Recover -> Showcase

[![Version](https://img.shields.io/badge/version-8.4.0-blue)](.claude-plugin/plugin.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Claude%20Code%20%7C%20Codex-purple)](#平台支持)

</div>

---

## 概览

Hypo-Workflow 把长周期 AI Agent 工作变成可规划、可恢复、可审查的本地工作流。你不需要让 Agent 在一个脆弱会话里“一次做完所有事”，而是给它一个 `.pipeline/` 工作区，用文件记录 prompts、状态、日志、报告和生命周期数据。

核心执行循环：

```text
Plan -> Prompt -> Step Chain -> Tests -> Review -> Report -> Evaluate -> Next / Stop
```

它不是 SaaS，也不是后台 daemon。它是一套 Skill 驱动的仓库结构，Claude Code 和 Codex 都可以直接读取并执行。

### 它提供什么

| 能力 | 说明 |
|---|---|
| Pipeline 执行 | 按 TDD、implement-only 或 custom preset 串行执行 prompts |
| 中断恢复 | 用 `state.yaml`、heartbeat、log 和 PROGRESS 保留可恢复状态 |
| Plan Mode | 支持交互式/自动规划、需求澄清、里程碑拆解、生成、确认和扩展 |
| Lifecycle | 覆盖 init、check、audit、debug、release、cycle archive 等项目生命周期动作 |
| Patch Track | 用 `P001` 轨道记录小问题，并可通过 Patch Fix 直接修复 |
| Context Compact | 生成 `.compact` 视图，减少 SessionStart 加载上下文 |
| Showcase | 生成项目介绍文档、技术文档、Markdown slides 和可选海报 |
| Rules | 统一管理规则严格度、生命周期钩子、自然语言偏好和规则包 |
| 多平台 | Claude Code 使用 `/hypo-workflow:*`，Codex 使用兼容命令 `/hw:*` |

当前版本提供 **30 个用户指令**，另有一个内部 watchdog skill。

---

## 快速开始

### 1. 安装

Claude Code：

```bash
/plugin marketplace add HypoxanthineOvO/Hypo-Workflow
/plugin install hypo-workflow@hypoxanthine-hypo-workflow
```

Codex：

```text
Use $skill-installer to install the GitHub repo HypoxanthineOvO/Hypo-Workflow with path . as skill name hypo-workflow
```

手动安装：

```bash
git clone https://github.com/HypoxanthineOvO/Hypo-Workflow.git ~/.claude/skills/hypo-workflow
```

### 2. 初始化全局配置

```text
/hw:setup
```

该命令会创建 `~/.hypo-workflow/config.yaml`，用于保存平台、执行模式、subagent、dashboard、输出语言和默认行为。项目内的 `.pipeline/config.yaml` 优先级更高。

### 3. 初始化项目

```text
/hw:init
```

如果这是一个已经有 Git 历史的旧项目：

```text
/hw:init --import-history
/hw:init --import-history --interactive
```

### 4. 规划并执行

```text
/hw:plan
/hw:start
```

如果会话中断：

```text
/hw:status
/hw:resume
```

### 5. 生成项目展示物料

```text
/hw:showcase --all
```

生成结果位于 `.pipeline/showcase/`。

---

## 指令简介

Claude Code 用户可以调用 `/hypo-workflow:<command>`。Codex 用户可以调用 `/hw:<command>`。

#### 设置

| 指令 | 用途 |
|---|---|
| `/hw:setup` | 创建或更新 `~/.hypo-workflow/config.yaml` |

#### Pipeline

| 指令 | 用途 |
|---|---|
| `/hw:start` | 从第一个可执行 prompt 开始或继续执行 |
| `/hw:resume` | 从中断或停止状态继续 |
| `/hw:status` | 查看当前进度；`--full` 可跳过 compact 视图 |
| `/hw:skip` | 安全跳过当前 prompt 或 step |
| `/hw:stop` | 优雅停止并持久化状态 |
| `/hw:report` | 查看报告摘要；`--view M<N>` 查看完整报告 |

#### Plan

| 指令 | 用途 |
|---|---|
| `/hw:plan` | 进入 Plan Mode |
| `/hw:plan --context audit,patches,deferred,debug` | 把已有证据注入 Discover 阶段 |
| `/hw:plan:discover` | 收集需求、约束和仓库上下文 |
| `/hw:plan:decompose` | 拆分 Milestones |
| `/hw:plan:generate` | 生成 `.pipeline/` prompts 和配置 |
| `/hw:plan:confirm` | 确认生成的计划 |
| `/hw:plan:extend` | 在 active Cycle 中追加 Milestones |
| `/hw:plan:review` | 审查架构漂移和下游 prompt 影响 |

#### 生命周期

| 指令 | 用途 |
|---|---|
| `/hw:init` | 初始化或重新扫描 `.pipeline/` |
| `/hw:check` | 检查 config、state、prompts 和 architecture 健康度 |
| `/hw:audit` | 执行预防性代码审计 |
| `/hw:debug` | 分析具体故障 |
| `/hw:release` | 执行 release 自动化 |
| `/hw:cycle` | 管理交付 Cycle 和 archives |
| `/hw:patch` | 创建、列出、关闭和修复轻量 Patch |
| `/hw:patch fix` | 执行六步 Patch Fix 流程 |

#### 工具

| 指令 | 用途 |
|---|---|
| `/hw:help` | 查看分组帮助或单个指令帮助 |
| `/hw:reset` | 重置运行状态或生成物 |
| `/hw:log` | 查看 lifecycle log；`--full` 可跳过 compact log |
| `/hw:compact` | 生成 compact 上下文文件 |
| `/hw:guide` | 交互式推荐下一步操作 |
| `/hw:showcase` | 生成项目介绍物料 |
| `/hw:rules` | 管理规则、严格度、自定义规则和规则包 |
| `/hw:dashboard` | 启动 WebUI dashboard |

`/hw:review` 是兼容别名，会提示迁移到 `/hw:plan:review`。

---

## 常见 Workflow

### 新项目

```text
/hw:setup
/hw:init
/hw:plan
/hw:start
```

适合还没有 `.pipeline/` 的仓库。`init` 会理解项目结构，`plan` 会拆解 Milestones，`start` 开始执行。

### 旧项目接入

```text
/hw:init --import-history --interactive
/hw:cycle list
/hw:plan --context deferred
```

History Import 会把 Git first-parent 历史导入 Cycle 0 Legacy，并把当前工作保留在 Cycle 1。

### 中断后继续

```text
/hw:status
/hw:resume
```

`state.yaml` 保存当前 prompt、step 和 heartbeat。Claude Code 的 SessionStart hook 还可以自动重新注入状态上下文。

### 修一个小问题，不开 Milestone

```text
/hw:patch "Fix login layout regression" --severity normal
/hw:patch fix P001
```

Patch Fix 是小修复专用流程：

1. Step 1: 读取 Patch
2. Step 2: 定位代码
3. Step 3: 修复
4. Step 4: 测试
5. Step 5: 提交
6. Step 6: 关闭

它不会进入 Plan Discover，不会跑完整 TDD pipeline，不会写 `state.yaml`，也不会生成 `report.md`。

### 审计后规划

```text
/hw:audit
/hw:plan --context audit
```

适合把审计发现转成结构化 Milestones。

### 降低上下文加载

```text
/hw:compact
/hw:status
/hw:log --full
```

Compact 文件是派生视图，用来减少 SessionStart 上下文，但不会替代原始文件。

### 生成项目物料

```text
/hw:showcase --all
/hw:showcase --new --doc
```

Showcase 会生成 `PROJECT-INTRO.md`、`TECHNICAL-DOC.md`、`slides.md`，以及可选的 `poster.png`。

### 调整项目规则

```text
/hw:rules list
/hw:rules set git-clean-check error
/hw:rules create prefer-chinese-comments
```

Rules 可以把原本散落在 Hook、config 和 Skill 里的行为约束集中管理。`warn` 只提醒，`error` 会成为门禁。

### 关闭一个交付周期

```text
/hw:cycle close
/hw:cycle new "Next release" --type feature --context patches,deferred
```

Cycle close 会归档 Cycle 内的 state、prompts、reports、PROGRESS、deferred items 和 summary。

---

## 指令详解

### `/hw:init`

初始化 `.pipeline/`。支持空仓库、已有代码仓库和已有 pipeline。

常用参数：

| 参数 | 行为 |
|---|---|
| `--rescan` | 重新扫描已有 pipeline 的 architecture baseline |
| `--folder` | 强制输出 folder-style architecture |
| `--single` | 强制输出单文件 architecture |
| `--import-history` | 把当前 Git first-parent 历史导入 Cycle 0 Legacy |
| `--interactive` | 与 `--import-history` 配合，先预览拆分方案并等待确认 |

History Import 的拆分信号顺序是：tag、milestone keyword、merge commit、time gap。

### `/hw:plan`

Plan Mode 在执行前生成可落地的 Milestones。

阶段：

```text
discover -> decompose -> generate -> confirm
```

Interactive 模式会强制问题轮次和明确确认。Auto 模式只在缺少关键信息时停下。

Context 注入：

| 来源 | 读取内容 |
|---|---|
| `audit` | 最新 `.pipeline/audits/` 报告 |
| `patches` | open `.pipeline/patches/P*.md` |
| `deferred` | archives 中的 `deferred.yaml` 和 Legacy summary |
| `debug` | 最新 `.pipeline/debug/` 报告 |

### `/hw:start` 和 `/hw:resume`

执行阶段根据 preset 展开步骤：

| Preset | 步骤 |
|---|---|
| `tdd` | write_tests -> review_tests -> run_tests_red -> implement -> run_tests_green -> review_code |
| `implement-only` | implement -> run_tests -> review_code |
| `custom` | 用户自定义 sequence |

运行过程中会更新：

- `.pipeline/state.yaml`
- `.pipeline/log.yaml`
- `.pipeline/PROGRESS.md`
- `.pipeline/reports/`
- `last_heartbeat`

### `/hw:cycle`

Cycle 用于把一组 Milestones 作为交付周期管理。

```text
/hw:cycle new "V8 implementation" --type feature --context audit,patches
/hw:cycle list
/hw:cycle view C1
/hw:cycle close --paused
/hw:cycle close --reason "superseded by upstream rewrite"
```

Cycle type 到 preset 的默认映射：

| Type | 默认 preset |
|---|---|
| `feature`, `refactor` | `tdd` |
| `bugfix`, `spike`, `hotfix` | `implement-only` |

### `/hw:patch`

Patch 是 `.pipeline/patches/` 下的持久轻量问题记录。

```text
/hw:patch "Fix X" --severity critical
/hw:patch list --open
/hw:patch close P001
/hw:patch fix P001 P003
```

Patch ID 全局递增，不随 Cycle 重置。

### `/hw:compact`

生成派生 compact 文件：

```text
.pipeline/PROGRESS.compact.md
.pipeline/state.compact.yaml
.pipeline/log.compact.yaml
.pipeline/reports.compact.md
.pipeline/patches.compact.md
```

SessionStart 会优先加载 compact 版本；缺失时回退到完整文件。

### `/hw:showcase`

生成项目展示物料：

```text
/hw:showcase
/hw:showcase --all
/hw:showcase --doc
/hw:showcase --slides
/hw:showcase --poster
/hw:showcase --new --all
```

无参数时会询问要生成哪些物料并等待用户回复。`--new` 会把旧版本归档到 `.pipeline/showcase/history/v<N>/`。

### `/hw:rules`

管理项目规则系统：

```text
/hw:rules
/hw:rules list --active
/hw:rules list --label guard
/hw:rules enable git-clean-check
/hw:rules disable commit-format
/hw:rules set git-clean-check error
/hw:rules create prefer-chinese-comments
/hw:rules pack export team-rules
/hw:rules pack import github:hypoxanthine/hw-rules-chinese
```

规则严格度：

| 严格度 | 行为 |
|---|---|
| `off` | 禁用，不加载 |
| `warn` | 输出警告但继续 |
| `error` | 作为门禁阻断执行 |

内置 preset：

| Preset | 用途 |
|---|---|
| `recommended` | 默认推荐规则集 |
| `strict` | guard/workflow 更严格，适合团队或发布前 |
| `minimal` | 只保留 hook 安全规则 |

项目规则位于 `.pipeline/rules.yaml`，自定义自然语言规则位于 `.pipeline/rules/custom/`。

### `/hw:release`

执行 release 自动化。通常包括 regression、validate、版本更新、changelog 检查、commit 和发布步骤。可用 `--dry-run` 预览。

---

## 架构与内部细节

### 仓库结构

```text
Hypo-Workflow/
├── SKILL.md                    # 根命令路由和运行规则
├── skills/                     # 30 个用户指令 + 内部 watchdog
├── plan/PLAN-SKILL.md          # Plan Mode 二级入口
├── rules/                      # 内置规则、presets 和自定义规则模板
├── references/                 # 详细行为规范
├── templates/                  # 根 fallback 模板
├── templates/en/               # 英文模板
├── templates/zh/               # 中文模板
├── assets/                     # 状态/报告资产和配置示例
├── scripts/                    # 辅助脚本
├── hooks/                      # Claude Code hook
├── adapters/                   # source/output adapter 契约
├── dashboard/                  # WebUI dashboard
└── tests/scenarios/            # 回归场景
```

### `.pipeline/` 工作区

```text
.pipeline/
├── config.yaml                 # 项目配置
├── state.yaml                  # 运行状态，通常不进 git
├── log.yaml                    # 生命周期日志
├── PROGRESS.md                 # 人类可读进度
├── architecture.md             # 架构基线
├── prompts/                    # Milestone prompts
├── reports/                    # Milestone reports
├── archives/                   # 已关闭 Cycle 归档
├── patches/                    # 持久 Patch 轨道
├── rules.yaml                  # 项目规则配置
├── rules/custom/               # 用户自定义自然语言规则
└── showcase/                   # 项目展示物料
```

### 状态模型

`state.yaml` 记录：

- pipeline status
- current prompt and step
- step index
- milestone statuses
- prompt state
- completed history
- heartbeat

`log.yaml` 记录 milestone 完成、patch fix、audit、debug、release、plan review 等生命周期事件。`PROGRESS.md` 面向人类阅读。

### Progressive Disclosure

Hypo-Workflow 用分层加载控制上下文：

1. 读取根 `SKILL.md` 做命令路由。
2. 只加载相关的 `skills/<command>/SKILL.md`。
3. 需要时再读取 references、templates、assets 和 scripts。
4. 大型运行时上下文优先使用 `.compact` 文件。

### Rules

Rules 将行为约束独立成可组合维度：

```text
rules/builtin/       # 12 条内置规则
rules/presets/       # recommended / strict / minimal
.pipeline/rules.yaml # 项目规则配置
.pipeline/rules/custom/*.md
```

内置规则覆盖 guard、style、hook、workflow 四类语义标签。真正影响执行的是严格度和生命周期钩子点：

```text
on-session-start, pre-milestone, post-milestone,
pre-step, post-step, pre-commit, on-fail,
on-evaluate, always
```

`always` 规则会在 SessionStart 时通过 `scripts/rules-summary.sh` 注入上下文，让 Agent 持续遵守。

### Hooks

Claude Code hooks 是被动安全网：

| Hook | 作用 |
|---|---|
| `stop-check.sh` | Pipeline 运行中阻止误停 |
| `session-start.sh` | 启动/恢复/compact 后注入状态和 compact context |
| `instructions-loaded.sh` | 观察指令重新加载 |
| `codex-notify.sh` | Codex turn-complete 通知 fallback |

Codex 没有 Claude hook 语义，但仍可通过文件恢复。

### i18n

用户可见输出跟随 `output.language`：

| 配置 | 模板路径 |
|---|---|
| `zh-CN`, `zh` | `templates/zh/` |
| `en`, `en-US` | `templates/en/` |
| 本地化模板缺失 | 根目录 `templates/` fallback |

内部 `state.yaml` 和 `log.yaml` key 始终保持英文。

---

## 配置

### 最小项目配置

```yaml
pipeline:
  name: "My Project"
  source: local
  output: local
  prompts_dir: .pipeline/prompts
  reports_dir: .pipeline/reports

execution:
  mode: self
  steps:
    preset: tdd

evaluation:
  auto_continue: false
  max_diff_score: 3
  checks:
    - tests_pass
    - no_regressions
    - matches_plan
    - code_quality
```

### 常用可选配置

```yaml
output:
  language: zh-CN
  timezone: Asia/Shanghai

plan:
  mode: interactive
  interaction_depth: medium
  interactive:
    min_rounds: 3
    require_explicit_confirm: true

watchdog:
  enabled: false
  interval: 300
  heartbeat_timeout: 300
  max_retries: 5

compact:
  auto: true
  progress_recent: 15
  state_history_full: 1
  log_recent: 20
  reports_summary_lines: 3

showcase:
  language: auto
  poster:
    api_key_env: OPENAI_API_KEY
    size: "1024x1536"
    quality: high
    style: auto

rules:
  extends: recommended
  rules:
    git-clean-check: warn
    commit-format: off
```

### Notion Adapter

```yaml
pipeline:
  source: notion
  output: local

notion:
  token_file: ./Notion-API.md
  source_database_id: "..."
  output_parent_page_id: "..."
```

Token 解析顺序：

1. `NOTION_TOKEN`
2. `notion.token_file`

---

## 平台支持

### Claude Code

- 原生 `/hypo-workflow:*` skills
- Marketplace metadata 位于 `.claude-plugin/marketplace.json`
- 支持 Stop 和 SessionStart hooks
- 可配置 Codex 作为 subagent

### Codex

- 使用根 `SKILL.md` 和 `/hw:*`
- Metadata 位于 `.codex-plugin/plugin.json`
- 可配置 Claude 作为 subagent
- Hook 行为降级，但文件恢复仍可用

### Subagent 示例

```yaml
execution:
  mode: self

step_overrides:
  implement:
    executor: subagent
    subagent: codex
  review_code:
    reviewer: self
```

---

## 验证

本仓库使用以下检查：

```bash
claude plugin validate .
python3 tests/run_regression.py
git diff --check
```

当前预期回归数量为 `50/50`。

---

## Changelog

### v8.4.0

- Added `/hw:rules` for rule listing, severity changes, custom Markdown rules, and shareable rule packs.
- Added `rules/builtin/` with 12 built-in rules and `rules/presets/` for `recommended`, `strict`, and `minimal`.
- Added `.pipeline/rules.yaml` and `.pipeline/rules/custom/` as the project-side rules surface.
- Added `scripts/rules-summary.sh` and SessionStart integration so active `always` rules are injected into context.
- Added `rules.*` config schema support and Rules initialization guidance for `/hw:init`.
- Updated the public command set to 30 user-facing commands.

### v8.3.0

- Added `/hw:showcase` for project intro docs, technical docs, Markdown slides, and optional GPT Image posters.
- Added the `showcase` preset and `.pipeline/showcase/` lifecycle with reuse, `--new` archive history, `showcase.yaml`, and review summaries.
- Added localized template directories under `templates/en/` and `templates/zh/`, with root template fallback.
- Strengthened i18n rules so user-facing output, reports, PROGRESS, and PROJECT-SUMMARY follow `output.language`.
- Bootstrapped Hypo-Workflow's own Chinese showcase artifacts under `.pipeline/showcase/`.
- Updated the public command set to 29 user-facing commands.

### v8.2.0

- Added `/hw:patch fix P<N>` for direct lightweight Patch repairs with independent commits, Patch closure, PROGRESS updates, and `patch_fix` log events.
- Added `/hw:compact` and compact context views for progress, state, log, reports, and closed Patches.
- Updated SessionStart to prefer `.compact` files, fallback to full files, and keep current prompt/report plus open Patches complete.
- Added `/hw:status --full`, `/hw:log --full`, and `/hw:report --view <M>` for on-demand full data loading.
- Added `/hw:guide` as an interactive project-aware command guide.
- Updated the public command set to 28 user-facing commands.

### v8.1.0

- Extended `/hw:init` with `--import-history` for importing Git first-parent history into Cycle 0 Legacy.
- Added `--interactive` preview mode for History Import split plans.
- Added `templates/legacy-report.md` for non-TDD legacy milestone reports.
- Added `history_import.*` config for split method, time-gap threshold, milestone cap, and keyword patterns.
- Updated Cycle and Plan context behavior so Cycle 0 Legacy appears in `/hw:cycle list`, `/hw:cycle view 0`, and deferred context.

### v8.0.0

- Added `/hw:cycle new|list|view|close` for explicit delivery Cycles, archives, deferred items, and project summaries.
- Added `/hw:patch` for persistent lightweight fixes with global `P001` numbering and severity filtering.
- Added `/hw:plan:extend` for appending milestones to an active Cycle.
- Added `/hw:plan --context audit,patches,deferred,debug` to preload Discover with existing evidence.
- Added optional Auto Resume watchdog support with heartbeat, lockfile, cron, and retry backoff.
- Added `output.language` and `output.timezone` for reports and `PROGRESS.md`.
- Strengthened Interactive Plan gates with minimum question rounds and explicit P2/P4 confirmation.
- Updated the public command set to 25 user-facing commands.

| Version | Milestone |
|---|---|
| V0 | Core state machine and TDD pipeline |
| V0.5 | Skip cascade and evaluation blocking |
| V1 | Subagent delegation with fallback |
| V2.5 | Progressive Disclosure and plugin packaging |
| V3 | Claude Code Hook integration |
| V4 | Multi-dimensional evaluation and architecture drift |
| V4.5 | Namespaced `/hw:*` commands |
| V5 | Plan Mode and Plan Review |
| V5.1 | Notion source/output adapters |
| V6 | Lifecycle commands and unified `log.yaml` |
| V6.1 | Claude marketplace and Codex plugin metadata |
| V6.2 | Native skills, hooks, PROGRESS, and failure triage |
| V7 | Setup wizard and WebUI dashboard |
| V7.1 | Global config and platform-specific subagent docs |
| V8 | Interactive gates, Cycles, Patches, Plan Extend, Watchdog |
| V8.1 | History Import and Cycle 0 Legacy |
| V8.2 | Patch Fix, Context Compact, full-view flags, Interactive Guide |
| V8.3 | Showcase preset and i18n template loading |

---

## License

MIT
