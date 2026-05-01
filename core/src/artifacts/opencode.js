import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { commandMap } from "../commands/index.js";
import { normalizeProfile } from "../profile/index.js";

const HW_VERSION = "9.1.1-alpha.0";

export const OPENCODE_AGENTS = Object.freeze([
  {
    name: "hw-plan",
    mode: "primary",
    tools: ["read", "grep", "glob", "question", "todowrite"],
    description: "Plan, discovery, guide, and confirmation work.",
  },
  {
    name: "hw-build",
    mode: "primary",
    tools: ["read", "grep", "glob", "edit", "bash", "todowrite"],
    description: "Pipeline execution, patch fix, debug, release, and showcase generation.",
  },
  {
    name: "hw-status",
    mode: "primary",
    tools: ["read", "grep", "glob"],
    description: "Status, help, log, compact, check, and rules inspection.",
  },
  {
    name: "hw-review",
    mode: "subagent",
    tools: ["read", "grep", "glob", "todowrite"],
    description: "Audit, review, and architecture drift analysis.",
  },
  {
    name: "hw-explore",
    mode: "subagent",
    tools: ["read", "grep", "glob"],
    description: "Bounded codebase exploration.",
  },
  {
    name: "hw-debug",
    mode: "subagent",
    tools: ["read", "grep", "glob", "bash", "todowrite", "question"],
    description: "Symptom-driven debugging with hypothesis tracking and user Ask gates.",
  },
  {
    name: "hw-docs",
    mode: "subagent",
    tools: ["read", "grep", "glob", "edit", "todowrite"],
    description: "Documentation, showcase, and release-note assistance.",
  },
]);

export async function writeOpenCodeArtifacts(outDir, options = {}) {
  const profile = normalizeProfile(options.profile || "standard");
  const adapterDir = outDir.endsWith(".opencode") ? outDir : join(outDir, ".opencode");
  const projectRoot = dirname(adapterDir);
  const rootConfig = renderOpenCodeConfig(profile, { includePlugins: true });
  const adapterConfig = renderOpenCodeConfig(profile, { includePlugins: false });
  await mkdir(join(adapterDir, "commands"), { recursive: true });
  await mkdir(join(adapterDir, "agents"), { recursive: true });
  await mkdir(join(adapterDir, "plugins"), { recursive: true });
  await mkdir(join(adapterDir, "runtime"), { recursive: true });
  await rm(join(adapterDir, "plugins", "hypo-workflow-status.js"), { force: true });

  for (const command of commandMap("opencode")) {
    await writeFile(
      join(adapterDir, "commands", `${command.opencode.slice(1)}.md`),
      renderCommand(command),
      "utf8",
    );
  }

  for (const agent of OPENCODE_AGENTS) {
    await writeFile(join(adapterDir, "agents", `${agent.name}.md`), renderAgent(agent), "utf8");
  }

  await writeFile(join(adapterDir, "opencode.json"), `${JSON.stringify(adapterConfig, null, 2)}\n`, "utf8");
  await writeFile(join(adapterDir, "hypo-workflow.json"), `${JSON.stringify(renderHypoWorkflowMetadata(profile), null, 2)}\n`, "utf8");
  await writeFile(join(projectRoot, "opencode.json"), `${JSON.stringify(rootConfig, null, 2)}\n`, "utf8");
  await writeFile(join(projectRoot, "AGENTS.md"), await renderAgentsInstruction(), "utf8");
  await writeFile(join(adapterDir, "package.json"), await renderTemplate("package.json"), "utf8");
  await writeFile(join(adapterDir, "plugins", "hypo-workflow.ts"), await renderPluginTemplate(), "utf8");
  await writeFile(
    join(adapterDir, "runtime", "hypo-workflow-status.js"),
    await renderOpenCodeStatusModule(),
    "utf8",
  );
  await writeFile(
    join(adapterDir, "plugins", "hypo-workflow-tui.tsx"),
    await renderOpenCodeStatusTuiPlugin(),
    "utf8",
  );
}

export function renderCommand(command) {
  const planGuidance = command.route === "plan"
    ? "\nPlan discipline: use `question` / Ask for every hard interactive gate unless automation is explicitly configured, and keep `todowrite` synchronized for P1/P2/P3/P4 checkpoint state. Progressive Discover starts with task category, desired effect, and verification method, then moves through assumptions, ambiguities, tradeoffs, and validation criteria as needed. For `/hw:plan --batch`, collect multiple Features in one Discover pass, then generate Feature Queue tables and Mermaid diagrams according to `batch.decompose_mode`. For `/hw:plan --insert`, convert the natural-language request into a structured queue operation, summarize the queue diff, and wait for explicit confirmation before writing `.pipeline/feature-queue.yaml`.\n"
    : "";
  const routeGuidance = commandSpecificGuidance(command);
  return `---\nagent: ${command.agent}\ndescription: Hypo-Workflow mapping for ${command.canonical}\n---\n\n# ${command.opencode}\n\nCanonical command: \`${command.canonical}\`\nRoute: \`${command.route}\`\nSkill: \`${command.skill}\`\n\nLoad the corresponding Hypo-Workflow skill instructions from \`${command.skill}\`, then execute the canonical command semantics with any user-provided arguments.${planGuidance}${routeGuidance}\nBefore acting, inspect the relevant context when present:\n\n- \`.pipeline/config.yaml\`\n- \`.pipeline/cycle.yaml\`\n- \`.pipeline/state.yaml\`\n- \`.pipeline/rules.yaml\`\n- current prompt/report files for pipeline commands\n- open patches for Patch commands\n\nKeep this command as an OpenCode-native slash mapping, not a separate runner. The OpenCode Agent performs the work and Hypo-Workflow files remain the source of truth.\n`;
}

function commandSpecificGuidance(command) {
  if (command.canonical === "/hw:patch fix") {
    return "\nPatch Fix lane:\n- Step 1: Read Patch\n- Step 2: Locate Code\n- Step 3: Apply Minimal Fix\n- Step 4: Run Tests\n- Step 5: Commit\n- Step 6: Close Patch\n\ndo not run Plan Discover, do not enter full TDD pipeline, and do not mutate `state.yaml` for Patch Fix.\n";
  }
  if (command.canonical === "/hw:release") {
    return "\nRelease lane:\n- run `claude plugin validate .`\n- run the regression suite\n- update versioned files\n- run `update_readme` after version updates and before the release commit\n- run `readme-freshness` before commit/tag/push gates\n- perform a dirty check before release mutations\n- require an Ask gate before tag or push\n- use `git tag` and `git push` only after confirmation\n";
  }
  if (command.canonical === "/hw:compact") {
    return "\nCompact lane: generate compact context files and coordinate with OpenCode `session.compacted` context restore.\n";
  }
  if (command.canonical === "/hw:chat") {
    return "\nChat lane:\n- reload `state.yaml + cycle.yaml + PROGRESS.md + recent report`\n- write chat entries instead of Milestone reports\n- keep small edits lightweight\n- suggest `/hw:patch` when scope grows beyond append conversation\n";
  }
  if (command.canonical === "/hw:showcase") {
    return "\nShowcase lane: Agent generates showcase artifacts; the plugin only provides context and file guard support.\n";
  }
  if (command.canonical === "/hw:dashboard") {
    return "\nDashboard lane: dashboard launcher for the existing Hypo-Workflow WebUI; do not reimplement the dashboard in the plugin.\n";
  }
  return "";
}

export function renderAgent(agent) {
  return `---\ndescription: ${agent.description}\nmode: ${agent.mode}\npermission:\n${renderAgentPermissions(agent.tools)}---\n\n# ${agent.name}\n\n${agent.description}\n\nUse \`question\` / Ask for required user interaction and \`todowrite\` for visible plan discipline when those tools are available. For Plan work, every P1/P2/P3/P4 checkpoint must be represented in the todo state before continuing.\n`;
}

function renderAgentPermissions(tools) {
  const permissions = new Map();
  for (const tool of tools) {
    const key = permissionKeyForTool(tool);
    if (!key) continue;
    permissions.set(key, defaultPermissionForKey(key));
  }
  return [...permissions.entries()]
    .map(([key, value]) => `  ${key}: ${value}\n`)
    .join("");
}

function permissionKeyForTool(tool) {
  if (["read", "grep", "glob", "list", "bash", "task", "todowrite", "question"].includes(tool)) {
    return tool;
  }
  if (["write", "edit", "apply_patch"].includes(tool)) {
    return "edit";
  }
  return null;
}

function defaultPermissionForKey(key) {
  return key === "bash" || key === "edit" ? "ask" : "allow";
}

export function renderOpenCodeConfig(profile, options = {}) {
  const config = {
    $schema: "https://opencode.ai/config.json",
    instructions: ["AGENTS.md", ".pipeline/rules.yaml"],
    compaction: {
      auto: true,
      prune: true,
    },
    permission: {
      edit: profile.permissions === "allow-safe" ? "allow" : "ask",
      bash: profile.permissions === "allow-safe" ? "ask" : "ask",
      question: "allow",
    },
  };
  if (options.includePlugins !== false) {
    config.plugin = [
      ".opencode/plugins/hypo-workflow.ts",
      ".opencode/plugins/hypo-workflow-tui.tsx",
    ];
  }
  return config;
}

export function renderHypoWorkflowMetadata(profile) {
  return {
    profile: profile.name,
    autoContinue: profile.auto_continue,
    auto_continue: {
      enabled: profile.auto_continue,
      mode: profile.auto_continue_mode || "safe",
    },
    fileGuard: profile.file_guard,
    version: HW_VERSION,
    commandMap: commandMap("opencode"),
  };
}

async function renderAgentsInstruction() {
  return renderTemplate("AGENTS.md");
}

async function renderPluginTemplate() {
  const template = await renderTemplate("plugin.ts");
  return template.replace("__COMMAND_MAP_JSON__", JSON.stringify(commandMap("opencode"), null, 2));
}

export async function renderOpenCodeStatusTuiPlugin() {
  return renderTemplate("plugin-tui.tsx");
}

export async function renderOpenCodeStatusModule() {
  return readFile(resolve("core", "src", "opencode-status", "index.js"), "utf8");
}

async function renderTemplate(name) {
  const templatePath = resolve("plugins", "opencode", "templates", name);
  const template = await readFile(templatePath, "utf8");
  return template.replaceAll("__HW_VERSION__", HW_VERSION);
}
