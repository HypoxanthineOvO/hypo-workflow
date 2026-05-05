import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

test("Claude smoke checklist covers required manual validation actions", async () => {
  const smoke = await readFile("docs/platforms/claude-code-smoke.md", "utf8");
  const readiness = await readFile("docs/release/c6-claude-code-readiness.md", "utf8");

  for (const phrase of [
    "claude plugin validate .",
    "sync --platform claude-code",
    ".claude/settings.local.json",
    "backup",
    "/hw:status",
    "Stop hook",
    "compact resume",
    "PermissionRequest",
    "developer",
    "standard",
    "strict",
    "deepseek-v4-pro",
    "mimo-v2.5-pro",
    "手动 Claude Code QA",
  ]) {
    assert.match(smoke, new RegExp(escapeRegExp(phrase), "i"));
  }

  assert.match(readiness, /No marketplace publication/i);
  assert.match(readiness, /MCP\/LSP\/Worktree hooks/i);
  assert.match(readiness, /manual Claude Code smoke/i);
});

test("Claude deterministic smoke fixture runs without touching global Claude settings", () => {
  const result = spawnSync("node", ["scripts/claude-smoke-fixture.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const output = JSON.parse(result.stdout);
  assert.equal(output.ok, true);
  assert.equal(output.global_settings_mutated, false);
  assert.equal(output.sync.operations.includes("claude_code_settings"), true);
  assert.equal(output.sync.operations.includes("claude_code_hooks"), true);
  assert.equal(output.hook_wrapper.exists, true);
  assert.equal(output.hook_wrapper.runs, true);
  assert.equal(output.settings.plugin_namespace, "hw");
  assert.equal(output.settings.main_model, "deepseek-v4-pro");
  assert.equal(output.settings.has_hooks, true);
  assert.equal(output.settings.backup_created, true);
  assert.equal(output.status.current, "M01");
  assert.equal(output.status.has_progress_table, true);
  assert.equal(output.hooks.stop_blocked, true);
  assert.equal(output.hooks.compact_resume, true);
  assert.equal(output.permissions.developer, "allow");
  assert.equal(output.permissions.standard_destructive, "ask");
  assert.equal(output.permissions.strict_pipeline_write, "deny");
  assert.equal(output.models.docs, "deepseek-v4-pro");
  assert.equal(output.models.code, "mimo-v2.5-pro");
  assert.equal(output.models.test, "mimo-v2.5-pro");
});

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
