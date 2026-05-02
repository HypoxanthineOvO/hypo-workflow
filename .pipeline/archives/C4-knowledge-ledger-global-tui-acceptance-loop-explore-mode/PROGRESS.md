# Hypo-Workflow C4 Knowledge Ledger, Global TUI, Acceptance Loop, and Explore Mode — 开发进度

> 最后更新：02:41 | 状态：已完成 | 进度：14/14 Milestone

## 当前状态
✅ **C4 完成** — Knowledge Ledger、Global TUI、Acceptance Loop、Explore Mode 和 `/hw:sync` 已全部通过验证。

## Milestone 进度

| # | Feature | Milestone | 状态 | 摘要 |
|---|---|---|---|---|
| M01 | F001 | Knowledge Ledger contract | ✅ 完成 | Knowledge Ledger 合同、helper、默认配置、Skill、命令映射和回归场景已通过验证 |
| M02 | F001 | Knowledge helpers and compact index | ✅ 完成 | Knowledge helper API、record append、index rebuild、compact render 已通过验证 |
| M03 | F001 | Knowledge hook integration | ✅ 完成 | SessionStart knowledge context、Stop Hook strict gate、规则和 archive/compact 文档已通过验证 |
| M04 | F001 | OpenCode workflow-control hooks | ✅ 完成 | OpenCode workflow-control policy runtime、plugin wiring 和回归验证已通过 |
| M05 | F001 | F001 integration gate | ✅ 完成 | F001 Knowledge Ledger、compact/index、SessionStart/Stop Hook、OpenCode policy gate 已通过 |
| M06 | F002 | Global config and registry model | ✅ 完成 | 全局 model pool、lazy migration、projects registry 和 OpenCode matrix mapping 已通过验证 |
| M07 | F002 | Ink TUI foundation | ✅ 完成 | 全局只读 Ink TUI foundation、CLI routing、hw alias 和依赖锁已通过验证 |
| M08 | F002 | Model pool and project actions | ✅ 完成 | model pool edit、project add/scan/refresh/sync、selected sync 和 TUI detail 状态已通过验证 |
| M09 | F003 | Cycle acceptance | ✅ 完成 | Cycle pending_acceptance、accept/reject 命令、feedback_ref、状态/TUI/文档和 OpenCode 映射已通过验证 |
| M10 | F003 | Patch acceptance | ✅ 完成 | Patch pending_acceptance、accept/reject、iteration、feedback refs 和 escalation 建议已通过验证 |
| M11 | F003 | Acceptance policy and status | ✅ 完成 | acceptance policy defaults/override、timeout status decision、structured reject template、OpenCode status 和 Global TUI 展示已通过验证 |
| M12 | F004 | Explore contract and worktree | ✅ 完成 | `/hw:explore` contract、metadata、全局隔离 worktree、dirty gate、OpenCode artifact 和 Knowledge record 已通过验证 |
| M13 | F004 | Explore lifecycle and upgrade | ✅ 完成 | status/end/archive、plan context、analysis context 和多 exploration 隔离已通过验证 |
| M14 | F004 | Sync standardization | ✅ 完成 | `/hw:sync` light/standard/deep、CLI 共享逻辑、SessionStart light check、TUI action 和 OpenCode artifact 已通过验证 |

## 时间线

| 时间 | 类型 | 事件 | 结果 |
|---|---|---|---|
| 02:41 | Pipeline | C4 completed | 14/14 Milestone 全部完成，核心 156/156、回归 62/62、配置/JSON/diff 校验通过 |
| 02:41 | Milestone | M14 completed | 报告已生成，Sync standardization 交付完成 |
| 02:40 | Step | M14 review_code | 范围审查通过，`/hw:sync` 不是 runner，SessionStart 只读检测，deep sync 必须显式触发 |
| 02:40 | Step | M14 run_tests_green | 定向 4/4、受影响 19/19、核心 156/156、回归 62/62、配置/JSON/diff 校验通过 |
| 02:35 | Step | M14 implement | 已实现 sync helper、CLI 共享路径、command map、Skill、SessionStart light detection、TUI label、文档和 OpenCode artifact |
| 02:28 | Step | M14 run_tests_red | 红灯符合预期：sync helper 尚未导出实现 |
| 02:27 | Step | M14 review_tests | 测试合同审查通过，覆盖 runner boundary、SessionStart no-heavy-write、CLI 兼容和 command exposure |
| 02:27 | Step | M14 write_tests | 已新增 `/hw:sync` 标准化测试 |
| 02:23 | Milestone | M14 started | auto-continue 进入 Sync standardization，当前步骤 `write_tests` |
| 02:23 | Milestone | M13 completed | 报告已生成，Explore lifecycle and upgrade 交付完成 |
| 02:23 | Step | M13 review_code | 范围审查通过，upgrade 只生成 context source，不合并 branch，不默认删除 worktree |
| 02:22 | Step | M13 run_tests_green | 定向 7/7、核心 152/152、回归 62/62、配置/JSON/diff 校验通过 |
| 02:20 | Step | M13 implement | 已实现 status/end/archive、plan context、analysis context 和 Explore/Plan 文档 |
| 02:18 | Step | M13 run_tests_red | 红灯符合预期：Explore lifecycle helper 尚未导出实现 |
| 02:17 | Step | M13 review_tests | 测试合同审查通过，覆盖 lifecycle、summary、upgrade 和多 exploration 隔离 |
| 02:17 | Step | M13 write_tests | 已新增 Explore lifecycle/upgrade 测试 |
| 02:17 | Milestone | M13 started | auto-continue 进入 Explore lifecycle and upgrade，当前步骤 `write_tests` |
| 02:17 | Milestone | M12 completed | 报告已生成，Explore contract and worktree 交付完成 |
| 02:16 | Step | M12 run_tests_green | 定向 3/3、核心 148/148、回归 62/62、配置校验通过 |
| 02:15 | Step | M12 review_code | 范围审查通过，不自动合并 exploration code，不删除 worktree，不授权整个 `~/.hypo-workflow` |
| 01:56 | Step | M12 implement | 已实现 Explore helper、metadata、worktree、dirty gate、Knowledge record、OpenCode artifact 和 Skill |
| 01:48 | Step | M12 run_tests_red | 红灯符合预期：Explore helper、command map 和 OpenCode artifact 尚未实现 |
| 01:46 | Step | M12 review_tests | 测试合同审查通过，覆盖 metadata、dirty gate、worktree path、command map 和 OpenCode artifact |
| 01:45 | Step | M12 write_tests | 已新增 Explore contract/worktree 测试 |
| 01:43 | Milestone | M12 started | 用户确认推进后进入 Explore contract and worktree，当前步骤 `write_tests` |
| 01:41 | Milestone | M11 completed | 报告已生成，Acceptance policy and status 交付完成 |
| 01:41 | Step | M11 review_code | 范围审查通过，timeout 为只读状态判定，不写受保护 state/cycle/rules |
| 01:40 | Step | M11 run_tests_green | 定向 4/4、核心 145/145、回归 62/62、配置/JSON/diff 校验通过 |
| 01:31 | Step | M11 implement | 已实现 policy resolver、timeout evaluator、structured reject template、OpenCode status/TUI 展示和文档 |
| 01:15 | Step | M11 run_tests_red | 红灯符合预期：rejection template 与 acceptance policy/status API 尚未导出实现 |
| 01:14 | Step | M11 review_tests | 测试合同审查通过，覆盖 defaults/override、timeout、structured feedback、OpenCode status 和 Global TUI |
| 01:14 | Step | M11 write_tests | 已新增 Acceptance policy/status 测试 |
| 01:13 | Milestone | M11 started | auto-continue 进入 Acceptance policy and status，当前步骤 `write_tests` |
| 01:13 | Milestone | M10 completed | 报告已生成，Patch acceptance 交付完成 |
| 01:12 | Step | M10 review_code | 范围审查通过，Patch acceptance 不写 state.yaml，不新增顶层 slash command |
| 01:12 | Step | M10 run_tests_green | 定向 3/3、核心 141/141、回归 62/62、配置/plugin/OpenCode/JSON/diff 校验通过 |
| 01:11 | Step | M10 implement | 已实现 Patch acceptance helper、metadata roundtrip、reject feedback 和 fix context 注入 |
| 01:09 | Step | M10 run_tests_red | 红灯符合预期：Patch acceptance helper 尚未导出实现 |
| 01:09 | Step | M10 review_tests | 测试合同审查通过，覆盖 state 边界、iteration、feedback_refs 和 escalation |
| 01:08 | Step | M10 write_tests | 已新增 Patch acceptance 生命周期、reject feedback、fix context 和 Skill 文档测试 |
| 01:07 | Milestone | M10 started | auto-continue 进入 Patch acceptance，当前步骤 `write_tests` |
| 01:07 | Milestone | M09 completed | 报告已生成，Cycle acceptance 交付完成 |
| 01:06 | Step | M09 review_code | 范围审查通过，acceptance helper 不执行 runner，不在 state 存 full feedback |
| 01:05 | Step | M09 run_tests_green | 定向 15/15、核心 138/138、回归 62/62、配置/plugin/OpenCode/JSON/diff 校验通过 |
| 00:52 | Step | M09 implement | 已实现 Cycle acceptance helper、accept/reject Skill、command map、status/TUI 和文档 |
| 00:24 | Step | M09 run_tests_red | 红灯符合预期：acceptance helper 尚未导出实现 |
| 00:20 | Step | M09 review_tests | 测试合同审查通过，覆盖 pending acceptance、accept/reject、feedback_ref 和 command/doc exposure |
| 00:18 | Step | M09 write_tests | 已新增 Cycle acceptance 生命周期、OpenCode status 和 command/docs 测试 |
| 00:02 | Milestone | M09 started | auto-continue 进入 Cycle acceptance，当前步骤 `write_tests` |
| 00:02 | Milestone | M08 completed | 报告已生成，Model pool and project actions 交付完成 |
| 00:01 | Step | M08 review_code | 范围审查通过，TUI build 保持 read-only，写入仅限显式 action helper |
| 00:00 | Step | M08 run_tests_green | 定向 7/7、核心 135/135、回归 62/62、配置/plugin/OpenCode/JSON/diff 校验通过 |
| 23:50 | Step | M08 implement | 已实现 model pool edit、project add/scan/refresh/sync、selected registry 和 TUI detail 状态 |
| 23:38 | Step | M08 run_tests_red | 红灯符合预期：action helper 尚未导出实现 |
| 23:37 | Step | M08 review_tests | 测试合同审查通过，覆盖 fallback chain、registry action、sync override 和 TUI action exposure |
| 23:37 | Step | M08 write_tests | 已新增 model pool actions、project actions、selected sync 和 TUI detail 测试 |
| 23:32 | Milestone | M08 started | auto-continue 进入 Model pool and project actions，当前步骤 `write_tests` |
| 23:32 | Milestone | M07 completed | 报告已生成，Ink TUI foundation 交付完成 |
| 23:32 | Step | M07 review_code | 范围审查通过，TUI 只读且测试不污染真实 projects registry |
| 23:29 | Step | M07 run_tests_green | 核心 132/132、回归 62/62、CLI lock/config/plugin/OpenCode/diff 校验通过 |
| 23:26 | Step | M07 implement | 已实现 TUI model/snapshot、CLI tui route、hw alias package、Ink dependency lock 和 docs |
| 23:24 | Step | M07 run_tests_red | 红灯符合预期：TUI model/render API、CLI tui route 和 package metadata 尚未实现 |
| 23:23 | Step | M07 review_tests | 测试合同审查通过，采用 deterministic snapshot 验证非交互 TUI |
| 23:23 | Step | M07 write_tests | 已新增 TUI model、CLI routing、hw alias、dependency lock 和 registry visibility 测试 |
| 23:18 | Milestone | M07 started | auto-continue 进入 Ink TUI foundation，当前步骤 `write_tests` |
| 23:18 | Milestone | M06 completed | 报告已生成，Global config and registry model 交付完成 |
| 23:18 | Step | M06 review_code | 范围审查通过，普通读取无副作用，CLI 注册只写 projects registry |
| 23:16 | Step | M06 run_tests_green | 核心 128/128、回归 62/62、配置/plugin/OpenCode/diff 校验通过 |
| 23:08 | Step | M06 implement | 已实现 model pool、lazy migration、project registry、OpenCode mapping、CLI 注册和 schema/docs |
| 23:01 | Step | M06 run_tests_red | 红灯符合预期：model-pool / migration / registry helper 尚未实现 |
| 23:00 | Step | M06 review_tests | 测试合同审查通过，准备红灯验证 |
| 23:00 | Step | M06 write_tests | 已新增全局配置、model pool、registry 和 init-project 注册测试 |
| 22:55 | Milestone | M06 started | 用户确认 F001 gate 后进入 F002 Global config and registry model，当前步骤 `write_tests` |
| 22:01 | Milestone | M05 completed | F001 gate 通过，报告已生成；按约束暂停在 F002 前 |
| 22:01 | Step | M05 review_code | 范围审查通过，OpenCode sidecar 改为 standard/safe，s61 已隔离真实 HOME |
| 22:00 | Step | M05 run_tests_green | 核心 122/122、回归 62/62、s50/s57/s61、OpenCode debug config、plugin/config/diff 校验通过 |
| 21:56 | Step | M05 implement | 已写入 C4/M05 Knowledge record，重建 compact/index，并同步 OpenCode artifacts |
| 21:51 | Step | M05 run_tests_red | 红灯符合预期：缺少 C4/M05 Knowledge record，OpenCode sidecar 仍显示 aggressive auto-continue |
| 21:49 | Step | M05 review_tests | gate 测试范围通过，准备红灯验证 |
| 21:48 | Step | M05 write_tests | 已新增 F001 gate Knowledge/OpenCode 集成测试 |
| 21:44 | Milestone | M05 started | auto-continue 进入 F001 integration gate，当前步骤 `write_tests` |
| 21:30 | Milestone | M04 completed | 报告已生成，OpenCode workflow-control hooks 交付完成 |
| 21:25 | Step | M04 run_tests_green | 核心 120/120、回归 62/62、s57、配置/plugin/diff 校验通过 |
| 21:25 | Step | M04 implement | 已实现 OpenCode policy runtime、plugin wiring、permission/auto-continue/stop-equivalent 行为 |
| 21:13 | Step | M04 run_tests_red | 红灯符合预期：OpenCode hook policy helpers 尚未实现 |
| 21:11 | Step | M04 review_tests | 测试合同审查通过，准备红灯验证 |
| 21:08 | Step | M04 write_tests | 已新增 OpenCode policy helper 和 generated runtime/plugin 测试 |
| 21:03 | Milestone | M04 started | auto-continue 进入 OpenCode workflow-control hooks，当前步骤 `write_tests` |
| 21:03 | Milestone | M03 completed | 报告已生成，hook integration 交付完成 |
| 21:01 | Step | M03 run_tests_green | 定向 11/11、核心 116/116、回归 62/62、配置/plugin/diff 校验通过 |
| 20:54 | Step | M03 implement | 已实现 SessionStart knowledge context、Stop Hook strict gate、规则和 archive/compact 文档 |
| 20:44 | Step | M03 run_tests_red | 红灯符合预期：Knowledge hook integration 尚未实现 |
| 20:42 | Step | M03 review_tests | 测试合同审查通过，准备红灯验证 |
| 20:41 | Step | M03 write_tests | 已新增 SessionStart、Stop Hook strict gate、archive/compact/rules 文档测试 |
| 20:40 | Patch | P006 closed | V4 报告和 Slides 全面重写，11章/45页+29页，编译通过 |
| 20:35 | Milestone | M03 started | auto-continue 进入 Knowledge hook integration，当前步骤 `write_tests` |
| 20:35 | Milestone | M02 completed | 报告已生成，helper/index/compact 交付完成 |
| 20:32 | Step | M02 run_tests_green | 定向 8/8、核心 113/113、回归 62/62、配置/plugin/diff 校验通过 |
| 20:29 | Step | M02 implement | 已实现 normalization、append、index rebuild、compact render 和 helper API 文档 |
| 20:23 | Step | M02 run_tests_red | 红灯符合预期：M02 helper exports 尚未实现 |
| 20:20 | Step | M02 review_tests | 测试合同审查通过，准备红灯验证 |
| 20:16 | Step | M02 write_tests | 已新增 normalization、append、index、compact、state boundary 测试 |
| 20:12 | Milestone | M02 started | 进入 Knowledge helpers and compact index，当前步骤 `write_tests` |
| 19:41 | Milestone | M01 completed | 报告已生成，pipeline 暂停在 M02 前，可用 `/hw:resume` 继续 |
| 19:41 | Step | M01 review_code | 范围审查通过：合同层完成，hook 行为留给后续 Milestone |
| 19:41 | Step | M01 run_tests_green | 定向测试、核心测试 110/110、配置校验、diff check、回归 62/62 通过 |
| 19:41 | Step | M01 implement | 完成 Knowledge Ledger helper、spec、Skill、命令映射和回归 fixture 同步 |
| 19:15 | Step | M01 run_tests_red | 红灯符合预期：Knowledge Ledger helper 导出尚不存在 |
| 19:15 | Step | M01 review_tests | 测试范围通过，准备运行定向红灯 |
| 19:14 | Step | M01 write_tests | 新增 Knowledge Ledger 合同测试与有效记录 fixture |
| 19:09 | Step | M01 write_tests | 开始将 Knowledge Ledger 合同需求转成可执行测试 |
| 19:09 | Milestone | M01 started | C4/F001 进入首个 Milestone |

## Patch 轨道

| Patch | 状态 | 时间 | 摘要 |
|---|---|---|---|
| P001 | closed | — | README OpenCode 文档 |
| P002 | closed | — | PROGRESS 表格时间线 |
| P003 | closed | — | OpenCode config schema 修复 |
| P004 | closed | — | C2 报告与 slides 优化 |
| P005 | closed | 15:51 | OpenCode model status display |
| P006 | closed | 20:40 | V4 报告和 Slides 全面重写（11章/45页+29页） |

## Deferred 项
- 暂无。
