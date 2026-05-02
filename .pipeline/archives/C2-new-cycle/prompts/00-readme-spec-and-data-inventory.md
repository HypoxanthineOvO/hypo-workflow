# M01 / F001 — README Spec and Dynamic Data Inventory

## 实施计划

1. 阅读当前 `README.md`、`references/release-spec.md`、`references/commands-spec.md`、`references/platform-capabilities.md`、`references/opencode-command-map.md`、`core/src/commands/index.js`、`core/src/config/index.js`、`skills/*/SKILL.md`。
2. 梳理 README 中应自动维护的动态信息：版本号、命令数量、Skill/command 列表、功能列表、平台矩阵、release/profile 状态、文档入口。
3. 设计 `templates/readme-spec.md`，明确 README 结构、动态段落、数据来源、marker block 语法、替换策略、完整重生成触发条件。
4. 在设计文档中记录宽松本地默认与严格发布/共享配置的区别。
5. 准备后续 M02 可直接消费的数据源清单和测试夹具建议。

## 依赖

- C2 Discover 记录：`.pipeline/design-spec.md`
- 当前命令映射：`core/src/commands/index.js`
- 当前平台材料：`references/platform-capabilities.md`、`references/opencode-*.md`

## 验证点

- `templates/readme-spec.md` 中每个动态段落都能追溯到明确数据源。
- README marker-block 默认替换边界清晰，不要求 M01 实现生成器。
- 完整重生成策略包含默认仅替换、英文/过时 README 自动判断、严格 profile 确认/拒绝。

## 约束

- 本 Milestone 不实现 release 自动更新逻辑。
- 不改 `.pipeline/state.yaml`、`.pipeline/cycle.yaml`、`.pipeline/rules.yaml`。
- 不删除 README 现有人工内容，除非只是记录问题。

## 需求

- 创建 `templates/readme-spec.md`，作为 README 自动维护的规范结构和数据来源合同。
- 记录 README 动态段落的所有输入来源，至少覆盖版本、命令数量、功能列表、平台矩阵、Skill/command 映射、release 行为。
- 明确 marker block 替换为默认行为。
- 明确 full regeneration 的宽松/严格策略：
  - 本地默认可以宽松；
  - 发布给别人或 strict profile 应要求确认或拒绝；
  - 当原 README 明显是英文模板、过时结构或缺失 marker 时，可进入自动重生成候选。

## 预期测试

- 手动检查 `templates/readme-spec.md` 的章节与当前项目资产一致。
- 使用 `rg` 验证 spec 中引用的数据源文件存在。
- 若新增测试夹具，确保 YAML/Markdown 可解析。
- 保持 `node --test core/test/*.test.js` 可运行；若未运行需说明原因。

## 预期产出

- `templates/readme-spec.md`
- README 动态数据源清单，写入 `templates/readme-spec.md` 或相关 reference。
- M02 可执行的 README 更新设计边界。
