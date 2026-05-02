import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DEFAULT_GLOBAL_CONFIG, loadConfig, parseYaml } from "../src/config/index.js";

test("default config exposes batch planning defaults", async () => {
  assert.equal(DEFAULT_GLOBAL_CONFIG.batch.decompose_mode, "upfront");
  assert.equal(DEFAULT_GLOBAL_CONFIG.batch.failure_policy, "skip_defer");
  assert.equal(DEFAULT_GLOBAL_CONFIG.batch.auto_chain, true);

  const projectConfig = await loadConfig(".pipeline/config.yaml");
  assert.equal(projectConfig.batch.decompose_mode, "upfront");
  assert.equal(projectConfig.batch.failure_policy, "skip_defer");
});

test("feature queue spec defines entity relationships and queue behavior", async () => {
  const spec = await readFile("references/feature-queue-spec.md", "utf8");

  for (const heading of [
    "# Feature Queue Spec",
    "## Entity Model",
    "## Queue File",
    "## Queue Item Fields",
    "## Decomposition Modes",
    "## Gates and Failure Policy",
    "## Insert and Reorder",
    "## State Boundaries",
  ]) {
    assert.match(spec, new RegExp(`^${escapeRegExp(heading)}$`, "m"));
  }

  for (const phrase of [
    "Project > Cycle > Feature > Milestone > Step",
    "Patch is a side track",
    ".pipeline/feature-queue.yaml",
    "gate: confirm",
    "skip_defer",
    "upfront",
    "just_in_time",
    "auto_chain",
    "do not replace state.yaml",
  ]) {
    assert.match(spec, new RegExp(escapeRegExp(phrase), "i"));
  }
});

test("metrics spec documents duration token cost fallback", async () => {
  const spec = await readFile("references/metrics-spec.md", "utf8");

  for (const heading of [
    "# Metrics Spec",
    "## Scope",
    "## Metrics File",
    "## Dimensions",
    "## Field Contract",
    "## Cost and Token Policy",
    "## Update Timing",
  ]) {
    assert.match(spec, new RegExp(`^${escapeRegExp(heading)}$`, "m"));
  }

  for (const phrase of [
    ".pipeline/metrics.yaml",
    "cycle",
    "feature",
    "milestone",
    "step",
    "duration_ms",
    "tokens",
    "cost",
    "n/a",
    "updated_at",
  ]) {
    assert.match(spec, new RegExp(escapeRegExp(phrase), "i"));
  }
});

test("feature queue and metrics fixtures are present", async () => {
  const queue = await readFile(".pipeline/feature-queue.yaml", "utf8");
  const metrics = await readFile(".pipeline/metrics.yaml", "utf8");
  const parsedQueue = parseYaml(queue);

  assert.match(queue, /decompose_mode: upfront/);
  assert.match(queue, /failure_policy: skip_defer/);
  assert.match(queue, /current_feature:/);
  assert.equal(parsedQueue.defaults.default_gate, "auto");
  assert.equal(parsedQueue.defaults.auto_chain, true);
  assert.equal((parsedQueue.features || []).some((feature) => feature.gate === "confirm"), false);
  assert.equal((parsedQueue.features || []).every((feature) => feature.status === "done"), true);
  assert.match(metrics, /token_count: n\/a/);
  assert.match(metrics, /cost: n\/a/);
  assert.match(metrics, /duration_ms:/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
