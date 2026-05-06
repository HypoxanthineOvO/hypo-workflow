import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  runProjectSync,
  writeConfig,
  writeThirdPartyAdapterArtifacts,
} from "../src/index.js";

test("third-party adapter artifacts teach conservative repository installation", async () => {
  const root = await fixtureRoot();
  const result = await writeThirdPartyAdapterArtifacts(root, { platform: "all" });

  assert.deepEqual(result.files.map((file) => file.path).sort(), [
    ".cursor/rules/hypo-workflow.mdc",
    ".github/copilot-instructions.md",
    ".trae/rules/project_rules.md",
  ]);

  const cursor = await readFile(join(root, ".cursor", "rules", "hypo-workflow.mdc"), "utf8");
  const copilot = await readFile(join(root, ".github", "copilot-instructions.md"), "utf8");
  const trae = await readFile(join(root, ".trae", "rules", "project_rules.md"), "utf8");

  for (const content of [cursor, copilot, trae]) {
    assert.match(content, /HypoxanthineOvO\/Hypo-Workflow/);
    assert.match(content, /not a runner/i);
    assert.match(content, /\.pipeline\//);
    assert.match(content, /\/hw:init/);
    assert.match(content, /\/hw:plan/);
    assert.match(content, /\/hw:start/);
    assert.match(content, /\/hw:resume/);
    assert.match(content, /\/hw:status/);
    assert.match(content, /protected files/i);
    assert.match(content, /preflight/i);
    assert.match(content, /implementation and testing\/review/i);
    assert.match(content, /Codex\/GPT runtime/i);
    assert.doesNotMatch(content, /guaranteed hook|lifecycle enforcement|auto-install/i);
    assert.doesNotMatch(content, /deepseek|mimo|claude model/i);
  }
  assert.match(cursor, /^---\ndescription:/);
});

test("third-party adapters preserve user-owned content around managed blocks", async () => {
  const root = await fixtureRoot();
  const target = join(root, ".github", "copilot-instructions.md");
  await mkdir(join(root, ".github"), { recursive: true });
  await writeFile(
    target,
    [
      "# Team Instructions",
      "",
      "Keep this local convention.",
      "",
      "<!-- HYPO-WORKFLOW:MANAGED:BEGIN -->",
      "old managed content",
      "<!-- HYPO-WORKFLOW:MANAGED:END -->",
      "",
      "Local footer.",
      "",
    ].join("\n"),
    "utf8",
  );

  await writeThirdPartyAdapterArtifacts(root, { platform: "copilot" });
  const content = await readFile(target, "utf8");

  assert.match(content, /Keep this local convention/);
  assert.match(content, /Local footer/);
  assert.doesNotMatch(content, /old managed content/);
  assert.match(content, /HypoxanthineOvO\/Hypo-Workflow/);
});

test("sync platform selection writes the requested third-party adapter only", async () => {
  const root = await fixtureRoot();
  const result = await runProjectSync(root, { mode: "standard", platform: "trae" });

  assert.ok(result.operations.includes("trae_adapter"));
  assert.equal(await exists(join(root, ".trae", "rules", "project_rules.md")), true);
  assert.equal(await exists(join(root, ".cursor", "rules", "hypo-workflow.mdc")), false);
  assert.equal(await exists(join(root, ".github", "copilot-instructions.md")), false);
});

async function fixtureRoot() {
  const root = await mkdtemp(join(tmpdir(), "hw-platform-adapters-"));
  await mkdir(join(root, ".pipeline"), { recursive: true });
  await writeConfig(join(root, ".pipeline", "config.yaml"), {
    pipeline: { name: "Adapter Fixture" },
    execution: { mode: "self", steps: { preset: "tdd" } },
  });
  await writeConfig(join(root, ".pipeline", "state.yaml"), {
    pipeline: { status: "running" },
    current: { prompt_name: "M05 / Adapters" },
  });
  return root;
}

async function exists(file) {
  try {
    await readFile(file, "utf8");
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
