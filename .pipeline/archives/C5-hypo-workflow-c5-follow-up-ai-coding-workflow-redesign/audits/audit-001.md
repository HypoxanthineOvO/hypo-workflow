# Audit Report C5/M01 - Full Workflow Architecture Audit

> 时间：2026-05-03 15:00 +08:00  
> 范围：全仓库，包括产品工作流模型、命令体系、文档治理、`.pipeline` 生命周期工件、skills/adapters、OpenCode 生成物、测试、TUI/dashboard/status、安全边界。  
> 状态：修订版报告已生成，等待用户复核。  
> 约束：本 Milestone 只做审计，不修复业务问题。

## 总体判断

Hypo-Workflow 的底层方向是成立的：它不是 runner，而是让 Agent 通过 `.pipeline/` 文件协议获得可规划、可恢复、可审查的长会话工作区。这一点适合 AI coding 场景，也适合需要保留上下文和决策记录的研究工作。但当前产品形态已经从“轻量工作流协议”膨胀成多层生命周期平台：`Plan -> Cycle -> Feature Queue -> Feature -> Milestone -> Step` 之外，又叠加 Patch、Chat、Explore、Compact、Knowledge、Showcase、Rules、Release、Dashboard、OpenCode scaffold。大量概念各自合理，组合后却没有形成用户可预测的主路径。

最核心的问题不是某几处文件没同步，而是两个一阶设计问题：

1. **工作流表达模型偏工程 release，缺少面向真实研究/博士生日常的任务实体。** 现有 Feature Queue 和 Plan Mode 能表达软件 Feature、Milestone、TDD Step、baseline metric，但不能自然表达 paper draft、literature thread、experiment run、dataset snapshot、notebook、ablation、meeting decision、advisor feedback 这些研究工作对象。`analysis` preset 能做调查，但它仍被塞进 Milestone/Feature/报告/验收的工程框架里。
2. **同步和文档治理没有全局 ownership 模型。** `state.yaml`、`cycle.yaml`、Feature Queue、metrics、PROGRESS、PROJECT-SUMMARY、compact、README、OpenCode artifacts 都承诺“反映当前事实”，但只有局部刷新规则，没有一个“哪些源是权威、哪些是派生、何时必须刷新、刷新失败如何阻断”的统一合同。README automation 还把 release/regression/adapter/runtime 事实当作用户 README freshness 条件，说明用户文档和开发者文档没有边界。

因此，本报告将初版发现重新分成两类：先列产品/架构必须重审的问题，再列实现一致性、锁恢复、状态 schema、secret、测试等支撑性缺陷。后续修复不应从“补几个字段”开始，而应先确定目标用户和主工作流：到底是 AI coding release workflow，还是面向研究者的 project memory/workbench，或者二者分层共存。

## 验证和证据来源

| 检查 | 结果 |
|---|---|
| `bash scripts/validate-config.sh .pipeline/config.yaml` | 初版审计时通过 |
| `node --test core/test/*.test.js` | 初版审计时通过，156/156 |
| `python3 tests/run_regression.py` | 初版审计时通过，62/62 |
| `git diff --check` | 初版审计时通过 |
| `test -f .opencode/hypo-workflow.json.analysis` | 失败，AGENTS 指向的 analysis sidecar 不存在 |
| `rg -n "paper|dataset|notebook|literature|experiment|hypothesis|latex|research"` | 确认只有 analysis/research profile 的工程化证据合同，没有一等研究工作实体 |

## 严重程度分布

| 等级 | 数量 |
|---|---:|
| Critical | 3 |
| High | 9 |
| Medium | 8 |
| Low | 4 |
| Info | 2 |

## Critical

### C-01 - 产品模型过度工程化，不能自然承载博士/研究生日常工作流

- 严重程度：Critical
- 类别：Product/Architecture
- 类型：mandatory_fix
- 证据：
  - `README.md:21-25` 把核心循环定义为 `Plan -> Prompt -> Step Chain -> Tests -> Review -> Report -> Evaluate -> Next / Stop`。
  - `references/feature-queue-spec.md:7-21` 的 canonical hierarchy 是 `Project > Cycle > Feature > Milestone > Step`，且 Step 示例是 TDD execution state。
  - `plan/PLAN-SKILL.md:160-169` 要求 Decompose 后每个 Milestone 必须有 objective、implementation scope、test spec、expected artifacts。
  - `references/analysis-spec.md:65-84` 只给出 `workflow_kind: build | analysis | showcase` 和 `analysis_kind: root_cause | metric | repo_system`。
  - `references/test-profile-spec.md:70-87` 的 research profile 只覆盖 baseline/after/delta/script，不覆盖论文、文献、数据集、notebook、实验批次、review feedback。
- 为什么重要：研究者的真实工作不是总能拆成“Feature -> Milestone -> tests”。博士生日常经常是并行探索、多假设证伪、实验批次失败、论文段落重写、文献筛选、导师反馈回收、数据集版本追踪。当前模型会强迫用户把这些工作伪装成 Feature 或 Patch，长期会让状态板和报告失真。
- 用户影响示例：用户想管理“ICLR rebuttal + ablation + related work 补充 + advisor meeting decisions”。现有系统会要求把它拆成 Feature/Milestone，并围绕 tests/report/evaluate 收口；但用户真正需要的是 paper section、experiment run、claim/evidence、deadline、decision log、artifact refs 的工作台。
- 复现或验证命令：
  - `rg -n "paper|dataset|notebook|literature|advisor|meeting|ablation|rebuttal" README.md references skills plan core`
  - `sed -n '1,120p' references/feature-queue-spec.md`
  - `sed -n '65,90p' references/analysis-spec.md`
- 推荐处理：
  - 先定义目标用户分层：`coding delivery`、`research project`、`project operations` 是否同属一个产品，还是用 profile/workspace template 分开。
  - 为 research lane 设计一等实体，例如 `Question`、`Experiment`、`Dataset`、`Paper/Draft`、`Claim`、`Evidence`、`Decision`、`Meeting`、`Deadline`，不要只复用 Feature。
  - 将 `analysis` 从“一个 preset”升级为可组合 lane：能从 hypothesis/experiment/paper artifacts 推导后续 build/polish/survey/check 任务。
  - 给研究者主路径设计命令，如 `research plan -> experiment log -> paper sync -> meeting summary -> decision/next actions`，而不是让所有内容进入 release-style Cycle。
- 后续 Plan bucket：M01 Product Model Redesign。
- 修复验收标准：
  - 给出 3 个真实用户画像和 5 条端到端工作流，其中至少 2 条是博士/研究生日常。
  - 新的 workflow taxonomy 能表达 coding、analysis、research、docs、release 的差异，不需要把非工程任务伪装成 Feature。
  - README 快速开始能分别引导“修代码”和“推进研究项目”，且状态文件不会混用语义。

### C-02 - 命令和层级过多，主路径被工具箱淹没

- 严重程度：Critical
- 类别：Product/UX
- 类型：mandatory_fix
- 证据：
  - `core/src/commands/index.js:1-38` 定义 37 个 canonical entries，其中 36 个用户指令。
  - `README.md:31-45` 在 capability table 中列出 Pipeline、Plan、Feature Queue、Analysis、Lifecycle、Patch、Compact、Showcase、Rules、多平台等能力。
  - `README.md:179-243` 用 Setup/Pipeline/Plan/Lifecycle/Utility 展示大量命令，随后 `README.md:266-453` 又列常见 Workflow。
  - `references/feature-queue-spec.md:174-186` 承认 Feature Queue、state、cycle、log、metrics 都有边界且互不替代。
- 为什么重要：对新用户来说，系统现在像一个内部平台，而不是一个能马上使用的 workflow。`new / init / plan / batch / start / cycle / feature queue / patch / chat / explore / compact / sync / release` 的选择成本过高，用户必须先理解内部分类，才能知道下一步该干什么。
- 用户影响示例：用户只是想“帮我把论文实验和代码修复排一下”，却需要判断该用 `/hw:plan`、`/hw:plan --batch`、`/hw:cycle new`、`/hw:patch`、`/hw:chat` 还是 `/hw:explore`。选择错误会导致状态写入不同轨道，之后恢复和汇总变复杂。
- 复现或验证命令：
  - `sed -n '1,80p' core/src/commands/index.js`
  - `sed -n '179,243p' README.md`
  - `sed -n '266,453p' README.md`
- 推荐处理：
  - 收敛用户入口为 3-5 个意图级命令，例如 `plan`、`work`、`status`、`fix`、`sync`；其他命令作为高级子动作或自动建议。
  - 把 `Cycle`、`Feature Queue`、`Milestone` 暴露为状态对象，而不是要求用户经常手动选择层级。
  - `/hw:guide` 不应只是辅助命令；它应成为默认 router，基于现有状态和用户意图推荐唯一下一步。
  - 定义“最短成功路径”：新项目 2 步内开始，已有项目 1 步内恢复，研究项目 2 步内记录实验/论文进展。
- 后续 Plan bucket：M02 Command Surface Simplification。
- 修复验收标准：
  - 新用户 README 前 200 行不出现完整 36 命令表，只展示意图主路径。
  - 关键路径命令数减少或隐藏到高级参考文档。
  - `/hw:status` 能给出单一下一步建议，而不是只展示多个状态面。

### C-03 - 全局同步没有 single-source 派生图，导致状态、compact、README、OpenCode artifacts 各自漂移

- 严重程度：Critical
- 类别：Docs/State Governance
- 类型：mandatory_fix
- 证据：
  - `skills/sync/SKILL.md:18-22` 只定义 light/standard/deep sync 的操作列表：registry、Knowledge compact/index、external changes、OpenCode adapters、config、compact、dependency scan hints。
  - `skills/sync/SKILL.md:28-33` 明确不 mutate `state.yaml`、`cycle.yaml`、`rules.yaml`，但没有说明 PROGRESS、PROJECT-SUMMARY、metrics、queue、README、OpenCode artifacts 的语义同步责任。
  - `skills/compact/SKILL.md:18-31` 说明 compact 是派生视图，但 `skills/compact/SKILL.md:148-156` 只要求 milestone final、knowledge changes、cycle close 时刷新。
  - `PROJECT-SUMMARY.md:3-11` 仍显示 C5 pending acceptance，而 `.pipeline/cycle.yaml:5-19` 已是 active/rejected；`.pipeline/PROGRESS.md:7` 才反映“审计报告被拒绝，正在修订”。
  - `templates/readme-spec.md:153-164` 的 README freshness 只检查 version、command count、platform matrix、Skill count、release flow。
- 为什么重要：Hypo-Workflow 的价值来自可恢复和可信状态。如果每个派生面只在某些命令后 best-effort 刷新，用户就会看到相互冲突的“当前事实”。这不是简单 stale bug，而是缺少 derived artifact ownership DAG。
- 用户影响示例：用户打开 PROJECT-SUMMARY 看到 C5 pending acceptance，打开 PROGRESS 看到 rejected/revising，cycle.yaml 又是 active。用户不知道是否应该 `/hw:accept`、继续修订，还是新开 Plan。
- 复现或验证命令：
  - `sed -n '1,40p' PROJECT-SUMMARY.md .pipeline/PROGRESS.md .pipeline/cycle.yaml`
  - `sed -n '1,80p' skills/sync/SKILL.md`
  - `sed -n '148,156p' skills/compact/SKILL.md`
- 推荐处理：
  - 设计 `.pipeline/derived-map.yaml` 或等价合同：列出每个文件的 `authority`、`derived_from`、`writer commands`、`refresh trigger`、`staleness blocker`。
  - 将 `sync` 从“刷 adapter/compact”扩展成“校验和刷新所有派生视图”，但 protected state/cycle/rules 仍只能由 lifecycle command 改写。
  - `/hw:check` 必须能报告 stale derived artifacts，并区分 harmless stale、warning stale、blocking stale。
  - OpenCode/README/compact/PROJECT-SUMMARY 统一从同一 registry 渲染，而不是各自读局部 markdown。
- 后续 Plan bucket：M03 Global Sync And Derived Artifact Contract。
- 修复验收标准：
  - 任一 Cycle acceptance/reject/close 后，PROGRESS、PROJECT-SUMMARY、metrics、queue、compact、status model 的同一事实一致。
  - `/hw:sync --light` 能检测但不乱改 protected 文件；标准 `/hw:sync` 能刷新所有允许的派生文件。
  - CI/regression 有一个 fixture 故意制造 summary/PROGRESS/cycle 漂移，`/hw:check` 必须报出。

## High

### H-01 - README 不是用户文档，而是用户手册、架构说明、开发验证和 Changelog 的混合物

- 严重程度：High
- 类别：Docs/User Guidance
- 类型：mandatory_fix
- 证据：
  - `README.md:49-175` 是安装和快速开始。
  - `README.md:179-263` 是命令简介和 OpenCode mapping。
  - `README.md:457-611` 是指令详解。
  - `README.md:615-744` 是仓库结构、状态模型、Core/CLI/OpenCode scaffold、hooks、i18n 等内部架构。
  - `README.md:980-999` 是 OpenCode runtime 验证和 scaffold 实现细节。
  - `README.md:1016-1038` 是本仓库测试命令和当前回归数量。
  - `README.md:1030-1120` 开始内嵌长 Changelog。
- 为什么重要：README 应该回答“我该如何开始并完成我的任务”。当前 README 同时承担 contributor guide、architecture guide、release notes、runtime validation checklist，用户很难判断哪些是必须理解，哪些是维护者内部细节。
- 用户影响示例：研究生用户只想知道如何记录实验和恢复上下文，却在 README 中读到 OpenCode model matrix、file guard、release regression、plugin scaffold。信息多不等于可用。
- 复现或验证命令：
  - `nl -ba README.md | sed -n '49,175p'`
  - `nl -ba README.md | sed -n '615,744p'`
  - `nl -ba README.md | sed -n '980,1038p'`
- 推荐处理：
  - 拆分文档层级：`README.md` 只面向用户；`docs/user-guide.md` 写任务指南；`docs/developer.md` 写架构和测试；`docs/opencode-adapter.md` 写平台细节；`CHANGELOG.md` 保留版本历史。
  - README 顶部用 persona/task 路由，而不是完整能力清单。
  - OpenCode runtime 验证、release regression、README automation、内部目录结构移到开发者文档。
- 后续 Plan bucket：M04 Documentation Information Architecture。
- 修复验收标准：
  - README 前 300 行能覆盖安装、最短路径、恢复、常见任务，不出现 release/test/internal scaffold 细节。
  - README 链接到开发者文档，而不是内嵌完整开发者内容。
  - `readme-freshness` 不再要求用户 README 直接包含 release internals。

### H-02 - README automation 的 freshness 目标错位，保护的是 release metadata，不是用户文档质量

- 严重程度：High
- 类别：Docs Governance
- 类型：mandatory_fix
- 证据：
  - `templates/readme-spec.md:8-23` 把 Architecture、Validation、Changelog 都列为 README preferred structure。
  - `templates/readme-spec.md:61-67` 把 release summary 和 version history 作为 required managed blocks。
  - `templates/readme-spec.md:153-164` freshness 检查 version badge、command count、OpenCode command table、platform matrix、Skill count、release flow。
  - `core/src/readme/index.js:95-147` 的 `checkReadmeFreshness` 只检查 version、command count、平台词、release terms。
  - `rules/builtin/readme-freshness.yaml:8-12` 也只检查 version metadata、command count、OpenCode map、platform matrix、Skill inventory、release/update_readme summary。
- 为什么重要：自动化会塑造文档。如果 freshness gate 要求 README 包含 release/regression/changelog/command count，那么用户 README 就会持续被维护者事实污染。当前规则没有检查“是否有用户主路径”“是否把内部细节拆出去”“是否和 output.language 一致”“是否有研究工作流指南”。
- 用户影响示例：release 前 README freshness 通过，但新用户仍不知道该用 `/hw:plan`、`/hw:plan --batch` 还是 `/hw:explore`；开发者测试命令反而被硬性保留在 README。
- 复现或验证命令：
  - `sed -n '153,164p' templates/readme-spec.md`
  - `sed -n '95,147p' core/src/readme/index.js`
  - `sed -n '1,20p' rules/builtin/readme-freshness.yaml`
- 推荐处理：
  - 将 README freshness 分成 `user-readme-quality` 和 `release-metadata-freshness`。
  - release metadata 可存在 `docs/release.md` 或 `CHANGELOG.md`，README 只保留一行链接。
  - freshness 应检查 task-oriented sections、doc links、language consistency、stale command examples、persona routes。
- 后续 Plan bucket：M04 Documentation Information Architecture。
- 修复验收标准：
  - 用户 README 不需要包含完整 release flow 也能通过 freshness。
  - 开发者 release gate 仍能检查 version/command/platform，但检查目标转移到开发者文档或 generated reference。
  - README spec 明确“用户拥有的 narrative”和“机器管理的 metadata”边界。

### H-03 - Analysis Cycle 仍按 TDD 配置，工作流类型没有贯穿生成物

- 严重程度：High
- 类别：Architecture/Contracts
- 类型：mandatory_fix
- 证据：
  - `.pipeline/architecture.md:7-12` 说明 C5 是 analysis Cycle。
  - `.pipeline/prompts/00-full-workflow-architecture-audit.md` 要求只做 audit，不做 repair。
  - `.pipeline/config.yaml:15-18` 仍为 `execution.steps.preset: tdd`。
  - `.pipeline/cycle.yaml:4-8` 类型是 `feature`，preset 是 `tdd`。
  - `AGENTS.md:19` 要求 preset=analysis 时读取 `.opencode/hypo-workflow.json.analysis`，但该文件不存在。
- 为什么重要：workflow kind 应决定 step chain、交互边界、报告结构和验收标准。当前 C5 的 planning artifact 说 analysis，runtime config/cycle 却说 TDD，这会让 Agent 和平台边界分裂。
- 用户影响示例：用户明确要求审计和产品判断，系统仍把 Cycle type 记为 feature，把 preset 记为 tdd；后续 report/status/test profile 会按工程交付语义解释审计结果。
- 复现或验证命令：
  - `rg -n "preset|workflow_kind|analysis" .pipeline/config.yaml .pipeline/cycle.yaml .pipeline/architecture.md .pipeline/feature-queue.yaml`
  - `test -f .opencode/hypo-workflow.json.analysis`
- 推荐处理：
  - Plan Generate 从 `workflow_kind: analysis` 推导 config/cycle/state/OpenCode artifacts。
  - Cycle type 增加 `analysis` 或将 type 和 preset 解耦，避免用 `feature + tdd` 表达审计。
  - AGENTS 指向实际存在的 analysis boundary source。
- 后续 Plan bucket：M05 Workflow Kind Single Source。
- 修复验收标准：
  - analysis 计划生成后，config/cycle/state/prompt/OpenCode metadata 全部显示 analysis。
  - analysis prompt_state 使用 `define_question -> gather_context -> hypothesize -> experiment -> interpret -> conclude` 或明确的 audit-analysis 子链。
  - 三个平台边界读取路径一致。

### H-04 - 状态面仍需要用户理解多个互相镜像的文件

- 严重程度：High
- 类别：Lifecycle/State
- 类型：mandatory_fix
- 证据：
  - `.pipeline/state.yaml:4-20` 保存 pipeline/current 指针。
  - `.pipeline/cycle.yaml:1-19` 保存 Cycle lifecycle 和 acceptance。
  - `.pipeline/feature-queue.yaml:1-36` 保存 current_feature、Feature/Milestone status 和 profile。
  - `.pipeline/metrics.yaml:1-29` 保存 Cycle/Feature/Milestone metrics/status mirror。
  - `references/feature-queue-spec.md:174-186` 说明 queue、state、cycle、log、metrics 各司其职。
- 为什么重要：文件分工本身不是问题，问题是用户和 Agent 现在必须从多个文件拼出“当前到底在哪”。这破坏可恢复性，也增加状态写入 Bug 的概率。
- 用户影响示例：C5 被拒绝修订时，state 仍 `pipeline.status=running` 且 prompts_completed=1，cycle 是 active/rejected，metrics 是 pending_acceptance/done，PROJECT-SUMMARY 是 pending acceptance，PROGRESS 是 revising。
- 复现或验证命令：
  - `sed -n '1,80p' .pipeline/state.yaml .pipeline/cycle.yaml .pipeline/feature-queue.yaml .pipeline/metrics.yaml PROJECT-SUMMARY.md .pipeline/PROGRESS.md`
- 推荐处理：
  - 定义一个 `status model` canonical builder，由 UI/status/PROJECT-SUMMARY/compact 统一消费。
  - 文件可以保持拆分，但用户可见状态必须来自同一个聚合器。
  - 对同一实体的状态枚举建立映射表，例如 Cycle active/rejected/revising、Milestone done/reopened、Feature done/revising。
- 后续 Plan bucket：M06 Status Model Truthfulness。
- 修复验收标准：
  - 对任意 rejected/reopened Cycle，所有用户面显示同一下一步。
  - `/hw:status` 输出 authoritative source 和 stale mirrors。
  - 状态聚合器测试覆盖 pending_acceptance -> rejected -> active 修订路径。

### H-05 - Context 压缩/中断后的遗留锁会阻断 `/hw:resume`

- 严重程度：High
- 类别：Lifecycle/State
- 类型：mandatory_fix
- 证据：
  - 本次恢复时观察到 `.pipeline/.lock` 内容仅为 `C5/M01 audit executing`，没有结构化 owner/时间/heartbeat。
  - `skills/resume/SKILL.md:29` 规定只要 `.pipeline/.lock` 存在就停止并报告另一个执行活跃。
  - `skills/watchdog/SKILL.md:65` 和 `scripts/watchdog.sh:164-166` 也只检查锁存在，不判断是否陈旧。
  - `hooks/session-start.sh:208-217` 在 compact 后重新注入状态并要求继续执行，却没有处理旧锁。
- 为什么重要：恢复能力是 Hypo-Workflow 的核心承诺。锁没有 owner、PID、created_at、heartbeat、TTL 或 stale 判定时，正常中断会变成永久阻断。
- 用户影响示例：用户执行 `/hw:resume` 后系统说另一个执行活跃，实际只是上次 context compact 后旧锁未清理；用户必须知道内部文件并手动删除。
- 复现路径：
  1. 让 `.pipeline/state.yaml` 保持 unfinished/running。
  2. 写入旧 `.pipeline/.lock`，内容为一行文本。
  3. 调用 `/hw:resume`。
  4. 观察 resume 直接停止，而不是判定 stale。
- 推荐处理：
  - 将 `.pipeline/.lock` 改为结构化 YAML/JSON，包含 owner、pid、agent、session_id、command、created_at、heartbeat_at、expires_at。
  - start/resume 使用原子创建；退出只删除属于当前 owner 的锁。
  - resume/watchdog/status 都执行 stale-lock 判定并给出安全清理路径。
- 后续 Plan bucket：M07 Lock/Heartbeat Recovery Contract。
- 修复验收标准：
  - 单测覆盖 fresh lock、foreign active lock、stale lock、missing PID、heartbeat timeout。
  - regression 场景覆盖 compact 后遗留锁。
  - dashboard/status 能显示 lock owner、age、stale 判定和推荐操作。

### H-06 - `state.yaml` 合同虽然改善，但 completed prompt 仍停在 executing/audit_scan

- 严重程度：High
- 类别：Lifecycle/State
- 类型：mandatory_fix
- 证据：
  - `.pipeline/state.yaml:6-20` 显示 `pipeline.status: running`、`prompts_completed: 1`、`current.phase: executing`、`current.step: audit_scan`。
  - `.pipeline/state.yaml:29-49` 的 `prompt_state.result: pass` 且唯一 step 已 done。
  - `.pipeline/state.yaml:69-76` acceptance 已是 rejected。
  - `references/state-contract.md:90-99` 要求 `current.step` 指向下一 runnable 或当前 running step。
- 为什么重要：prompt 已完成并被拒绝修订时，状态不应同时表示“执行中”。这会影响 resume、watchdog、status、auto-chain 和 acceptance loop。
- 用户影响示例：用户拒绝审计报告后想继续修订，系统可能从 `audit_scan` 继续而不是进入“revision”或“acceptance_rework”状态。
- 复现或验证命令：
  - `sed -n '1,90p' .pipeline/state.yaml`
  - `sed -n '90,100p' references/state-contract.md`
- 推荐处理：
  - 为 manual acceptance rejection 定义明确 state phase，例如 `lifecycle_acceptance_rework` 或 `executing` with `prompt_state.result=revising`。
  - `current.step` 不应指向 done step，除非有 revision step。
  - `/hw:reject` 后应生成修订任务状态，而不只是更新 acceptance mirror。
- 后续 Plan bucket：M06 Status Model Truthfulness。
- 修复验收标准：
  - reject 后 state/cycle/progress/status 给出一致修订 phase。
  - resume 能定位到“修订审计报告”而不是重跑已 done step。

### H-07 - Log schema 与实际事件类型/状态漂移

- 严重程度：High
- 类别：Architecture/Contracts
- 类型：mandatory_fix
- 证据：
  - `references/log-spec.md:22-24` 只列出有限 type/status。
  - `.pipeline/log.yaml` 实际包含 `milestone_start`、`step`、`pipeline_complete`、`patch_fix`、`cycle_new`、`plan_generate`、`feature_start` 等事件族。
  - 实际状态包含 `active`、`done`、`closed` 等。
- 为什么重要：log 是生命周期账本。schema 不覆盖真实事件时，过滤、dashboard、release notes、status recent events 都只能宽松猜测。
- 用户影响示例：`/hw:log --type milestone` 可能漏掉 `milestone_start/milestone_complete`；OpenCode Recent 可能显示旧事件。
- 复现或验证命令：
  - `rg -n "type:|status:" .pipeline/log.yaml references/log-spec.md`
- 推荐处理：
  - 扩展 log-spec 到真实事件族，或把实现收敛到 spec。
  - 增加 log schema validator，并让 `/hw:check` 报告 unknown type/status。
- 后续 Plan bucket：M08 Log Schema And Readers。
- 修复验收标准：
  - 当前 `.pipeline/log.yaml` 无 unknown type/status。
  - `/hw:log --type` 对 cycle、feature、milestone、patch、accept/reject 都有确定语义。

### H-08 - OpenCode Recent 事件顺序会错读 newest-first log

- 严重程度：High
- 类别：UX/TUI
- 类型：mandatory_fix
- 证据：
  - `.pipeline/log.yaml` 当前顶部是最新事件。
  - `core/src/opencode-status/index.js:280-288` 使用 `entries.slice(-10).reverse()`，对 newest-first log 会取文件末尾旧事件。
  - `references/log-spec.md:85-90` 要求默认显示 newest 10。
- 为什么重要：状态面会把旧事件显示为最近事件，用户会以为系统仍卡在旧 Cycle 或旧 milestone。
- 用户影响示例：C5 正在修订，但 OpenCode sidebar Recent 可能显示 C3/C4 旧事件。
- 复现或验证命令：
  - `node --input-type=module -e 'import("./core/src/opencode-status/index.js").then(async m=>console.log((await m.buildOpenCodeStatusModel(".")).recent_events.map(e=>e.id).join("\\n")))'`
- 推荐处理：
  - recent reader 按 timestamp 降序排序，或明确 log 文件写入方向并统一 writer。
  - 增加 newest-first 和 oldest-first fixtures。
- 后续 Plan bucket：M08 Log Schema And Readers。
- 修复验收标准：
  - Recent 第一条为真实最新事件。
  - C5 新事件不会被 C3/C4 旧事件覆盖。

### H-09 - Debug/audit/report 没有统一 secret-safe evidence pipeline

- 严重程度：High
- 类别：Security/Secrets
- 类型：mandatory_fix
- 证据：
  - `skills/debug/SKILL.md:24-35` 要求读取 architecture、lifecycle log、recent report、git changes 并写 debug report。
  - `references/debug-spec.md:18-45` 没有统一 redaction、secret key scan、禁止 raw env/config 值的合同。
  - `references/knowledge-spec.md:76-85` 只对 Knowledge Ledger 有 secret 规则，Debug/Audit/Report 没有同级统一规则。
- 为什么重要：debug/audit 最常读取失败日志、配置、diff 和环境上下文，是最容易把 token、authorization header、API key 写入报告的路径。
- 用户影响示例：用户让 `/hw:debug --trace` 查认证失败，Agent 把 Authorization header 写进 `.pipeline/debug/`，之后被 SessionStart 注入或提交。
- 复现或验证命令：
  - `sed -n '1,120p' skills/debug/SKILL.md references/debug-spec.md references/knowledge-spec.md`
- 推荐处理：
  - 抽象统一 redaction helper，供 knowledge/debug/audit/report/log/status 使用。
  - 报告写入前跑 secret scan，疑似 secret 阻断或强制脱敏。
- 后续 Plan bucket：M09 Secret-Safe Evidence Pipeline。
- 修复验收标准：
  - Debug/Audit report 测试覆盖 api_key/token/authorization/password。
  - 任何报告写入前通过 redaction validator。

## Medium

### M-01 - Research profile 是验证策略，不是研究工作台

- 严重程度：Medium
- 类别：Product/Research UX
- 类型：architecture_recommendation
- 证据：
  - `references/test-profile-spec.md:32-45` 要求 Discover 问 task category/effect/verification。
  - `references/test-profile-spec.md:70-87` research profile 只要求 baseline metric、expected direction、validation script、before/after/delta。
  - `core/src/test-profile/index.js` 的 research profile 也围绕 baseline/delta/report_fields。
- 为什么重要：这能防止“只看 diff 就说研究成功”，但它不是研究者每天管理实验、论文和文献的工作流。
- 用户影响示例：做 ablation 时，用户需要记录 run config、dataset split、seed、table row、paper claim，而不仅是 before/after metric。
- 推荐处理：将 research profile 保留为 validation policy，同时新增 research lane/entity model。
- 后续 Plan bucket：M01 Product Model Redesign。

### M-02 - Patch、Chat、Explore 边界合理但入口选择成本高

- 严重程度：Medium
- 类别：Product/UX
- 类型：architecture_recommendation
- 证据：
  - `skills/patch/SKILL.md` 将小修复排除在 Milestone 外。
  - `skills/explore/SKILL.md` 将探索隔离到 worktree。
  - `/hw:chat` 是轻量 append conversation mode。
- 为什么重要：这些轨道各自有价值，但用户需要在开始前知道“这件事是 Patch、Chat、Explore 还是 Plan”。这是产品应替用户判断的路由问题。
- 用户影响示例：用户说“先试一下这个算法能不能快一点”，系统应建议 Explore 或 Analysis，而不是让用户自己选。
- 推荐处理：意图 router 根据 dirty worktree、风险、是否要持久记录、是否要改代码自动推荐轨道。
- 后续 Plan bucket：M02 Command Surface Simplification。

### M-03 - `/hw:sync` 名称承诺大于实际语义

- 严重程度：Medium
- 类别：Architecture/Contracts
- 类型：mandatory_fix
- 证据：
  - `skills/sync/SKILL.md:16-22` 的 sync 主要覆盖 registry、knowledge compact/index、OpenCode adapters、config loading、compact views、dependency scan hints。
  - 它不覆盖 README freshness、PROJECT-SUMMARY、queue/metrics/status semantic reconciliation。
- 为什么重要：用户看到 sync 会期待“把项目同步到一致状态”。当前 sync 更像 adapter/derived-context refresh。
- 用户影响示例：用户运行 `/hw:sync` 后仍看到 PROJECT-SUMMARY 和 PROGRESS 对 C5 状态不一致。
- 推荐处理：重命名为 adapter/context sync，或扩展为全局 derived sync，并明确 protected 文件只读校验。
- 后续 Plan bucket：M03 Global Sync And Derived Artifact Contract。

### M-04 - OpenCode analysis 边界位置承诺不一致

- 严重程度：Medium
- 类别：Platform Parity
- 类型：mandatory_fix
- 证据：
  - `AGENTS.md:19` 和模板要求读取 `.opencode/hypo-workflow.json.analysis`。
  - 实际 `.opencode/hypo-workflow.json` 含 analysis block，但没有 `.analysis` sidecar。
  - `core/src/artifacts/opencode.js` 渲染的是 `hypo-workflow.json` metadata。
- 为什么重要：OpenCode agent 可能按文档读取不存在文件，忽略实际 boundary 配置。
- 推荐处理：选择 canonical path，并让生成器、AGENTS、agent prompt、测试全部一致。
- 后续 Plan bucket：M05 Workflow Kind Single Source。

### M-05 - Dashboard/status surfaces 没有 lock/stale-lock 可见性

- 严重程度：Medium
- 类别：UX/TUI
- 类型：mandatory_fix
- 证据：
  - `core/src/opencode-status/index.js` 读取 state/config/cycle/queue/metrics/log/reports/metadata，但不读取 `.pipeline/.lock`。
  - Sidebar/footer sections 只显示 pipeline/gate/acceptance/metrics/recent。
- 为什么重要：当 resume 被锁挡住时，用户最需要知道“锁是谁、是否陈旧、下一步是什么”。
- 推荐处理：status/check/dashboard 增加 lock section。
- 后续 Plan bucket：M07 Lock/Heartbeat Recovery Contract。

### M-06 - Test Profiles 激活，但当前 Feature 声明不存在的 `analysis` profile

- 严重程度：Medium
- 类别：Testing/Regression
- 类型：mandatory_fix
- 证据：
  - 全局配置启用 `execution.test_profiles.enabled: true`。
  - `.pipeline/feature-queue.yaml:24-26` 声明 `test_profiles: [analysis, agent-service]`。
  - `references/test-profile-spec.md:46-87` 只定义 webapp、agent-service、research；`analysis` 明确是 preset，不是 Test Profile。
- 为什么重要：profile 是验收证据合同。声明不存在的 profile 会让系统无法判断证据是否足够。
- 推荐处理：Plan Generate 禁止把 preset 写入 test_profiles；analysis evidence 应走 analysis evaluation checks。
- 后续 Plan bucket：M10 Profile Evidence Contract Repair。

### M-07 - 回归套件覆盖 helper 和静态场景，不覆盖真实长会话恢复

- 严重程度：Medium
- 类别：Testing/Regression
- 类型：architecture_recommendation
- 证据：
  - `tests/run_regression.py` 覆盖 62 个场景，但 resume-interrupt 场景主要检查 state/prompt 文件。
  - 没有场景模拟 `.pipeline/.lock`、last_heartbeat 超时、watchdog skip、Context compact 后手动 resume。
- 为什么重要：测试绿不能代表用户长会话恢复可靠。C5 真实遇到的 stale-lock 就是测试空洞。
- 推荐处理：新增 runner-adjacent lifecycle regression，覆盖 start/resume/compact/lock/watchdog/status 的组合路径。
- 后续 Plan bucket：M11 Regression Real Workflow Expansion。

### M-08 - Global TUI 是 snapshot，不是用户自然期待的交互式 TUI

- 严重程度：Medium
- 类别：UX/TUI
- 类型：architecture_recommendation
- 证据：
  - `core/src/tui/index.js` 构建和渲染 snapshot 文本。
  - Actions 暴露为数据项，没有交互执行路径。
- 为什么重要：README 和 C4 summary 把 Global TUI 当能力亮点；实际更像只读状态快照。
- 推荐处理：命名为 “TUI status snapshot”，或实现真正 action dispatcher 并保留确认 gate。
- 后续 Plan bucket：M12 TUI/Dashboard Product Surface。

## Low

### L-01 - README 仍称“串行工作流引擎”，容易和“不是 runner”合同混淆

- 类别：Docs/User Guidance
- 类型：architecture_recommendation
- 证据：`README.md:5` 写“串行工作流引擎”，`AGENTS.md:7` 写 Hypo-Workflow is not a runner。
- 建议：改成“工作流协议/工作区/Agent orchestration contract”，减少 runner 误解。

### L-02 - `references/opencode-parity.md` 标题仍是 V8.4/V9 语境

- 类别：Docs/User Guidance
- 类型：mandatory_fix
- 证据：`references/opencode-parity.md:1-3` 仍使用 OpenCode V8.4/V9 语境，当前 root `SKILL.md` 是 v10.1.0。
- 建议：加 historical baseline 标记，或升级标题到 v10.1。

### L-03 - Metrics 仍以 `n/a` 为主，不能支持审计后的成本/时长判断

- 类别：Maintainability
- 类型：architecture_recommendation
- 证据：`.pipeline/metrics.yaml:1-29` 的 C5/F001/M01 duration/token/cost 均为 `n/a`。
- 建议：保留 `n/a` 兼容，但至少记录 wall-clock duration；token/cost 缺失时说明 telemetry unavailable。

### L-04 - Changelog 内嵌 README 加剧用户文档噪音

- 类别：Docs/User Guidance
- 类型：architecture_recommendation
- 证据：`README.md:1030-1120` 直接内嵌长 Changelog，同时仓库已有 `CHANGELOG.md`。
- 建议：README 只保留最新版本摘要和 `CHANGELOG.md` 链接。

## Info

### I-01 - 基础回归资产仍有价值

156 个 Node 单测和 62 个回归场景能保护 command map、OpenCode artifacts、README helper、Feature Queue helper、analysis ledger、test profiles 等局部合同。问题在于覆盖面偏静态，不是这些测试无效。

### I-02 - Knowledge/Compact 的“原始证据外置、状态轻量化”方向正确

Knowledge Ledger 和 compact 视图默认不把 raw records 塞进 state，这符合长会话上下文治理方向。后续应把这种权威/派生边界推广到全局同步和文档治理。

## 后续 Plan 候选 Milestone

| Bucket | 建议 Milestone | 覆盖发现 |
|---|---|---|
| M01 | Product Model Redesign | C-01, M-01 |
| M02 | Command Surface Simplification | C-02, M-02 |
| M03 | Global Sync And Derived Artifact Contract | C-03, M-03 |
| M04 | Documentation Information Architecture | H-01, H-02, L-01, L-04 |
| M05 | Workflow Kind Single Source | H-03, M-04 |
| M06 | Status Model Truthfulness | H-04, H-06 |
| M07 | Lock/Heartbeat Recovery Contract | H-05, M-05 |
| M08 | Log Schema And Readers | H-07, H-08 |
| M09 | Secret-Safe Evidence Pipeline | H-09 |
| M10 | Profile Evidence Contract Repair | M-06 |
| M11 | Regression Real Workflow Expansion | M-07 |
| M12 | TUI/Dashboard Product Surface | M-08 |

## 建议优先级

1. 先做 **Product Model Redesign**：明确 Hypo-Workflow 是 coding delivery 工具、research workbench，还是二者分层共存。没有这个决定，后续只是继续堆命令。
2. 再做 **Documentation Information Architecture** 和 **Command Surface Simplification**：把用户主路径从内部平台概念中剥离出来。
3. 同步推进 **Global Sync And Derived Artifact Contract**：否则 README、PROGRESS、PROJECT-SUMMARY、compact、OpenCode status 会持续漂移。
4. 然后修复锁、state/log schema、secret-safe evidence、profile evidence 和真实恢复回归。

## 人工验收清单

- [ ] 确认是否接受“当前最大问题是产品模型和文档治理，而非单个 stale 文件”的结论。
- [ ] 确认是否将研究/博士生日常作为一等目标用户；如果是，下一轮应先重设计 research lane。
- [ ] 确认是否拆分 README 与开发者文档，并重写 readme-freshness 目标。
- [ ] 确认是否先做全局派生同步合同，再修局部状态漂移。
- [ ] 验收本审计报告后，使用 `/hw:plan --context audit` 生成后续修复或重构 Cycle。
