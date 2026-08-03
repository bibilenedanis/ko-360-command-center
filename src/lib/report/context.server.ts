import { fetchSessions } from "@/lib/notion/queries.server";
import {
  extractDate,
  extractRelationIds,
  extractSelect,
  extractTitle,
  extractCheckbox,
  extractRichText,
  extractNumber,
} from "@/lib/notion/transformers";
import {
  getStudentProfileData,
  type StudentProfileRecord,
} from "@/lib/students/profile.server";
import type {
  ReportContext,
  ReportContextStudent,
  ReportContextSession,
  ReportContextSessionNotes,
  ReportContextAssessment,
  ReportContextGoals,
  ReportContextGoal,
  ReportContextSprint,
  ReportContextTasks,
  ReportContextTask,
  ReportContextRecommendations,
  ReportContextRecommendation,
  ReportContextCoachNotes,
  ReportContextParentFeedback,
  ReportContextPreviousReports,
  ReportContextMetadata,
} from "./context.types";

// ============================================================================
// Helper Functions
// ============================================================================

function isTaskDone(status: string | null): boolean {
  const DONE_STATUSES = new Set([
    "done",
    "completed",
    "achieved",
    "closed",
    "cancelled",
    "canceled",
  ]);
  return DONE_STATUSES.has((status ?? "").toLowerCase());
}

function isTaskInProgress(status: string | null): boolean {
  const ACTIVE_STATUSES = new Set(["active", "in progress", "ongoing"]);
  return ACTIVE_STATUSES.has((status ?? "").toLowerCase());
}

function isPast(iso: string | null): boolean {
  if (!iso) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

function isHighRisk(risk: string | null): boolean {
  const s = (risk ?? "").toLowerCase();
  return s.includes("high") || s.includes("critical");
}

function isPendingReview(status: string | null): boolean {
  const s = (status ?? "").toLowerCase();
  return s.includes("pending") || s === "new" || s === "open";
}

// ============================================================================
// Builder Functions
// ============================================================================

function buildStudent(
  profile: Awaited<ReturnType<typeof getStudentProfileData>>
): ReportContextStudent {
  return {
    id: profile.student.id,
    name: profile.student.name,
    studentId: profile.student.studentId,
    educationLevel: profile.student.educationLevel,
    status: profile.student.status,
    attentionStatus: profile.student.attentionStatus,
    attentionReason: profile.student.attentionReason,
  };
}

function buildSession(
  sessionPage: { id: string; properties: Record<string, unknown> }
): ReportContextSession {
  const p = sessionPage.properties;
  return {
    id: sessionPage.id,
    title: extractTitle(p, "Session") || "Untitled Session",
    date: extractDate(p, "Session Date"),
    type: extractSelect(p, "Session Type"),
    status: extractSelect(p, "Status"),
  };
}

function buildSessionNotes(
  sessionPage: { id: string; properties: Record<string, unknown> }
): ReportContextSessionNotes {
  const p = sessionPage.properties;
  return {
    winsAndProgress: extractRichText(p, "Wins & Progress"),
    challengesAndObstacles: extractRichText(p, "Challenges & Obstacles"),
    coreNotes: extractRichText(p, "Core Notes"),
    commitments: extractRichText(p, "Commitments"),
  };
}

function buildAssessment(
  assessments: StudentProfileRecord[]
): ReportContextAssessment | null {
  if (assessments.length === 0) return null;

  // Get the most recent assessment
  const sorted = [...assessments]
    .filter((a) => a.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  if (sorted.length === 0) return null;

  const latest = sorted[0];
  return {
    id: latest.id,
    title: latest.title,
    type: latest.status,
    date: latest.date,
    score: latest.detail,
    result: null, // TODO: Extract from assessment properties if available
  };
}

function buildGoals(
  goals: StudentProfileRecord[]
): ReportContextGoals {
  const active: ReportContextGoal[] = [];
  const completed: ReportContextGoal[] = [];

  for (const goal of goals) {
    const mapped: ReportContextGoal = {
      id: goal.id,
      title: goal.title,
      type: goal.detail,
      status: goal.status,
      targetDate: goal.date,
      progressPercent: goal.progress ?? null,
    };

    if (isTaskDone(goal.status)) {
      completed.push(mapped);
    } else {
      active.push(mapped);
    }
  }

  return { active, completed };
}

function buildSprint(
  sprints: StudentProfileRecord[]
): ReportContextSprint | null {
  // Find the active sprint
  const activeSprint = sprints.find((s) => isTaskInProgress(s.status));

  if (!activeSprint) return null;

  return {
    id: activeSprint.id,
    title: activeSprint.title,
    status: activeSprint.status,
    focus: activeSprint.detail,
    endDate: activeSprint.date,
    progressPercent: activeSprint.progress ?? null,
  };
}

function buildTasks(
  tasks: StudentProfileRecord[]
): ReportContextTasks {
  const overdue: ReportContextTask[] = [];
  const upcoming: ReportContextTask[] = [];
  const completed: ReportContextTask[] = [];

  for (const task of tasks) {
    const mapped: ReportContextTask = {
      id: task.id,
      title: task.title,
      type: task.detail,
      status: task.status,
      dueDate: task.date,
      isOverdue: !isTaskDone(task.status) && isPast(task.date),
    };

    if (isTaskDone(task.status)) {
      completed.push(mapped);
    } else if (isPast(task.date)) {
      overdue.push(mapped);
    } else {
      upcoming.push(mapped);
    }
  }

  // Sort upcoming tasks by due date
  upcoming.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return { overdue, upcoming, completed };
}

function buildRecommendations(
  recommendations: StudentProfileRecord[]
): ReportContextRecommendations {
  const pendingHighRisk: ReportContextRecommendation[] = [];
  const pendingOther: ReportContextRecommendation[] = [];
  const reviewed: ReportContextRecommendation[] = [];

  for (const rec of recommendations) {
    const mapped: ReportContextRecommendation = {
      id: rec.id,
      title: rec.title,
      risk: rec.detail,
      reviewStatus: rec.status,
      generatedAt: rec.date,
    };

    if (isPendingReview(rec.status)) {
      if (isHighRisk(rec.detail)) {
        pendingHighRisk.push(mapped);
      } else {
        pendingOther.push(mapped);
      }
    } else {
      reviewed.push(mapped);
    }
  }

  return { pendingHighRisk, pendingOther, reviewed };
}

function buildCoachNotes(): ReportContextCoachNotes {
  return {
    available: false,
    reason: "Coach notes database not yet implemented. Requires Notion Coach Notes database integration.",
    notes: null,
  };
}

function buildParentFeedback(): ReportContextParentFeedback {
  return {
    available: false,
    reason: "Parent feedback database not yet implemented. Requires Notion Parent Feedback database integration.",
    feedback: null,
  };
}

function buildPreviousReports(): ReportContextPreviousReports {
  return {
    available: false,
    reason: "Previous reports database not yet implemented. Requires Notion Reports database integration.",
    reports: null,
  };
}

function buildMetadata(
  sessionId: string,
  studentId: string,
  dataAvailability: ReportContextMetadata["dataAvailability"]
): ReportContextMetadata {
  return {
    sessionId,
    studentId,
    builtAt: new Date().toISOString(),
    dataAvailability,
  };
}

// ============================================================================
// Main Builder Function
// ============================================================================

export async function buildReportContext(
  sessionId: string
): Promise<ReportContext> {
  // 1. Fetch session data
  const sessionsResult = await fetchSessions();
  if (!sessionsResult.ok) {
    throw new Error(`Failed to fetch sessions: ${sessionsResult.message}`);
  }

  const sessionPage = sessionsResult.data.find((p) => p.id === sessionId);
  if (!sessionPage) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  // 2. Extract student ID from session
  const studentIds = extractRelationIds(sessionPage.properties, "Student");
  const studentId = studentIds[0];
  if (!studentId) {
    throw new Error(`No student associated with session: ${sessionId}`);
  }

  // 3. Fetch student profile data
  const profile = await getStudentProfileData(studentId);

  // 4. Build all context sections
  const student = buildStudent(profile);
  const session = buildSession(sessionPage);
  const sessionNotes = buildSessionNotes(sessionPage);
  const assessment = buildAssessment(profile.assessments);
  const goals = buildGoals(profile.goals);
  const sprint = buildSprint(profile.sprints);
  const tasks = buildTasks(profile.tasks);
  const recommendations = buildRecommendations(profile.aiRecommendations);

  // 5. Build placeholders for unimplemented data
  const coachNotes = buildCoachNotes();
  const parentFeedback = buildParentFeedback();
  const previousReports = buildPreviousReports();

  // 6. Build metadata with data availability flags
  const dataAvailability: ReportContextMetadata["dataAvailability"] = {
    student: true,
    session: true,
    sessionNotes: true,
    assessment: assessment !== null,
    goals: goals.active.length > 0 || goals.completed.length > 0,
    sprint: sprint !== null,
    tasks: tasks.overdue.length > 0 || tasks.upcoming.length > 0 || tasks.completed.length > 0,
    recommendations: recommendations.pendingHighRisk.length > 0 || 
                     recommendations.pendingOther.length > 0 || 
                     recommendations.reviewed.length > 0,
    coachNotes: false,
    parentFeedback: false,
    previousReports: false,
  };

  const metadata = buildMetadata(sessionId, studentId, dataAvailability);

  // 7. Assemble final ReportContext
  return {
    student,
    session,
    sessionNotes,
    assessment,
    goals,
    sprint,
    tasks,
    recommendations,
    coachNotes,
    parentFeedback,
    previousReports,
    metadata,
  };
}
