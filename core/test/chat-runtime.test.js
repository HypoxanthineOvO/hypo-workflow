import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  appendChatLogEntry,
  assessPatchEscalation,
  endChatSession,
  recoverChatContext,
  startChatSession,
} from "../src/chat/index.js";

test("startChatSession marks chat active and records recovery context inputs", async () => {
  const state = {
    pipeline: { name: "demo", status: "stopped" },
    current: { prompt_name: "M13 / F006", prompt_file: ".pipeline/prompts/12-chat.md" },
  };

  const result = startChatSession(state, {
    now: "2026-05-01T14:30:00+08:00",
    relatedCycle: "C2",
    recentFiles: ["references/chat-spec.md"],
  });

  assert.equal(result.chat.active, true);
  assert.equal(result.chat.session_id, "chat-2026-05-01T14:30:00+08:00");
  assert.equal(result.chat.related_cycle, "C2");
  assert.deepEqual(result.chat.recent_files, ["references/chat-spec.md"]);
  assert.equal(result.chat.summary_policy, "auto");
});

test("recoverChatContext loads state cycle progress and latest report paths", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hw-chat-recover-"));
  const result = await recoverChatContext(dir, {
    state: {
      chat: { active: true, recent_files: ["core/src/chat/index.js"] },
    },
  });

  assert.deepEqual(result.files, [
    ".pipeline/state.yaml",
    ".pipeline/cycle.yaml",
    ".pipeline/PROGRESS.md",
    ".pipeline/reports/latest",
  ]);
  assert.equal(result.chatActive, true);
  assert.deepEqual(result.recentFiles, ["core/src/chat/index.js"]);
});

test("appendChatLogEntry emits chat_entry records instead of milestone reports", () => {
  const entry = appendChatLogEntry({
    sessionId: "chat-1",
    summary: "Discussed follow-up and touched two files.",
    files: ["a.js", "b.js"],
    timestamp: "2026-05-01T14:31:00+08:00",
  });

  assert.equal(entry.type, "chat_entry");
  assert.equal(entry.session_id, "chat-1");
  assert.match(entry.summary, /two files/i);
  assert.deepEqual(entry.files, ["a.js", "b.js"]);
});

test("endChatSession chooses summary or minimal logging and clears active flag", () => {
  const state = {
    chat: {
      active: true,
      session_id: "chat-2",
      summary_policy: "auto",
      started_at: "2026-05-01T14:00:00+08:00",
    },
  };

  const minimal = endChatSession(state, {
    now: "2026-05-01T14:10:00+08:00",
    filesChanged: 1,
    linesChanged: 12,
  });
  assert.equal(minimal.chat.active, false);
  assert.equal(minimal.persist.mode, "minimal");

  const full = endChatSession(state, {
    now: "2026-05-01T15:10:00+08:00",
    filesChanged: 4,
    linesChanged: 180,
  });
  assert.equal(full.persist.mode, "summary");
  assert.match(full.persist.reason, /material/i);
});

test("assessPatchEscalation warns when chat scope is no longer lightweight", () => {
  const keepChat = assessPatchEscalation({
    filesChanged: 1,
    linesChanged: 24,
    turns: 2,
    explicitIntent: "discussion",
  });
  assert.equal(keepChat.recommendation, "stay_in_chat");

  const upgrade = assessPatchEscalation({
    filesChanged: 6,
    linesChanged: 240,
    turns: 8,
    explicitIntent: "bugfix",
  });
  assert.equal(upgrade.recommendation, "suggest_patch");
  assert.match(upgrade.reason, /files|lines|bugfix/i);
});
