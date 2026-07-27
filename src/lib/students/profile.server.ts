import {
  fetchAIRecommendations,
  fetchAssessments,
  fetchGoals,
  fetchSessions,
  fetchSprints,
  fetchStudents,
  fetchTasks,
  type RawNotionPage,
} from "@/lib/notion/queries.server";
import {
  extractCheckbox,
  extractDate,
  extractFormulaString,
  extractNumber,
  extractRelationIds,
  extractRichText,
  extractSelect,
  extractStatus,
  extractTitle,
} from "@/lib/notion/transformers";

export interface StudentProfileRecord {
  id: string;
  title: string;
  status: string | null;
  date: string | null;
  detail: string | null;
}

export interface StudentProfileData {
  student: {
    id: string;
    name: string;
    studentId: string;
    educationLevel: string | null;
    status: string | null;
    attentionStatus: string | null;
    attentionReason: string | null;
  };
  goals: StudentProfileRecord[];
  sprints: StudentProfileRecord[];
  sessions: StudentProfileRecord[];
  assessments: StudentProfileRecord[];
  tasks: StudentProfileRecord[];
  aiRecommendations: StudentProfileRecord[];
  summary: {
    openGoals: number;
    activeSprints: number;
    upcomingSessions: number;
    overdueTasks: number;
    pendingAIRecommendations: number;
  };
}

function belongsToStudent(page: RawNotionPage, studentId: string): boolean {
  return extractRelationIds(page.properties, "Student").includes(studentId);
}

export async function getStudentProfileData(
  studentId: string,
): Promise<StudentProfileData> {
  const [
    studentsResult,
    goalsResult,
    sprintsResult,
    sessionsResult,
    assessmentsResult,
    tasksResult,
    aiResult,
  ] = await Promise.all([
    fetchStudents(),
    fetchGoals(),
    fetchSprints(),
    fetchSessions(),
    fetchAssessments(),
    fetchTasks(),
    fetchAIRecommendations(),
  ]);

  if (!studentsResult.ok) {
    throw new Error(`Students could not be loaded: ${studentsResult.message}`);
  }

  const studentPage = studentsResult.data.find(
    (page) => page.id === studentId,
  );

  if (!studentPage) {
    throw new Error("Student not found.");
  }

  const related = (result: typeof goalsResult): RawNotionPage[] =>
    result.ok
      ? result.data.filter((page) => belongsToStudent(page, studentId))
      : [];

  const goals = related(goalsResult);
  const sprints = related(sprintsResult);
  const sessions = related(sessionsResult);
  const assessments = related(assessmentsResult);
  const tasks = related(tasksResult);
  const aiRecommendations = related(aiResult);

  const p = studentPage.properties;

  return {
    student: {
      id: studentPage.id,
      name: extractTitle(p, "Student") || "Unknown student",
      studentId: extractRichText(p, "Student ID") || "—",
      educationLevel: extractSelect(p, "Education Level"),
      status: extractSelect(p, "Status") ?? extractStatus(p, "Status"),
      attentionStatus: extractFormulaString(p, "Attention Status"),
      attentionReason: extractFormulaString(p, "Attention Reason"),
    },

    goals: goals.map((page) => ({
      id: page.id,
      title: extractTitle(page.properties, "Goal") || "Untitled goal",
      status: extractSelect(page.properties, "Status"),
      date: extractDate(page.properties, "Target Date"),
      detail: extractSelect(page.properties, "Goal Type"),
    })),

    sprints: sprints.map((page) => ({
      id: page.id,
      title: extractTitle(page.properties, "Sprint") || "Untitled sprint",
      status: extractSelect(page.properties, "Status"),
      date: extractDate(page.properties, "End Date"),
      detail: extractRichText(page.properties, "Focus") || null,
    })),

    sessions: sessions.map((page) => ({
      id: page.id,
      title: extractTitle(page.properties, "Session") || "Untitled session",
      status: extractSelect(page.properties, "Status"),
      date: extractDate(page.properties, "Session Date"),
      detail: extractSelect(page.properties, "Session Type"),
    })),

    assessments: assessments.map((page) => {
      const score = extractNumber(page.properties, "Score");
      const maximumScore = extractNumber(page.properties, "Maximum Score");

      return {
        id: page.id,
        title:
          extractTitle(page.properties, "Assessment") ||
          "Untitled assessment",
        status: extractSelect(page.properties, "Assessment Type"),
        date: extractDate(page.properties, "Assessment Date"),
        detail:
          score !== null && maximumScore !== null
            ? `${score}/${maximumScore}`
            : extractRichText(page.properties, "Result") || null,
      };
    }),

    tasks: tasks.map((page) => ({
      id: page.id,
      title: extractTitle(page.properties, "Task") || "Untitled task",
      status:
        extractSelect(page.properties, "Status") ??
        extractStatus(page.properties, "Status"),
      date: extractDate(page.properties, "Due Date"),
      detail: extractSelect(page.properties, "Task Type"),
    })),

    aiRecommendations: aiRecommendations.map((page) => ({
      id: page.id,
      title:
        extractTitle(page.properties, "Recommendation") ||
        "Untitled recommendation",
      status: extractSelect(page.properties, "Review Status"),
      date: extractDate(page.properties, "Generated At"),
      detail: extractSelect(page.properties, "Risk"),
    })),

    summary: {
      openGoals: goals.filter((page) =>
        extractCheckbox(page.properties, "Open"),
      ).length,

      activeSprints: sprints.filter((page) =>
        extractCheckbox(page.properties, "Active Flag"),
      ).length,

      upcomingSessions: sessions.filter((page) =>
        extractCheckbox(page.properties, "Upcoming"),
      ).length,

      overdueTasks: tasks.filter((page) =>
        extractCheckbox(page.properties, "Is Overdue"),
      ).length,

      pendingAIRecommendations: aiRecommendations.filter((page) =>
        extractCheckbox(page.properties, "Pending Flag"),
      ).length,
    },
  };
}
