# Changelog

## v8.4.0 - 2026-04-30

### Features

- 新增 `/hw:rules`，用于列出规则、调整严格度、创建自定义 Markdown 规则，并导入/导出规则包。
- 新增 `rules/builtin/`，内置 12 条规则，覆盖 guard、style、hook 和 workflow 四类语义标签。
- 新增 `rules/presets/`，提供 `recommended`、`strict`、`minimal` 三套规则集。
- 新增 `.pipeline/rules.yaml` 和 `.pipeline/rules/custom/`，作为项目侧规则配置和自然语言规则入口。
- 新增 `scripts/rules-summary.sh`，供 hook 和测试稳定汇总有效规则、启用数量和 always 规则。

### Improvements

- SessionStart Hook 现在注入 Rules Context，让 active `always` 规则在会话恢复时持续生效。
- `/hw:init` 和 `/hw:setup` 文档加入 Rules 初始化和默认规则集说明。
- `config.schema.yaml` 支持 `rules.extends` 和 `rules.rules`，保持旧项目向后兼容。
- README、命令规范、配置规范和 Showcase 自举物料更新到 V8.4，用户指令数更新为 30。

### Tests

- 新增 `s50-rules-system` 回归场景，覆盖规则资产、命令注册、helper 输出和 SessionStart 注入。
- 回归测试扩展为 `50/50`。
