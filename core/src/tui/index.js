import { homedir } from "node:os";
import { join } from "node:path";
import { DEFAULT_GLOBAL_CONFIG, loadConfig, loadProjectRegistry } from "../config/index.js";
import { resolveAcceptancePolicy } from "../acceptance/index.js";

export async function buildGlobalTuiModel(options = {}) {
  const homeDir = options.homeDir || homedir();
  const configFile = options.configFile || join(homeDir, ".hypo-workflow", "config.yaml");
  const registryFile = options.registryFile || join(homeDir, ".hypo-workflow", "projects.yaml");
  const config = await loadConfig(configFile).catch(() => DEFAULT_GLOBAL_CONFIG);
  const acceptancePolicy = resolveAcceptancePolicy(config, DEFAULT_GLOBAL_CONFIG);
  const registry = await loadProjectRegistry(registryFile);
  const projects = registry.projects || [];
  const selectedProject = options.selectedProjectId
    ? projects.find((project) => project.id === options.selectedProjectId) || null
    : registry.selected_project_id
      ? projects.find((project) => project.id === registry.selected_project_id) || projects[0] || null
      : projects[options.selectedIndex || 0] || null;

  return {
    title: "Hypo-Workflow Global TUI",
    homeDir,
    config_file: configFile,
    registry_file: registryFile,
    projects,
    detail: {
      project: selectedProject,
      status: selectedProject?.pipeline_status || "no project selected",
      acceptance: selectedProject?.acceptance || {
        mode: acceptancePolicy.mode,
        state: acceptancePolicy.default_state,
      },
      knowledge: selectedProject?.knowledge || { status: "missing" },
    },
    config: {
      agent: config.agent || DEFAULT_GLOBAL_CONFIG.agent,
      dashboard: config.dashboard || DEFAULT_GLOBAL_CONFIG.dashboard,
      output: config.output || DEFAULT_GLOBAL_CONFIG.output,
      acceptance: acceptancePolicy,
      sync: config.sync || DEFAULT_GLOBAL_CONFIG.sync,
    },
    model_pool: config.model_pool || DEFAULT_GLOBAL_CONFIG.model_pool,
    actions: [
      { id: "open", label: "Open Project", side_effect: "explicit" },
      { id: "edit-model-pool", label: "Edit Model Pool", side_effect: "confirm" },
      { id: "add-project", label: "Add Project", side_effect: "confirm" },
      { id: "scan-projects", label: "Scan Projects", side_effect: "confirm" },
      { id: "refresh-projects", label: "Refresh Registry", side_effect: "explicit" },
      { id: "sync", label: "Sync Project", side_effect: "confirm" },
      { id: "doctor", label: "Run Doctor", side_effect: "explicit" },
      { id: "quit", label: "Quit", side_effect: "none" },
    ],
  };
}

export function renderGlobalTuiSnapshot(model = {}) {
  const lines = [
    model.title || "Hypo-Workflow Global TUI",
    "",
    "Projects",
  ];

  if (model.projects?.length) {
    for (const project of model.projects) {
      lines.push(`- ${project.display_name} [${project.pipeline_status}] ${project.path}`);
      lines.push(`  ${project.platform}/${project.profile} cycle=${project.current_cycle || "n/a"} patches=${project.open_patch_count ?? 0} acceptance=${project.acceptance?.mode || "auto"}/${project.acceptance?.state || "pending"}`);
    }
  } else {
    lines.push("- No registered projects");
  }

  lines.push(
    "",
    "Project Detail",
    `- Selected: ${model.detail?.project?.display_name || "n/a"}`,
    `- Status: ${model.detail?.status || "n/a"}`,
    `- Acceptance: ${model.detail?.acceptance?.mode || "auto"}/${model.detail?.acceptance?.state || "pending"}`,
    `- Knowledge: ${model.detail?.knowledge?.status || "missing"}`,
    "",
    "Global Config",
    `- Platform: ${model.config?.agent?.platform || "auto"}`,
    `- Dashboard: ${model.config?.dashboard?.enabled ? "enabled" : "disabled"}:${model.config?.dashboard?.port || 7700}`,
    `- Output: ${model.config?.output?.language || "zh-CN"} ${model.config?.output?.timezone || "Asia/Shanghai"}`,
    `- Acceptance: ${model.config?.acceptance?.mode || "auto"}`,
    "",
    "Model Pool",
  );

  for (const [role, config] of Object.entries(model.model_pool?.roles || {})) {
    lines.push(`- ${role}: ${config.primary}${config.fallback?.length ? ` -> ${config.fallback.join(" -> ")}` : ""}`);
  }

  lines.push("", "Sync/Actions");
  for (const action of model.actions || []) {
    lines.push(`- ${action.label} (${action.side_effect})`);
  }

  return `${lines.join("\n").trimEnd()}\n`;
}
