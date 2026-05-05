export const PROFILE_DEFAULTS = Object.freeze({
  standard: {
    name: "standard",
    file_guard: "standard",
    auto_continue: true,
    auto_continue_mode: "safe",
    ask_interactions: true,
    subagents: true,
    permissions: "ask",
  },
  strict: {
    name: "strict",
    file_guard: "strict",
    auto_continue: false,
    auto_continue_mode: "ask",
    ask_interactions: true,
    subagents: true,
    permissions: "ask",
  },
  automation: {
    name: "automation",
    file_guard: "standard",
    auto_continue: true,
    auto_continue_mode: "aggressive",
    ask_interactions: false,
    subagents: true,
    permissions: "allow-safe",
  },
});

export const CLAUDE_CODE_PROFILE_DEFAULTS = Object.freeze({
  developer: {
    name: "developer",
    file_guard: "developer",
    auto_continue: true,
    auto_continue_mode: "aggressive",
    ask_interactions: false,
    subagents: true,
    permissions: "allow",
    destructive_actions: "allow",
  },
  standard: {
    name: "standard",
    file_guard: "standard",
    auto_continue: true,
    auto_continue_mode: "safe",
    ask_interactions: true,
    subagents: true,
    permissions: "ask",
    destructive_actions: "confirm",
  },
  strict: {
    name: "strict",
    file_guard: "strict",
    auto_continue: false,
    auto_continue_mode: "ask",
    ask_interactions: true,
    subagents: true,
    permissions: "ask",
    destructive_actions: "confirm",
  },
});

export function normalizeProfile(input = {}) {
  const requested = typeof input === "string" ? input : input.name || input.profile || "standard";
  const base = PROFILE_DEFAULTS[requested] || PROFILE_DEFAULTS.standard;
  const overrides = typeof input === "object" && input ? input : {};
  return {
    ...base,
    ...overrides,
    name: base.name,
  };
}

export function selectProfile(config = {}) {
  const opencode = config?.opencode || {};
  const profile = normalizeProfile(opencode.profile || config?.profile || "standard");
  return {
    ...profile,
    auto_continue: opencode.auto_continue ?? profile.auto_continue,
    compaction: opencode.compaction || profile.compaction,
    agents: opencode.agents || profile.agents,
    providers: opencode.providers || profile.providers,
  };
}

export function normalizeClaudeCodeProfile(input = {}) {
  const requested = typeof input === "string" ? input : input.name || input.profile || "standard";
  const base = CLAUDE_CODE_PROFILE_DEFAULTS[requested] || CLAUDE_CODE_PROFILE_DEFAULTS.standard;
  const overrides = typeof input === "object" && input ? input : {};
  return {
    ...base,
    ...overrides,
    name: base.name,
  };
}

export function selectClaudeCodeProfile(config = {}) {
  const claudeCode = config?.claude_code || {};
  const profile = normalizeClaudeCodeProfile(claudeCode.profile || config?.profile || "standard");
  return {
    ...profile,
    agents: claudeCode.agents || profile.agents,
    hooks: claudeCode.hooks || profile.hooks,
    settings: claudeCode.settings || profile.settings,
    status: claudeCode.status || profile.status,
  };
}
