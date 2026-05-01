import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

test("session-start hook restores active chat context", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-chat-hook-start-"));
  await mkdir(join(dir, ".pipeline"), { recursive: true });
  await writeFile(
    join(dir, ".pipeline", "state.yaml"),
    [
      "pipeline:",
      "  name: chat-hook",
      "  status: stopped",
      "current:",
      "  prompt_file: 12-chat.md",
      "  step: write_tests",
      "  step_index: 0",
      "chat:",
      "  active: true",
      "  session_id: chat-test",
      "",
    ].join("\n"),
    "utf8",
  );

  const { stdout } = await runHook(join(repoRoot, "hooks", "session-start.sh"), ["resume"], dir);
  assert.match(stdout, /Chat Recovery/);
  assert.match(stdout, /chat\.active == true/);
  assert.match(stdout, /\/hw:chat/);
});

test("stop hook blocks active chat without summary or chat_entry", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-chat-hook-stop-"));
  await mkdir(join(dir, ".pipeline"), { recursive: true });
  await writeFile(
    join(dir, ".pipeline", "state.yaml"),
    [
      "pipeline:",
      "  name: chat-hook",
      "  status: stopped",
      "chat:",
      "  active: true",
      "  session_id: chat-test",
      "",
    ].join("\n"),
    "utf8",
  );

  const { stdout } = await runHook(join(repoRoot, "hooks", "stop-check.sh"), [], dir);
  const parsed = JSON.parse(stdout);
  assert.equal(parsed.decision, "block");
  assert.match(parsed.reason, /chat summary|chat_entry/);
  assert.match(parsed.reason, /Patch escalation/);
});

function runHook(script, args, cwd) {
  const command = `printf '{}' | bash ${shellQuote(script)} ${args.map(shellQuote).join(" ")}`;
  return execFileAsync("bash", ["-lc", command], { cwd });
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}
