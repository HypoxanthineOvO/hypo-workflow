export function startChatSession(state = {}, options = {}) {
  const now = options.now || new Date().toISOString();
  return {
    ...state,
    chat: {
      ...(state.chat || {}),
      active: true,
      session_id: options.sessionId || `chat-${now}`,
      started_at: (state.chat && state.chat.started_at) || now,
      last_activity_at: now,
      summary_policy: options.summaryPolicy || state.chat?.summary_policy || "auto",
      related_cycle: options.relatedCycle || state.chat?.related_cycle || null,
      related_milestone: options.relatedMilestone || state.chat?.related_milestone || null,
      recent_files: options.recentFiles || state.chat?.recent_files || [],
    },
  };
}

export async function recoverChatContext(_projectRoot = ".", options = {}) {
  const state = options.state || {};
  return {
    chatActive: Boolean(state.chat?.active),
    files: [
      ".pipeline/state.yaml",
      ".pipeline/cycle.yaml",
      ".pipeline/PROGRESS.md",
      ".pipeline/reports/latest",
    ],
    recentFiles: state.chat?.recent_files || [],
  };
}

export function appendChatLogEntry(input = {}) {
  return {
    type: "chat_entry",
    session_id: input.sessionId || null,
    timestamp: input.timestamp || new Date().toISOString(),
    summary: input.summary || "",
    files: input.files || [],
  };
}

export function endChatSession(state = {}, options = {}) {
  const assessment = summarizePersistence(options);
  return {
    ...state,
    chat: {
      ...(state.chat || {}),
      active: false,
      ended_at: options.now || new Date().toISOString(),
      last_activity_at: options.now || new Date().toISOString(),
    },
    persist: assessment,
  };
}

export function assessPatchEscalation(input = {}) {
  const reasons = [];
  if ((input.filesChanged || 0) >= 5) reasons.push("files");
  if ((input.linesChanged || 0) >= 160) reasons.push("lines");
  if ((input.turns || 0) >= 6) reasons.push("turns");
  if (/bugfix|repair|fix/i.test(input.explicitIntent || "")) reasons.push("bugfix");

  if (reasons.length) {
    return {
      recommendation: "suggest_patch",
      reason: `Patch escalation recommended due to ${reasons.join(", ")}`,
    };
  }

  return {
    recommendation: "stay_in_chat",
    reason: "lightweight_follow_up",
  };
}

function summarizePersistence(options = {}) {
  const filesChanged = options.filesChanged || 0;
  const linesChanged = options.linesChanged || 0;
  const mode = filesChanged >= 3 || linesChanged >= 120 ? "summary" : "minimal";
  return {
    mode,
    reason: mode === "summary" ? "material_changes_detected" : "lightweight_session",
  };
}
