import { fetchSessions } from "@/lib/notion/queries.server";
import {
  extractDate,
  extractRelationIds,
  extractSelect,
  extractTitle,
  extractRichText,
} from "@/lib/notion/transformers";
import { getStudentProfileData } from "@/lib/students/profile.server";
import type {
  SessionContext,
  SessionContextStudent,
  SessionContextSession,
  SessionContextSessionNotes,
  SessionContextPreviousSession,
  SessionContextGoal,
  SessionContextGoals,
  SessionContextSprint,
  SessionContextTask,
  SessionContextTasks,
  SessionContextAssessment,
  SessionContextRecommendation,
  SessionContextRecommendations,
  SessionContextMetadata,
} from "./context.types";

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

function buildStudent(
  profile: Awaited<ReturnType<typeof getStudentProfileData>>
): SessionContextStudent {
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
): SessionContextSession {
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
): SessionContextSessionNotes {
  const p = sessionPage.properties;
  return {
    winsAndProgress: extractRichText(p, "Wins & Progress"),
    challengesAndObstacles: extractRichText(p, "Challenges & Obstacles"),
    coreNotes: extractRichText(p, "Core Notes"),
    commitments: extractRichText(p, "Commitments"),
  };
}

function buildPreviousSession(
  sessions: Array<{ id: string; properties: Record<string, unknown> }>,
  currentSessionId: string,
  studentId: string
): SessionContextPreviousSession | null {
  const studentSessions = sessions
    .filter((s) => {
      const ids = extractRelationIds(s.properties, "Student");
      return ids.includes(studentId);
    })
    .filter((s) => s.id !== currentSessionId)
    .sort((a, b) => {
      const dateA = extractDate(a.properties, "Session Date");
      const dateB = extractDate(b.properties, "Session Date");
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  if (studentSessions.length === 0) return null;

  const prev = studentSessions[0];
  const p = prev.properties;

  return {
    id: prev.id,
    title: extractTitle(p, "Session") || "Previous Session",
    date: extractDate(p, "Session Date"),
    winsAndProgress: extractRichText(p, "Wins & Progress"),
    challengesAndObstacles: extractRichText(p, "Challenges & Obstacles"),
    coreNotes: extractRichText(p, "Core Notes"),
    commitments: extractRichText(p, "Commitments"),
  };
}

function buildGoals(
  profile: Awaited<ReturnType<typeof getStudentProfileData>>
): SessionContextGoals {
  const active: SessionContextGoal[] = [];
  const completed: SessionContextGoal[] = [];

  for (const g of profile.goals) {
    const goal: SessionContextGoal = {
      id: g.id,
      title: g.title,
      type: g.type,
      status: g.status,
      targetDate: g.date,
      progressPercent: g.progress,
    };

    if (isTaskDone(g.status)) {
      completed.push(goal);
    } else {
      active.push(goal);
    }
  }

  return { active, completed };
}

function buildSprint(
  profile: Awaited<ReturnType<typeof getStudentProfileData>>
): SessionContextSprint | null {
  const activeSprint = profile.sprints.find(
    (s) => (s.status ?? "").toLowerCase() === "active"
  );

  if (!activeSprint) return null;

  return {
    id: activeSprint.id,
    title: activeSprint.title,
    status: activeSprint.status,
    focus: activeSprint.detail,
    endDate: activeSprint.date,
    progressPercent: activeSprint.progress,
  };
}

function buildTasks(
  profile: Awaited<ReturnType<typeof getStudentProfileData>>
): SessionContextTasks {
  const overdue: SessionContextTask[] = [];
  const upcoming: SessionContextTask[] = [];
  const completed: SessionContextTask[] = [];

  for (const t of profile.tasks) {
    const task: SessionContextTask = {
      id: t.id,
      title: t.title,
      type: t.type,
      status: t.status,
      dueDate: t.date,
      isOverdue: !isTaskDone(t.status) && isPast(t.date),
    };

    if (isTaskDone(t.status)) {
      completed.push(task);
    } else if (isPast(t.date)) {
      overdue.push(task);
    } else {
      upcoming.push(task);
    }
  }

  return { overdue, upcoming, completed };
}

function buildAssessment(
  profile: Awaited<ReturnType<typeof getStudentProfileData>>
): SessionContextAssessment | null {
  const assessments = profile.assessments
    .filter((a) => a.date)
    .sort(
      (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
    );

  if (assessments.length === 0) return null;

  const a = assessments[0];
  return {
    id: a.id,
    title: a.title,
    type: a.type,
    date: a.date,
    score: a.score,
    result: a.result,
  };
}

function buildRecommendations(
  profile: Awaited<ReturnType<typeof getStudentProfileData>>
): SessionContextRecommendations {
  const pendingHighRisk: SessionContextRecommendation[] = [];
  const pendingOther: SessionContextRecommendation[] = [];
  const reviewed: SessionContextRecommendation[] = [];

  for (const r of profile.aiRecommendations) {
    const rec: SessionContextRecommendation = {
      id: r.id,
      title: r.title,
      risk: r.detail,
      reviewStatus: r.status,
      generatedAt: r.generatedAt,
    };

    if (isPendingReview(r.status) || isHighRisk(r.detail)) {
      if (isHighRisk(r.detail)) {
        pendingHighRisk.push(rec);
      } else {
        pendingOther.push(rec);
      }
    } else {
      reviewed.push(rec);
    }
  }

  return { pendingHighRisk, pendingOther, reviewed };
}

export async function buildSessionContext(
  sessionId: string
): Promise<SessionContext> {
  const sessionsResult = await fetchSessions();
  if (!sessionsResult.ok) {
    throw new Error(`Failed to fetch sessions: ${sessionsResult.message}`);
  }

  const sessionPage = sessionsResult.data.find((s) => s.id === sessionId);
  if (!sessionPage) {
    throw new Error(`Session not found: ${sessionId}`);
  }

  const studentIds = extractRelationIds(sessionPage.properties, "Student");
  const studentId = studentIds[0];

  if (!studentId) {
    throw new Error(`No student associated with session: ${sessionId}`);
  }

  const profile = await getStudentProfileData(studentId);

  const student = buildStudent(profile);
  const session = buildSession(sessionPage);
  const sessionNotes = buildSessionNotes(sessionPage);
  const previousSession = buildPreviousSession(
    sessionsResult.data,
    sessionId,
    studentId
  );
  const goals = buildGoals(profile);
  const sprint = buildSprint(profile);
  const tasks = buildTasks(profile);
  const assessment = buildAssessment(profile);
  const recommendations = buildRecommendations(profile);

  const metadata: SessionContextMetadata = {
    sessionId,
    studentId,
    builtAt: new Date().toISOString(),
    dataAvailability: {
      student: true,
      session: true,
      previousSession: previousSession !== null,
      goals: goals.active.length > 0 || goals.completed.length > 0,
      sprint: sprint !== null,
      tasks:
        tasks.overdue.length > 0 ||
        tasks.upcoming.length > 0 ||
        tasks.completed.length > 0,
      assessment: assessment !== null,
      recommendations:
        recommendations.pendingHighRisk.length > 0 ||
        recommendations.pendingOther.length > 0 ||
        recommendations.reviewed.length > 0,
    },
  };

  return {
    student,
    session,
    sessionNotes,
    previousSession,
    goals,
    sprint,
    tasks,
    assessment,
    recommendations,
    metadata,
  };
}
