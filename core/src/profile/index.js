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
  return normalizeProfile(config?.opencode?.profile || config?.profile || "standard");
}
