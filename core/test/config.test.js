import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadConfig, parseYaml, writeConfig } from "../src/config/index.js";

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
  assert.match(raw, /platform: opencode/);
});
