import { fetchSessions } from "@/lib/notion/queries.server";
import {
  extractDate,
  extractRelationIds,
  extractSelect,
  extractTitle,
  extractCheckbox,
  extractRichText,
} from "@/lib/notion/transformers";
import {
  getStudentProfileData,
  type StudentProfileData,
  type StudentProfileRecord,
} from "@/lib/students/profile.server";
import { createNotionClient, isNotionClientError, APIResponseError } from "@/lib/notion/client.server";
import { getNotionConfig } from "@/lib/notion/config.server";

export interface SessionWorkspaceSession {
  id: string;
  title: string;
  status: string | null;
  date: string | null;
  type: string | null;
  upcoming: boolean;
  winsAndProgress: string;
  challengesAndObstacles: string;
  coreNotes: string;
  commitments: string;
}

export interface SessionWorkspaceContext {
  activeGoal: StudentProfileRecord | null;
  activeSprint: StudentProfileRecord | null;
  recentAssessment: StudentProfileRecord | null;
  overdueTasks: StudentProfileRecord[];
  upcomingTasks: StudentProfileRecord[];
  otherTasks: StudentProfileRecord[];
  pendingHighRiskAI: StudentProfileRecord[];
  otherAI: StudentProfileRecord[];
}

export interface SessionWorkspaceData {
  session: SessionWorkspaceSession;
  profile: StudentProfileData;
  context: SessionWorkspaceContext;
}

export type SessionWorkspaceResult =
  | { ok: true; data: SessionWorkspaceData }
  | { ok: false; reason: "session_not_found" | "student_missing" | "load_failed"; message: string };

const DONE_STATUSES = new Set([
  "done",
  "completed",
  "achieved",
  "closed",
  "cancelled",
  "canceled",
]);
const ACTIVE_STATUSES = new Set(["active", "in progress", "ongoing"]);

function isTaskDone(status: string | null): boolean {
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

function isHighRisk(detail: string | null): boolean {
  const s = (detail ?? "").toLowerCase();
  return s.includes("high") || s.includes("critical");
}

function isPendingReview(status: string | null): boolean {
  const s = (status ?? "").toLowerCase();
  return s.includes("pending") || s === "new" || s === "open";
}

export async function getSessionWorkspaceData(
  sessionId: string,
): Promise<SessionWorkspaceResult> {
  const sessionsResult = await fetchSessions();
  if (!sessionsResult.ok) {
    return {
      ok: false,
      reason: "load_failed",
      message: sessionsResult.message,
    };
  }

  const sessionPage = sessionsResult.data.find((p) => p.id === sessionId);
  if (!sessionPage) {
    return {
      ok: false,
      reason: "session_not_found",
      message: "Görüşme bulunamadı.",
    };
  }

  const p = sessionPage.properties;
  const studentIds = extractRelationIds(p, "Student");
  const studentId = studentIds[0];

  if (!studentId) {
    return {
      ok: false,
      reason: "student_missing",
      message: "Bu görüşmeye bağlı bir öğrenci bulunamadı.",
    };
  }

  let profile: StudentProfileData;
  try {
    profile = await getStudentProfileData(studentId);
  } catch (error) {
    return {
      ok: false,
      reason: "load_failed",
      message:
        error instanceof Error
          ? error.message
          : "Öğrenci profili yüklenemedi.",
    };
  }

  const session: SessionWorkspaceSession = {
    id: sessionPage.id,
    title: extractTitle(p, "Session") || "Görüşme",
    status: extractSelect(p, "Status"),
    date: extractDate(p, "Session Date"),
    type: extractSelect(p, "Session Type"),
    upcoming: extractCheckbox(p, "Upcoming"),
    winsAndProgress: extractRichText(p, "Wins & Progress"),
    challengesAndObstacles: extractRichText(p, "Challenges & Obstacles"),
    coreNotes: extractRichText(p, "Core Notes"),
    commitments: extractRichText(p, "Commitments"),
  };

  const activeGoal =
    profile.goals.find((g) => !isTaskDone(g.status)) ?? null;

  const activeSprint =
    profile.sprints.find((s) =>
      ACTIVE_STATUSES.has((s.status ?? "").toLowerCase()),
    ) ?? null;

  const recentAssessment =
    [...profile.assessments]
      .filter((a) => a.date)
      .sort(
        (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime(),
      )[0] ?? null;

  const activeTasks = profile.tasks.filter((t) => !isTaskDone(t.status));
  const overdueTasks = activeTasks.filter((t) => isPast(t.date));
  const upcomingTasks = activeTasks
    .filter((t) => !isPast(t.date) && t.date)
    .sort(
      (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime(),
    );
  const otherTasks = activeTasks.filter((t) => !t.date);

  const pendingHighRiskAI = profile.aiRecommendations.filter(
    (r) => isPendingReview(r.status) || isHighRisk(r.detail),
  );
  const pendingSet = new Set(pendingHighRiskAI.map((r) => r.id));
  const otherAI = profile.aiRecommendations.filter(
    (r) => !pendingSet.has(r.id),
  );

  return {
    ok: true,
    data: {
      session,
      profile,
      context: {
        activeGoal,
        activeSprint,
        recentAssessment,
        overdueTasks,
        upcomingTasks,
        otherTasks,
        pendingHighRiskAI,
        otherAI,
      },
    },
  };
}

export interface UpdateSessionNotesInput {
  sessionId: string;
  winsAndProgress: string;
  challengesAndObstacles: string;
  coreNotes: string;
  commitments: string;
}

export type UpdateSessionNotesResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "session_not_found" | "api_error" | "unknown" };

const USER_ERROR_MESSAGE = "Görüşme notları kaydedilemedi.";

function toRichTextArray(value: string): Array<{ type: "text"; text: { content: string } }> {
  if (value.length === 0) return [];
  return [{ type: "text" as const, text: { content: value } }];
}

async function validateSessionBelongsToSessionsDb(
  sessionId: string,
): Promise<boolean> {
  const clientResult = createNotionClient();
  if (!clientResult.ok) return false;

  const sessionsDbId = getNotionConfig().sessionsDatabaseId;
  if (!sessionsDbId) return false;

  try {
    const page = await clientResult.client.pages.retrieve({ page_id: sessionId });
    const parent = "parent" in page ? page.parent : undefined;
    if (!parent || parent.type !== "database_id") return false;
    return "database_id" in parent && parent.database_id === sessionsDbId;
  } catch (error) {
    if (isNotionClientError(error) && error instanceof APIResponseError) {
      if (error.status === 404) return false;
      console.error(`[notion] validateSessionBelongsToSessionsDb API error: status=${error.status} code=${error.code}`);
    } else {
      console.error("[notion] validateSessionBelongsToSessionsDb failed:", error);
    }
    return false;
  }
}

export async function updateSessionNotes(
  input: UpdateSessionNotesInput,
): Promise<UpdateSessionNotesResult> {
  const clientResult = createNotionClient();
  if (!clientResult.ok) {
    console.error("[notion] updateSessionNotes: client not configured");
    return { ok: false, reason: "not_configured" };
  }

  const isValid = await validateSessionBelongsToSessionsDb(input.sessionId);
  if (!isValid) {
    return { ok: false, reason: "session_not_found" };
  }

  try {
    await clientResult.client.pages.update({
      page_id: input.sessionId,
      properties: {
        "Wins & Progress": {
          rich_text: toRichTextArray(input.winsAndProgress),
        },
        "Challenges & Obstacles": {
          rich_text: toRichTextArray(input.challengesAndObstacles),
        },
        "Core Notes": {
          rich_text: toRichTextArray(input.coreNotes),
        },
        Commitments: {
          rich_text: toRichTextArray(input.commitments),
        },
      },
    });

    return { ok: true };
  } catch (error) {
    if (isNotionClientError(error) && error instanceof APIResponseError) {
      console.error(`[notion] updateSessionNotes API error: status=${error.status} code=${error.code}`);
    } else {
      console.error("[notion] updateSessionNotes failed:", error);
    }
    return { ok: false, reason: "api_error" };
  }
}
