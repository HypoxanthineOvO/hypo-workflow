import { resolveCycleStatusPhase } from "../lifecycle/index.js";

const ROUTES = Object.freeze({
  init: Object.freeze({
    id: "init",
    command_flow: ["/hw:init", "/hw:plan", "/hw:start"],
    confidence: "high",
    reason: "workspace_missing_pipeline",
  }),
  resume_revision: Object.freeze({
    id: "resume_revision",
    command_flow: ["/hw:resume"],
    confidence: "high",
    reason: "cycle_rejected_needs_revision",
  }),
  resume: Object.freeze({
    id: "resume",
    command_flow: ["/hw:resume"],
    confidence: "high",
    reason: "unfinished_pipeline",
  }),
  follow_up_plan: Object.freeze({
    id: "follow_up_plan",
    command_flow: ["/hw:plan --context follow_up", "/hw:plan:generate", "/hw:start"],
    confidence: "high",
    reason: "accepted_with_follow_up_continuation",
  }),
  repair: Object.freeze({
    id: "sync_repair",
    command_flow: ["/hw:sync --light", "/hw:check"],
    confidence: "high",
    reason: "derived_or_lease_repair_needed",
  }),
  patch: Object.freeze({
    id: "patch",
    command_flow: ["/hw:patch \"描述\"", "/hw:patch fix P<N>"],
    confidence: "medium",
    reason: "small_bug_or_fix_intent",
  }),
  explore: Object.freeze({
    id: "explore",
    command_flow: ["/hw:explore \"主题\"", "/hw:plan --context explore:E001"],
    confidence: "medium",
    reason: "exploration_or_spike_intent",
  }),
  batch: Object.freeze({
    id: "batch_dag_plan",
    command_flow: ["/hw:plan --batch", "/hw:start"],
    confidence: "medium",
    reason: "long_running_or_multi_feature_intent",
  }),
  deep_plan: Object.freeze({
    id: "deep_grill_me_plan",
    command_flow: ["/hw:plan", "/hw:start"],
    confidence: "medium",
    reason: "architecture_or_source_of_truth_risk",
    discover_mode: "deep_grill_me",
  }),
  docs: Object.freeze({
    id: "docs",
    command_flow: ["/hw:docs"],
    confidence: "medium",
    reason: "documentation_intent",
    forward_compatible: true,
  }),
  config: Object.freeze({
    id: "config_tui",
    command_flow: ["/hw:setup"],
    confidence: "medium",
    reason: "configuration_intent",
  }),
  status: Object.freeze({
    id: "status",
    command_flow: ["/hw:status"],
    confidence: "medium",
    reason: "status_intent",
  }),
  ordinary_plan: Object.freeze({
    id: "ordinary_plan",
    command_flow: ["/hw:plan", "/hw:start"],
    confidence: "medium",
    reason: "default_planning_path",
  }),
});

export const GUIDE_ROUTER_OUTPUTS = Object.freeze(Object.keys(ROUTES));

export function routeGuideIntent(input = {}) {
  const state = input.state || {};
  const cycle = unwrapCycle(input.cycle || {});
  const intent = normalizeIntent(input.intent || input.user_intent || input.message || "");
  const dirtyWorktree = Boolean(input.dirty_worktree || input.dirtyWorktree);
  const lifecycle = input.lifecycle || resolveCycleStatusPhase({ cycle, state });
  const context = {
    has_pipeline: input.has_pipeline ?? input.hasPipeline ?? Boolean(input.pipeline_exists ?? (state.pipeline || cycle.number || cycle.status)),
    lifecycle,
    intent,
    dirty_worktree: dirtyWorktree,
    lease: input.lease || input.lock || null,
    derived_refresh: input.derived_refresh || input.derivedRefresh || null,
    open_patch_count: Number(input.open_patch_count ?? input.openPatchCount ?? 0),
  };

  const selected = selectRoute(context);
  return {
    ...selected,
    command_flow: [...selected.command_flow],
    requires_confirmation: selected.requires_confirmation ?? true,
    sense: {
      phase: lifecycle.phase || null,
      next_action: lifecycle.next_action || null,
      dirty_worktree: dirtyWorktree,
      open_patch_count: context.open_patch_count,
    },
  };
}

export function evaluateDiscoverGrillMeRisk(input = {}) {
  const feature = input.feature || input;
  const intent = normalizeIntent(feature.intent || feature.title || feature.summary || feature.desired_effect || "");
  const reasons = [];

  if (feature.force_deep || feature.deep_grill_me) reasons.push("explicit_deep_request");
  if (["analysis", "showcase"].includes(feature.workflow_kind)) reasons.push("workflow_semantics");
  if (hasAny(intent, ["architecture", "架构", "source of truth", "source-of-truth", "状态语义", "workflow", "lifecycle", "contract", "契约"])) {
    reasons.push("architecture_or_source_of_truth");
  }
  if (hasAny(intent, ["multi feature", "batch", "dag", "roadmap", "长期", "多功能", "队列"])) {
    reasons.push("long_running_or_batch");
  }
  if (feature.source_of_truth_unclear || feature.affects_architecture || feature.workflow_semantic_risk) {
    reasons.push("declared_design_risk");
  }

  const deep = reasons.length > 0;
  return {
    mode: deep ? "deep_grill_me" : "light_discover",
    requires_design_concept_alignment: deep,
    reasons,
    first_questions: ["task_category", "desired_effect", "verification_method"],
  };
}

export function buildDesignConceptArtifacts(input = {}) {
  const concepts = normalizeConcepts(input.concepts || []);
  const glossary = normalizeGlossary(input.glossary || input.terms || [], concepts);
  return {
    "design-concepts.yaml": {
      schema_version: "1",
      artifact: "design-concepts",
      owner: "plan-discover",
      concepts,
      layering: {
        transient_discussion: "conversation only until confirmed",
        durable_decisions: ".pipeline/knowledge/records/*.yaml and decision indexes",
        glossary: ".pipeline/glossary.md",
        architecture: ".pipeline/architecture.md",
        prompt_inputs: ".pipeline/prompts/*.md",
      },
    },
    "glossary.md": renderGlossaryMarkdown(glossary),
    knowledge_index_guidance: {
      categories: ["decisions", "references"],
      rule: "Index confirmed decisions and concept references; do not copy full glossary or design-concepts bodies into every context.",
    },
  };
}

function selectRoute(context) {
  const { intent, lifecycle, lease, derived_refresh: derivedRefresh } = context;

  if (!context.has_pipeline) return ROUTES.init;
  if (derivedRefresh?.status === "warning" || lease?.stale === true || lease?.expired === true) return ROUTES.repair;
  if (lifecycle.next_action === "resume_revision" || lifecycle.phase === "needs_revision") return ROUTES.resume_revision;
  if (lifecycle.next_action === "start_follow_up_plan" || lifecycle.phase === "follow_up_planning") return ROUTES.follow_up_plan;
  if (hasAny(intent, ["status", "progress", "dashboard", "进度", "状态"])) return ROUTES.status;
  if (hasAny(intent, ["config", "setup", "settings", "配置", "设置", "tui"])) return ROUTES.config;
  if (hasAny(intent, ["docs", "documentation", "readme", "文档", "用户指南"])) return ROUTES.docs;
  if (hasAny(intent, ["patch", "fix", "bug", "hotfix", "修 bug", "修复"])) return ROUTES.patch;
  if (hasAny(intent, ["explore", "spike", "try", "investigate", "探索", "试验"])) return ROUTES.explore;
  if (hasAny(intent, ["batch", "dag", "roadmap", "queue", "多功能", "长期", "批量", "队列"])) return ROUTES.batch;
  if (evaluateDiscoverGrillMeRisk({ intent }).requires_design_concept_alignment) return ROUTES.deep_plan;
  if (["continue_execution", "start"].includes(lifecycle.next_action) && ["executing", "blocked", "ready_to_start"].includes(lifecycle.phase)) {
    if (!hasAny(intent, ["new", "plan", "规划", "新增"])) return ROUTES.resume;
  }
  return ROUTES.ordinary_plan;
}

function normalizeConcepts(concepts) {
  return (Array.isArray(concepts) ? concepts : []).map((concept, index) => ({
    id: slugify(concept.id || concept.term || concept.name || `concept-${index + 1}`),
    term: String(concept.term || concept.name || concept.id || "").trim(),
    definition: String(concept.definition || "").trim(),
    boundaries: normalizeStringArray(concept.boundaries || concept.boundary || concept.non_goals),
    source_of_truth: normalizeStringArray(concept.source_of_truth || concept.sourceOfTruth || concept.sources),
    state_transitions: normalizeStringArray(concept.state_transitions || concept.stateTransitions),
    decision_refs: normalizeStringArray(concept.decision_refs || concept.decisions),
    prompt_hints: normalizeStringArray(concept.prompt_hints || concept.promptHints),
  }));
}

function normalizeGlossary(glossary, concepts) {
  const explicit = (Array.isArray(glossary) ? glossary : []).map((entry) => ({
    term: String(entry.term || entry.name || "").trim(),
    definition: String(entry.definition || entry.description || "").trim(),
    examples: normalizeStringArray(entry.examples),
    non_examples: normalizeStringArray(entry.non_examples || entry.nonExamples),
    misunderstandings: normalizeStringArray(entry.misunderstandings || entry.common_misunderstandings),
  }));
  const terms = new Set(explicit.map((entry) => entry.term));
  for (const concept of concepts) {
    if (!concept.term || terms.has(concept.term)) continue;
    explicit.push({
      term: concept.term,
      definition: concept.definition,
      examples: [],
      non_examples: concept.boundaries,
      misunderstandings: [],
    });
    terms.add(concept.term);
  }
  return explicit;
}

function renderGlossaryMarkdown(entries) {
  const lines = [
    "# Glossary",
    "",
    "Stable terms extracted from confirmed Discover and Grill-Me decisions.",
    "",
  ];
  for (const entry of entries) {
    lines.push(`## ${entry.term || "Unnamed Term"}`, "");
    lines.push(entry.definition || "Definition pending.", "");
    lines.push("Examples:");
    lines.push(...renderList(entry.examples));
    lines.push("");
    lines.push("Non-examples:");
    lines.push(...renderList(entry.non_examples));
    lines.push("");
    lines.push("Common misunderstandings:");
    lines.push(...renderList(entry.misunderstandings));
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderList(values) {
  const items = normalizeStringArray(values);
  return items.length ? items.map((item) => `- ${item}`) : ["- None recorded."];
}

function unwrapCycle(value = {}) {
  return value?.cycle && typeof value.cycle === "object" ? value.cycle : value;
}

function normalizeIntent(value) {
  return String(value || "").trim().toLowerCase();
}

function hasAny(source, patterns) {
  return patterns.some((pattern) => source.includes(pattern));
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (!value) return [];
  return [String(value).trim()].filter(Boolean);
}

function slugify(value) {
  return String(value || "concept")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "") || "concept";
}
