import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  DEFAULT_GLOBAL_CONFIG,
  loadConfig,
  parseYaml,
  writeConfig,
} from "../src/config/index.js";

test("parseYaml reads nested objects and arrays", () => {
  const parsed = parseYaml(`
agent:
  platform: opencode
  model: qwen
output:
  language: zh-CN
items:
  - one
  - two
`);

  assert.equal(parsed.agent.platform, "opencode");
  assert.equal(parsed.output.language, "zh-CN");
  assert.deepEqual(parsed.items, ["one", "two"]);
});

test("loadConfig merges defaults and writeConfig persists yaml", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-core-"));
  const file = join(dir, "config.yaml");
  await writeConfig(file, {
    agent: { platform: "opencode", model: "kimi" },
    output: { language: "zh-CN", timezone: "Asia/Shanghai" },
  });

  const loaded = await loadConfig(file);
  const raw = await readFile(file, "utf8");

  assert.equal(loaded.agent.platform, "opencode");
  assert.equal(loaded.execution.default_mode, "self");
  assert.equal(loaded.output.timezone, "Asia/Shanghai");
  assert.equal(loaded.release.readme.mode, "loose");
  assert.equal(loaded.release.readme.full_regen, "auto");
  assert.match(raw, /platform: opencode/);
});

test("default config exposes OpenCode model matrix defaults", () => {
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.auto_continue, true);
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.profile, "standard");
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.compaction.effective_context_target, 900000);
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.agents.plan.model, "gpt-5.5");
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.agents.compact.model, "deepseek-v4-flash");
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.agents.test.model, "deepseek-v4-pro");
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.agents["code-a"].model, "mimo-v2.5-pro");
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.agents["code-b"].model, "deepseek-v4-pro");
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.agents.debug.model, "gpt-5.5");
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.agents.docs.model, "deepseek-v4-pro");
  assert.equal(DEFAULT_GLOBAL_CONFIG.opencode.agents.report.model, "deepseek-v4-flash");
});

test("loadConfig accepts project overrides for OpenCode model matrix", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-core-opencode-matrix-"));
  const file = join(dir, "config.yaml");
  await writeConfig(file, {
    opencode: {
      compaction: {
        effective_context_target: 750000,
      },
      agents: {
        plan: { model: "custom-plan" },
        compact: { model: "custom-flash" },
        test: { model: "custom-test" },
      },
    },
  });

  const loaded = await loadConfig(file);
  assert.equal(loaded.opencode.compaction.effective_context_target, 750000);
  assert.equal(loaded.opencode.agents.plan.model, "custom-plan");
  assert.equal(loaded.opencode.agents.compact.model, "custom-flash");
  assert.equal(loaded.opencode.agents.test.model, "custom-test");
  assert.equal(loaded.opencode.agents["code-a"].model, "mimo-v2.5-pro");
});
