#!/usr/bin/env node
import { evaluateClaudeHookEvent } from "../core/src/index.js";

const event = process.argv[2] || "";
const matcher = process.argv[3];
const input = await readStdin();
let payload = {};
try {
  payload = input.trim() ? JSON.parse(input) : {};
} catch (error) {
  payload = { parse_error: error.message };
}
if (matcher && !payload.matcher) payload.matcher = matcher;

const output = await evaluateClaudeHookEvent(event, payload);
process.stdout.write(`${JSON.stringify(output)}\n`);

async function readStdin() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data;
}
