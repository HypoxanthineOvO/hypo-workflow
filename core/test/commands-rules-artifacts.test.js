import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { commandByCanonical, commandMap, loadRulesSummary, writeOpenCodeArtifacts } from "../src/index.js";

test("commandMap contains 30 OpenCode mappings", () => {
  const commands = commandMap("opencode");
  assert.equal(commands.length, 30);
  assert.equal(commandByCanonical("/hw:plan").opencode, "/hw-plan");
  assert.equal(commandByCanonical("/hw:dashboard").agent, "hw-status");
});

test("loadRulesSummary reads builtin rules", async () => {
  const summary = await loadRulesSummary(".", ".");
  assert.match(summary, /Rules: recommended/);
  assert.match(summary, /git-clean-check/);
  assert.match(summary, /Summary:/);
});

test("writeOpenCodeArtifacts renders commands, agents, and config", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-opencode-"));
  await writeOpenCodeArtifacts(dir, { profile: "standard" });

  const command = await readFile(join(dir, ".opencode", "commands", "hw-plan.md"), "utf8");
  const agent = await readFile(join(dir, ".opencode", "agents", "hw-plan.md"), "utf8");
  const plugin = await readFile(join(dir, ".opencode", "plugins", "hypo-workflow.ts"), "utf8");
  const config = JSON.parse(await readFile(join(dir, "opencode.json"), "utf8"));

  assert.match(command, /\/hw:plan/);
  assert.match(command, /not a separate runner/);
  assert.match(agent, /todowrite/);
  assert.match(plugin, /commandMap/);
  assert.equal(config.hypoWorkflow.autoContinue, true);
});
