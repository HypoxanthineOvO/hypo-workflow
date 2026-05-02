import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  addProjectAction,
  buildGlobalTuiModel,
  loadConfig,
  loadProjectRegistry,
  refreshProjectRegistryAction,
  saveGlobalModelPoolEdit,
  scanProjectsAction,
  syncSelectedProjectAction,
  updateModelPoolRole,
  writeConfig,
} from "../src/index.js";

test("model pool role edits validate fallback chains and roundtrip with backup", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-model-actions-"));
  const file = join(dir, "config.yaml");
  await writeConfig(file, {
    model_pool: {
      roles: {
        implement: { primary: "old-code", fallback: ["old-fallback"] },
      },
    },
  });

  const updated = updateModelPoolRole(await loadConfig(file), "implement", {
    primary: "new-code",
    fallback: ["new-code", "fallback-a", "fallback-a", "fallback-b"],
  });
  assert.deepEqual(updated.model_pool.roles.implement, {
    primary: "new-code",
    fallback: ["fallback-a", "fallback-b"],
  });
  assert.throws(() => updateModelPoolRole(updated, "unknown", { primary: "x" }), /Unsupported model pool role/);
  assert.throws(() => updateModelPoolRole(updated, "plan", { primary: "" }), /primary model is required/);

  await saveGlobalModelPoolEdit(file, "implement", {
    primary: "saved-code",
    fallback: ["fallback-a"],
  }, { now: "2026-05-02T23:40:00+08:00" });
  const saved = await loadConfig(file);
  assert.equal(saved.model_pool.roles.implement.primary, "saved-code");
  assert.deepEqual(saved.model_pool.roles.implement.fallback, ["fallback-a"]);
  assert.ok((await readdir(dir)).some((name) => /^config\.yaml\.bak\.20260502T234000/.test(name)));
});

test("project actions add, scan, refresh, and sync selected projects", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-project-actions-"));
  const home = join(dir, "home");
  const registryFile = join(home, ".hypo-workflow", "projects.yaml");
  const project = join(dir, "project-a");
  const nested = join(dir, "workspace", "project-b");

  await writeConfig(join(project, ".pipeline", "config.yaml"), {
    pipeline: { name: "Project A" },
  });
  await mkdir(join(project, ".pipeline", "knowledge"), { recursive: true });
  await writeFile(join(project, ".pipeline", "state.yaml"), "pipeline:\n  status: running\ncurrent:\n  prompt_name: M01\n", "utf8");
  await writeFile(join(project, ".pipeline", "patches.compact.md"), "- P001 open\n- P002 open\n", "utf8");
  await writeFile(join(project, ".pipeline", "knowledge", "knowledge.compact.md"), "# Knowledge Compact\n", "utf8");
  await writeConfig(join(nested, ".pipeline", "config.yaml"), {
    pipeline: { name: "Project B" },
  });

  const added = await addProjectAction(registryFile, project, { platform: "opencode", profile: "standard" });
  assert.equal(added.project.display_name, "project-a");

  const scanned = await scanProjectsAction(registryFile, join(dir, "workspace"), { platform: "codex" });
  assert.equal(scanned.added.length, 1);
  assert.equal(scanned.added[0].display_name, "project-b");

  const refreshed = await refreshProjectRegistryAction(registryFile);
  const projectA = refreshed.registry.projects.find((entry) => entry.path === project);
  assert.equal(projectA.pipeline_status, "running");
  assert.equal(projectA.open_patch_count, 2);
  assert.equal(projectA.knowledge.status, "available");

  const synced = await syncSelectedProjectAction(registryFile, projectA.id, { platform: "opencode" });
  assert.equal(synced.project.pipeline_status, "running");
  assert.match(await readFile(join(project, ".opencode", "hypo-workflow.json"), "utf8"), /model_pool/);

  const tui = await buildGlobalTuiModel({ homeDir: home });
  assert.equal(tui.detail.acceptance.state, "pending");
  assert.equal(tui.detail.knowledge.status, "available");
  assert.ok(tui.actions.some((action) => action.id === "edit-model-pool"));
  assert.ok(tui.actions.some((action) => action.id === "scan-projects"));
});

test("project-local config override still wins during selected-project sync", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-selected-sync-"));
  const home = join(dir, "home");
  const registryFile = join(home, ".hypo-workflow", "projects.yaml");
  const project = join(dir, "project");

  await writeConfig(join(home, ".hypo-workflow", "config.yaml"), {
    model_pool: {
      roles: {
        implement: { primary: "global-code", fallback: ["global-fallback"] },
      },
    },
  });
  await writeConfig(join(project, ".pipeline", "config.yaml"), {
    opencode: {
      agents: {
        "code-a": { model: "project-code" },
      },
    },
  });

  const added = await addProjectAction(registryFile, project, { platform: "opencode", profile: "standard" });
  await syncSelectedProjectAction(registryFile, added.project.id, { homeDir: home, platform: "opencode" });

  const buildAgent = await readFile(join(project, ".opencode", "agents", "hw-build.md"), "utf8");
  assert.match(buildAgent, /^model: project-code$/m);
});
