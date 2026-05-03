import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildDerivedArtifactMap,
  checkDerivedArtifacts,
  runProjectSync,
  writeConfig,
} from "../src/index.js";

test("derived artifact map declares authorities, writers, triggers, and protected boundaries", () => {
  const map = buildDerivedArtifactMap();
  const progress = map.find((entry) => entry.id === "progress_compact");
  const summary = map.find((entry) => entry.id === "project_summary");

  assert.ok(progress);
  assert.equal(progress.path, ".pipeline/PROGRESS.compact.md");
  assert.deepEqual(progress.authority, [".pipeline/PROGRESS.md"]);
  assert.ok(progress.writer_commands.includes("/hw:sync --repair"));
  assert.ok(progress.refresh_triggers.includes("progress_update"));
  assert.equal(progress.staleness_severity, "warning");

  assert.ok(summary);
  assert.ok(summary.derived_from.includes(".pipeline/state.yaml"));
  assert.equal(summary.repair_behavior, "safe_refresh");

  assert.ok(map.every((entry) => entry.protected_authority !== true));
  assert.ok(map.some((entry) => entry.protected_authorities.includes(".pipeline/state.yaml")));
});

test("sync check-only reports stale derived artifacts without writing", async () => {
  const root = await fixtureRoot();
  await writeFile(join(root, ".pipeline", "PROGRESS.compact.md"), "stale compact\n", "utf8");
  await sleepForMtime();
  await writeFile(join(root, ".pipeline", "PROGRESS.md"), "# Progress\n\nfresh progress\n", "utf8");

  const before = await readFile(join(root, ".pipeline", "PROGRESS.compact.md"), "utf8");
  const result = await runProjectSync(root, { mode: "standard", checkOnly: true });
  const after = await readFile(join(root, ".pipeline", "PROGRESS.compact.md"), "utf8");

  assert.equal(result.check_only, true);
  assert.ok(result.operations.includes("derived_check"));
  assert.ok(result.derived_health.artifacts.some((artifact) => (
    artifact.id === "progress_compact" && artifact.status === "stale"
  )));
  assert.equal(after, before);
  assert.equal(await exists(join(root, ".opencode", "hypo-workflow.json")), false);
});

test("standard repair refreshes safe derived artifacts and avoids protected authority writes", async () => {
  const root = await fixtureRoot();
  const stateBefore = await readFile(join(root, ".pipeline", "state.yaml"), "utf8");
  await writeFile(join(root, ".pipeline", "PROGRESS.compact.md"), "stale compact\n", "utf8");
  await writeFile(join(root, "PROJECT-SUMMARY.md"), "stale summary\n", "utf8");
  await sleepForMtime();
  await writeFile(join(root, ".pipeline", "PROGRESS.md"), "# Progress\n\nfresh progress\n", "utf8");

  const result = await runProjectSync(root, { mode: "standard", repair: true });

  assert.ok(result.operations.includes("derived_repair"));
  assert.equal(result.derived_health.ok, true);
  assert.match(await readFile(join(root, ".pipeline", "PROGRESS.compact.md"), "utf8"), /fresh progress/);
  assert.match(await readFile(join(root, "PROJECT-SUMMARY.md"), "utf8"), /Sync Fixture/);
  assert.equal(await readFile(join(root, ".pipeline", "state.yaml"), "utf8"), stateBefore);
});

test("authority conflict is reported for declared derived views without mutating protected files", async () => {
  const root = await fixtureRoot();
  const stateFile = join(root, ".pipeline", "state.yaml");
  const before = await readFile(stateFile, "utf8");
  const health = await checkDerivedArtifacts(root, {
    map: [
      {
        id: "bad_state_mirror",
        path: ".pipeline/state.yaml",
        authority: [".pipeline/config.yaml"],
        derived_from: [".pipeline/config.yaml"],
        writer_commands: ["/hw:sync --repair"],
        refresh_triggers: ["sync_repair"],
        staleness_severity: "error",
        repair_behavior: "requires_confirmation",
      },
    ],
  });

  assert.equal(health.ok, false);
  assert.equal(health.artifacts[0].status, "authority_conflict");
  assert.match(health.artifacts[0].repair_hint, /protected authority/);
  assert.equal(await readFile(stateFile, "utf8"), before);
});

async function fixtureRoot() {
  const root = await mkdtemp(join(tmpdir(), "hw-sync-derived-"));
  await mkdir(join(root, ".pipeline"), { recursive: true });
  await writeConfig(join(root, ".pipeline", "config.yaml"), {
    pipeline: { name: "Sync Fixture" },
    execution: { mode: "self", steps: { preset: "tdd" } },
  });
  await writeConfig(join(root, ".pipeline", "state.yaml"), {
    pipeline: {
      name: "Sync Fixture",
      status: "running",
      prompts_completed: 1,
      prompts_total: 2,
    },
    current: { phase: "executing", prompt_name: "M02 - Sync Fixture", step: "write_tests" },
  });
  await writeConfig(join(root, ".pipeline", "cycle.yaml"), {
    cycle: { id: "C1", status: "active" },
  });
  await writeConfig(join(root, ".pipeline", "rules.yaml"), { extends: "recommended" });
  await writeFile(join(root, ".pipeline", "PROGRESS.md"), "# Progress\n\ninitial\n", "utf8");
  return root;
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function sleepForMtime() {
  await new Promise((resolve) => setTimeout(resolve, 20));
}
