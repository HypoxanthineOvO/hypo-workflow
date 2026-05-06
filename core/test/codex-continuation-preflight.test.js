import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildContinuationState,
  readContinuationState,
  resolveResumeTarget,
  runCodexPreflight,
  writeConfig,
  writeContinuationState,
} from "../src/index.js";

test("continuation state roundtrips with safe resume command", async () => {
  const root = await fixtureRoot();
  const continuation = buildContinuationState({
    next_action: "continue_execution",
    reason: "agent_turn_completed_with_unfinished_milestone",
    updated_at: "2026-05-06T14:00:00+08:00",
    context: { prompt_file: ".pipeline/prompts/02-codex-continuation-and-preflight-runtime.md" },
  });

  await writeContinuationState(root, continuation);
  const loaded = await readContinuationState(root);

  assert.equal(loaded.status, "active");
  assert.equal(loaded.next_action, "continue_execution");
  assert.equal(loaded.safe_resume_command, "/hw:resume");
  assert.equal(loaded.reason, "agent_turn_completed_with_unfinished_milestone");
  assert.deepEqual(loaded.context, continuation.context);
});

test("resume target prioritizes active continuation before generic current state", () => {
  const state = {
    pipeline: { status: "running" },
    current: {
      phase: "executing",
      prompt_file: ".pipeline/prompts/02-codex-continuation-and-preflight-runtime.md",
      step: "implement",
    },
  };
  const continuation = buildContinuationState({
    next_action: "run_preflight",
    reason: "pre_completion_checks_pending",
    updated_at: "2026-05-06T14:01:00+08:00",
  });

  const target = resolveResumeTarget({ continuation, state });

  assert.equal(target.source, "continuation");
  assert.equal(target.next_action, "run_preflight");
  assert.equal(target.safe_resume_command, "/hw:resume");

  const fallback = resolveResumeTarget({ continuation: { ...continuation, status: "completed" }, state });
  assert.equal(fallback.source, "state");
  assert.equal(fallback.next_action, "continue_execution");
});

test("continuation rejects unsafe resume commands", () => {
  assert.throws(
    () => buildContinuationState({
      next_action: "continue_execution",
      safe_resume_command: "/hw:resume && rm -rf .pipeline",
    }),
    /safe_resume_command/,
  );
});

test("codex preflight classifies blocking and warning checks deterministically", async () => {
  const root = await fixtureRoot();
  await writeFile(join(root, ".pipeline", "PROGRESS.compact.md"), "stale\n", "utf8");
  await writeFile(join(root, "README.md"), "# Demo\n\n当前版本提供 **1 个用户指令**。\n", "utf8");
  await writeFile(join(root, ".pipeline", "leaky.md"), "OPENAI_API_KEY=sk-test-secret\n", "utf8");
  await sleepForMtime();
  await writeFile(join(root, ".pipeline", "PROGRESS.md"), "# Progress\n\nfresh\n", "utf8");

  const result = await runCodexPreflight(root, {
    protected_writes: [".pipeline/state.yaml"],
    authority_writes_committed: false,
    files: [
      ".pipeline/state.yaml",
      ".pipeline/config.yaml",
      ".pipeline/log.yaml",
      ".pipeline/PROGRESS.md",
      ".pipeline/leaky.md",
      "README.md",
      "hooks/codex-notify.sh",
    ],
  });

  assert.equal(result.ok, false);
  assert.ok(result.checks.some((check) => check.id === "protected-authority-writes" && check.status === "block"));
  assert.ok(result.checks.some((check) => check.id === "secret-markers" && check.status === "block"));
  assert.ok(result.checks.some((check) => check.id === "derived-artifacts" && check.status === "warn"));
  assert.ok(result.checks.some((check) => check.id === "readme-freshness" && check.status === "warn"));
  assert.ok(result.checks.some((check) => check.id === "codex-notify" && check.status === "pass"));
  assert.doesNotMatch(JSON.stringify(result), /sk-test-secret/);
});

test("codex preflight warns when optional notify hook is missing", async () => {
  const root = await fixtureRoot({ notify: false });
  const result = await runCodexPreflight(root, {
    files: [".pipeline/state.yaml", ".pipeline/config.yaml", ".pipeline/log.yaml", ".pipeline/PROGRESS.md"],
  });

  assert.equal(result.checks.find((check) => check.id === "codex-notify").status, "warn");
  assert.equal(result.ok, true);
});

test("skills and codex notify document continuation without runner semantics", async () => {
  const start = await readFile("skills/start/SKILL.md", "utf8");
  const resume = await readFile("skills/resume/SKILL.md", "utf8");
  const commands = await readFile("references/commands-spec.md", "utf8");
  const codex = await readFile("references/platform-codex.md", "utf8");
  const notify = await readFile("hooks/codex-notify.sh", "utf8");
  const combined = `${start}\n${resume}\n${commands}\n${codex}\n${notify}`;

  assert.match(combined, /\.pipeline\/continuation\.yaml/);
  assert.match(combined, /safe_resume_command/);
  assert.match(combined, /preflight/i);
  assert.match(combined, /observability, not (?:a )?runner/i);
  assert.doesNotMatch(notify, /hw:resume|hypo-workflow start|hypo-workflow resume/);
});

async function fixtureRoot(options = {}) {
  const root = await mkdtemp(join(tmpdir(), "hw-codex-continuation-"));
  await mkdir(join(root, ".pipeline", "reports"), { recursive: true });
  await mkdir(join(root, "hooks"), { recursive: true });
  await writeConfig(join(root, ".pipeline", "config.yaml"), {
    output: { language: "zh-CN" },
    pipeline: { name: "Continuation Fixture" },
    execution: { mode: "subagent", steps: { preset: "tdd" } },
  });
  await writeConfig(join(root, ".pipeline", "state.yaml"), {
    pipeline: { name: "Continuation Fixture", status: "running", prompts_completed: 1, prompts_total: 2 },
    current: { phase: "executing", prompt_file: ".pipeline/prompts/02.md", step: "implement" },
    history: { completed_prompts: [{ result: "pass" }] },
  });
  await writeConfig(join(root, ".pipeline", "cycle.yaml"), { cycle: { id: "C1", status: "active" } });
  await writeConfig(join(root, ".pipeline", "rules.yaml"), { extends: "recommended" });
  await writeConfig(join(root, ".pipeline", "log.yaml"), {
    events: [{ id: "M01", type: "milestone_complete", status: "completed" }],
  });
  await writeFile(join(root, ".pipeline", "PROGRESS.md"), "# Progress\n\n当前状态\n", "utf8");
  await writeFile(join(root, ".pipeline", "reports", "01.report.md"), "# Report\n\n通过\n", "utf8");
  if (options.notify !== false) {
    await writeFile(join(root, "hooks", "codex-notify.sh"), "#!/bin/bash\n# observability, not a runner\n", "utf8");
  }
  return root;
}

async function sleepForMtime() {
  await new Promise((resolve) => setTimeout(resolve, 20));
}
