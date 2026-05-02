import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  renderHypoWorkflowMetadata,
  renderOpenCodeStatusTuiPlugin,
  writeOpenCodeArtifacts,
} from "../src/index.js";

test("renderOpenCodeStatusTuiPlugin registers sidebar and footer slots without mutating workflow state", async () => {
  const source = await renderOpenCodeStatusTuiPlugin();

  assert.match(source, /from "@opencode-ai\/plugin\/tui"/);
  assert.match(source, /export const tui/);
  assert.match(source, /export const HypoWorkflowTuiPlugin = tui/);
  assert.match(source, /slots\.register/);
  assert.match(source, /sidebar_content/);
  assert.match(source, /sidebar_footer/);
  assert.match(source, /home_footer/);
  assert.match(source, /session_prompt_right/);
  assert.match(source, /buildOpenCodeStatusModel/);
  assert.match(source, /toast/);
  assert.doesNotMatch(source, /<text>/);
  assert.doesNotMatch(source, /jsx-dev-runtime/);
  assert.doesNotMatch(source, /writeFile|state\.yaml.*=/);
});

test("renderOpenCodeStatusTuiPlugin falls back when TUI path state is unavailable", async () => {
  const source = await renderOpenCodeStatusTuiPlugin();

  assert.match(source, /api\.state\?\.path\?\.worktree/);
  assert.match(source, /process\.cwd\(\)/);
  assert.doesNotMatch(source, /api\.state\.path/);
});

test("writeOpenCodeArtifacts emits separate server and TUI plugin files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-opencode-panels-"));
  await writeOpenCodeArtifacts(dir, { profile: "standard" });

  const serverPlugin = await readFile(join(dir, ".opencode", "plugins", "hypo-workflow.ts"), "utf8");
  const statusModule = await readFile(join(dir, ".opencode", "runtime", "hypo-workflow-status.js"), "utf8");
  const tuiPlugin = await readFile(join(dir, ".opencode", "plugins", "hypo-workflow-tui.tsx"), "utf8");

  assert.match(serverPlugin, /fileGuard/);
  assert.match(serverPlugin, /commandMap/);
  assert.match(serverPlugin, /export const server/);
  assert.match(statusModule, /buildOpenCodeStatusModel/);
  assert.match(tuiPlugin, /export const tui/);
  assert.match(tuiPlugin, /sidebar_content/);
  assert.match(tuiPlugin, /home_footer/);
  assert.match(tuiPlugin, /session_prompt_right/);
  assert.match(tuiPlugin, /\.\.\/runtime\/hypo-workflow-status\.js/);
});

test("generated OpenCode plugins are importable and expose OpenCode module entrypoints", async (t) => {
  const bun = spawnSync("bun", ["--version"], { encoding: "utf8" });
  if (bun.error || bun.status !== 0) {
    t.skip("bun is not available to import OpenCode TypeScript plugins");
    return;
  }

  const dir = await mkdtemp(join(tmpdir(), "hw-opencode-plugin-import-"));
  await writeOpenCodeArtifacts(dir, { profile: "standard" });
  await mkdir(join(dir, ".opencode", "node_modules", "@opencode-ai", "plugin"), { recursive: true });
  await mkdir(join(dir, ".opencode", "node_modules", "solid-js"), { recursive: true });
  await writeFile(
    join(dir, ".opencode", "node_modules", "@opencode-ai", "plugin", "package.json"),
    JSON.stringify({ type: "module", exports: { "./tui": "./tui.js" } }),
    "utf8",
  );
  await writeFile(join(dir, ".opencode", "node_modules", "@opencode-ai", "plugin", "tui.js"), "export {};\n", "utf8");
  await writeFile(
    join(dir, ".opencode", "node_modules", "solid-js", "package.json"),
    JSON.stringify({ type: "module", main: "./index.js", exports: { ".": "./index.js" } }),
    "utf8",
  );
  await writeFile(
    join(dir, ".opencode", "node_modules", "solid-js", "index.js"),
    "export function createSignal(value) { return [() => value, (next) => { value = next; }]; }\n",
    "utf8",
  );

  const script = `
    const server = await import(${JSON.stringify(join(dir, ".opencode", "plugins", "hypo-workflow.ts"))});
    const tui = await import(${JSON.stringify(join(dir, ".opencode", "plugins", "hypo-workflow-tui.tsx"))});
    if (typeof server.server !== "function") throw new Error("missing server export");
    if (typeof tui.tui !== "function") throw new Error("missing tui export");
    if (typeof tui.HypoWorkflowTuiPlugin !== "function") throw new Error("missing compatibility export");
  `;
  const result = spawnSync("bun", ["-e", script], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("writeOpenCodeArtifacts removes legacy plugin-side status helper", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-opencode-panels-cleanup-"));
  const legacy = join(dir, ".opencode", "plugins", "hypo-workflow-status.js");
  await mkdir(join(dir, ".opencode", "plugins"), { recursive: true });
  await writeFile(legacy, "export const legacy = true;\n", "utf8");

  await writeOpenCodeArtifacts(dir, { profile: "standard" });

  await assert.rejects(readFile(legacy, "utf8"));
});

test("writeOpenCodeArtifacts renders model matrix into role agent files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-opencode-matrix-"));
  await writeOpenCodeArtifacts(dir, {
    profile: {
      name: "standard",
      compaction: {
        effective_context_target: 777000,
      },
      agents: {
        plan: { model: "custom-plan" },
        compact: { model: "custom-compact" },
        test: { model: "custom-test" },
        "code-a": { model: "custom-code-a" },
        "code-b": { model: "custom-code-b" },
        debug: { model: "custom-debug" },
        report: { model: "custom-report" },
      },
    },
  });

  const planAgent = await readFile(join(dir, ".opencode", "agents", "hw-plan.md"), "utf8");
  const testAgent = await readFile(join(dir, ".opencode", "agents", "hw-test.md"), "utf8");
  const codeAAgent = await readFile(join(dir, ".opencode", "agents", "hw-code-a.md"), "utf8");
  const codeBAgent = await readFile(join(dir, ".opencode", "agents", "hw-code-b.md"), "utf8");
  const reportAgent = await readFile(join(dir, ".opencode", "agents", "hw-report.md"), "utf8");
  const metadata = JSON.parse(await readFile(join(dir, ".opencode", "hypo-workflow.json"), "utf8"));
  const rootConfig = JSON.parse(await readFile(join(dir, "opencode.json"), "utf8"));

  assert.match(planAgent, /^model: custom-plan$/m);
  assert.match(testAgent, /^model: custom-test$/m);
  assert.match(codeAAgent, /^model: custom-code-a$/m);
  assert.match(codeBAgent, /^model: custom-code-b$/m);
  assert.match(reportAgent, /^model: custom-report$/m);
  assert.equal(metadata.compaction.effective_context_target, 777000);
  assert.equal(metadata.agents.compact.model, "custom-compact");
  assert.equal(rootConfig.compaction.effective_context_target, undefined);
  assert.equal(rootConfig.agents, undefined);
});

test("OpenCode metadata carries agent model matrix and compaction settings", () => {
  const metadata = renderHypoWorkflowMetadata({
    name: "standard",
    auto_continue: true,
    file_guard: "strict",
    compaction: {
      effective_context_target: 900000,
    },
    agents: {
      plan: { model: "gpt-5.5" },
      compact: { model: "deepseek-v4-flash" },
      test: { model: "gpt-5.4" },
      "code-a": { model: "gpt-5.4" },
      "code-b": { model: "gpt-5.4-mini" },
      report: { model: "gpt-5.4-mini" },
    },
  });

  assert.equal(metadata.compaction.effective_context_target, 900000);
  assert.equal(metadata.agents.plan.model, "gpt-5.5");
  assert.equal(metadata.agents.compact.model, "deepseek-v4-flash");
  assert.equal(metadata.agents["code-b"].model, "gpt-5.4-mini");
  assert.equal(metadata.agents.report.model, "gpt-5.4-mini");
});

test("OpenCode spec documents model matrix contract without runner semantics", async () => {
  const spec = await readFile("references/opencode-spec.md", "utf8");

  assert.match(spec, /## OpenCode Model Matrix Contract/);
  assert.match(spec, /effective_context_target: 900000/);
  assert.match(spec, /plan:\n\s+model: gpt-5\.5/);
  assert.match(spec, /compact:\n\s+model: deepseek-v4-flash/);
  assert.match(spec, /not as a model-calling runner/);
});
