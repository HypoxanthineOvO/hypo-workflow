import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { commandByCanonical, commandMap, loadRulesSummary, writeOpenCodeArtifacts } from "../src/index.js";

test("commandMap contains 31 OpenCode mappings", () => {
  const commands = commandMap("opencode");
  assert.equal(commands.length, 31);
  assert.equal(commandByCanonical("/hw:plan").opencode, "/hw-plan");
  assert.equal(commandByCanonical("/hw:dashboard").agent, "hw-status");
  assert.equal(commandByCanonical("/hw:chat").opencode, "/hw-chat");
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

  const releaseCommand = await readFile(join(dir, ".opencode", "commands", "hw-release.md"), "utf8");
  const chatCommand = await readFile(join(dir, ".opencode", "commands", "hw-chat.md"), "utf8");
  const command = await readFile(join(dir, ".opencode", "commands", "hw-plan.md"), "utf8");
  const agent = await readFile(join(dir, ".opencode", "agents", "hw-plan.md"), "utf8");
  const plugin = await readFile(join(dir, ".opencode", "plugins", "hypo-workflow.ts"), "utf8");
  const adapterConfig = JSON.parse(await readFile(join(dir, ".opencode", "opencode.json"), "utf8"));
  const config = JSON.parse(await readFile(join(dir, "opencode.json"), "utf8"));
  const metadata = JSON.parse(await readFile(join(dir, ".opencode", "hypo-workflow.json"), "utf8"));

  assert.match(command, /\/hw:plan/);
  assert.match(command, /not a separate runner/);
  assert.match(releaseCommand, /update_readme/);
  assert.match(releaseCommand, /readme-freshness/);
  assert.match(chatCommand, /\/hw:chat/);
  assert.match(chatCommand, /state\.yaml \+ cycle\.yaml \+ PROGRESS\.md \+ recent report/);
  assert.match(chatCommand, /chat entries instead of Milestone reports/);
  assert.match(agent, /todowrite/);
  assert.match(agent, /permission:/);
  assert.doesNotMatch(agent, /^tools:/m);
  assert.match(plugin, /commandMap/);
  assert.equal(config.$schema, "https://opencode.ai/config.json");
  assert.deepEqual(config.plugin, [
    ".opencode/plugins/hypo-workflow.ts",
    ".opencode/plugins/hypo-workflow-tui.tsx",
  ]);
  assert.equal(adapterConfig.$schema, "https://opencode.ai/config.json");
  assert.equal("plugin" in adapterConfig, false);
  assert.equal(config.compaction.auto, true);
  assert.equal(config.compaction.prune, true);
  assert.equal(metadata.autoContinue, true);
  assert.equal(metadata.auto_continue.mode, "safe");
});
