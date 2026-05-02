import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildGlobalTuiModel,
  loadProjectRegistry,
  renderGlobalTuiSnapshot,
  writeConfig,
} from "../src/index.js";

test("global TUI model renders project list, detail, config, model pool, and actions", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-tui-model-"));
  const home = join(dir, "home");
  const project = join(dir, "project");
  const registryFile = join(home, ".hypo-workflow", "projects.yaml");
  const configFile = join(home, ".hypo-workflow", "config.yaml");

  await writeConfig(configFile, {
    agent: { platform: "opencode", model: "default" },
    model_pool: {
      roles: {
        plan: { primary: "plan-model", fallback: ["plan-fallback"] },
      },
    },
  });
  await writeConfig(registryFile, {
    schema_version: "1",
    projects: [
      {
        id: "prj-demo",
        display_name: "Demo Project",
        path: project,
        platform: "opencode",
        profile: "standard",
        current_cycle: "C4",
        pipeline_status: "running",
        open_patch_count: 2,
        acceptance: { mode: "auto", state: "pending" },
        knowledge: { status: "available" },
      },
    ],
  });

  const model = await buildGlobalTuiModel({ homeDir: home });
  assert.equal(model.projects[0].display_name, "Demo Project");
  assert.equal(model.detail.project.id, "prj-demo");
  assert.equal(model.config.agent.platform, "opencode");
  assert.equal(model.model_pool.roles.plan.primary, "plan-model");
  assert.deepEqual(model.actions.map((action) => action.id), [
    "open",
    "edit-model-pool",
    "add-project",
    "scan-projects",
    "refresh-projects",
    "sync",
    "doctor",
    "quit",
  ]);
  assert.equal(model.detail.acceptance.state, "pending");
  assert.equal(model.detail.knowledge.status, "available");

  const snapshot = renderGlobalTuiSnapshot(model);
  assert.match(snapshot, /Hypo-Workflow Global TUI/);
  assert.match(snapshot, /Demo Project/);
  assert.match(snapshot, /Model Pool/);
  assert.match(snapshot, /Knowledge: available/);
  assert.match(snapshot, /Sync\/Actions/);
  assert.match(snapshot, /Sync Project/);
  assert.doesNotMatch(snapshot, /run pipeline/i);
});

test("no-command CLI routes to setup first, then TUI snapshot when global config exists", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-tui-route-"));
  const home = join(dir, "home");

  const first = execFileSync(process.execPath, ["cli/bin/hypo-workflow"], {
    cwd: ".",
    env: { ...process.env, HOME: home, HW_TUI_SNAPSHOT: "1" },
    encoding: "utf8",
  });
  assert.match(first, /Created .*config\.yaml/);

  const second = execFileSync(process.execPath, ["cli/bin/hypo-workflow"], {
    cwd: ".",
    env: { ...process.env, HOME: home, HW_TUI_SNAPSHOT: "1" },
    encoding: "utf8",
  });
  assert.match(second, /Hypo-Workflow Global TUI/);
  assert.match(second, /Global Config/);
  assert.match(second, /Model Pool/);
});

test("hw alias and Ink dependency are declared in CLI package metadata", async () => {
  const pkg = JSON.parse(await readFile("cli/package.json", "utf8"));
  const lock = JSON.parse(await readFile("cli/package-lock.json", "utf8"));

  assert.equal(pkg.bin["hypo-workflow"], "bin/hypo-workflow");
  assert.equal(pkg.bin.hw, "bin/hypo-workflow");
  assert.ok(pkg.dependencies.ink);
  assert.ok(pkg.dependencies.react);
  assert.equal(lock.packages[""].dependencies.ink, pkg.dependencies.ink);
  assert.equal(lock.packages[""].dependencies.react, pkg.dependencies.react);
});

test("init-project registered projects appear in the TUI snapshot", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-tui-init-"));
  const home = join(dir, "home");
  const project = join(dir, "project");

  execFileSync(process.execPath, ["cli/bin/hypo-workflow", "init-project", "--platform", "opencode", "--project", project], {
    cwd: ".",
    env: { ...process.env, HOME: home },
    stdio: "pipe",
  });

  const registry = await loadProjectRegistry(join(home, ".hypo-workflow", "projects.yaml"));
  assert.equal(registry.projects.length, 1);

  const snapshot = execFileSync(process.execPath, ["cli/bin/hypo-workflow", "tui", "--snapshot"], {
    cwd: ".",
    env: { ...process.env, HOME: home },
    encoding: "utf8",
  });
  assert.match(snapshot, new RegExp(registry.projects[0].display_name));
  assert.match(snapshot, /initialized/);
});
