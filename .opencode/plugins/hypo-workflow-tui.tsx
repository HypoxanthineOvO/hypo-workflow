// Hypo-Workflow managed OpenCode TUI plugin scaffold.
// This plugin renders read-only workflow status into OpenCode TUI slots.
// It does not mutate .pipeline state or trigger workflow execution.

import type { TuiPlugin } from "@opencode-ai/plugin/tui";
import { createSignal } from "solid-js";
import { buildOpenCodeStatusModel } from "../runtime/hypo-workflow-status.js";

export const tui: TuiPlugin = async (api) => {
  const [model, setModel] = createSignal(await loadStatus(api));
  let lastWarningKey = "";

  const refresh = async () => {
    const next = await loadStatus(api);
    setModel(next);
    const warningKey = next.warnings.join("\n");
    if (warningKey && warningKey !== lastWarningKey) {
      lastWarningKey = warningKey;
      api.ui.toast({
        variant: "warning",
        message: `Hypo-Workflow status degraded: ${next.warnings[0]}`,
      });
    }
  };

  const subscriptions = [
    "command.executed",
    "tool.execute.after",
    "permission.asked",
    "permission.replied",
    "todo.updated",
    "session.idle",
    "session.compacted",
    "session.status",
    "session.updated",
  ].map((type) => api.event.on(type, () => void refresh()));

  api.lifecycle.onDispose(() => {
    for (const unsubscribe of subscriptions) unsubscribe();
  });

  api.slots.register({
    id: "hypo-workflow-status-panels",
    slots: {
      sidebar_content() {
        return renderSidebarText(model());
      },
      sidebar_footer() {
        return renderSidebarFooter(model());
      },
      home_footer() {
        return renderFooterText(model(), true);
      },
      session_prompt_right() {
        return renderFooterText(model(), false);
      },
    },
  });
};

export const HypoWorkflowTuiPlugin = tui;

async function loadStatus(api) {
  const root = api.state?.path?.worktree || api.state?.path?.directory || process.cwd();
  return buildOpenCodeStatusModel(root);
}

function renderSidebarText(model) {
  const lines = [
    "Hypo-Workflow",
    model.sidebar.summary,
    "",
  ];

  for (const section of model.sidebar.sections) {
    lines.push(`${section.title}:`);
    for (const item of section.items) {
      if (item) lines.push(`- ${item}`);
    }
    lines.push("");
  }

  if (model.warnings.length) {
    lines.push("Warnings:");
    for (const warning of model.warnings.slice(0, 3)) {
      lines.push(`- ${warning}`);
    }
  }

  return lines.join("\n").trim();
}

function renderSidebarFooter(model) {
  const event = model.recent_events[0]?.summary || "no recent event";
  return `${model.cycle.id || "C?"} | ${model.feature.id || "F?"} | ${model.metrics.duration_ms} | ${event}`;
}

function renderFooterText(model, includeEvent) {
  const parts = [model.footer.text];
  if (model.pipeline.heartbeat) parts.push(`hb:${formatHeartbeat(model.pipeline.heartbeat)}`);
  if (includeEvent && model.recent_events[0]?.summary) parts.push(model.recent_events[0].summary);
  return parts.join(" | ");
}

function formatHeartbeat(value) {
  const match = /T(\d{2}:\d{2})/.exec(String(value));
  return match?.[1] || String(value);
}
