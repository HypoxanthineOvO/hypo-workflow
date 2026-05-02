# M01 / F001 — Matrix Contract and Schema Report

## 结果

- Result: pass
- Diff score: 2
- Code quality: 4

## 完成内容

- 为 OpenCode model matrix 增加默认配置合同：
  - `plan`
  - `compact`
  - `test`
  - `code-a`
  - `code-b`
  - `debug`
  - `report`
- 增加 900K effective context compaction target。
- 扩展 project/global config schema，使 `opencode.*` 可作为结构化配置表面。
- 扩展 OpenCode metadata，使 matrix 和 compaction intent 可以被后续 sync/render 层读取。
- 更新 `references/config-spec.md` 和 `references/opencode-spec.md`，明确 M01 是合同层，M02 才负责具体 artifact rendering。

## 验证

- `node --test core/test/config.test.js core/test/opencode-panels.test.js`：9/9 passed
- `node --test core/test/commands-rules-artifacts.test.js core/test/profile-platform.test.js core/test/opencode-status.test.js`：12/12 passed
- `bash scripts/validate-config.sh .pipeline/config.yaml`：passed
- YAML parse check for `config.schema.yaml` and `.pipeline/config.yaml`：passed
- `git diff --check`：passed

## 已知限制

- 未跑通 `node --test core/test/*.test.js` 作为 M01 gate，因为当前旧测试仍把 active `.pipeline` 当 C2 fixture，要求 active queue 中存在 `gate: confirm` / `just_in_time` 示例和 C2 M20 prompt；这与 C3 no-gate active plan 冲突。
- M01 只定义 schema/default/metadata contract。实际 OpenCode agent 文件和 `opencode.json` rendering 留给 M02。
