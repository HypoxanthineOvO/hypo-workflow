import { normalizeDiscoverFeature } from "../progressive-discover/index.js";
import { normalizeTestProfileSelection } from "../test-profile/index.js";

export function renderBatchPlanArtifacts(input = {}, options = {}) {
  const cycleId = input.cycle_id || input.cycleId || "C1";
  const mode = options.decompose_mode || "upfront";
  const failurePolicy = options.failure_policy || "skip_defer";
  const features = normalizeFeatures(input.features || [], mode);
  const currentFeature = features.find((feature) => feature.status === "active")?.id || features[0]?.id || null;

  const queue = {
    version: 1,
    cycle_id: cycleId,
    current_feature: currentFeature,
    defaults: {
      decompose_mode: mode,
      failure_policy: failurePolicy,
      auto_chain: options.auto_chain ?? true,
      default_gate: options.default_gate || "auto",
    },
    features,
  };

  return {
    queue,
    markdown: renderFeatureTable(features, mode),
    mermaid: renderFeatureGraph(features),
  };
}

export function applyFeatureQueueOperation(queue, operation, options = {}) {
  const before = clone(queue);
  const nextQueue = clone(queue);
  const validation = validateQueueOperation(nextQueue, operation, options);
  if (validation) {
    return {
      status: "blocked",
      reason: validation,
      requires_confirmation: false,
      queue: before,
      operation,
    };
  }

  mutateQueue(nextQueue, operation);
  nextQueue.updated_at = options.now || nextQueue.updated_at || new Date().toISOString();
  const summary = summarizeOperation(operation);
  const diff = {
    before: summarizeQueue(before),
    after: summarizeQueue(nextQueue),
  };

  if (!options.confirmed) {
    return {
      status: "confirmation_required",
      requires_confirmation: true,
      queue: before,
      operation,
      summary,
      diff,
    };
  }

  return {
    status: "applied",
    requires_confirmation: false,
    queue: nextQueue,
    operation,
    summary,
    diff,
    event: {
      type: "feature_queue_update",
      summary,
      timestamp: nextQueue.updated_at,
    },
  };
}

export function resolveFeatureAutoChain(queue, transition = {}) {
  const nextQueue = clone(queue);
  const now = transition.now || new Date().toISOString();
  const feature = nextQueue.features.find((item) => item.id === transition.feature_id);
  if (!feature) {
    return {
      action: "blocked",
      reason: `feature not found: ${transition.feature_id}`,
      queue: nextQueue,
    };
  }

  const failurePolicy = transition.failure_policy || nextQueue.defaults?.failure_policy || "skip_defer";
  const autoChain = transition.auto_chain ?? nextQueue.defaults?.auto_chain ?? true;
  if (transition.result === "fail") {
    if (failurePolicy === "retry") {
      feature.status = "active";
      nextQueue.current_feature = feature.id;
      nextQueue.updated_at = now;
      return { action: "retry", queue: nextQueue, feature_id: feature.id };
    }
    if (failurePolicy === "stop") {
      feature.status = "blocked";
      nextQueue.current_feature = feature.id;
      nextQueue.updated_at = now;
      return { action: "stop", queue: nextQueue, feature_id: feature.id };
    }
    feature.status = "deferred";
    feature.deferred_reason = transition.reason || "failure_policy_skip_defer";
  } else {
    feature.status = "done";
  }

  nextQueue.updated_at = now;
  if (!autoChain) {
    nextQueue.current_feature = null;
    return { action: "pause_auto_chain_disabled", queue: nextQueue };
  }

  const nextFeature = nextQueue.features.find((item) => item.status === "queued" || item.status === "decomposed");
  if (!nextFeature) {
    nextQueue.current_feature = null;
    return { action: "complete", queue: nextQueue };
  }

  if (nextFeature.gate === "confirm") {
    nextQueue.current_feature = null;
    return {
      action: "pause_for_confirmation",
      next_feature_id: nextFeature.id,
      queue: nextQueue,
    };
  }

  nextFeature.status = "active";
  nextQueue.current_feature = nextFeature.id;
  const decomposed = decomposeFeatureJustInTime(nextQueue, nextFeature.id, { now });
  return {
    action: "advance",
    next_feature_id: nextFeature.id,
    queue: decomposed.queue,
  };
}

export function decomposeFeatureJustInTime(queue, featureId, options = {}) {
  const nextQueue = clone(queue);
  const feature = nextQueue.features.find((item) => item.id === featureId);
  if (!feature) {
    return {
      generated: false,
      reason: `feature not found: ${featureId}`,
      queue: nextQueue,
    };
  }

  if (feature.decompose_mode !== "just_in_time" || feature.milestones?.length) {
    return {
      generated: false,
      queue: nextQueue,
    };
  }

  feature.milestones = renderDefaultMilestones(feature.id, feature.title || feature.id);
  nextQueue.updated_at = options.now || nextQueue.updated_at || new Date().toISOString();
  return {
    generated: true,
    queue: nextQueue,
  };
}

export function syncFeatureMetricSummary(queue, metrics = {}) {
  const nextQueue = clone(queue);
  for (const feature of nextQueue.features || []) {
    const record = (metrics.features || []).find((item) => item.id === feature.id) || {};
    feature.metric_summary = {
      duration_ms: fallbackMetric(record.duration_ms),
      token_count: fallbackMetric(record.token_count),
      cost: fallbackMetric(record.cost),
    };
  }
  return nextQueue;
}

function normalizeFeatures(features, mode) {
  return features.map((feature, index) => {
    const discover = normalizeDiscoverFeature(feature);
    const id = discover.id || `F${String(index + 1).padStart(3, "0")}`;
    const featureMode = discover.decompose_mode || mode;
    return {
      id,
      title: discover.title || id,
      priority: discover.priority ?? (index + 1) * 10,
      status: index === 0 ? "active" : "queued",
      gate: discover.gate || "auto",
      decompose_mode: featureMode,
      source: discover.source || "batch-discover",
      summary: discover.summary || discover.desired_effect || "",
      category: discover.category,
      workflow_kind: discover.workflow_kind,
      analysis_kind: discover.analysis_kind,
      desired_effect: discover.desired_effect,
      verification: discover.verification,
      test_profiles: normalizeTestProfileSelection(discover).profiles,
      milestones: featureMode === "upfront" ? renderDefaultMilestones(id, discover.title || id) : [],
      metric_summary: {
        duration_ms: "n/a",
        token_count: "n/a",
        cost: "n/a",
      },
    };
  });
}

function renderDefaultMilestones(featureId, title) {
  return [
    {
      id: `${featureId}-M01`,
      status: "planned",
      title: `${title} design and tests`,
    },
    {
      id: `${featureId}-M02`,
      status: "planned",
      title: `${title} implementation and validation`,
    },
  ];
}

function validateQueueOperation(queue, operation = {}, options = {}) {
  if (!operation.type) {
    return "operation type is required";
  }

  if (["append", "insert"].includes(operation.type)) {
    const featureId = operation.feature?.id;
    if (!featureId) {
      return "feature id is required";
    }
    if (queue.features.some((feature) => feature.id === featureId)) {
      return `duplicate feature id: ${featureId}`;
    }
    if (operation.type === "insert") {
      const target = queue.features.find((feature) => feature.id === operation.target_id);
      if (!target) {
        return `target feature not found: ${operation.target_id}`;
      }
      if (!options.allow_protected && !isQueued(target)) {
        return `target feature is protected: ${operation.target_id}`;
      }
    }
    return null;
  }

  if (["move", "reprioritize", "pause", "update", "replace"].includes(operation.type)) {
    const featureId = operation.feature_id;
    const feature = queue.features.find((item) => item.id === featureId);
    if (!feature) {
      return `feature not found: ${featureId}`;
    }
    if (!options.allow_protected && ["move", "reprioritize"].includes(operation.type) && !isQueued(feature)) {
      return `cannot ${operation.type} protected ${feature.status} feature: ${featureId}`;
    }
    if (!options.allow_protected && operation.decompose_mode && !isQueued(feature)) {
      return `cannot change decompose_mode for protected ${feature.status} feature: ${featureId}`;
    }
    if (operation.type === "move") {
      const target = queue.features.find((item) => item.id === operation.target_id);
      if (!target) {
        return `target feature not found: ${operation.target_id}`;
      }
      if (!options.allow_protected && !isQueued(target)) {
        return `target feature is protected: ${operation.target_id}`;
      }
    }
    return null;
  }

  return `unsupported operation type: ${operation.type}`;
}

function mutateQueue(queue, operation) {
  if (operation.type === "append") {
    queue.features.push(normalizeInsertedFeature(queue, operation.feature));
    return;
  }

  if (operation.type === "insert") {
    const index = queue.features.findIndex((feature) => feature.id === operation.target_id);
    const offset = operation.position === "after" ? 1 : 0;
    queue.features.splice(index + offset, 0, normalizeInsertedFeature(queue, operation.feature));
    return;
  }

  if (operation.type === "move") {
    const index = queue.features.findIndex((feature) => feature.id === operation.feature_id);
    const [feature] = queue.features.splice(index, 1);
    const targetIndex = queue.features.findIndex((item) => item.id === operation.target_id);
    const offset = operation.position === "after" ? 1 : 0;
    queue.features.splice(targetIndex + offset, 0, feature);
    return;
  }

  const feature = queue.features.find((item) => item.id === operation.feature_id);
  if (operation.type === "reprioritize") {
    feature.priority = operation.priority;
    return;
  }
  if (operation.type === "pause") {
    feature.gate = "confirm";
    return;
  }
  if (operation.type === "update" || operation.type === "replace") {
    for (const key of ["title", "summary", "priority", "gate", "decompose_mode", "source"]) {
      if (Object.hasOwn(operation, key)) {
        feature[key] = operation[key];
      }
    }
  }
}

function normalizeInsertedFeature(queue, feature = {}) {
  const discover = normalizeDiscoverFeature(feature);
  const id = discover.id;
  return {
    id,
    title: discover.title || id,
    priority: discover.priority ?? nextPriority(queue.features),
    status: "queued",
    gate: discover.gate || queue.defaults?.default_gate || "auto",
    decompose_mode: discover.decompose_mode || queue.defaults?.decompose_mode || "upfront",
    source: discover.source || "insert",
    summary: discover.summary || discover.desired_effect || "",
    category: discover.category,
    workflow_kind: discover.workflow_kind,
    analysis_kind: discover.analysis_kind,
    desired_effect: discover.desired_effect,
    verification: discover.verification,
    test_profiles: normalizeTestProfileSelection(discover).profiles,
    milestones: discover.milestones || [],
    metric_summary: {
      duration_ms: fallbackMetric(discover.metric_summary?.duration_ms),
      token_count: fallbackMetric(discover.metric_summary?.token_count),
      cost: fallbackMetric(discover.metric_summary?.cost),
    },
  };
}

function nextPriority(features = []) {
  if (!features.length) {
    return 10;
  }
  return Math.max(...features.map((feature) => Number(feature.priority) || 0)) + 10;
}

function summarizeOperation(operation) {
  if (operation.type === "append") {
    return `append feature ${operation.feature.id}`;
  }
  if (operation.type === "insert") {
    return `insert feature ${operation.feature.id} ${operation.position || "before"} ${operation.target_id}`;
  }
  if (operation.type === "move") {
    return `move feature ${operation.feature_id} ${operation.position || "before"} ${operation.target_id}`;
  }
  if (operation.type === "reprioritize") {
    return `reprioritize feature ${operation.feature_id} to ${operation.priority}`;
  }
  if (operation.type === "pause") {
    return `pause feature ${operation.feature_id} with gate confirm`;
  }
  return `update feature ${operation.feature_id}`;
}

function summarizeQueue(queue) {
  return {
    current_feature: queue.current_feature || null,
    features: (queue.features || []).map((feature) => ({
      id: feature.id,
      priority: feature.priority,
      status: feature.status,
      gate: feature.gate,
      decompose_mode: feature.decompose_mode,
      milestone_count: feature.milestones?.length || 0,
    })),
  };
}

function isQueued(feature) {
  return feature.status === "queued" || feature.status === "decomposed";
}

function fallbackMetric(value) {
  return value === undefined || value === null ? "n/a" : value;
}

function clone(value) {
  return globalThis.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function renderFeatureTable(features, mode) {
  const lines = [
    `Batch decompose mode: ${mode}`,
    "",
    "| Feature | Priority | Gate | Decompose | Status | Milestones | Workflow | Analysis Kind | Category | Verification | Profiles |",
    "|---|---:|---|---|---|---|---|---|---|---|---|",
  ];
  for (const feature of features) {
    const milestones = feature.milestones.length
      ? feature.milestones.map((milestone) => milestone.id).join(", ")
      : "JIT decomposition pending";
    const verification = feature.verification?.method || "TBD";
    const profiles = feature.test_profiles?.length ? feature.test_profiles.join("+") : "preset-only";
    lines.push(`| ${feature.id} ${feature.title} | ${feature.priority} | ${feature.gate} | ${feature.decompose_mode} | ${feature.status} | ${milestones} | ${feature.workflow_kind || "build"} | ${feature.analysis_kind || "n/a"} | ${feature.category || "other"} | ${verification} | ${profiles} |`);
  }
  return `${lines.join("\n")}\n`;
}

function renderFeatureGraph(features) {
  const lines = ["graph TD"];
  for (const feature of features) {
    lines.push(`  ${sanitizeNode(feature.id)}["${feature.id}: ${escapeLabel(feature.title)}"]`);
    for (const milestone of feature.milestones) {
      lines.push(`  ${sanitizeNode(feature.id)} --> ${sanitizeNode(milestone.id)}["${milestone.id}: ${escapeLabel(milestone.title)}"]`);
    }
  }
  for (let index = 0; index < features.length - 1; index += 1) {
    lines.push(`  ${sanitizeNode(features[index].id)} -. next .-> ${sanitizeNode(features[index + 1].id)}`);
  }
  return `${lines.join("\n")}\n`;
}

function sanitizeNode(value) {
  return String(value).replace(/[^A-Za-z0-9_]/g, "_");
}

function escapeLabel(value) {
  return String(value).replace(/"/g, "'");
}
