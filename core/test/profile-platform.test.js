import test from "node:test";
import assert from "node:assert/strict";
import { capabilityFor, normalizeProfile, selectProfile } from "../src/index.js";

test("normalizeProfile applies known presets", () => {
  assert.equal(normalizeProfile("standard").auto_continue, true);
  assert.equal(normalizeProfile("strict").auto_continue, false);
  assert.equal(normalizeProfile({ name: "automation", permissions: "allow-safe" }).permissions, "allow-safe");
});

test("selectProfile reads config profile", () => {
  const profile = selectProfile({ opencode: { profile: "strict" } });
  assert.equal(profile.name, "strict");
  assert.equal(profile.file_guard, "strict");
});

test("capabilityFor exposes OpenCode native primitives", () => {
  const capabilities = capabilityFor("opencode");
  assert.equal(capabilities.commands, "native-slash");
  assert.equal(capabilities.ask, "question-tool");
  assert.equal(capabilities.plan, "todowrite");
  assert.equal(capabilities.recovery, "lease-heartbeat-plugin-events");
  assert.match(capabilities.handoff_boundaries, /permissions/);
});

test("capabilityFor exposes third-party IDE adapter targets", () => {
  assert.equal(capabilityFor("cursor").rules, ".cursor/rules/hypo-workflow.mdc");
  assert.equal(capabilityFor("copilot").rules, ".github/copilot-instructions.md");
  assert.equal(capabilityFor("trae").rules, ".trae/rules/project_rules.md");
});

test("capabilityFor keeps Codex subagents inside Codex runtime assumptions", () => {
  const capabilities = capabilityFor("codex");
  assert.equal(capabilities.subagents, "codex-gpt-runtime");
  assert.equal(capabilities.model_routing, "host-gpt-runtime");
  assert.match(capabilities.delegation_policy, /testing\/review/);
  assert.doesNotMatch(JSON.stringify(capabilities), /deepseek|mimo|claude/i);
});
