// Hypo-Workflow managed OpenCode adapter scaffold.
// This plugin bridges native OpenCode events to Hypo-Workflow file contracts.
// It does not implement business tasks, write product code, fix bugs, or generate reports by itself.

const metadata = {
  name: "hypo-workflow",
  version: "__HW_VERSION__",
  commandMap: __COMMAND_MAP_JSON__,
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

const server = async ({ client }) => {
  const log = createLogger(client);
  return {
    event: async ({ event }) => {
      if (event?.type === "session.compacted") restoreCompactContext(event, log);
      if (event?.type === "permission.asked" || event?.type === "permission.replied") {
        recordPermissionEvent(event.type, event, log);
      }
      if (event?.type === "command.executed") recordCommandContext(event, log);
    },
    "command.execute.before": async (input) => {
      recordCommandContext({ command: input.command, args: input.arguments, cwd: undefined }, log);
    },
    "tool.execute.before": async (_input, output) => {
      const decision = fileGuard({ tool: { args: output.args || {} } }, log);
      if (decision?.behavior === "deny") {
        throw new Error(decision.message);
      }
    },
    "tool.execute.after": async () => {
      log("tool.execute.after heartbeat bridge");
    },
    "permission.ask": async (input) => {
      recordPermissionEvent("permission.ask", input, log);
    },
    "experimental.session.compacting": async (_input, output) => {
      const restored = restoreCompactContext({}, log);
      output.context.push(`Hypo-Workflow compact context files: ${restored.files.join(", ")}`);
    },
    "experimental.compaction.autocontinue": async (_input, output) => {
      if (!autoContinue.enabled || autoContinue.mode === "ask") output.enabled = false;
    },
  };
};

export default server;

async function activate({ app, client }) {
  const log = createLogger(client);

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

function createLogger(client) {
  return (message) => {
    if (client?.log) client.log(`[hypo-workflow] ${message}`);
  };
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
