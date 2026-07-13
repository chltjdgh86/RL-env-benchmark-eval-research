import type {
  DatasetAccess,
  DatasetArtifact,
  DatasetCategory,
  DatasetProvenance,
} from "./dataset-filters"
import type { DatasetSurface } from "./dataset-schema"

export const DATASET_CATEGORY_LABELS: Readonly<Record<DatasetCategory, string>> = {
  computer_use_gui: "Computer use & GUI",
  browser_web: "Browser & web",
  mcp_tool_use: "MCP & tool use",
  coding_terminal: "Coding & terminal",
  office_professional: "Office & professional",
  enterprise_customer_service: "Enterprise & customer service",
  finance_legal_compliance: "Finance, legal & compliance",
  science_data_research: "Science, data & research",
  safety_cybersecurity: "Safety & cybersecurity",
  multiagent_memory_planning_games: "Multi-agent, memory, planning & games",
  robotics_physical_ai: "Robotics & physical AI",
  general_agent_suites_trajectories: "General agent suites & trajectories",
  company_sample_catalogs: "Company sample catalogs",
}

export const DATASET_ARTIFACT_LABELS: Readonly<Record<DatasetArtifact, string>> = {
  tasks: "Tasks",
  environment: "Environments",
  inputs: "Inputs & fixtures",
  references: "References & rubrics",
  trajectories: "Trajectories & traces",
  results: "Results & logs",
  training: "Training corpora",
  viewer_sample: "Sample viewers",
  commercial_catalog: "Commercial catalogs",
}

export const DATASET_ACCESS_LABELS: Readonly<Record<DatasetAccess, string>> = {
  open: "Open",
  gated: "Gated",
  public_subset: "Public subset",
  sample_demo: "Sample or demo",
  commercial: "Commercial",
  credential_dependent: "Credentials required",
  rolling: "Rolling release",
  provisional: "Provisional",
}

export const DATASET_PROVENANCE_LABELS: Readonly<Record<DatasetProvenance, string>> = {
  first_party: "First party",
  official_companion: "Official companion",
  community_derivative: "Community derivative",
  anonymous_release: "Anonymous release",
}

export const DATASET_SURFACE_KIND_LABELS: Readonly<Record<DatasetSurface["kind"], string>> = {
  benchmark_page: "Benchmark page",
  dataset: "Dataset",
  repository: "Repository",
  sample_viewer: "Sample viewer",
  leaderboard: "Leaderboard",
  environment: "Environment",
  catalog: "Catalog",
  download: "Download",
}
