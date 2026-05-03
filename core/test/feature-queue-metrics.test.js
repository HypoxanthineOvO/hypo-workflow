import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  DEFAULT_GLOBAL_CONFIG,
  loadConfig,
  normalizeMetricRecord,
  parseYaml,
  rollupMetricRecords,
} from "../src/index.js";

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
    "## Feature DAG Board",
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
    "depends_on",
    "blocked_by",
    "parallel candidates",
    "Ordinary single-feature",
    "must not become an automatic runner",
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
    "telemetry_unavailable",
    "updated_at",
  ]) {
    assert.match(spec, new RegExp(escapeRegExp(phrase), "i"));
  }
});

test("metrics helper records duration and explicit telemetry unavailable markers", () => {
  const record = normalizeMetricRecord({
    id: "M12",
    cycle_id: "C5",
    feature_id: "F012",
    started_at: "2026-05-03T10:00:00+08:00",
    finished_at: "2026-05-03T10:00:05.250+08:00",
    message_count: 4,
  });

  assert.equal(record.duration_ms, 5250);
  assert.equal(record.token_count, "telemetry_unavailable");
  assert.deepEqual(record.tokens, {
    input: "telemetry_unavailable",
    output: "telemetry_unavailable",
    total: "telemetry_unavailable",
  });
  assert.equal(record.cost, "telemetry_unavailable");
  assert.equal(record.telemetry_status.token_count, "telemetry_unavailable");
  assert.equal(record.telemetry_status.cost, "telemetry_unavailable");
});

test("metrics helper preserves provider telemetry and rollups durations", () => {
  const records = [
    normalizeMetricRecord({
      id: "S1",
      duration_ms: 100,
      tokens: { input: 10, output: 20 },
      cost: 0.02,
      currency: "USD",
    }),
    normalizeMetricRecord({
      id: "S2",
      duration_ms: 250,
    }),
  ];

  assert.equal(records[0].token_count, 30);
  assert.equal(records[0].telemetry_status.token_count, "available");
  assert.equal(records[0].telemetry_status.cost, "available");

  const rollup = rollupMetricRecords("F012", records);
  assert.equal(rollup.duration_ms, 350);
  assert.equal(rollup.token_count, 30);
  assert.equal(rollup.cost, 0.02);
  assert.equal(rollup.currency, "USD");
  assert.equal(rollup.telemetry_status.token_count, "partial");
  assert.equal(rollup.telemetry_status.cost, "partial");
});

test("feature queue and metrics fixtures are present", async () => {
  const archive = ".pipeline/archives/C3-opencode-multi-agent-matrix-and-v10-analysis-preset";
  const queue = await readFile(`${archive}/feature-queue.yaml`, "utf8");
  const metrics = await readFile(`${archive}/metrics.yaml`, "utf8");
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
