# M0: Project Scaffold

## 需求
创建 hypo-todo Python CLI 项目骨架：
- pyproject.toml（使用 typer 做 CLI、pytest 做测试）
- src/hypo_todo/__init__.py
- src/hypo_todo/cli.py（入口，能运行 hypo-todo --help）
- tests/__init__.py
- tests/conftest.py

## 预期测试
- test_help_output: 运行 --help 返回 0 且输出包含 "Usage"
- test_version: 运行 --version 返回版本号

## 预期产出
- pyproject.toml 配置正确
- `hypo-todo --help` 可运行
- 目录结构完整
