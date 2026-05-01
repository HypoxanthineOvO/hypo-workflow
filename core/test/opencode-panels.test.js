import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { renderOpenCodeStatusTuiPlugin, writeOpenCodeArtifacts } from "../src/index.js";

test("renderOpenCodeStatusTuiPlugin registers sidebar and footer slots without mutating workflow state", async () => {
  const source = await renderOpenCodeStatusTuiPlugin();

  assert.match(source, /from "@opencode-ai\/plugin\/tui"/);
  assert.match(source, /slots\.register/);
  assert.match(source, /sidebar_content/);
  assert.match(source, /sidebar_footer/);
  assert.match(source, /home_footer/);
  assert.match(source, /session_prompt_right/);
  assert.match(source, /buildOpenCodeStatusModel/);
  assert.match(source, /toast/);
  assert.doesNotMatch(source, /writeFile|state\.yaml.*=/);
});

test("writeOpenCodeArtifacts emits separate server and TUI plugin files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-opencode-panels-"));
  await writeOpenCodeArtifacts(dir, { profile: "standard" });

  const serverPlugin = await readFile(join(dir, ".opencode", "plugins", "hypo-workflow.ts"), "utf8");
  const statusModule = await readFile(join(dir, ".opencode", "runtime", "hypo-workflow-status.js"), "utf8");
  const tuiPlugin = await readFile(join(dir, ".opencode", "plugins", "hypo-workflow-tui.tsx"), "utf8");

  assert.match(serverPlugin, /fileGuard/);
  assert.match(serverPlugin, /commandMap/);
  assert.match(statusModule, /buildOpenCodeStatusModel/);
  assert.match(tuiPlugin, /sidebar_content/);
  assert.match(tuiPlugin, /home_footer/);
  assert.match(tuiPlugin, /session_prompt_right/);
  assert.match(tuiPlugin, /\.\.\/runtime\/hypo-workflow-status\.js/);
});

test("writeOpenCodeArtifacts removes legacy plugin-side status helper", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-opencode-panels-cleanup-"));
  const legacy = join(dir, ".opencode", "plugins", "hypo-workflow-status.js");
  await mkdir(join(dir, ".opencode", "plugins"), { recursive: true });
  await writeFile(legacy, "export const legacy = true;\n", "utf8");

  await writeOpenCodeArtifacts(dir, { profile: "standard" });

  await assert.rejects(readFile(legacy, "utf8"));
});
