import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  evaluateClaudeHookEvent,
  renderClaudeCodeSettingsHooks,
  writeConfig,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("SessionStart and compact hooks inject resume-oriented context", async () => {
  const root = await fixtureRoot();

  const session = await evaluateClaudeHookEvent("SessionStart", { cwd: root, matcher: "resume" });
  const compact = await evaluateClaudeHookEvent("PostCompact", { cwd: root });

  assert.match(session.additionalContext, /Hypo-Workflow Resume/);
  assert.match(session.additionalContext, /M04 \/ F001 - Claude Hook Runtime/);
  assert.match(session.additionalContext, /write_tests/);
  assert.match(session.additionalContext, /Do not replay completed steps/);
  assert.match(compact.additionalContext, /Compact Resume Packet/);
  assert.match(compact.additionalContext, /automation: auto_continue=true/);
  assert.match(compact.additionalContext, /recent events/i);
});

test("Stop blocks missing critical workflow evidence but warnings do not block metrics gaps", async () => {
  const root = await fixtureRoot({ finalStep: true });
  await rm(join(root, ".pipeline", "PROGRESS.md"));

  const blocked = await evaluateClaudeHookEvent("Stop", { cwd: root });
  assert.equal(blocked.decision, "block");
  assert.match(blocked.reason, /PROGRESS\.md/);

  await writeFile(join(root, ".pipeline", "PROGRESS.md"), "# Progress\n", "utf8");
  await rm(join(root, ".pipeline", "metrics.yaml"), { force: true });
  const warned = await evaluateClaudeHookEvent("Stop", { cwd: root });

  assert.equal(warned.decision, undefined);
  assert.match(warned.systemMessage, /metrics/);
});

test("PermissionRequest follows Claude safety profiles", async () => {
  const developer = await evaluateClaudeHookEvent("PermissionRequest", {
    cwd: await fixtureRoot({ profile: "developer" }),
    tool_name: "Write",
    args: { path: ".pipeline/state.yaml" },
  });
  const standard = await evaluateClaudeHookEvent("PermissionRequest", {
    cwd: await fixtureRoot({ profile: "standard" }),
    tool_name: "Bash",
    args: { command: "rm -rf dist" },
  });
  const strict = await evaluateClaudeHookEvent("PermissionRequest", {
    cwd: await fixtureRoot({ profile: "strict" }),
    tool_name: "Write",
    args: { path: ".pipeline/state.yaml" },
  });

  assert.equal(developer.permissionDecision, "allow");
  assert.equal(standard.permissionDecision, "ask");
  assert.match(standard.reason, /destructive/);
  assert.equal(strict.permissionDecision, "deny");
});

test("tool and progress hooks emit parseable refresh output", async () => {
  const root = await fixtureRoot();

  const postTool = await evaluateClaudeHookEvent("PostToolUse", {
    cwd: root,
    tool_name: "Write",
    args: { path: ".pipeline/PROGRESS.md" },
  });
  const fileChanged = await evaluateClaudeHookEvent("FileChanged", {
    cwd: root,
    file_path: ".pipeline/PROGRESS.md",
  });

  assert.equal(postTool.progress_refresh.path, ".pipeline/PROGRESS.md");
  assert.equal(postTool.progress_refresh.exists, true);
  assert.equal(fileChanged.progress_refresh.path, ".pipeline/PROGRESS.md");
  assert.match(fileChanged.progress_refresh.summary, /Progress/);
});

test("generated Claude settings register initial hook events through the wrapper", () => {
  const hooks = renderClaudeCodeSettingsHooks({ claude_code: { profile: "standard" } });

  for (const event of ["Stop", "SessionStart", "PreCompact", "PostCompact", "PostToolUse", "PostToolBatch", "UserPromptSubmit", "PermissionRequest", "FileChanged"]) {
    assert.ok(event in hooks, `${event} should be registered`);
    assert.match(JSON.stringify(hooks[event]), /node hooks\/claude-hook\.mjs/);
  }
  assert.match(JSON.stringify(hooks.FileChanged), /\.pipeline\/PROGRESS\.md/);
});

test("hooks/claude-hook.mjs returns valid JSON for Claude hook stdout", async () => {
  const root = await fixtureRoot();
  const { stdout } = await runClaudeHook("SessionStart", { cwd: root, matcher: "resume" });
  const parsed = JSON.parse(stdout);

  assert.match(parsed.additionalContext, /Hypo-Workflow Resume/);
});

async function fixtureRoot(options = {}) {
  const root = await mkdtemp(join(tmpdir(), "hw-claude-hooks-"));
  await mkdir(join(root, ".pipeline", "reports"), { recursive: true });
  await writeConfig(join(root, ".pipeline", "config.yaml"), {
    pipeline: { name: "Claude Hook Fixture" },
    execution: { mode: "self", steps: { preset: "tdd" } },
    evaluation: { auto_continue: true },
    claude_code: {
      profile: options.profile || "standard",
    },
  });
  await writeConfig(join(root, ".pipeline", "cycle.yaml"), {
    cycle: { number: 6, name: "Hook Cycle", workflow_kind: "build" },
  });
  await writeConfig(join(root, ".pipeline", "state.yaml"), {
    pipeline: {
      name: "Claude Hook Fixture",
      status: "running",
      prompts_total: 7,
      prompts_completed: 3,
    },
    current: {
      phase: "executing",
      prompt_index: 3,
      prompt_file: ".pipeline/prompts/03-claude-hook-runtime.md",
      prompt_name: "M04 / F001 - Claude Hook Runtime",
      step: options.finalStep ? "review_code" : "write_tests",
      step_index: options.finalStep ? 5 : 0,
    },
    prompt_state: {
      steps: [
        { name: "write_tests", status: options.finalStep ? "done" : "running" },
        { name: "review_tests", status: options.finalStep ? "done" : "pending" },
        { name: "run_tests_red", status: options.finalStep ? "done" : "pending" },
        { name: "implement", status: options.finalStep ? "done" : "pending" },
        { name: "run_tests_green", status: options.finalStep ? "done" : "pending" },
        { name: "review_code", status: options.finalStep ? "done" : "pending" },
      ],
    },
  });
  await writeFile(join(root, ".pipeline", "PROGRESS.md"), "# Progress\n\n| M04 | running |\n", "utf8");
  await writeFile(join(root, ".pipeline", "log.yaml"), "events:\n  - summary: recent events ready\n", "utf8");
  await writeFile(join(root, ".pipeline", "metrics.yaml"), "milestones: []\n", "utf8");
  await writeFile(join(root, ".pipeline", "reports", "03-claude-hook-runtime.report.md"), "# Report\n", "utf8");
  return root;
}

function runClaudeHook(event, payload) {
  return execFileAsync("bash", ["-lc", `printf '${JSON.stringify(payload)}' | node ${shellQuote(join(repoRoot, "hooks", "claude-hook.mjs"))} ${shellQuote(event)}`], {
    cwd: payload.cwd,
  });
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}
