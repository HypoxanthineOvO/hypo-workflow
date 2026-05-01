// Hypo-Workflow managed OpenCode adapter scaffold.
// This plugin bridges native OpenCode events to Hypo-Workflow file contracts.
// It does not implement business tasks, write product code, fix bugs, or generate reports by itself.

export const metadata = {
  name: "hypo-workflow",
  version: "9.1.0-alpha.0",
  commandMap: [
  {
    "canonical": "/hw:start",
    "opencode": "/hw-start",
    "agent": "hw-build",
    "route": "pipeline",
    "skill": "skills/start/SKILL.md"
  },
  {
    "canonical": "/hw:resume",
    "opencode": "/hw-resume",
    "agent": "hw-build",
    "route": "pipeline",
    "skill": "skills/resume/SKILL.md"
  },
  {
    "canonical": "/hw:status",
    "opencode": "/hw-status",
    "agent": "hw-status",
    "route": "read",
    "skill": "skills/status/SKILL.md"
  },
  {
    "canonical": "/hw:skip",
    "opencode": "/hw-skip",
    "agent": "hw-build",
    "route": "pipeline",
    "skill": "skills/skip/SKILL.md"
  },
  {
    "canonical": "/hw:stop",
    "opencode": "/hw-stop",
    "agent": "hw-status",
    "route": "pipeline",
    "skill": "skills/stop/SKILL.md"
  },
  {
    "canonical": "/hw:report",
    "opencode": "/hw-report",
    "agent": "hw-status",
    "route": "read",
    "skill": "skills/report/SKILL.md"
  },
  {
    "canonical": "/hw:chat",
    "opencode": "/hw-chat",
    "agent": "hw-build",
    "route": "lifecycle",
    "skill": "skills/chat/SKILL.md"
  },
  {
    "canonical": "/hw:plan",
    "opencode": "/hw-plan",
    "agent": "hw-plan",
    "route": "plan",
    "skill": "skills/plan/SKILL.md"
  },
  {
    "canonical": "/hw:plan:discover",
    "opencode": "/hw-plan-discover",
    "agent": "hw-plan",
    "route": "plan",
    "skill": "skills/plan-discover/SKILL.md"
  },
  {
    "canonical": "/hw:plan:decompose",
    "opencode": "/hw-plan-decompose",
    "agent": "hw-plan",
    "route": "plan",
    "skill": "skills/plan-decompose/SKILL.md"
  },
  {
    "canonical": "/hw:plan:generate",
    "opencode": "/hw-plan-generate",
    "agent": "hw-plan",
    "route": "plan",
    "skill": "skills/plan-generate/SKILL.md"
  },
  {
    "canonical": "/hw:plan:confirm",
    "opencode": "/hw-plan-confirm",
    "agent": "hw-plan",
    "route": "plan",
    "skill": "skills/plan-confirm/SKILL.md"
  },
  {
    "canonical": "/hw:plan:extend",
    "opencode": "/hw-plan-extend",
    "agent": "hw-plan",
    "route": "plan",
    "skill": "skills/plan-extend/SKILL.md"
  },
  {
    "canonical": "/hw:plan:review",
    "opencode": "/hw-plan-review",
    "agent": "hw-review",
    "route": "review",
    "skill": "skills/plan-review/SKILL.md"
  },
  {
    "canonical": "/hw:cycle",
    "opencode": "/hw-cycle",
    "agent": "hw-status",
    "route": "lifecycle",
    "skill": "skills/cycle/SKILL.md"
  },
  {
    "canonical": "/hw:patch",
    "opencode": "/hw-patch",
    "agent": "hw-build",
    "route": "lifecycle",
    "skill": "skills/patch/SKILL.md"
  },
  {
    "canonical": "/hw:patch fix",
    "opencode": "/hw-patch-fix",
    "agent": "hw-build",
    "route": "fix",
    "skill": "skills/patch/SKILL.md"
  },
  {
    "canonical": "/hw:compact",
    "opencode": "/hw-compact",
    "agent": "hw-status",
    "route": "tool",
    "skill": "skills/compact/SKILL.md"
  },
  {
    "canonical": "/hw:guide",
    "opencode": "/hw-guide",
    "agent": "hw-plan",
    "route": "plan",
    "skill": "skills/guide/SKILL.md"
  },
  {
    "canonical": "/hw:showcase",
    "opencode": "/hw-showcase",
    "agent": "hw-build",
    "route": "artifact",
    "skill": "skills/showcase/SKILL.md"
  },
  {
    "canonical": "/hw:rules",
    "opencode": "/hw-rules",
    "agent": "hw-status",
    "route": "rules",
    "skill": "skills/rules/SKILL.md"
  },
  {
    "canonical": "/hw:init",
    "opencode": "/hw-init",
    "agent": "hw-plan",
    "route": "lifecycle",
    "skill": "skills/init/SKILL.md"
  },
  {
    "canonical": "/hw:check",
    "opencode": "/hw-check",
    "agent": "hw-status",
    "route": "read",
    "skill": "skills/check/SKILL.md"
  },
  {
    "canonical": "/hw:audit",
    "opencode": "/hw-audit",
    "agent": "hw-review",
    "route": "review",
    "skill": "skills/audit/SKILL.md"
  },
  {
    "canonical": "/hw:release",
    "opencode": "/hw-release",
    "agent": "hw-build",
    "route": "release",
    "skill": "skills/release/SKILL.md"
  },
  {
    "canonical": "/hw:debug",
    "opencode": "/hw-debug",
    "agent": "hw-build",
    "route": "debug",
    "skill": "skills/debug/SKILL.md"
  },
  {
    "canonical": "/hw:help",
    "opencode": "/hw-help",
    "agent": "hw-status",
    "route": "read",
    "skill": "skills/help/SKILL.md"
  },
  {
    "canonical": "/hw:reset",
    "opencode": "/hw-reset",
    "agent": "hw-status",
    "route": "lifecycle",
    "skill": "skills/reset/SKILL.md"
  },
  {
    "canonical": "/hw:log",
    "opencode": "/hw-log",
    "agent": "hw-status",
    "route": "read",
    "skill": "skills/log/SKILL.md"
  },
  {
    "canonical": "/hw:setup",
    "opencode": "/hw-setup",
    "agent": "hw-status",
    "route": "setup",
    "skill": "skills/setup/SKILL.md"
  },
  {
    "canonical": "/hw:dashboard",
    "opencode": "/hw-dashboard",
    "agent": "hw-status",
    "route": "tool",
    "skill": "skills/dashboard/SKILL.md"
  }
],
};

const protectedFiles = [
  ".pipeline/state.yaml",
  ".pipeline/cycle.yaml",
  ".pipeline/rules.yaml",
];

const compactContextFiles = [
  ".pipeline/state.compact.yaml",
  ".pipeline/state.yaml",
  ".pipeline/PROGRESS.compact.md",
  ".pipeline/PROGRESS.md",
  ".pipeline/cycle.yaml",
  ".pipeline/rules.yaml",
  ".pipeline/patches.compact.md",
  ".pipeline/patches",
];

const autoContinue = {
  enabled: true,
  mode: "safe",
};

export async function activate({ app, client }) {
  const log = (message) => {
    if (client?.log) client.log(`[hypo-workflow] ${message}`);
  };

  app.on("command.executed", async (event) => {
    recordCommandContext(event, log);
  });

  app.on("tool.execute.before", async (event) => {
    return fileGuard(event, log);
  });

  app.on("tool.execute.after", async () => {
    log("tool.execute.after heartbeat bridge");
  });

  app.on("session.idle", async (event) => {
    if (shouldAutoContinue({ ...event, autoContinue }, log)) {
      log("session.idle auto-continue approved");
    }
  });

  app.on("session.compacted", async (event) => {
    restoreCompactContext(event, log);
  });

  app.on("permission.asked", async (event) => {
    recordPermissionEvent("permission.asked", event, log);
  });

  app.on("permission.replied", async (event) => {
    recordPermissionEvent("permission.replied", event, log);
  });

  app.on("todo.updated", async (event) => {
    log("todo.updated sync to .plan-state/todo.yaml");
    // The concrete file write is intentionally left to the host Agent or a later
    // runtime integration pass. The scaffold records the contract early so Plan
    // recovery has one stable path: .plan-state/todo.yaml.
    return event;
  });
}

function recordCommandContext(event, log) {
  log(`command.executed ${event?.command || ""}`);
  return {
    command: event?.command,
    args: event?.args || [],
    cwd: event?.cwd,
  };
}

function fileGuard(event, log) {
  const target = event?.tool?.args?.file || event?.tool?.args?.path || "";
  if (protectedFiles.some((file) => target.endsWith(file))) {
    return {
      behavior: "deny",
      severity: "error",
      message: `Hypo-Workflow protected file requires explicit workflow mutation: ${target}`,
    };
  }
  if (target.includes(".pipeline/")) {
    log(`warn .pipeline write ${target}`);
    return {
      behavior: "allow",
      severity: "warn",
      message: `Hypo-Workflow observed .pipeline write: ${target}`,
    };
  }
  return undefined;
}

function shouldAutoContinue(context, log) {
  const policy = context.autoContinue || autoContinue;
  if (!policy.enabled) return false;
  const mode = policy.mode || "safe";
  if (mode === "ask") {
    log("auto-continue ask mode requires question/Ask");
    return false;
  }
  if (mode === "aggressive") {
    return !context.interactiveGateOpen;
  }
  if (mode === "safe") {
    return Boolean(
      context.testsPassed &&
      !context.errorRules &&
      !context.interactiveGateOpen &&
      !context.protectedFileDirty,
    );
  }
  return false;
}

function restoreCompactContext(event, log) {
  log(`session.compacted restoreCompactContext ${compactContextFiles.join(",")}`);
  return {
    event,
    files: compactContextFiles,
  };
}

function recordPermissionEvent(type, event, log) {
  log(`${type} recorded`);
  return {
    type,
    tool: event?.tool,
    decision: event?.decision,
  };
}
