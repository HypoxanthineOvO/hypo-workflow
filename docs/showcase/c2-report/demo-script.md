# Demo Script

## Route

1. 展示 `README.md` 和 `.pipeline/PROGRESS.md`，说明项目不是 runner，而是 file-first workflow。
2. 进入 `/hw:plan --batch`，说明 Progressive Discover 先问 task category、desired effect、verification method。
3. 展示 `.pipeline/feature-queue.yaml`，解释 `Cycle > Feature > Milestone > Step` 与 `Patch` 的边界。
4. 展示 Test Profiles：
   - `webapp` 要求 E2E、browser interaction、visual evidence
   - `agent-service` 要求 CLI + shared core
   - `research` 要求 baseline / script / delta
5. 展示 OpenCode 状态面板相关文件：
   - `.opencode/plugins/hypo-workflow-tui.tsx`
   - `.opencode/runtime/hypo-workflow-status.js`
6. 演示 `/hw:chat` 的用途与边界，说明轻量追问不必新开 Patch/Cycle。
7. 演示 `/hw:release` 路线：README dynamic blocks、freshness rule、release gates。
8. 以 `node --test core/test/*.test.js` 和最终 PDF 产物收尾。

## Live talking points

- 对比 Copilot / AntiGravity 的问题时，不停留在情绪判断，而是落到 repository visibility、planning ability、context persistence、recoverability、automatic maintenance。
- 强调 Hypo-Workflow 把“人反复复制粘贴 prompt 约束”变成 Skills、rules、hooks、reports、queues、artifacts。
- 强调 V9 和 C2 都是由同一套 workflow 自己完成的，这是最强的自举证据。
