import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const SPEC_FILE = "templates/readme-spec.md";

test("README spec defines managed dynamic blocks and data sources", async () => {
  const spec = await readFile(SPEC_FILE, "utf8");

  for (const heading of [
    "# README Spec",
    "## README Structure",
    "## Managed Dynamic Blocks",
    "## Data Sources",
    "## Update Policy",
    "## Full Regeneration Policy",
    "## Freshness Checks",
    "## M02 Implementation Notes",
  ]) {
    assert.match(spec, new RegExp(`^${escapeRegExp(heading)}$`, "m"));
  }

  for (const block of [
    "badges",
    "feature-summary",
    "command-count",
    "command-reference",
    "platform-matrix",
    "release-summary",
    "version-history",
  ]) {
    assert.match(spec, new RegExp(`<!-- HW:README:BEGIN ${block} -->`));
    assert.match(spec, new RegExp(`<!-- HW:README:END ${block} -->`));
  }
});

test("README spec source paths are explicit and exist", async () => {
  const spec = await readFile(SPEC_FILE, "utf8");
  const paths = [...spec.matchAll(/`([^`\n]+)`/g)]
    .map((match) => match[1])
    .filter((value) => isProjectPath(value));
  const uniquePaths = [...new Set(paths)];

  for (const requiredPath of [
    "README.md",
    ".claude-plugin/plugin.json",
    ".codex-plugin/plugin.json",
    "core/package.json",
    "core/src/commands/index.js",
    "core/src/platform/index.js",
    "references/commands-spec.md",
    "references/opencode-command-map.md",
    "references/platform-capabilities.md",
    "references/release-spec.md",
    "skills/",
  ]) {
    assert.ok(
      uniquePaths.includes(requiredPath),
      `expected README spec to reference ${requiredPath}`,
    );
  }

  for (const sourcePath of uniquePaths) {
    assert.ok(existsSync(sourcePath), `README spec source path does not exist: ${sourcePath}`);
  }
});

test("README spec gates full regeneration behind profile/config policy", async () => {
  const spec = await readFile(SPEC_FILE, "utf8");

  assert.match(spec, /release\.readme\.mode/);
  assert.match(spec, /release\.readme\.full_regen/);
  assert.match(spec, /loose/);
  assert.match(spec, /strict/);
  assert.match(spec, /auto/);
  assert.match(spec, /ask/);
  assert.match(spec, /deny/);
  assert.match(spec, /English/i);
  assert.match(spec, /marker/i);
});

function isProjectPath(value) {
  return (
    value === "README.md" ||
    value.endsWith("/") ||
    value.startsWith(".claude-plugin/") ||
    value.startsWith(".codex-plugin/") ||
    value.startsWith("core/") ||
    value.startsWith("references/") ||
    value.startsWith("skills/") ||
    value.startsWith("templates/")
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
