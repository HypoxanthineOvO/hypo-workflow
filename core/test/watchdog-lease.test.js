import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeConfig } from "../src/index.js";

test("watchdog dry-run does not skip forever when a stale structured lease exists", async () => {
  const root = await fixtureRoot();
  await writeConfig(join(root, ".pipeline", "config.yaml"), {
    watchdog: { enabled: true, heartbeat_timeout: 60, interval: 1, max_retries: 5 },
  });
  await writeConfig(join(root, ".pipeline", "state.yaml"), {
    pipeline: { status: "running" },
    current: { phase: "executing" },
    last_heartbeat: "2026-05-03T10:00:00+08:00",
  });
  await writeConfig(join(root, ".pipeline", ".lock"), {
    schema_version: "1",
    platform: "opencode",
    session_id: "sess-old",
    owner: "agent",
    command: "/hw:start",
    phase: "executing",
    heartbeat_at: "2026-05-03T10:00:00+08:00",
    expires_at: "2026-05-03T10:01:00+08:00",
    handoff_allowed: true,
  });

  const result = spawnSync("bash", ["scripts/watchdog.sh", root, "--dry-run"], {
    cwd: ".",
    env: {
      ...process.env,
      HYPO_WORKFLOW_RESUME_CMD: "echo resume",
      HYPO_WORKFLOW_NOW_EPOCH: String(Date.parse("2026-05-03T10:05:00+08:00") / 1000),
    },
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const log = await readFile(join(root, ".pipeline", "watchdog.log"), "utf8");
  assert.match(log, /takeover: stale lease/);
  assert.match(log, /dry-run: would trigger resume/);
  assert.doesNotMatch(log, /skip: lock exists/);
});

test("watchdog dry-run still blocks a fresh structured lease", async () => {
  const root = await fixtureRoot();
  await writeConfig(join(root, ".pipeline", "config.yaml"), {
    watchdog: { enabled: true, heartbeat_timeout: 60, interval: 1, max_retries: 5 },
  });
  await writeConfig(join(root, ".pipeline", "state.yaml"), {
    pipeline: { status: "running" },
    current: { phase: "executing" },
    last_heartbeat: "2026-05-03T10:00:00+08:00",
  });
  await writeConfig(join(root, ".pipeline", ".lock"), {
    schema_version: "1",
    platform: "opencode",
    session_id: "sess-fresh",
    owner: "agent",
    command: "/hw:start",
    phase: "executing",
    heartbeat_at: "2026-05-03T10:04:30+08:00",
    expires_at: "2026-05-03T10:09:30+08:00",
    handoff_allowed: true,
  });

  const result = spawnSync("bash", ["scripts/watchdog.sh", root, "--dry-run"], {
    cwd: ".",
    env: {
      ...process.env,
      HYPO_WORKFLOW_RESUME_CMD: "echo resume",
      HYPO_WORKFLOW_NOW_EPOCH: String(Date.parse("2026-05-03T10:05:00+08:00") / 1000),
    },
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const log = await readFile(join(root, ".pipeline", "watchdog.log"), "utf8");
  assert.match(log, /skip: fresh lease exists/);
  assert.doesNotMatch(log, /would trigger resume/);
});

async function fixtureRoot() {
  const root = await mkdtemp(join(tmpdir(), "hw-watchdog-lease-"));
  await mkdir(join(root, ".pipeline"), { recursive: true });
  return root;
}
