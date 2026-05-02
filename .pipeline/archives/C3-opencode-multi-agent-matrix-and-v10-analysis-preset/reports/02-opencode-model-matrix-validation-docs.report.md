# M03 / F001 — Model Matrix Validation and Docs Report

## 结果

- Result: pass
- Diff score: 2
- Code quality: 4

## 完成内容

- 增加 OpenCode model matrix 文档一致性测试，覆盖：
  - command map 中 `hw-report` / `hw-compact` / `hw-debug` 路由；
  - parity docs 中对应能力的 agent；
  - README 中发布默认 matrix、角色 agent 和边界说明；
  - s61 scenario 是否存在并覆盖关键 artifact。
- 新增离线 scenario：
  - `tests/scenarios/v9/s61-opencode-model-matrix-sync/run.sh`
  - 覆盖项目级 matrix override、默认 legacy sync、sidecar metadata、agent frontmatter、命令 agent frontmatter 和 `opencode.json` 私有字段隔离。
- 更新 `references/opencode-command-map.md`、`references/opencode-parity.md`、`references/v9-architecture.md`。
- 更新 README OpenCode Native Adapter 章节：
  - agent 列表；
  - model matrix 默认值；
  - role -> agent 推荐表；
  - private override 与发布默认区别；
  - OpenCode 负责实际模型调用，Hypo-Workflow 不作为 runner。
- 将 s61 加入 `tests/run_regression.py` 的目标 scenario 集。

## 验证

- 红灯测试：
  - `node --test core/test/opencode-model-matrix-docs.test.js` 初始失败，原因是 docs 仍使用旧 agent、README 缺 matrix 说明、s61 scenario 缺失。
- 绿灯测试：
  - `node --test core/test/opencode-model-matrix-docs.test.js`：3/3 passed
  - `bash tests/scenarios/v9/s61-opencode-model-matrix-sync/run.sh`：passed
  - `bash tests/scenarios/v9/s51-opencode-capability-matrix/run.sh`：passed
  - `node --test core/test/opencode-model-matrix-docs.test.js core/test/commands-rules-artifacts.test.js core/test/opencode-panels.test.js`：12/12 passed
  - 受影响 README/OpenCode/docs 测试集合：44/44 passed
  - `bash scripts/validate-config.sh .pipeline/config.yaml`：passed
  - `git diff --check`：passed

## 已知限制

- `node --test core/test/*.test.js` 仍有 3 个旧 active fixture 失败：
  - active C3 queue 与旧 `just_in_time` / confirm gate fixture 断言冲突；
  - active C3 prompts 不包含 C2 M20 showcase prompt；
  - active C3 不保留 C2 showcase report narrative fixture。
- `python3 tests/run_regression.py` 当前为 58/61 passed，失败项为：
  - `s18-template-library`：active `.pipeline/architecture.md` 不包含旧 `## Review History` fixture；
  - `s49-showcase-bootstrap`：active C3 没有旧 `.pipeline/showcase/*` artifacts；
  - `s52-core-config-artifacts`：内部调用全量 core suite，继承上述 active fixture 失败。
- 这些限制与 C3 no-gate active plan 和 C2 archive 状态有关，不属于 F001 model matrix 行为失败。
