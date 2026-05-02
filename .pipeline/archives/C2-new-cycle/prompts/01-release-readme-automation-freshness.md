# M02 / F001 — Release README Automation and Freshness Rule

## 实施计划

1. 读取 M01 的 `templates/readme-spec.md` 和当前 release/rules/config 实现。
2. 设计 README 动态渲染模块，优先从结构化资产读取数据，避免脆弱字符串拼接。
3. 实现 marker block 替换；仅在配置允许或明确判断原 README 不适配时考虑 full regeneration。
4. 将 `update_readme` 接入 `/hw:release` 文档与 OpenCode command guidance：版本更新后、commit 前执行。
5. 增加 `readme-freshness` 规则或检查面，覆盖版本、命令数量、平台矩阵、功能列表。
6. 补齐配置默认与 schema/docs：`release.readme.mode`、`release.readme.full_regen`。
7. 写测试并跑核心回归。

## 依赖

- M01 `templates/readme-spec.md`
- `skills/release/SKILL.md`
- `references/release-spec.md`
- `core/src/artifacts/opencode.js`
- `core/src/config/index.js`
- `config.schema.yaml`
- `core/test/*.test.js`

## 验证点

- release 文档和 OpenCode command guidance 都包含 `update_readme` 子步骤。
- README stale fixture 能触发 `readme-freshness`。
- marker block 替换不会破坏非托管 README 内容。
- full regeneration 在 strict/shared 策略下不会静默执行。

## 约束

- 不实际执行 git tag/push。
- 不把 README 生成器做成独立 runner；它是 release/check 体系中的工具能力。
- 现有单功能 `/hw:plan` 不受影响。

## 需求

- 实现 README 自动更新能力，从项目资产生成动态段落。
- `/hw:release` 增加 `update_readme` 子步骤，并在提交 release 前执行。
- 增加 `readme-freshness` pre-release 检测。
- 增加配置与文档：
  - `release.readme.mode: loose | strict`
  - `release.readme.full_regen: auto | ask | deny`
- 更新 README 本身的动态段落时，遵守 marker block 和 full regeneration 策略。

## 预期测试

- README render/replace 单元测试。
- stale README freshness 测试。
- release guidance/artifact 测试。
- config schema/default merge 测试。
- `node --test core/test/*.test.js`

## 预期产出

- README 更新模块或 helper。
- 更新后的 release skill/spec/rule/config 文档。
- `readme-freshness` 规则或检查实现。
- 新增/更新测试。
- 安全情况下更新 README 动态段落。
