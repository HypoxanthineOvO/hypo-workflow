import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  DEFAULT_GLOBAL_CONFIG,
  loadConfig,
  normalizeAnalysisInteraction,
  writeOpenCodeArtifacts,
} from "../src/index.js";

test("analysis interaction defaults are hybrid and boundary-aware", () => {
  const defaults = DEFAULT_GLOBAL_CONFIG.execution.analysis;
  assert.equal(defaults.interaction_mode, "hybrid");
  assert.equal(defaults.boundaries.code_changes.manual, "deny");
  assert.equal(defaults.boundaries.code_changes.hybrid, "confirm");
  assert.equal(defaults.boundaries.code_changes.auto, "allow");
  assert.equal(defaults.boundaries.restart_services, "confirm");
  assert.equal(defaults.boundaries.install_system_dependencies, "ask");
  assert.equal(defaults.boundaries.network_remote_resources.hybrid, "ask");
  assert.equal(defaults.boundaries.network_remote_resources.auto, "allow");

  const normalized = normalizeAnalysisInteraction({});
  assert.equal(normalized.interaction_mode, "hybrid");
  assert.equal(normalized.effective.code_changes, "confirm");
  assert.equal(normalized.effective.restart_services, "confirm");
  assert.equal(normalized.effective.install_system_dependencies, "ask");
});

test("analysis interaction mode controls code-change permission", () => {
  assert.equal(
    normalizeAnalysisInteraction({ execution: { analysis: { interaction_mode: "manual" } } }).effective.code_changes,
    "deny",
  );
  assert.equal(
    normalizeAnalysisInteraction({ execution: { analysis: { interaction_mode: "hybrid" } } }).effective.code_changes,
    "confirm",
  );
  assert.equal(
    normalizeAnalysisInteraction({ execution: { analysis: { interaction_mode: "auto" } } }).effective.code_changes,
    "allow",
  );
});

test("project config can override analysis interaction boundaries", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-analysis-interaction-"));
  const file = join(dir, "config.yaml");
  await writeFile(
    file,
    [
      "execution:",
      "  analysis:",
      "    interaction_mode: auto",
      "    boundaries:",
      "      restart_services: confirm",
      "      install_system_dependencies: ask",
      "      destructive_or_external_side_effects: ask",
      "",
    ].join("\n"),
    "utf8",
  );

  const config = await loadConfig(file);
  const normalized = normalizeAnalysisInteraction(config);
  assert.equal(normalized.interaction_mode, "auto");
  assert.equal(normalized.effective.code_changes, "allow");
  assert.equal(normalized.effective.network_remote_resources, "allow");
  assert.equal(normalized.effective.restart_services, "confirm");
  assert.equal(normalized.effective.install_system_dependencies, "ask");
});

test("OpenCode artifacts expose analysis boundaries to agents", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-opencode-analysis-boundary-"));
  await writeOpenCodeArtifacts(dir, {
    config: {
      execution: {
        analysis: {
          interaction_mode: "auto",
        },
      },
    },
  });

  const metadata = JSON.parse(await readFile(join(dir, ".opencode", "hypo-workflow.json"), "utf8"));
  const agents = await readFile(join(dir, "AGENTS.md"), "utf8");
  const buildAgent = await readFile(join(dir, ".opencode", "agents", "hw-build.md"), "utf8");

  assert.equal(metadata.analysis.interaction_mode, "auto");
  assert.equal(metadata.analysis.effective.code_changes, "allow");
  assert.equal(metadata.analysis.effective.restart_services, "confirm");
  assert.match(agents, /Analysis boundary/i);
  assert.match(agents, /manual.*deny/i);
  assert.match(buildAgent, /analysis boundary/i);
});
