export const PLATFORM_CAPABILITIES = Object.freeze({
  codex: {
    commands: "skill",
    ask: "chat",
    plan: "codex-plan-tool",
    subagents: "available",
    events: "limited",
    permissions: "environment",
    recovery: "lease-heartbeat",
    handoff_boundaries: "preserve-host-sandbox",
    rules: "skill-files",
  },
  "claude-code": {
    commands: "plugin-skill",
    ask: "chat",
    plan: "prompt-managed",
    subagents: "available",
    events: "hooks",
    permissions: "claude-settings",
    recovery: "lease-heartbeat-hooks",
    handoff_boundaries: "preserve-claude-permissions",
    rules: "skill-files",
  },
  opencode: {
    commands: "native-slash",
    ask: "question-tool",
    plan: "todowrite",
    subagents: "native-agents",
    events: "plugin-events",
    permissions: "native-permissions",
    recovery: "lease-heartbeat-plugin-events",
    handoff_boundaries: "preserve-opencode-permissions-auto-continue",
    rules: "AGENTS.md-instructions",
  },
});

export function capabilityFor(platform) {
  const key = normalizePlatform(platform);
  if (!PLATFORM_CAPABILITIES[key]) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  return PLATFORM_CAPABILITIES[key];
}

export function normalizePlatform(platform = "codex") {
  const value = String(platform).toLowerCase();
  if (value === "claude") return "claude-code";
  if (value === "open-code") return "opencode";
  return value;
}
