import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import {
  normalizeDiscoverFeature,
  renderBatchPlanArtifacts,
  stepSequenceForPreset,
} from "../src/index.js";

test("analysis spec defines preset chain and taxonomy without replacing test profiles", async () => {
  const spec = await readFile("references/analysis-spec.md", "utf8");
  const testProfileSpec = await readFile("references/test-profile-spec.md", "utf8");
  const discoverSpec = await readFile("references/progressive-discover-spec.md", "utf8");
  const discoverSkill = await readFile("skills/plan-discover/SKILL.md", "utf8");
  const configSpec = await readFile("references/config-spec.md", "utf8");

  for (const heading of [
    "# Analysis Preset Spec",
    "## Preset Boundary",
    "## Step Chain",
    "## Workflow Taxonomy",
  ]) {
    assert.match(spec, new RegExp(`^${escapeRegExp(heading)}$`, "m"));
  }

  for (const step of [
    "define_question",
    "gather_context",
    "hypothesize",
    "experiment",
    "interpret",
    "conclude",
  ]) {
    assert.match(spec, new RegExp(`\\b${step}\\b`));
  }
  assert.match(spec, /analysis is a preset/i);
  assert.match(spec, /not a Test Profile/i);
  assert.match(testProfileSpec, /Preset controls step order/i);
  assert.match(discoverSpec, /workflow_kind/);
  assert.match(discoverSpec, /analysis_kind/);
  assert.match(discoverSkill, /root_cause/);
  assert.match(configSpec, /analysis/);
});

test("preset step sequences include analysis while preserving legacy presets", () => {
  assert.deepEqual(stepSequenceForPreset("tdd"), [
    "write_tests",
    "review_tests",
    "run_tests_red",
    "implement",
    "run_tests_green",
    "review_code",
  ]);
  assert.deepEqual(stepSequenceForPreset("implement-only"), [
    "implement",
    "run_tests",
    "review_code",
  ]);
  assert.deepEqual(stepSequenceForPreset("analysis"), [
    "define_question",
    "gather_context",
    "hypothesize",
    "experiment",
    "interpret",
    "conclude",
  ]);
  assert.deepEqual(stepSequenceForPreset("custom", { sequence: ["one", "two"] }), ["one", "two"]);
});

test("discover taxonomy normalizes analysis workflow kinds and batch artifacts", () => {
  const feature = normalizeDiscoverFeature({
    id: "F301",
    title: "Cache hit root cause",
    workflow_kind: "analysis",
    analysis_kind: "root-cause",
    category: "research",
    desired_effect: "Explain why cache hit rate differs between two agents.",
    verification: {
      method: "compare logs and provider parameters",
      evidence: ["commands", "metrics"],
    },
  });

  assert.equal(feature.workflow_kind, "analysis");
  assert.equal(feature.analysis_kind, "root_cause");
  assert.equal(feature.category, "research");

  assert.equal(normalizeDiscoverFeature({ workflow_kind: "showcase" }).workflow_kind, "showcase");
  assert.equal(normalizeDiscoverFeature({ analysis_kind: "repo-system" }).analysis_kind, "repo_system");
  assert.equal(normalizeDiscoverFeature({ analysis_kind: "trend" }).analysis_kind, "metric");

  const artifacts = renderBatchPlanArtifacts(
    {
      cycle_id: "C9",
      features: [feature],
    },
    { decompose_mode: "upfront" },
  );

  assert.equal(artifacts.queue.features[0].workflow_kind, "analysis");
  assert.equal(artifacts.queue.features[0].analysis_kind, "root_cause");
  assert.match(artifacts.markdown, /Workflow/);
  assert.match(artifacts.markdown, /Analysis Kind/);
  assert.match(artifacts.markdown, /root_cause/);
});

test("project config validation accepts analysis preset", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-analysis-preset-"));
  const configFile = join(dir, "config.yaml");
  await writeFile(
    configFile,
    [
      "pipeline:",
      "  name: Analysis Fixture",
      "  source: local",
      "  output: local",
      "execution:",
      "  mode: self",
      "  steps:",
      "    preset: analysis",
      "",
    ].join("\n"),
    "utf8",
  );

  const result = spawnSync("bash", ["scripts/validate-config.sh", configFile], {
    cwd: ".",
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
