#!/usr/bin/env node
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildClaudeStatusSurface,
  evaluateClaudeHookEvent,
  runProjectSync,
  writeConfig,
} from "../core/src/index.js";

const root = await mkdtemp(join(tmpdir(), "hypo-claude-smoke-"));
await mkdir(join(root, ".pipeline"), { recursive: true });
await mkdir(join(root, ".claude"), { recursive: true });

await writeConfig(join(root, ".pipeline", "config.yaml"), {
  pipeline: { name: "Claude Smoke Fixture" },
  evaluation: { auto_continue: true },
  batch: { auto_chain: true },
  claude_code: {
    profile: "standard",
    model: "deepseek-v4-pro",
    status: { surface: "auto", fallback_order: ["monitor", "hw-status", "session-summary", "dashboard"] },
  },
});
await writeConfig(join(root, ".pipeline", "state.yaml"), {
  pipeline: { name: "Claude Smoke Fixture", status: "running", prompts_total: 1, prompts_completed: 0 },
  current: { phase: "executing", prompt_name: "M01 / F001 - Smoke", step: "write_tests", step_index: 0 },
  milestones: [{ id: "M01", feature_id: "F001", name: "Smoke", status: "in_progress" }],
  prompt_state: { steps: [{ name: "write_tests", status: "running" }] },
});
await writeConfig(join(root, ".pipeline", "log.yaml"), {
  entries: [{ id: "smoke-start", type: "milestone_start", status: "active", timestamp: "2026-05-05T00:00:00Z", summary: "Smoke started" }],
});
await writeFile(join(root, ".pipeline", "PROGRESS.md"), progressMarkdown(), "utf8");

await writeFile(join(root, ".claude", "settings.local.json"), JSON.stringify({
  env: { EXISTING_USER_KEY: "preserved" },
  hooks: {
    Notification: [{ matcher: "", hooks: [{ type: "command", command: "echo user", timeout: 1000 }] }],
  },
}, null, 2), "utf8");

const sync = await runProjectSync(root, { mode: "standard", platform: "claude-code" });
const settings = JSON.parse(await readFile(join(root, ".claude", "settings.local.json"), "utf8"));
const hookWrapper = await readFile(join(root, "hooks", "claude-hook.mjs"), "utf8");
const backups = (await readdir(join(root, ".claude"))).filter((name) => name.startsWith("settings.local.json.bak."));
const status = await buildClaudeStatusSurface(root);
const routing = JSON.parse(await readFile(join(root, ".claude", "hypo-workflow-agents.json"), "utf8"));

const progressText = await readFile(join(root, ".pipeline", "PROGRESS.md"), "utf8");
await rm(join(root, ".pipeline", "PROGRESS.md"));
const stop = await evaluateClaudeHookEvent("Stop", {}, { projectRoot: root });
await writeFile(join(root, ".pipeline", "PROGRESS.md"), progressText, "utf8");
const compact = await evaluateClaudeHookEvent("PreCompact", { matcher: "compact" }, { projectRoot: root });
const developer = await evaluateClaudeHookEvent("PermissionRequest", {
  profile: "developer",
  args: { path: ".pipeline/state.yaml" },
}, { projectRoot: root });
const standard = await evaluateClaudeHookEvent("PermissionRequest", {
  profile: "standard",
  command: "rm -rf build",
}, { projectRoot: root });
const strict = await evaluateClaudeHookEvent("PermissionRequest", {
  profile: "strict",
  args: { path: ".pipeline/state.yaml" },
}, { projectRoot: root });

console.log(JSON.stringify({
  ok: true,
  root,
  global_settings_mutated: false,
  sync,
  settings: {
    plugin_namespace: sync.claude_code_plugin?.namespace,
    main_model: settings.model,
    has_hooks: Boolean(settings.hooks?.Stop?.length && settings.hooks?.SessionStart?.length),
    backup_created: backups.length > 0,
    preserved_user_env: settings.env?.EXISTING_USER_KEY === "preserved",
  },
  hook_wrapper: {
    exists: /hypo_workflow_managed_hook: true/.test(hookWrapper),
    runs: sync.operations.includes("claude_code_hooks"),
  },
  status: {
    current: status.current.milestone_id,
    has_progress_table: status.progress_table.length > 0,
    fallback: status.monitor.decision,
  },
  hooks: {
    stop_blocked: stop.decision === "block" && /PROGRESS\.md/.test(stop.reason || ""),
    compact_resume: /Do not replay completed steps/.test(compact.additionalContext || ""),
  },
  permissions: {
    developer: developer.permissionDecision,
    standard_destructive: standard.permissionDecision,
    strict_pipeline_write: strict.permissionDecision,
  },
  models: {
    docs: routing.agents.docs.model,
    code: routing.agents.code.model,
    test: routing.agents.test.model,
  },
}, null, 2));

function progressMarkdown() {
  return `# Claude Smoke Fixture - 开发进度

> 最后更新：16:00 | 状态：执行中 | 进度：0/1 Milestone

## 当前状态

🔄 **M01 Smoke** — \`write_tests\` 执行中。

## 基本设置

| 项目 | 值 |
|---|---|
| Automation | \`evaluation.auto_continue=true\`，\`batch.auto_chain=true\` |
| Safety Profiles | local \`developer\`；发布默认 \`standard\`；team \`strict\` |

## Milestone 进度

| # | Feature | Milestone | 状态 | 摘要 |
|---|---|---|---|---|
| M01 | F001 | Smoke | 🔄 进行中 | local deterministic smoke |

## 时间线

| 时间 | 类型 | 事件 | 结果 |
|---|---|---|---|
| 16:00 | Milestone | M01 started | smoke fixture |
`;
}
