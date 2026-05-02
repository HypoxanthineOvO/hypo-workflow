# M02 / F001 — OpenCode Artifact Rendering and Sync Report

## 结果

- Result: pass
- Diff score: 2
- Code quality: 4

## 完成内容

- 将 M01 的 OpenCode model matrix 渲染到生成的 `.opencode/agents/*.md` frontmatter。
- 新增并生成角色 agent：
  - `hw-compact`
  - `hw-test`
  - `hw-code-a`
  - `hw-code-b`
  - `hw-report`
- 为现有角色绑定模型：
  - `hw-plan` 使用 `plan`
  - `hw-build` / `hw-code-a` 使用 `code-a`
  - `hw-debug` 使用 `debug`
- 将 `/hw:report`、`/hw:compact`、`/hw:debug` 路由到对应角色 agent。
- `hypo-workflow sync --platform opencode` 现在读取全局配置与项目 `.pipeline/config.yaml` 的有效合并结果。
- 将 compaction intent 和完整 matrix 保留在 `.opencode/hypo-workflow.json`，并保持根 `opencode.json` / `.opencode/opencode.json` 不写入 HW 私有字段。
- 更新 `references/opencode-spec.md`，记录 M02 的 artifact rendering 语义和角色映射。

## 验证

- 红灯测试：
  - `node --test core/test/commands-rules-artifacts.test.js core/test/opencode-panels.test.js` 先失败，原因是 `model:` frontmatter 和新角色 agent 尚未实现。
- 绿灯测试：
  - `node --test core/test/commands-rules-artifacts.test.js core/test/opencode-panels.test.js core/test/profile-platform.test.js core/test/config.test.js core/test/opencode-status.test.js`：22/22 passed
- CLI smoke：
  - `node cli/bin/hypo-workflow sync --platform opencode --project <tmp>`：passed
  - 验证项目配置 override 能渲染到 `hw-compact` / `hw-code-b` agent，并且 `effective_context_target` 不泄漏进根 `opencode.json`。
- `bash scripts/validate-config.sh .pipeline/config.yaml`：passed
- `git diff --check`：passed

## 已知限制

- `node --test core/test/*.test.js` 仍有 3 个非 M02 行为失败：
  - `core/test/feature-queue-metrics.test.js` 读取 active C3 queue，但旧断言要求 `decompose_mode: just_in_time`。
  - `core/test/showcase-report-refresh.test.js` 读取 active C3 prompts，但旧断言要求 C2 的 `19-book-report-slides-imagegen-and-showcase-packaging.md`。
  - 同一 showcase 测试还要求 C2 report narrative 内容。
- 这些失败来自旧测试对 active `.pipeline` 的 C2 fixture 假设，与 C3 no-gate / upfront active queue 要求冲突；M02 未为兼容旧测试添加假 gate 或恢复 C2 active prompt。
