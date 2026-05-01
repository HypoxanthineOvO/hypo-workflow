import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("README explains Feature Queue long-range planning", async () => {
  const readme = await readFile("README.md", "utf8");

  for (const pattern of [
    /Feature Queue/,
    /\/hw:plan --batch/,
    /\/hw:plan --insert/,
    /\.pipeline\/feature-queue\.yaml/,
    /\.pipeline\/metrics\.yaml/,
    /upfront/,
    /just_in_time/,
    /gate: confirm/,
    /auto_chain/,
    /failure_policy: skip_defer/,
  ]) {
    assert.match(readme, pattern);
  }
});

test("README spec keeps Feature Queue as a documented data source", async () => {
  const spec = await readFile("templates/readme-spec.md", "utf8");

  assert.match(spec, /Feature Queue/);
  assert.match(spec, /references\/feature-queue-spec\.md/);
  assert.match(spec, /skills\/plan\/SKILL\.md/);
  assert.match(spec, /skills\/start\/SKILL\.md/);
});
