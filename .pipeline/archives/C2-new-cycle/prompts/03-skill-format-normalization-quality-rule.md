# M04 / F002 — Skill Format Normalization and Skill-Quality Rule

## 实施计划

1. 读取 M03 的 `references/skill-spec.md` 和问题清单。
2. 对 Skill 文件做保守规范化：修正明显 heading 不一致、过时兼容文案、缺失 reference 提示。
3. 增加 `skill-quality` 检查或规则面，覆盖 frontmatter、必需章节、引用路径、command map、内部 Skill 例外。
4. 更新 `references/rules-spec.md`、`skills/check/SKILL.md`、`skills/rules/SKILL.md` 或核心规则实现，使检查入口清晰。
5. 添加测试，确保问题能被捕获，同时不误报 `watchdog` 等内部 Skill。

## 依赖

- M03 `references/skill-spec.md`
- `skills/*/SKILL.md`
- `core/src/rules/index.js`
- `rules/builtin/*`
- `core/test/commands-rules-artifacts.test.js`

## 验证点

- `skills/showcase/SKILL.md` 等已知格式问题被修复。
- stale `/hw:review` V7 compatibility wording 被清理或改成当前版本语义。
- `skill-quality` 不改变命令映射数量。
- 没有 Skill 被删除或静默重命名。

## 约束

- 格式化和文案调整必须保持触发描述准确。
- 大段内容外移到 references/examples/scripts 时，要保留原 Skill 的 progressive disclosure 入口。
- 不引入和当前 Codex/Claude/OpenCode 适配冲突的新约定。

## 需求

- 按 M03 规范整理 Skill 文件。
- 增加 `skill-quality` rule/checking surface。
- 确保三个平台的 Skill/command 映射清晰可查。
- 修复已知本地坑：非标准 output-language heading、过时 review 兼容文字、内部 Skill 例外说明。

## 预期测试

- `skill-quality` fixture 覆盖：
  - 缺 frontmatter；
  - 缺 Output Language Rules；
  - 引用文件不存在；
  - command map 指向不存在 Skill；
  - internal watchdog 例外。
- `node --test core/test/*.test.js`

## 预期产出

- 更新后的 Skill 文件。
- `skill-quality` 规则/检查实现和文档。
- 新增/更新测试。
- 平台映射说明更新。
