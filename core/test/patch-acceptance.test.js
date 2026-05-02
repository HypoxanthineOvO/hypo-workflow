import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import {
  acceptPatch,
  buildPatchFixContext,
  readPatch,
  rejectPatch,
  requestPatchAcceptance,
  writeConfig,
} from "../src/index.js";

test("patch acceptance lifecycle never mutates state.yaml", async () => {
  const root = await fixtureRoot();
  const patchFile = join(root, ".pipeline", "patches", "P001-demo-fix.md");
  await writePatch(patchFile, {
    status: "open",
    iteration: 1,
  });
  const stateBefore = await readFile(join(root, ".pipeline", "state.yaml"), "utf8");

  const pending = await requestPatchAcceptance(root, "P001", {
    mode: "manual",
    now: "2026-05-03T01:20:00+08:00",
  });
  assert.equal(pending.patch.metadata.status, "pending_acceptance");
  assert.equal(pending.patch.metadata.iteration, 1);
  assert.equal(pending.patch.metadata.acceptance_requested_at, "2026-05-03T01:20:00+08:00");

  const accepted = await acceptPatch(root, "P001", {
    now: "2026-05-03T01:22:00+08:00",
  });
  assert.equal(accepted.patch.metadata.status, "closed");
  assert.equal(accepted.patch.metadata.accepted_at, "2026-05-03T01:22:00+08:00");
  assert.match(await readFile(join(root, ".pipeline", "log.yaml"), "utf8"), /patch_accept/);
  assert.match(await readFile(join(root, ".pipeline", "PROGRESS.md"), "utf8"), /P001 accepted/);
  assert.equal(await readFile(join(root, ".pipeline", "state.yaml"), "utf8"), stateBefore);
});

test("patch rejection reopens with iteration and structured feedback references", async () => {
  const root = await fixtureRoot();
  const patchFile = join(root, ".pipeline", "patches", "P001-demo-fix.md");
  await writePatch(patchFile, {
    status: "pending_acceptance",
    iteration: 1,
    acceptance_requested_at: "2026-05-03T01:20:00+08:00",
  });

  const first = await rejectPatch(root, "P001", {
    feedback: "Still fails on the empty project case.",
    now: "2026-05-03T01:24:00+08:00",
  });
  assert.equal(first.patch.metadata.status, "open");
  assert.equal(first.patch.metadata.iteration, 2);
  assert.deepEqual(first.patch.metadata.rejection_refs, [
    ".pipeline/patches/feedback/P001-rejection-20260503T012400+0800.yaml",
  ]);
  assert.equal(first.escalation.recommended, false);
  assert.match(await readFile(join(root, first.feedback_ref), "utf8"), /empty project case/);

  await requestPatchAcceptance(root, "P001", {
    mode: "manual",
    now: "2026-05-03T01:25:00+08:00",
  });
  const second = await rejectPatch(root, "P001", {
    feedback: "Still too broad; make this a milestone.",
    now: "2026-05-03T01:26:00+08:00",
  });
  assert.equal(second.patch.metadata.status, "open");
  assert.equal(second.patch.metadata.iteration, 3);
  assert.equal(second.patch.metadata.rejection_refs.length, 2);
  assert.equal(second.escalation.recommended, true);
  assert.match(second.escalation.reason, /repeated rejection/i);

  const context = await buildPatchFixContext(root, "P001");
  assert.equal(context.patch.id, "P001");
  assert.equal(context.patch.metadata.iteration, 3);
  assert.match(context.feedback[0].feedback, /Still fails/);
  assert.match(context.feedback[1].feedback, /Still too broad/);
});

test("patch skill documents accept/reject and patch metadata roundtrips", async () => {
  const root = await fixtureRoot();
  const patchFile = join(root, ".pipeline", "patches", "P007-roundtrip.md");
  await writePatch(patchFile, {
    status: "pending_acceptance",
    iteration: 4,
    rejection_refs: [".pipeline/patches/feedback/P007-rejection-old.yaml"],
  });

  const patch = await readPatch(root, "P007");
  assert.equal(patch.id, "P007");
  assert.equal(patch.title, "Demo fix");
  assert.equal(patch.metadata.status, "pending_acceptance");
  assert.equal(patch.metadata.iteration, 4);
  assert.deepEqual(patch.metadata.rejection_refs, [".pipeline/patches/feedback/P007-rejection-old.yaml"]);

  const skill = await readFile("skills/patch/SKILL.md", "utf8");
  assert.match(skill, /\/hw:patch accept P001/);
  assert.match(skill, /\/hw:patch reject P001/);
  assert.match(skill, /pending_acceptance/);
  assert.match(skill, /rejection_refs/);
  assert.match(skill, /must never write `.pipeline\/state.yaml`/);
});

async function fixtureRoot() {
  const root = await mkdtemp(join(tmpdir(), "hw-patch-acceptance-"));
  await mkdir(join(root, ".pipeline", "patches"), { recursive: true });
  await writeConfig(join(root, ".pipeline", "state.yaml"), {
    pipeline: { status: "running" },
    current: { prompt_name: "M10 / Patch Acceptance" },
  });
  await writeFile(join(root, ".pipeline", "PROGRESS.md"), [
    "# Demo",
    "",
    "## 时间线",
    "",
    "| 时间 | 类型 | 事件 | 结果 |",
    "|---|---|---|---|",
    "",
    "## Patch 轨道",
    "",
    "| Patch | 状态 | 时间 | 摘要 |",
    "|---|---|---|---|",
  ].join("\n"), "utf8");
  return root;
}

async function writePatch(file, metadata = {}) {
  const id = /^P\d+/.exec(basename(file))?.[0] || "P001";
  const lines = [
    `# ${id}: Demo fix`,
    `- status: ${metadata.status || "open"}`,
    `- severity: ${metadata.severity || "normal"}`,
    `- iteration: ${metadata.iteration || 1}`,
    "- discovered_in: C4/M10",
  ];
  if (metadata.acceptance_requested_at) {
    lines.push(`- acceptance_requested_at: ${metadata.acceptance_requested_at}`);
  }
  if (metadata.accepted_at) {
    lines.push(`- accepted_at: ${metadata.accepted_at}`);
  }
  if (metadata.rejection_refs) {
    lines.push(`- rejection_refs: [${metadata.rejection_refs.join(", ")}]`);
  }
  lines.push("", "Patch body.");
  await writeFile(file, `${lines.join("\n")}\n`, "utf8");
}
