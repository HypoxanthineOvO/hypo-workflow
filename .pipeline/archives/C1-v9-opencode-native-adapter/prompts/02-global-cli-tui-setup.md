# M2 — 全局 CLI/TUI Setup 重做

## 需求

- 新增全局命令 `hypo-workflow`，用于设置、安装、同步、doctor、profile 和项目适配初始化。
- `hypo-workflow` 不运行 pipeline；真正执行仍由 OpenCode / Codex / Claude Code Agent 完成。
- 首次启动默认进入 setup。
- 非首次启动进入简单 TUI 设置界面。
- 支持 profiles：
  - `default`
  - `codex`
  - `claude-code`
  - `opencode`
  - `team-strict`
- 支持命令：
  - `hypo-workflow setup`
  - `hypo-workflow doctor`
  - `hypo-workflow sync`
  - `hypo-workflow profile list|use|edit`
  - `hypo-workflow install opencode|codex|claude`
  - `hypo-workflow init-project`

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- CLI 测试：
  - 首次运行能生成全局配置
  - profile list/use/edit 行为正确
  - doctor 能检查 OpenCode/Codex/Claude 安装状态
  - init-project 能调用 core 生成项目适配文件

## 预期产出

- `cli/` 或 `packages/cli/`
- 可执行入口：`hypo-workflow`
- TUI/wizard 实现
- profile schema
- CLI 文档
- 回归场景：`tests/scenarios/v9/s53-global-cli-tui-setup/`

## 约束

- CLI/TUI 只管理设置，不执行 prompt pipeline。
- 需要兼容无 TTY 场景，提供非交互 flags 或 graceful fallback。
- 不能破坏现有 `/hw:setup`；旧 setup 可转为调用或提示全局 CLI。
