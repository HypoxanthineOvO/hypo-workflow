import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { renderBatchPlanArtifacts } from "../src/index.js";

test("plan docs keep single-feature plan behavior and add --batch semantics", async () => {
  const planSkill = await readFile("skills/plan/SKILL.md", "utf8");
  const discoverSkill = await readFile("skills/plan-discover/SKILL.md", "utf8");
  const decomposeSkill = await readFile("skills/plan-decompose/SKILL.md", "utf8");
  const planReference = await readFile("plan/PLAN-SKILL.md", "utf8");
  const commandsSpec = await readFile("references/commands-spec.md", "utf8");

  assert.match(planSkill, /Use this skill for the full P1-P4 planning flow\./);
  assert.match(planSkill, /without `--batch`, preserve the existing single-feature P1-P4 flow/i);
  assert.match(planSkill, /\/hw:plan --batch/);
  assert.match(planSkill, /Feature Queue/);
  assert.match(planSkill, /batch\.decompose_mode/);
  assert.match(discoverSkill, /Batch Discover/i);
  assert.match(discoverSkill, /multiple Feature candidates/i);
  assert.match(decomposeSkill, /upfront/i);
  assert.match(decomposeSkill, /just_in_time/i);
  assert.match(planReference, /Batch Plan Mode/);
  assert.match(planReference, /Mermaid/i);
  assert.match(commandsSpec, /--batch/);
  assert.match(commandsSpec, /### `\/hw:plan`\n\nSupported flags:\n\n- none\n- `--batch`/);
  assert.match(commandsSpec, /### `\/hw:status`\n\nSupported flags:\n\n- none\n- `--full`/);
  assert.match(commandsSpec, /single-feature \/hw:plan behavior is unchanged/i);
});

test("renderBatchPlanArtifacts creates upfront queue, markdown, and Mermaid outputs", () => {
  const result = renderBatchPlanArtifacts(
    {
      cycle_id: "C9",
      features: [
        { id: "F101", title: "Search", summary: "Add search UX", priority: 10 },
        { id: "F102", title: "Export", summary: "Add export flow", priority: 20, gate: "confirm" },
      ],
    },
    { decompose_mode: "upfront", failure_policy: "skip_defer" },
  );

  assert.equal(result.queue.current_feature, "F101");
  assert.equal(result.queue.defaults.decompose_mode, "upfront");
  assert.equal(result.queue.features.length, 2);
  assert.ok(result.queue.features.every((feature) => feature.milestones.length >= 1));
  assert.equal(result.queue.features[1].gate, "confirm");
  assert.match(result.markdown, /\| Feature \| Priority \| Gate \| Decompose \| Status \| Milestones \|/);
  assert.match(result.markdown, /F101/);
  assert.match(result.mermaid, /graph TD/);
  assert.match(result.mermaid, /F101/);
  assert.match(result.mermaid, /F102/);
});

test("renderBatchPlanArtifacts honors just_in_time scaffold without full decomposition", () => {
  const result = renderBatchPlanArtifacts(
    {
      cycle_id: "C9",
      features: [
        { id: "F201", title: "Analysis", summary: "Add analysis mode", priority: 10 },
        { id: "F202", title: "Reports", summary: "Add reports", priority: 20 },
      ],
    },
    { decompose_mode: "just_in_time" },
  );

  assert.equal(result.queue.defaults.decompose_mode, "just_in_time");
  assert.equal(result.queue.features[0].milestones.length, 0);
  assert.equal(result.queue.features[1].milestones.length, 0);
  assert.match(result.markdown, /just_in_time/);
  assert.match(result.markdown, /JIT decomposition pending/);
});
