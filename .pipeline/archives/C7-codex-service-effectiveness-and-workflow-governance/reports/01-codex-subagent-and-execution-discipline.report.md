# M02 / F001 - Codex Subagent and Execution Discipline

## 结果

通过。已把 Codex Subagent 纪律写入共享入口、start/resume 执行流、Patch lane、Subagent spec 和 Codex 平台指南，并增加内容回归测试防止后续退化。

## 改动

- `SKILL.md`：Codex substantial work 明确强烈优先使用 Codex/GPT Subagents；测试/复核与实现分离；README/docs 工作优先 docs assistance；未委托需记录原因；通用执行流改为 main agent orchestration。
- `skills/start/SKILL.md`、`skills/resume/SKILL.md`：移除通用流程里的 Claude-centric wording，改为 main agent coordinates，并加入 Codex Subagent preference。
- `skills/patch/SKILL.md`：保持 Patch fix lightweight，同时要求非琐碎 Codex 修复尽量用独立 review/test Subagent；无 report 时把委托证据或未委托原因写入 Patch/log。
- `references/subagent-spec.md`：新增 Codex Preference、Implementation and Validation Separation、proposer/challenger pass、non-delegation rationale。
- `references/platform-codex.md`：明确 Codex Subagents 是 Codex/GPT runtime workers；跨工具委托不再作为 Codex 默认路径呈现。
- `core/test/codex-subagent-discipline.test.js`：新增 4 个内容契约测试。

## Subagent 使用

已使用 Subagent Russell 做只读复核。它指出了 root/start/resume/patch/subagent-spec 的弱提示、Claude-centric wording 和 Codex 外部模型路由误导风险；实现已纳入这些反馈。

## 质量结论

- 测试/实现分离：已在 root、start/resume、Patch 和 subagent spec 中固化。
- 外部模型路由：Codex Subagent 合同限定为 Codex/GPT runtime workers；Claude 路径只保留在非 Codex/跨工具语境。
- trivial fallback：保留一文件小修、纯检查、本地工具不可用时可 self execution。
- left/right brain：以 lightweight proposer/challenger pass 形式进入 subagent spec，完整多 Agent debate 框架留到后续 Cycle。

## 验证

- `node --test core/test/codex-subagent-discipline.test.js`：4/4 pass
- `node --test core/test/skill-spec.test.js core/test/commands-rules-artifacts.test.js core/test/codex-subagent-discipline.test.js`：12/12 pass
- `node --test core/test/*.test.js`：265/265 pass
- `bash scripts/validate-config.sh .pipeline/config.yaml`：pass
- `git diff --check`：pass

## 评估

- diff_score: 1
- code_quality: 4
- test_coverage: 3
- complexity: 2
- architecture_drift: 1
- overall: 2

## 风险

`skills/setup/SKILL.md` 仍有通用跨工具 subagent provider 说明，当前不在 Codex 平台默认路径中。后续 M04/M05 处理 init/setup 和第三方适配时应把这类说明中文化并解释清楚。
