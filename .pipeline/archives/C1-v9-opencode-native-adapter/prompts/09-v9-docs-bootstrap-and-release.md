# M9 — V9 文档、自举与发布

## 需求

- 更新公开文档和 release 资产，完成 V9 发布。
- README 覆盖：
  - OpenCode 支持
  - OpenCode plugin 安装
  - 全局 `hypo-workflow` CLI/TUI setup
  - profiles
  - OpenCode command mapping
  - Ask / agents / todowrite / permissions
  - auto continue 默认 safe
  - full V8.4 parity
- 更新 CHANGELOG。
- 更新版本号到 V9。
- 自举生成 OpenCode 项目适配产物，验证 Hypo-Workflow 自己可作为 OpenCode 项目使用。
- 同步全局安装位置。

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- `git diff --check`
- OpenCode scaffold 静态验证通过。
- 全局安装副本版本一致。
- release tag 和 remote refs 正确。

## 预期产出

- README V9 文档
- CHANGELOG V9 entry
- version bump
- OpenCode bootstrap artifacts
- release commit/tag
- GitHub release notes

## 约束

- 不发布未通过 regression 的版本。
- release 前确认 Codex/Claude 现有路径仍通过。
- 如果 OpenCode runtime 不可用，文档必须明确当前验证范围是 scaffold/static smoke。
