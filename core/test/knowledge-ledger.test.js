import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  DEFAULT_GLOBAL_CONFIG,
  buildKnowledgeLoadPlan,
  commandByCanonical,
  commandMap,
  parseYaml,
  redactKnowledgeSecrets,
  validateKnowledgeRecord,
} from "../src/index.js";

test("knowledge ledger fixture satisfies the session record contract", async () => {
  const raw = await readFile("core/test/fixtures/knowledge/M01-milestone-record.yaml", "utf8");
  const record = parseYaml(raw);
  const result = validateKnowledgeRecord(record);

  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.equal(record.type, "milestone");
  assert.equal(record.source.cycle, "C4");
  assert.equal(record.source.milestone, "M01");
  assert.deepEqual(record.categories, ["dependencies", "decisions", "secret-refs"]);
  assert.equal(record.secret_refs[0].env, "OPENAI_API_KEY");
  assert.equal(Object.hasOwn(record.secret_refs[0], "raw_value"), false);
});

test("knowledge redaction removes common secret field names recursively", () => {
  const redacted = redactKnowledgeSecrets({
    provider: "openai",
    api_key: "sk-live-value",
    token: "token-value",
    headers: {
      Authorization: "Bearer raw-token",
      "x-api-token": "nested-token",
    },
    nested: [
      { password: "plain-password" },
      { client_secret: "plain-client-secret" },
    ],
    secret_refs: [
      {
        provider: "openai",
        env: "OPENAI_API_KEY",
        redacted_value: "sk-...abcd",
      },
    ],
  });

  assert.equal(redacted.provider, "openai");
  assert.equal(redacted.api_key, "[REDACTED]");
  assert.equal(redacted.token, "[REDACTED]");
  assert.equal(redacted.headers.Authorization, "[REDACTED]");
  assert.equal(redacted.headers["x-api-token"], "[REDACTED]");
  assert.equal(redacted.nested[0].password, "[REDACTED]");
  assert.equal(redacted.nested[1].client_secret, "[REDACTED]");
  assert.equal(redacted.secret_refs[0].provider, "openai");
  assert.equal(redacted.secret_refs[0].env, "OPENAI_API_KEY");
  assert.equal(redacted.secret_refs[0].redacted_value, "sk-...abcd");
});

test("knowledge config defaults load compact plus category indexes only at SessionStart", () => {
  assert.equal(DEFAULT_GLOBAL_CONFIG.knowledge.enabled, true);
  assert.equal(DEFAULT_GLOBAL_CONFIG.knowledge.loading.session_start, true);
  assert.equal(DEFAULT_GLOBAL_CONFIG.knowledge.loading.records, false);
  assert.deepEqual(DEFAULT_GLOBAL_CONFIG.knowledge.loading.indexes, [
    "dependencies",
    "references",
    "pitfalls",
    "decisions",
    "config-notes",
    "secret-refs",
  ]);

  const plan = buildKnowledgeLoadPlan(DEFAULT_GLOBAL_CONFIG.knowledge);
  assert.equal(plan.compact, ".pipeline/knowledge/knowledge.compact.md");
  assert.deepEqual(plan.indexes, [
    ".pipeline/knowledge/index/dependencies.yaml",
    ".pipeline/knowledge/index/references.yaml",
    ".pipeline/knowledge/index/pitfalls.yaml",
    ".pipeline/knowledge/index/decisions.yaml",
    ".pipeline/knowledge/index/config-notes.yaml",
    ".pipeline/knowledge/index/secret-refs.yaml",
  ]);
  assert.deepEqual(plan.records, []);
});

test("knowledge specs and skill document command semantics and state boundary", async () => {
  const knowledgeSpec = await readFile("references/knowledge-spec.md", "utf8");
  const commandsSpec = await readFile("references/commands-spec.md", "utf8");
  const configSpec = await readFile("references/config-spec.md", "utf8");
  const rootSkill = await readFile("SKILL.md", "utf8");
  const knowledgeSkill = await readFile("skills/knowledge/SKILL.md", "utf8");

  for (const heading of [
    "# Knowledge Ledger Spec",
    "## Directory Layout",
    "## Session Records",
    "## Category Indexes",
    "## Compact Summary",
    "## Secret References",
    "## Loading Policy",
    "## Cycle Archive Summary",
  ]) {
    assert.match(knowledgeSpec, new RegExp(`^${escapeRegExp(heading)}$`, "m"));
  }

  for (const phrase of [
    ".pipeline/knowledge/records/*.yaml",
    ".pipeline/knowledge/index/dependencies.yaml",
    ".pipeline/knowledge/index/secret-refs.yaml",
    ".pipeline/knowledge/knowledge.compact.md",
    "~/.hypo-workflow/secrets.yaml",
    "state.yaml must not store full knowledge records",
    "SessionStart loads the compact summary and category indexes only",
  ]) {
    assert.match(knowledgeSpec, new RegExp(escapeRegExp(phrase), "i"));
  }

  for (const subcommand of ["list", "view", "compact", "index", "search"]) {
    assert.match(commandsSpec, new RegExp(`\\b${subcommand}\\b`, "i"));
    assert.match(knowledgeSkill, new RegExp(`\\b${subcommand}\\b`, "i"));
  }
  assert.match(commandsSpec, /\/hw:knowledge/);
  assert.match(configSpec, /knowledge\.loading\.session_start/);
  assert.match(configSpec, /knowledge\.redaction\.secret_keys/);
  assert.match(rootSkill, /\/hw:knowledge/);
});

test("knowledge command is exposed through the canonical OpenCode command map", () => {
  const commands = commandMap("opencode");
  const knowledge = commandByCanonical("/hw:knowledge");

  assert.equal(commands.length, 32);
  assert.equal(knowledge.opencode, "/hw-knowledge");
  assert.equal(knowledge.agent, "hw-compact");
  assert.equal(knowledge.route, "tool");
  assert.equal(knowledge.skill, "skills/knowledge/SKILL.md");
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
