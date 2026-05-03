import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  checkDocs,
  checkNarrativeDocsForRelease,
  commandByCanonical,
  commandMap,
  docsMap,
  repairDocs,
} from "../src/index.js";

test("docs command is exposed and mapped to OpenCode", async () => {
  assert.equal(commandMap("opencode").length, 37);
  assert.equal(commandByCanonical("/hw:docs").opencode, "/hw-docs");
  assert.equal(commandByCanonical("/hw:docs").agent, "hw-docs");
  assert.equal(commandByCanonical("/hw:docs").skill, "skills/docs/SKILL.md");
  assert.match(await readFile("skills/docs/SKILL.md", "utf8"), /generate|check|repair|sync/i);
});

test("docs map defines ownership, generated references, and narrative policy", () => {
  const map = docsMap();
  const readme = map.documents.find((doc) => doc.path === "README.md");
  const commands = map.documents.find((doc) => doc.path === "docs/reference/commands.md");
  const userGuide = map.documents.find((doc) => doc.path === "docs/user-guide.md");

  assert.equal(readme.role, "concise_user_entrypoint");
  assert.equal(readme.narrative_update_policy, "explicit_repair");
  assert.ok(readme.must_not_include.includes("full_test_matrix"));
  assert.equal(commands.update_class, "generated_reference");
  assert.ok(commands.sources.includes("core/src/commands/index.js"));
  assert.equal(userGuide.role, "full_user_guide");
});

test("docs check rejects README internals, stale commands, and missing license links", async () => {
  const root = await fixtureRoot();
  await writeFile(join(root, "README.md"), [
    "# Demo",
    "",
    "Internal adapter runtime details and full test matrix.",
    "当前版本提供 **1 个用户指令**。",
  ].join("\n"), "utf8");

  const result = await checkDocs(root);

  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.check === "readme-must-not-include"));
  assert.ok(result.failures.some((failure) => failure.check === "command-count"));
  assert.ok(result.failures.some((failure) => failure.check === "license-link"));
});

test("docs repair writes docs IA and generated references without silently rewriting narrative docs", async () => {
  const root = await fixtureRoot();
  await writeFile(join(root, "README.md"), [
    "# Manual README",
    "",
    "<!-- HW:README:BEGIN command-count -->",
    "stale",
    "<!-- HW:README:END command-count -->",
  ].join("\n"), "utf8");

  const result = await repairDocs(root, { write: true });

  assert.ok(result.generated.includes("docs/reference/commands.md"));
  assert.ok(result.generated.includes("docs/user-guide.md"));
  assert.ok(result.generated.includes("docs/platforms/opencode.md"));
  assert.ok(result.managed_blocks.includes("command-count"));
  assert.match(await readFile(join(root, "README.md"), "utf8"), /Manual README/);
  assert.match(await readFile(join(root, "README.md"), "utf8"), /37 个用户指令/);
  assert.match(await readFile(join(root, "docs/reference/commands.md"), "utf8"), /\/hw:docs/);
});

test("release narrative fact check blocks stale docs claims", async () => {
  const root = await fixtureRoot();
  await writeFile(join(root, "docs", "user-guide.md"), "Hypo-Workflow has 1 commands and no OpenCode support.\n", "utf8");

  const result = await checkNarrativeDocsForRelease(root);

  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.check === "stale-command-count"));
  assert.ok(result.failures.some((failure) => failure.check === "stale-platform-claim"));
});

async function fixtureRoot() {
  const root = await mkdtemp(join(tmpdir(), "hw-docs-"));
  await mkdir(join(root, ".pipeline"), { recursive: true });
  await mkdir(join(root, "docs"), { recursive: true });
  await writeFile(join(root, "README.md"), "# Demo\n\n[License](LICENSE)\n", "utf8");
  return root;
}
