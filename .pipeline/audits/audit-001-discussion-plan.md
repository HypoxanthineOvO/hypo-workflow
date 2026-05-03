# C5 Audit Follow-Up Discussion Plan

> 创建时间：2026-05-03 15:08 +08:00  
> 来源：`.pipeline/audits/audit-001.md`  
> 状态：P1 Discover 讨论中  
> 目标：先形成产品/架构决策，再生成 C5 后续可执行 Milestone prompts。

## 讨论原则

- 每次只讨论一个 finding 或一个紧密相关的问题簇。
- 先判断产品方向，再判断实现方案。
- 每项讨论后记录：决策、理由、保留/修改/删除的概念、影响文件、后续 Milestone 候选。
- 未决问题不要直接进入实现；先标记 blocker 或需要用户决策的分歧点。

## 建议顺序

| 顺序 | Finding | 主题 | 目标输出 |
|---:|---|---|---|
| 1 | C-01, M-01 | Product Scope / Research Deferral | 当前轮以 AI Coding 和跑通代码为主线；Research lane 只保留为下个大版本方向 |
| 2 | C-02, M-02 | Command Surface For AI Coding | 确定当前主线的入口、隐藏/合并哪些命令、`/hw:guide` 是否升级为 router |
| 3 | H-03, M-04 | Workflow Kind Single Source | 确定 workflow_kind、preset、Cycle type、OpenCode boundary 的单一来源 |
| 4 | H-04, H-06 | Status Model Truthfulness | 确定用户可见状态聚合器和 acceptance/revision 状态语义 |
| 5 | H-05, M-05 | Lock / Heartbeat Recovery | 确定结构化锁、stale 判定、status 可见性 |
| 6 | H-07, H-08 | Log Schema / Recent Events | 确定 log event schema 和排序合同 |
| 7 | H-09 | Secret-Safe Evidence | 确定 debug/audit/report/log/status 的统一脱敏管线 |
| 8 | M-06, M-07 | Profile Evidence / Regression | 确定 analysis preset 与 test profile 的边界和真实生命周期回归 |
| 9 | M-08 | TUI / Dashboard Surface | 确定只读 snapshot 命名还是实现交互式 action |
| 10 | H-01, H-02, L-01, L-04 | README / Docs Governance | 确定用户 README、开发者文档、release metadata 的拆分 |
| 11 | C-03, M-03 | Global Sync / Derived Artifacts | 放到 C5 末尾统一处理 authority/derived map、sync/check 边界 |

## 决策记录模板

```markdown
## D-YYYYMMDD-NN - <主题>

- Related findings:
- Decision:
- Rationale:
- Keep:
- Change:
- Remove:
- Impacted files:
- Follow-up Milestone candidate:
- Open questions:
```

## 记录区

## D-20260503-01 - C5 后续规划范围

- Related findings: C-01, M-01, C-02, C-03
- Decision: 当前 C5 后续 Milestone 以 AI Coding 和跑通代码等工程主线为优先目标；Research/博士生日常 workflow 暂不作为本轮实现主线，保留为下一个大版本方向。
- Rationale: 当前仓库已经具备 coding delivery、OpenCode adapter、Plan/Start/Resume、TDD/analysis、status、acceptance 等工程 workflow 基础；先把这条主线做稳，避免在 C5 同时引入 Research lane 导致产品模型继续膨胀。
- Keep: C5 审计中对 Research fit 的发现保留为 vNext 方向证据；当前轮仍可在 README/架构中说明 Research 是未来方向，而不是当前承诺。
- Change: C5 后续规划不把 paper/dataset/notebook/meeting 等 Research 一等实体纳入实现范围。
- Remove: 不在 C5 中新增完整 Research lane 或研究工作台命令。
- Impacted files: `.pipeline/audits/audit-001.md`, `.pipeline/audits/audit-001-discussion-plan.md`, 后续 `.pipeline/prompts/*.md`, `.pipeline/architecture.md`
- Follow-up Milestone candidate: C5/M01-MN 以 AI Coding 主线修复和重构为主；Research lane 另列 next-major candidate。
- Open questions: 当前 AI Coding 主线是否需要保留 Feature Queue，还是收敛为更简单的 Plan/Work/Status 主路径？

## D-20260503-02 - Feature Queue 与 Guide 编排定位

- Related findings: C-02, M-02, C-03
- Decision: 保留 Feature Queue，但将它定位为“超长规划 / batch / long-running orchestration lane”，不作为普通 AI Coding 主路径的一等必经概念。普通主路径继续以 `init -> plan -> start -> status/resume` 为基础；`Guide` 应升级为更灵活的意图 router，负责根据上下文选择普通 Plan、Batch Queue、Audit 后续 Plan、Plan Extend 或 Patch/Explore。
- Rationale: Feature Queue 的优势是真实存在的：它能保存长路线图、Feature 优先级、gate、失败策略、upfront/JIT decomposition 和 auto-chain 意图，适合“后台跑很久”的多 Feature 长规划。但它不适合每个普通任务都暴露；否则用户需要理解 Cycle、Feature Queue、Feature、Milestone、Step 的完整层级，主路径会变长变僵硬。本轮遇到的“先审计、审计本身要计划、审计后仍是同一件事但又需要继续规划”说明需要更强的 Guide/router，而不是让用户手动选择所有底层命令。
- Keep: `/hw:plan --batch`、Feature Queue、gate、failure_policy、auto_chain、upfront/JIT 等能力保留，用于多 Feature 长规划和自动串行推进。
- Change: Feature Queue 从默认主路径中隐藏；只有用户明确要求长规划、多 Feature、后台长跑，或 Guide 判断当前意图符合 batch lane 时才进入。Guide 需要能识别 audit -> plan follow-up、active/completed Cycle 内继续规划、普通 plan/start、patch/explore 等场景。
- Remove: 不再把 Feature Queue 描述成所有 Cycle 中 Cycle 与 Milestone 之间的必然层级；普通单 Feature 工作不应生成或强制用户理解 queue。
- Impacted files: `skills/guide/SKILL.md`, `plan/PLAN-SKILL.md`, `references/feature-queue-spec.md`, `README.md`, `references/commands-spec.md`, 后续 OpenCode command/agent guidance
- Follow-up Milestone candidate: Command Surface And Guide Router Redesign
- Open questions: Guide 是否只推荐命令，还是可以在确认后自动执行“审计后继续规划/同 Cycle 追加规划”等复合流程的第一步？

## D-20260503-03 - 预声明 Follow-Up Plan 节点

- Related findings: C-02, H-03, H-04
- Decision: Follow-Up Plan 应该能在初始 Plan 阶段就作为工作流后继节点被预声明，而不是审计完成后临时选择的新入口。对于“先审计，再讨论审计结论，再生成修复/重构 Milestones”的任务，Plan 生成时就应表达：M01 是 audit/analysis；M01 完成并验收后，自动进入一个 `follow_up_plan` 阶段，用审计报告作为输入，要求先讨论并记录决策，再生成后续 prompts。
- Rationale: 这类任务一开始就知道“审计完成后还需要计划”。它不是普通 `plan:extend`，因为 extend 假设已有明确追加内容；也不是普通 `/hw:plan --context audit`，因为上下文不是事后手工选择，而是工作流设计的一部分。C5 暴露出的真实问题是 Plan 模型只能生成一次性 Milestone 序列，缺少“阶段完成后进入下一轮规划”的 continuation node。
- Keep: `plan:extend` 保留用于人工追加明确 Milestones；`/hw:guide` 仍可作为用户迷路时的入口。
- Change: Plan Mode 增加 continuation/follow-up node 语义：可在 P3 Generate 中生成“当前阶段 prompts + follow-up planning trigger/contract”。Cycle/PROGRESS/status 应能显示“当前工作完成后将进入 follow-up planning”，而不是让用户重新猜命令。
- Remove: 不把审计后规划硬塞进普通 `plan:extend`；不把 follow-up planning 描述成事后新增命令选择问题。
- Impacted files: `plan/PLAN-SKILL.md`, `skills/plan-generate/SKILL.md`, `skills/plan-confirm/SKILL.md`, `skills/start/SKILL.md`, `skills/accept/SKILL.md`, `skills/guide/SKILL.md`, `references/state-contract.md`, `references/commands-spec.md`, `README.md`, OpenCode `/hw-plan*` docs
- Follow-up Milestone candidate: Plan Continuation / Follow-Up Node Semantics
- Follow-up correction: continuation 是 Cycle 生命周期合同，应以 `.pipeline/cycle.yaml` 作为权威元数据；`state.yaml` 只镜像当前执行/待执行状态。若 continuation 细节过长，可在 cycle metadata 中保存 compact descriptor 和外链，例如 `.pipeline/plan-continuations/C5-follow-up.yaml`。
- Open questions: continuation 的最小 cycle schema 是 `continuations[]`，还是 `next_actions.follow_up_plan`？

## D-20260503-04 - Matt Pocock Skills 方法对 C5 的启发

- Related findings: C-02, H-01, H-02, H-03
- Decision: 将 Matt Pocock Skills 的工程方法纳入 C5 后续设计，但不照搬其仓库结构。Hypo-Workflow 应把“设计概念对齐、通用语言、TDD 反馈循环、深模块、垂直切片、DAG/看板并行、人工 QA”作为 AI Coding 主线的 workflow 原语。
- Rationale: 这篇文章的核心不是“多写几个 prompt”，而是反对 specs-to-code / vibe coding 式放弃代码所有权。AI Coding 的关键是让人掌握设计、接口和 QA，让 Agent 在清晰边界内实现。坏代码会放大 AI 失败；好代码库、快反馈、深模块和垂直切片会放大 AI 成功。
- Keep: Hypo-Workflow 已有 Plan、TDD preset、Feature Queue、Patch、Audit、Explore、Acceptance、OpenCode agents，这些可以承载 Matt 方法的一部分。
- Change:
  - Plan Discover 应更像 `grill-me`：每次一个问题，持续追问直到设计概念一致，而不是急着产出计划。
  - 建立 Hypo-Workflow 的 `CONTEXT.md` / glossary / ADR 等价物，减少 Agent 术语漂移。
  - Decompose 应优先生成垂直曳光弹 Milestones，而不是按层水平切分。
  - TDD preset 应收紧为“一次一个行为/测试”的红绿循环，避免一次性写大量测试和实现。
  - Feature Queue 的优势应与 DAG/看板并行结合：记录依赖、HITL/AFK、可并行项，而不只是线性队列。
  - Compact 策略要谨慎：运行实现任务时应尽量从稳定 artifacts 重新开始，而不是在沉积上下文里继续漂移。Compact 更适合作为索引/恢复摘要，不应替代清晰 issue/prompt/ADR。
- Remove: 不把代码当成黑盒编译产物；不采用“只改 spec 不理解代码”的 specs-to-code 心智。
- Impacted files: `plan/PLAN-SKILL.md`, `references/tdd-spec.md`, `references/feature-queue-spec.md`, `skills/guide/SKILL.md`, `skills/compact/SKILL.md`, `references/progress-spec.md`, `README.md`, future glossary/ADR docs
- Follow-up Milestone candidate: Engineering Fundamentals Workflow Upgrade
- Open questions: Hypo-Workflow 是否要新增项目级 `CONTEXT.md`/ADR 约定，还是复用 `.pipeline/architecture.md` 与 Knowledge Ledger 来承载通用语言和设计决策？
- External references:
  - User-provided article text about Matt Pocock Skills and six AI coding failure modes.
  - `https://github.com/mattpocock/skills`

## D-20260503-05 - Adaptive Grill-Me 与 Feature DAG 粒度

- Related findings: C-02, M-02, H-03, M-07
- Decision: Plan Discover 应支持自适应的 `grill-me` 式设计概念对齐，但不把深度 grill-me 强制用于每个普通任务。`Guide` 和 Discover 前几轮大方向问题负责判断是否需要进入深挖模式。Feature Queue 应升级为 Feature-level DAG / board；第一版只让 Feature 成为 DAG 节点，Milestone 默认仍在 Feature 内部串行。
- Rationale: Matt Pocock 方法的价值在于让 Agent 开工前先对齐设计概念，而不是把含混需求直接拆成 prompt。但如果每个小修复都强制长访谈，普通 AI Coding 主路径会变慢。Feature Queue 的价值在长任务和 AFK/HITL 编排上；Feature-level DAG 能表达跨 Feature 依赖、ready/blocked、human gate 和并行候选，又不会把 Milestone prompt 本身变成调度系统。
- Keep: 普通主路径仍可以轻量 Discover；复杂、架构性、状态语义强或 source-of-truth 不清的任务进入深度 grill-me。Feature Queue 继续承载 batch、long-running、auto-chain、gate、failure policy 等长任务能力。
- Change:
  - `Guide` 需要具备路由判断：普通 plan、深度 grill-me plan、batch/DAG plan、follow-up plan、patch、explore。
  - Plan Discover 前几轮先问大方向，再根据风险进入或跳过 grill-me。
  - Feature Queue 从线性队列升级成 Feature DAG / board，记录 `depends_on`、`unlocks`、`blocked_by`、`ready/blocked/running/done/needs_human/deferred`、gate、HITL/AFK 和并行提示。
  - 用户可见术语避免“曳光弹/tracer bullet”黑话，改用“可运行垂直切片”。
- Remove: 不做 Milestone-level DAG 作为第一版；不把 deep grill-me 作为所有计划的强制长问卷；不让普通用户主路径必须理解 DAG。
- Impacted files: `skills/guide/SKILL.md`, `skills/plan-discover/SKILL.md`, `plan/PLAN-SKILL.md`, `references/feature-queue-spec.md`, `references/commands-spec.md`, `README.md`, 后续 prompt templates
- Follow-up Milestone candidate: Guide Router + Adaptive Discover + Feature DAG Board
- Open questions:
  - Grill-me 的输出应该如何分层：哪些是 transient discussion，哪些进入 durable architecture/design decision，哪些进入 glossary/ubiquitous language，哪些进入 generated execution prompts？
  - 是否新增 `.pipeline/design-concepts.yaml` / `.pipeline/glossary.md`，还是复用 `.pipeline/architecture.md` 与 Knowledge Ledger？

## D-20260503-06 - Grill-Me 输出分层

- Related findings: C-02, H-01, H-02, H-03, H-04
- Decision: Grill-Me 的输出不应落成一个巨大的单体上下文文件，而应按生命周期职责分层沉淀：原始讨论保留为 transient discussion；确认后的取舍、非目标和 source-of-truth 判断进入 durable decision records；稳定术语进入 glossary/design-concepts artifact；当前系统结构和跨切面合同进入 `.pipeline/architecture.md` 或其后继；Milestone prompt 只接收目标、边界、验收、测试、影响面和非目标等可执行子集；Knowledge Ledger 负责索引和可追溯性，不替代 architecture/glossary/prompt。
- Rationale: Matt Pocock 方法强调通用语言和设计所有权，但如果把所有讨论压成一个 `CONTEXT.md`，它很快会变成新的上下文垃圾堆。Hypo-Workflow 需要的是“讨论 -> 决策 -> 术语 -> 架构 -> prompt”的过滤链，每一层都有明确读者和刷新时机。
- Keep: `.pipeline/architecture.md` 继续承载当前系统结构和跨切面设计；Knowledge Ledger 继续承载长期索引、引用和决策记录能力；Plan Discover 继续保留对话式澄清。
- Change:
  - Plan Discover / Grill-Me 结束时需要把确认内容分类沉淀，而不是把完整对话注入后续 prompt。
  - 后续 prompt generation 应从已确认的 decision/glossary/architecture 中提取执行输入。
  - 需要定义轻量 glossary/design-concepts artifact，或明确由 Knowledge Ledger + architecture 共同承担。
- Remove: 不新增一个包罗万象的 repo-root `CONTEXT.md` 作为所有上下文的唯一入口；不让 Compact 充当设计事实来源。
- Impacted files: `skills/plan-discover/SKILL.md`, `skills/plan-generate/SKILL.md`, `skills/knowledge/SKILL.md`, `skills/compact/SKILL.md`, `plan/PLAN-SKILL.md`, `references/knowledge-spec.md`, `README.md`, future glossary/design-concepts artifact
- Follow-up Milestone candidate: Adaptive Grill-Me + Design Artifact Layering
- Open questions: 具体 artifact 命名和格式尚未定：`.pipeline/design-concepts.yaml`、`.pipeline/glossary.md`、Knowledge Ledger records，或三者组合。

### D-20260503-06 补充 - artifact split 与追问策略

- Decision: durable design concept artifact 采用机器可读 + 人类可读分层：`.pipeline/design-concepts.yaml` 保存 concept id、定义、边界、source-of-truth 链接、状态转移、相关决策和 prompt-generation hints；`.pipeline/glossary.md` 面向人解释术语、例子/反例和常见误解；Knowledge Ledger 负责索引这些概念和决策，不复制所有正文。后续 Discover 不再为低影响 artifact 命名/格式细节反复追问；Agent 有明确保守工程倾向时可直接记录建议，追问保留给会影响用户体验、workflow 语义、source of truth 或执行风险的决定。
- Rationale: 用户希望把讨论时间用于高影响产品/架构边界；artifact 文件名和 YAML/Markdown 分工已有清晰工程解法，不应阻塞继续讨论 audit findings。
- Open questions: 回到 audit 剩余高影响问题，优先讨论 workflow kind/status truth、lock recovery 用户体验、README/docs governance、sync/source-of-truth governance。

## D-20260503-07 - Lifecycle 命令一致提交

- Related findings: C-03, H-04, H-06, H-07, H-08, M-03
- Decision: 状态冲突不应成为正常用户体验。任何会改变 lifecycle 的命令都必须在同一命令流程中一致更新权威 workflow state 和受影响的派生视图，并在成功返回前执行 invariant/post-write checks。Status/check 对 stale derived view 或 authority conflict 的报告只是恢复兜底，不是期望路径。
- Rationale: 用户指出这类冲突本不应出现；Hypo-Workflow 的核心承诺是可恢复和可信状态。如果 `/hw:reject`、`/hw:accept`、`/hw:start`、`/hw:resume`、`/hw:plan-generate` 等命令只局部写文件，用户就必须肉眼拼接多个 YAML/Markdown，违背产品目标。
- Keep: 文件协议仍保留：`.pipeline/` 是 source of truth，Hypo-Workflow 仍不是 runner；status/check 仍需要诊断中断、手工编辑、旧 schema 或异常失败导致的不一致。
- Change:
  - 引入中心化 workflow commit/update helper，避免各 skill/command handler 分散写 `state/cycle/metrics/PROGRESS/log/compact/summary`。
  - lifecycle-mutating commands 必须声明会 invalidated/refreshed 的 artifacts。
  - 成功返回前必须刷新或显式标记受影响派生视图，例如 PROGRESS、metrics、compact、PROJECT-SUMMARY、OpenCode status inputs。
  - post-write invariant 检查失败时不得静默成功，应给出 repair guidance 或写入明确的 recoverable failure marker。
- Remove: 不接受“status 永远自己猜哪个文件对”作为主设计；不让派生物漂移成为正常状态。
- Impacted files: `references/state-contract.md`, `references/progress-spec.md`, `references/log-spec.md`, `skills/accept/SKILL.md`, `skills/reject/SKILL.md`, `skills/start/SKILL.md`, `skills/resume/SKILL.md`, `skills/sync/SKILL.md`, `skills/status/SKILL.md`, `core/src/*status*`, lifecycle tests
- Follow-up Milestone candidate: Workflow Commit Contract + Status Truthfulness
- Open questions: 命令级一致性失败时采用哪种策略：回滚/no-op、权威提交但派生刷新失败并打 failed-derived marker，还是对所有受影响 artifact 做严格 temp-file two-phase commit？

### D-20260503-07 补充 - partial failure 策略

- Decision: lifecycle 命令采用 prevalidation + temp-file atomic writes。若权威 lifecycle facts 已成功提交但某个派生视图刷新失败，不回滚权威事实；命令必须返回 failure/warning，标记 derived refresh failure，并给出 repair/sync 指引。派生视图可以重建，权威生命周期事实不应因为 README/compact/status-summary 刷新失败而倒退。
- Rationale: 这在一致性和恢复性之间取平衡：避免静默漂移，也避免为了非权威派生物失败而撤销真实 lifecycle 进展。
- Open questions: C-03 仍需决定 `/hw:sync` 是否升级为完整 global derived-artifact reconciliation，还是拆分/改名，把 adapter/context sync 和 lifecycle-derived repair 分开。

## D-20260503-08 - `/hw:sync` 分层全局同步语义

- Related findings: C-03, M-03, H-01, H-02, H-04
- Decision: `/hw:sync` 应升级为分层 global sync 命令，同时保留原有 config/registry/adapter/context refresh 职责。新语义不是把 sync 改成“只检查文件”，而是在原能力之上增加 authority/derived map check、安全派生 artifact refresh/repair、刷新失败报告和 repair guidance。
- Rationale: 用户对 `sync` 的直觉是“把项目同步到一致状态”。现有 sync 主要刷新配置、registry、Knowledge/compact、OpenCode adapters 和上下文提示，不能处理 PROGRESS、PROJECT-SUMMARY、metrics mirror、README managed blocks、OpenCode status inputs 等派生视图漂移。分层设计既保留原轻量能力，又补上 C-03 暴露的全局派生同步缺口。
- Keep:
  - `/hw:sync --light` 保留现有轻量 config/registry/adapter/context refresh 语义。
  - Sync 默认不随便修改 `.pipeline/state.yaml`、`.pipeline/cycle.yaml`、`.pipeline/rules.yaml` 等受保护权威文件。
- Change:
  - 标准 `/hw:sync` 增加 authority/derived map 检查和安全派生刷新。
  - 增加 `--check-only` 只报告不写。
  - 增加 `--repair` 或 `--deep` 做更完整派生修复，但仍遵守 protected authority 边界。
  - PROGRESS、metrics mirror、compact、PROJECT-SUMMARY、OpenCode artifacts/status inputs、README managed blocks 等需要声明为 derived artifacts，定义 authority、derived_from、writer、refresh trigger、staleness blocker。
- Remove: 不拆出一个用户必须额外记住的新同步命令作为主路径；不把 `/hw:sync` 收窄成 adapter-only refresh；不让 sync 对权威冲突自行猜测并改写 protected files。
- Impacted files: `skills/sync/SKILL.md`, `skills/check/SKILL.md`, `skills/status/SKILL.md`, `references/state-contract.md`, `references/progress-spec.md`, `templates/readme-spec.md`, `core/src/readme/index.js`, OpenCode artifact generation, future derived-map contract
- Follow-up Milestone candidate: Global Sync + Derived Artifact Map
- Open questions: 权威文件之间发生真实冲突时，repair flow 是单独命令、sync confirmation gate，还是 guide 路由到 repair？

## D-20260503-09 - Cycle-Scoped Workflow Kind

- Related findings: H-03, M-04, M-06
- Decision: `workflow_kind` 是 Cycle-scoped 的单一工作流语义来源；项目可以定义 `default_workflow_kind`，但每个 Cycle 拥有自己的 `workflow_kind`，并驱动该 Cycle 内的 Plan、Decompose、Generate、Start、Report、Acceptance、Status、OpenCode boundaries 和 docs。初始值为 `build | analysis | showcase`，未来可扩展 `research`。`cycle.type` 不再作为竞争分类来源，应废弃为用户可见概念或仅作为从 `workflow_kind` 派生的 legacy/internal alias。
- Rationale: 同一仓库可以有不同 Cycle：C5 是 `analysis/repo_system` 审计 Cycle，后续修复 Cycle 可以是 `build/tdd`。问题不在跨 Cycle 不同，而在同一 Cycle 内 architecture/prompt/config/cycle/state/OpenCode/report 彼此矛盾。`workflow_kind` 必须成为 Cycle 内唯一语义源。
- Keep: 项目级默认值可保留，便于多数 coding delivery 项目默认 `build`；`execution.preset` 仍存在，作为 step-chain template。
- Change:
  - `execution.preset` 默认从 `workflow_kind` 推导，高级覆盖必须不违背 Cycle workflow。
  - `analysis` 可携带 `analysis_kind: repo_system | root_cause | metric`。
  - `test_profiles` 只表达验证证据策略，不能再写入 `analysis` 这类 workflow/preset 名称。
  - OpenCode analysis boundary 的生成路径和 AGENTS/adapter 文档必须从同一 workflow source 渲染。
- Remove: 不再用 `feature + tdd` 表达 audit/analysis Cycle；不让 `cycle.type`、config preset、prompt 内容、architecture direction 各说各话。
- Impacted files: `.pipeline/config.yaml`, `.pipeline/cycle.yaml`, `references/analysis-spec.md`, `references/test-profile-spec.md`, `references/state-contract.md`, `skills/plan-generate/SKILL.md`, `skills/start/SKILL.md`, `skills/status/SKILL.md`, `core/src/artifacts/opencode.js`, OpenCode templates/tests
- Follow-up Milestone candidate: Workflow Kind Single Source
- Open questions: completed-but-rejected、revision、pending follow-up planning、blocked continuation 等用户可见 phase 名称和状态转移仍需讨论。

## D-20260503-10 - Status Phase 与 Cycle Lifecycle Policy

- Related findings: H-04, H-06, C-02, H-03
- Decision: 用户可见 status 应通过聚合器暴露一个 canonical phase 和一个 next action，而不是让用户同时理解 execution/acceptance/continuation/lock/derived-health 多轴状态。拒绝 Milestone/Cycle 后默认进入 `needs_revision`，保存用户反馈作为 revision input；`/hw:resume` 默认继续修订，除非用户显式选择 abandon、abort 或 replan。Acceptance、revision、auto-continue、gate、planned follow-up 等行为应在 Cycle 开始 / Plan Generate 时作为 Cycle lifecycle policy 声明，而不是后续命令临时猜测。
- Rationale: 用户指出这一系列默认行为应在 Cycle 开始时决定好。这样 accept/reject/resume/status/guide 都能从 Cycle policy 单源推导，避免 C5 这种 done/running/rejected 混合状态。
- Keep: 内部仍可保留多轴状态：execution、acceptance、continuation、lock、derived health；详细诊断可在 status 展开或 check 中显示。
- Change:
  - 增加用户可见 canonical phases：`planning`、`ready_to_start`、`executing`、`pending_acceptance`、`needs_revision`、`accepted`、`follow_up_planning`、`blocked`、`completed`。
  - Cycle lifecycle policy 需要声明默认行为，例如 `reject.default_action: needs_revision`、`accept.next: complete | auto_continue | follow_up_plan`、`continuations[]`、`gates: auto | confirm | manual_qa`、`resume.default_action`。
  - `status` 第一屏显示 phase、next action、reason；stale/repair diagnostics 作为补充。
  - `/hw:reject` 必须创建或激活 revision state，不应只写 acceptance mirror。
- Remove: 不再把 completed-but-rejected 表示成 `executing` + done step + rejected acceptance 的混合状态；不让 resume 从已 done step 继续。
- Impacted files: `references/state-contract.md`, `references/progress-spec.md`, `skills/reject/SKILL.md`, `skills/accept/SKILL.md`, `skills/resume/SKILL.md`, `skills/status/SKILL.md`, `skills/guide/SKILL.md`, `skills/plan-generate/SKILL.md`, status builders/tests
- Follow-up Milestone candidate: Status Truthfulness + Cycle Lifecycle Policy
- Open questions: Cycle-start lifecycle policy 是每个 Cycle 都必须显式写完整，还是由 workflow_kind 生成默认 policy 并允许 Plan 覆盖？

## D-20260503-11 - Execution Recovery 与 Cross-Platform Handoff

- Related findings: H-05, M-05, M-07, H-03, M-04, C-03
- Decision: 锁恢复不应只修 `.pipeline/.lock`，而应升级为统一的 execution recovery 设计，覆盖 stale lock、模型/API 失败、上下文压缩后停摆、watchdog resume、以及 Codex/OpenCode 之间的接管。明显 stale lock 默认自动接管，不要求用户手动删锁；接管必须写 lifecycle log。Codex 和 OpenCode 的授权边界、auto-continue、gate、protected files、外部副作用边界必须从同一 `.pipeline` Cycle/project policy 和生成 adapter 中读取，保证平台切换不改变工作流语义。
- Rationale: 用户指出两个真实恢复问题：模型 429 或上下文压缩后 Agent 停止不干时如何重新启动；Codex 不能用而切到 OpenCode 时如何保持授权、自动继续、边界一致。现有 watchdog 遇到 lock 直接 skip，SessionStart 只注入上下文，不足以保证恢复。
- Keep: Hypo-Workflow 仍不是 runner；Agent 继续执行实际工作。`.pipeline/` 仍是跨平台 source of truth。
- Change:
  - 将 `.pipeline/.lock` 从一行文本升级为 structured execution lease，包含 platform、agent/session id、owner、command、workflow phase、created_at、heartbeat_at、expires_at、handoff_allowed。
  - `/hw:start`、`/hw:resume`、watchdog、status/check 都使用同一 lease/stale 判定。
  - 429/model failure 或 lost context 应写入 resumable failure reason、retry/backoff metadata 和 next action。
  - compact/SessionStart 不能是唯一恢复机制；durable state、prompt、report、decision/glossary artifacts 和 lease 必须足够重启工作。
  - 平台 adapter 生成 capability/boundary profile：allowed writes、protected files、service restart、network/external side-effect boundaries、auto-continue permission、gate policy。
  - OpenCode 应能运行 status/check，识别 stale Codex lease，在 handoff_allowed 且 lease expired 时自动接管并按同一 Cycle policy resume。
- Remove: 不再让 watchdog 因为任何 lock 存在就永久 skip；不再依赖压缩上下文里的自然语言提醒作为恢复保证；不让 Codex/OpenCode 各自拥有不同授权/自动继续语义。
- Impacted files: `skills/resume/SKILL.md`, `skills/start/SKILL.md`, `skills/watchdog/SKILL.md`, `skills/status/SKILL.md`, `skills/check/SKILL.md`, `references/state-contract.md`, `references/config-spec.md`, `scripts/watchdog.sh`, `hooks/session-start.sh`, OpenCode artifact generator/templates, AGENTS/adapter docs
- Follow-up Milestone candidate: Execution Lease + Recovery + Platform Handoff
- Open questions: 429/API failure 的默认 retry/handoff 策略如何设定：先同平台 watchdog auto-resume，平台可用时立即 handoff，还是由 Cycle/project policy 配置优先级？

### D-20260503-11 补充 - Failure Hook 不可作为统一前提

- Decision: 不假设 Codex、Claude Code、OpenCode 都提供可靠的 failure hook 或显式 429 事件。平台事件只能作为可选证据；跨平台恢复的便携信号必须是 heartbeat / execution lease timeout。若平台报告了 429/model failure，就记录具体 failure reason；若平台没有报告，则按 expired lease/heartbeat 推断为 `unknown_stalled` 或 `platform_unresponsive` 并执行恢复。
- Evidence:
  - 本仓库现有 `hooks/codex-notify.sh` 明确写着当前 Codex 集成只使用 `notify` 作为 agent-turn-complete fallback；README 也说明现有 Codex 集成没有 Claude hook 语义。
  - Claude Code 可用 Stop / SessionStart / InstructionsLoaded 等 hook 面，当前仓库已有 `hooks/hooks.json`。
  - OpenCode plugin 文档和仓库现有 scaffold 指向 session/command/permission/tool 等事件面，适合记录更丰富的 session/error/context 事件。
  - Official references checked: Anthropic Claude Code hooks reference documents Stop/SessionStart/PreCompact/SessionEnd/StopFailure and hook exit/JSON behavior; OpenCode plugins docs list `session.error`, `session.idle`, `session.status`, `session.compacted`, command, permission, and tool events; OpenAI Codex hooks docs describe lifecycle hooks behind `codex_hooks` such as SessionStart, PreToolUse, PermissionRequest, PostToolUse, UserPromptSubmit, and Stop, while the config reference describes legacy `notify` as a turn-finish notification hook.
- Rationale: 用户问“它怎么知道 429 了”是核心问题。自动恢复不能建立在所有平台都能上报同一种失败事件的假设上；即使平台有 hooks，也不一定有显式 429/rate-limit failure event。否则部分平台 failure 会变成不可恢复的沉默停摆。
- Change:
  - Recovery state 区分 `reported_failure` 与 `inferred_stall`。
  - Watchdog/status/check 以 lease/heartbeat 作为最低共同恢复机制。
  - 平台 adapter 可以补充捕获 error/session events，但不能让这些事件成为恢复必需条件。
- Follow-up correction: 自动恢复采用 best-effort platform hooks + portable lease/heartbeat fallback。能捕获 429/rate-limit 就记录具体原因，捕获不到就按 execution lease/heartbeat 过期恢复。
- Open questions: 低层 failure reason 命名可由实现保守决定；后续优先讨论 log/event history UX、secret evidence safety、docs governance、TUI/dashboard surface 和 regression scope。

## D-20260503-12 - Log Ledger 与 Recent Events 分层

- Related findings: H-07, H-08
- Decision: `.pipeline/log.yaml` 是完整 lifecycle audit ledger；`/hw:status` 和 dashboard 的 Recent Events 是面向用户下一步的过滤活动流。Log schema 必须覆盖真实事件族，Recent reader 必须按 timestamp 排序，不依赖文件写入方向。内部 hook heartbeat、helper refresh、低层平台噪音默认不进 status/dashboard recent，除非影响用户动作；它们仍可通过 `/hw:log` 或 debug 视图查看。
- Rationale: 用户需要两种不同视图：完整审计历史用于追溯，status/dashboard 用于知道现在发生了什么和下一步做什么。把所有事件都塞到 Recent 会制造噪音；只保留 Recent 又会损失审计性。
- Keep: 完整 lifecycle history 保留在 log；debug/internal event 不丢失。
- Change:
  - log schema 覆盖 cycle、plan、feature、milestone、step、patch、acceptance、sync、recovery、handoff、derived refresh、platform events。
  - 每条事件至少有 `id`、`timestamp`、`type`、`scope`、`status`、`message`、`refs`。
  - log writer/schema validator 统一，命令不再手写散乱 YAML。
  - Recent Events 按 timestamp 排序，覆盖 newest-first 和 oldest-first fixture。
  - status/dashboard Recent 只展示 started、completed、rejected、needs_revision、follow_up_planning、handoff、blocked、sync_failed 等用户相关事件。
- Remove: 不让 OpenCode Recent 通过 `entries.slice(-10).reverse()` 这种依赖文件顺序的方式读旧事件；不把每个 hook heartbeat 都塞进用户状态第一屏。
- Impacted files: `references/log-spec.md`, `skills/log/SKILL.md`, `skills/status/SKILL.md`, `core/src/opencode-status/index.js`, log writer helpers/tests, dashboard/TUI recent rendering
- Follow-up Milestone candidate: Log Schema + Recent Event Readers
- Open questions: 具体 event type 枚举由实现保守设计，不需要继续追问。

## D-20260503-13 - Secret-Safe Evidence Pipeline

- Related findings: H-09
- Decision: debug、audit、report、log、status、dashboard、Knowledge surfaces 必须共用统一且保守的 secret-safe evidence pipeline。写 durable report/evidence artifact 前执行 secret scan/redaction validation。API key、token、password、Authorization header、cookie、private key、provider credential 等疑似 secret 默认脱敏或阻断。策略上宁可误报，不可漏报。
- Rationale: debug/audit/report 最常读取配置、diff、错误日志和环境上下文，是 secret 泄露高风险路径。Knowledge Ledger 已有 secret 规则，但安全边界不能只存在于 Knowledge；所有会写持久证据或展示状态的 surface 都应共享同一脱敏逻辑。
- Keep: 可以引用 env var 名、secret reference id、provider 名和 redacted value shape，用于定位问题。
- Change:
  - 增加 shared deterministic redaction helper，替代各 skill 自己写 regex。
  - reports/evidence/log/status/dashboard 写入或展示前走 redaction validation。
  - Debug secret 相关问题时只写 redacted evidence，不写 raw value。
- Remove: 不允许 raw Authorization header、API key、token、password 进入 `.pipeline/debug/`、audit report、lifecycle log、status/dashboard 或 compact context。
- Impacted files: `skills/debug/SKILL.md`, `skills/audit/SKILL.md`, `skills/report/SKILL.md`, `skills/log/SKILL.md`, `skills/status/SKILL.md`, `references/debug-spec.md`, `references/knowledge-spec.md`, core evidence/report helpers/tests
- Follow-up Milestone candidate: Secret-Safe Evidence Pipeline
- Open questions: 具体 secret pattern 列表和测试样例由实现保守设计，不继续追问。

## D-20260503-14 - Docs Governance 与显式 Docs Command

- Related findings: H-01, H-02, L-01, L-04, C-03
- Decision: 文档治理应明确区分面向用户的 README/完整用户文档和面向维护者的开发者文档。README 是简洁用户入口，讲工具是什么、最快开始、常见 workflow、examples、恢复路径和文档入口；不应被“如何跑测试”、release validation、内部架构、完整 changelog、adapter runtime 细节占据。测试是否通过和如何跑测试属于开发者文档或 release/check 报告，不属于用户 README 主叙事。Hypo-Workflow 应增加显式 docs command/workflow，用于生成、刷新、检查和修复 README、完整用户文档、完整开发者文档、License 引用，而不是把所有文档工作隐含在 sync/release 中。
- Rationale: 用户明确指出 README 经常变成“如何跑通 TEST”，这不符合 README 给用户看的定位。用户关心如何使用、Examples 和恢复；开发者才需要测试、架构、release、adapter、hooks、schemas 等维护信息。显式 docs 命令能让文档产物成为一等 workflow，而不是 README automation 的副产品。
- Keep:
  - README 保留最新版本/License/文档入口等必要摘要。
  - Developer docs 保留测试命令、回归、release、架构和平台 adapter 细节。
  - `/hw:sync` 可继续检测/刷新安全的 derived doc blocks。
- Change:
  - README 拆成 concise user entrypoint。
  - 增加完整用户文档，例如 `docs/user-guide.md`，覆盖概念、workflow examples、平台选择、troubleshooting、Feature DAG/long-running、Patch/Explore、Recovery。
  - 增加完整开发者文档，例如 `docs/developer.md`，覆盖架构、repo structure、tests、release、generated artifacts、adapters、hooks/plugins、schemas、贡献/维护 workflow。
  - 增加平台文档，如 `docs/platforms/opencode.md`、`docs/platforms/claude-code.md`、`docs/platforms/codex.md`。
  - 增加或校验 `LICENSE`，README 明确 License 链接。
  - 将 README freshness 拆成 user-doc quality checks 与 developer/release metadata freshness checks。
  - 新增显式 docs command/workflow，可能是 `/hw:docs` 或 `/hw:doc`，负责 doc generate/check/repair。
- Remove: 不在 README 内嵌完整 36 命令表、runtime 验证、回归测试数量、长 changelog、OpenCode scaffold 实现细节。
- Impacted files: `README.md`, `docs/*`, `CHANGELOG.md`, `LICENSE`, `templates/readme-spec.md`, `core/src/readme/index.js`, `rules/builtin/readme-freshness.yaml`, `skills/sync/SKILL.md`, command registry, future docs skill/command
- Follow-up Milestone candidate: Docs Command + User/Developer Documentation IA
- Open questions: 命令命名用 `/hw:docs` 还是 `/hw:doc`；docs command 是否只生成文档，还是也能检查和修复 freshness。

### D-20260503-14 补充 - 自动更新边界与 Release 文档事实检查

- Decision: 文档自动化分三类：Managed Blocks 可自动更新，Generated Reference 可自动全量再生成，Narrative Docs 不应被 sync/release 静默重写。Release gate 必须检查人读 narrative docs 是否存在事实问题或 stale claims，但默认应报告/阻断/要求 docs repair，而不是直接静默改写叙事段落。
- Rationale: 用户确认文档本身需要自动更新，同时指出 release 时必须检查人读文档里的事实问题。因此自动化要同时满足 freshness 和 narrative ownership：机器事实自动刷，人类叙事受保护，release 做事实审计。
- Update classes:
  - Managed Blocks: version、command reference links、platform matrix、docs index、License link、changelog summary、schema/config reference、generated artifact list。
  - Generated Reference: commands/config/state schema/platform matrix/generated artifacts 等由 registry/schema/source artifacts 派生的 reference docs。
  - Narrative Docs: README body、user guide、developer guide、platform guides、examples、troubleshooting narrative。
- Change:
  - 增加 docs map，声明每个文档的 role、sources、managed blocks、narrative update policy、must-not-include。
  - `/hw:sync` 或 `/hw:docs sync` 可自动刷新 managed blocks 和 generated reference。
  - `/hw:docs repair` 可重写 narrative，但需要确认或显式 auto docs policy。
  - `/hw:release` 必须运行 narrative fact check，对照 current commands/config/schema/platform artifacts 检查 README/user guide/developer docs/platform docs 是否有错误承诺、旧命令、过期平台信息或错误测试/安装说法。
- Open questions: Release-time narrative fact check 发现问题时默认是 block release，还是生成 docs repair queue 并由用户确认是否继续？

## D-20260503-15 - TUI 作为配置管理界面

- Related findings: M-08, C-02, M-05
- Decision: TUI 的产品目标是配置管理 TUI，不是全流程 workflow action center。第一版交互能力聚焦管理全局默认和当前项目 `.pipeline/config.yaml`：通过表单、toggle、selector、diff preview、schema validation 和确认写入来配置平台、模型、approval/sandbox、plan mode、watchdog、compact、sync、docs automation、lifecycle defaults、language/timezone、subagent defaults。后续可增加自动展示进度的 Dashboard，但 C5 不做 start/resume/accept/reject/sync/repair 等完整 lifecycle action dispatcher。
- Rationale: 用户明确表示不打算做全流程 TUI，核心痛点是手改配置文件体验很差。配置管理 TUI 边界清楚、用户价值直接，风险远低于把所有 workflow action 放进 TUI。
- Keep: Status snapshot / dashboard 可继续只读展示当前 Cycle、phase、next action、lock/lease、recent events、derived health、active config summary。
- Change:
  - TUI 必须区分“修改全局默认”与“修改当前项目配置”。
  - 配置编辑写入前展示 diff，写入前后运行 schema validation。
  - 若配置变更影响 adapters/platform artifacts，提示或触发 `/hw:sync --light`。
  - Config TUI 不修改 `.pipeline/state.yaml`、`.pipeline/cycle.yaml`、`.pipeline/rules.yaml` 等 protected lifecycle files。
- Remove: C5 不实现完整 workflow action dispatcher；不把 TUI 作为替代 Guide/command system 的主操作中心。
- Impacted files: `skills/dashboard/SKILL.md`, `skills/setup/SKILL.md`, `references/config-spec.md`, `core/src/tui/index.js`, `dashboard/*`, config schema/helpers/tests, docs
- Follow-up Milestone candidate: Interactive Config TUI + Read-Only Progress Dashboard
- Open questions: Config TUI 是否作为 `/hw:dashboard` 的一个 tab，还是新增 `/hw:setup --tui` / `/hw:config` 入口，由实现阶段评估。

## D-20260503-16 - Evidence / Regression / Metrics 收口

- Related findings: M-06, M-07, L-03, H-03
- Decision: Test Profiles 只表示验证证据策略，不能编码 `workflow_kind` 或 execution preset 名称，例如 `analysis`。Analysis Cycle 使用 analysis evaluation/evidence contract，不伪装成 test profile。Regression 需要覆盖真实 lifecycle fixtures，而不只测静态 helper。Metrics 至少应尽量记录 wall-clock duration；token/cost 是可选 telemetry，缺失时明确写 `telemetry_unavailable`，不要只写不透明的 `n/a`。
- Rationale: Audit 暴露出 `analysis` 被错误写进 test profiles，以及长会话恢复问题未被回归覆盖。测试绿不等于真实 workflow 可靠；metrics 全是 `n/a` 也不能帮助用户判断执行成本/时长。
- Change:
  - Plan Generate 禁止把 workflow/preset 写入 `test_profiles`。
  - Analysis evidence 走 analysis report/evidence/ledger 语义。
  - 新增 lifecycle regression fixtures：stale lease takeover、heartbeat timeout resume、context compact 后 resume、Codex->OpenCode handoff、reject->needs_revision、accept->follow_up_plan、sync derived repair、workflow_kind analysis/build artifact consistency。
  - Metrics 对 duration 做 best-effort 记录；token/cost 缺失时说明 telemetry unavailable。
- Impacted files: `references/test-profile-spec.md`, `references/analysis-spec.md`, `references/state-contract.md`, `tests/run_regression.py`, regression fixtures, `core/src/test-profile/*`, `core/src/analysis/*`, metrics helpers/docs
- Follow-up Milestone candidate: Evidence Contract + Lifecycle Regression Expansion
- Open questions: 具体 regression fixture 文件组织由实现阶段决定。
