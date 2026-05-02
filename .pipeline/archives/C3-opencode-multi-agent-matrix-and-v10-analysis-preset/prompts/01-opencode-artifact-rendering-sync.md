# M02 / F001 — OpenCode Artifact Rendering and Sync

## 实施计划

1. 基于 M01 的 matrix contract，阅读 `core/src/artifacts/opencode.js`、OpenCode command/agent 生成逻辑和相关 tests。
2. 先写 artifact rendering tests，覆盖 role-to-agent model、agent compaction、缺省值、override、旧配置兼容。
3. 更新 OpenCode artifact renderer，使 `hypo-workflow sync --platform opencode` 输出稳定的 agent definitions 和 compaction metadata。
4. 生成或更新角色 agent：`hw-test`、`hw-code-a`、`hw-code-b`、`hw-report`，并保持现有 `hw-plan` / `hw-build` / `hw-status` 等角色兼容。
5. 保持 `opencode.json` 官方 schema 兼容；Hypo-Workflow 自有 metadata 继续放在 `.opencode/hypo-workflow.json` 或等价侧车文件。
6. 更新 docs，说明 artifact 字段和 OpenCode 实际执行边界。

## 依赖

- M01
- `core/src/artifacts/opencode.js`
- `references/opencode-spec.md`
- `references/opencode-parity.md`
- `core/test/opencode*.test.js`

## 验证点

- 相同输入生成相同 OpenCode artifacts。
- Matrix 中的模型和 compaction 设置渲染到正确 agent。
- 旧项目没有 matrix 字段时仍生成旧式可用 artifacts。
- OpenCode 官方配置字段与 HW metadata 不混用。

## 约束

- 不生成 OpenCode 不接受的 top-level keys。
- 不破坏已有 command mapping、plugin scaffold、TUI status plugin。
- 不引入模型调用逻辑。

## 需求

- 更新 OpenCode artifact renderer。
- 增加多 agent model matrix 渲染。
- 增加 compaction settings 渲染和 fallback。

## 预期测试

- `node --test core/test/*.test.js`
- 相关 OpenCode artifact snapshot/fixture 测试。
- 如本机安装 OpenCode，可运行 `opencode debug config` smoke；未安装则在报告中说明。
- `git diff --check`

## 预期产出

- OpenCode artifact rendering 更新
- agent definitions 更新
- fixtures/tests 更新
- docs 更新
