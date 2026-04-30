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
});
