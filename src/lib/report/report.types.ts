export type ReportStatus = "draft" | "reviewing" | "approved" | "published" | "archived";

export type SourceStatus = "available" | "missing" | "partial";

export type SourceType =
  | "session_notes"
  | "sprint_log"
  | "tasks"
  | "assessment"
  | "commitments"
  | "parent_feedback"
  | "coach_notes"
  | "ai_output"
  | "goals";

export type SourcePriority = "required" | "optional" | "recommended";

export type VersionStatus = "created" | "edited" | "approved" | "published" | "shared" | "viewed";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface ReportSource {
  id: string;
  title: string;
  status: SourceStatus;
  priority: SourcePriority;
  description: string;
  isRequired: boolean;
  isMissing: boolean;
  sourceType: SourceType;
}

export interface ReportConfidence {
  confidence: number;
  missingSources: string[];
  warnings: string[];
  suggestions: string[];
  readiness: number;
}

export interface ReportVersion {
  id: string;
  createdAt: string;
  createdBy: string;
  status: VersionStatus;
  version: number;
  publishedAt: string | null;
  publishedFor: string | null;
  timelineDescription: string;
}

export interface ReportSummarySection {
  label: string;
  content: string;
}

export interface SprintFocusItem {
  title: string;
  detail: string;
}

export interface ReportMetadata {
  completionPercent: number;
  readingTimeMinutes: number;
  lastGeneratedAt: string;
  reportStatus: ReportStatus;
  draftLabel: string;
  reviewLabel: string;
}

export interface ReportActions {
  generateDraft: () => Promise<{ ok: boolean }>;
  approveReport: () => Promise<{ ok: boolean }>;
  publishReport: () => Promise<{ ok: boolean }>;
  regenerateAI: () => Promise<{ ok: boolean }>;
  saveDraft: () => Promise<{ ok: boolean }>;
  shareReport: () => Promise<{ ok: boolean; url?: string }>;
}

export interface ReportWorkspaceData {
  report: {
    id: string;
    title: string;
    metadata: ReportMetadata;
    summary: ReportSummarySection[];
    strengths: string[];
    challenges: string[];
    coachNotes: string;
    sprintFocus: SprintFocusItem[];
    versions: ReportVersion[];
  };
  student: {
    id: string;
    name: string;
  };
  session: {
    id: string;
    date: string;
  };
  assessment: {
    id: string | null;
    title: string | null;
  };
  goals: {
    items: Array<{ id: string; title: string; progress: number | null }>;
  };
  sprint: {
    id: string;
    name: string;
    goal: string;
  };
  tasks: {
    items: Array<{ id: string; title: string; status: string }>;
  };
  recommendations: {
    items: Array<{ id: string; title: string; detail: string }>;
  };
  sources: {
    items: ReportSource[];
  };
  confidence: ReportConfidence;
  publishing: {
    readiness: number;
    readinessLabel: string;
  };
  history: {
    versions: ReportVersion[];
  };
}
