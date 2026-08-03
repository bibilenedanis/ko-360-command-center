import type { SessionContext } from "./context.types";
import type { PromptDocument, PromptMetadata, PromptSection } from "@/lib/report/prompt.types";
import { PROMPT_TEMPLATE_VERSION } from "@/lib/report/prompt.templates";
import { getSessionBriefSchemaJson } from "./brief.schema";

export function buildSessionBriefPrompt(context: SessionContext): PromptDocument {
  const sections: PromptSection[] = [
    {
      id: "role",
      title: "Role & Context",
      content: buildRoleSection(context),
      order: 1,
    },
    {
      id: "student",
      title: "Student Profile",
      content: buildStudentSection(context),
      order: 2,
    },
    {
      id: "current-session",
      title: "Current Session",
      content: buildCurrentSessionSection(context),
      order: 3,
    },
    {
      id: "previous-session",
      title: "Previous Session",
      content: buildPreviousSessionSection(context),
      order: 4,
    },
    {
      id: "goals",
      title: "Goals",
      content: buildGoalsSection(context),
      order: 5,
    },
    {
      id: "sprint",
      title: "Sprint Data",
      content: buildSprintSection(context),
      order: 6,
    },
    {
      id: "tasks",
      title: "Tasks",
      content: buildTasksSection(context),
      order: 7,
    },
    {
      id: "assessment",
      title: "Assessment Data",
      content: buildAssessmentSection(context),
      order: 8,
    },
    {
      id: "recommendations",
      title: "AI Recommendations",
      content: buildRecommendationsSection(context),
      order: 9,
    },
    {
      id: "data-availability",
      title: "Data Availability",
      content: buildDataAvailabilitySection(context),
      order: 10,
    },
    {
      id: "output-instructions",
      title: "Output Instructions",
      content: buildOutputSection(),
      order: 11,
    },
  ];

  sections.sort((a, b) => a.order - b.order);

  const system = buildSystemSection();
  const userSections = sections.map((section) => section.content);
  const user = userSections.join("\n\n---\n\n");
  const metadata = buildMetadata(context, system, user, sections);

  return {
    system,
    user,
    metadata,
    sections,
  };
}

function buildSystemSection(): string {
  return `You are an expert educational coach assistant for Koç360, a coaching platform that helps students achieve their academic and personal goals.

Your role is to generate structured coaching briefings that help coaches prepare for and conduct effective coaching sessions.

CRITICAL RULES:
- Never invent facts or make assumptions beyond the provided data
- Use ONLY the information explicitly provided in the context
- Never diagnose the student with any medical or psychological conditions
- Never label the student (e.g., "lazy", "gifted", "problematic")
- If information is missing or insufficient, explicitly state: "Insufficient evidence to determine..."
- Write like an educational coach, NOT like a psychologist or therapist
- Be constructive and solution-focused
- Be objective and evidence-based
- Highlight what requires immediate attention
- Identify opportunities for growth and progress

TONE:
- Professional yet approachable
- Encouraging but realistic
- Evidence-based and specific
- Action-oriented
- Respectful of the student's autonomy and dignity`;
}

function buildRoleSection(context: SessionContext): string {
  const studentName = context.student.name;
  const sessionDate = context.session.date || "Unknown date";

  return `COACHING SESSION BRIEFING:

You are preparing a coaching briefing for an upcoming session with ${studentName}.
Session Date: ${sessionDate}

This briefing will help the coach understand:
- What happened since the previous session
- What requires attention
- What improved
- What became worse
- What should be discussed today
- Which coaching actions are recommended`;
}

function buildStudentSection(context: SessionContext): string {
  const { student } = context;

  let content = `STUDENT PROFILE:

Name: ${student.name}
Student ID: ${student.studentId}`;

  if (student.educationLevel) {
    content += `\nEducation Level: ${student.educationLevel}`;
  }

  if (student.status) {
    content += `\nStatus: ${student.status}`;
  }

  if (student.attentionStatus && student.attentionStatus !== "On Track") {
    content += `\n\nATTENTION REQUIRED: ${student.attentionStatus}`;
    if (student.attentionReason) {
      content += `\nReason: ${student.attentionReason}`;
    }
  }

  return content;
}

function buildCurrentSessionSection(context: SessionContext): string {
  const { session, sessionNotes } = context;

  let content = `CURRENT SESSION:

Title: ${session.title}
Date: ${session.date || "Unknown"}
Type: ${session.type || "Coaching"}`;

  if (sessionNotes.winsAndProgress) {
    content += `\n\nWins & Progress:\n${sessionNotes.winsAndProgress}`;
  }

  if (sessionNotes.challengesAndObstacles) {
    content += `\n\nChallenges & Obstacles:\n${sessionNotes.challengesAndObstacles}`;
  }

  if (sessionNotes.coreNotes) {
    content += `\n\nCore Notes:\n${sessionNotes.coreNotes}`;
  }

  if (sessionNotes.commitments) {
    content += `\n\nCommitments:\n${sessionNotes.commitments}`;
  }

  if (!sessionNotes.winsAndProgress && !sessionNotes.challengesAndObstacles && 
      !sessionNotes.coreNotes && !sessionNotes.commitments) {
    content += `\n\nNo session notes yet. This is the first session or notes have not been recorded.`;
  }

  return content;
}

function buildPreviousSessionSection(context: SessionContext): string {
  if (!context.previousSession) {
    return `PREVIOUS SESSION:

No previous session data available. This may be the first session or previous session data is not accessible.`;
  }

  const { previousSession } = context;

  let content = `PREVIOUS SESSION:

Title: ${previousSession.title}
Date: ${previousSession.date || "Unknown"}`;

  if (previousSession.winsAndProgress) {
    content += `\n\nWins & Progress:\n${previousSession.winsAndProgress}`;
  }

  if (previousSession.challengesAndObstacles) {
    content += `\n\nChallenges & Obstacles:\n${previousSession.challengesAndObstacles}`;
  }

  if (previousSession.coreNotes) {
    content += `\n\nCore Notes:\n${previousSession.coreNotes}`;
  }

  if (previousSession.commitments) {
    content += `\n\nCommitments Made:\n${previousSession.commitments}`;
  }

  return content;
}

function buildGoalsSection(context: SessionContext): string {
  const { goals } = context;

  if (goals.active.length === 0 && goals.completed.length === 0) {
    return `GOALS:

No goals data available for this student.`;
  }

  let content = `GOALS:\n\n`;

  if (goals.active.length > 0) {
    content += `Active Goals:\n`;
    goals.active.forEach((goal, index) => {
      content += `\n${index + 1}. ${goal.title}`;
      if (goal.type) content += `\n   Type: ${goal.type}`;
      if (goal.status) content += `\n   Status: ${goal.status}`;
      if (goal.targetDate) content += `\n   Target Date: ${goal.targetDate}`;
      if (goal.progressPercent !== null) content += `\n   Progress: ${goal.progressPercent}%`;
    });
  }

  if (goals.completed.length > 0) {
    content += `\n\nCompleted Goals:\n`;
    goals.completed.forEach((goal, index) => {
      content += `\n${index + 1}. ${goal.title}`;
      if (goal.type) content += `\n   Type: ${goal.type}`;
      if (goal.targetDate) content += `\n   Completed: ${goal.targetDate}`;
    });
  }

  return content;
}

function buildSprintSection(context: SessionContext): string {
  if (!context.sprint) {
    return `SPRINT DATA:

No sprint data available.`;
  }

  const { sprint } = context;

  let content = `CURRENT SPRINT:

Title: ${sprint.title}`;

  if (sprint.status) {
    content += `\nStatus: ${sprint.status}`;
  }

  if (sprint.focus) {
    content += `\nFocus: ${sprint.focus}`;
  }

  if (sprint.endDate) {
    content += `\nEnd Date: ${sprint.endDate}`;
  }

  if (sprint.progressPercent !== null) {
    content += `\nProgress: ${sprint.progressPercent}%`;
  }

  return content;
}

function buildTasksSection(context: SessionContext): string {
  const { tasks } = context;

  if (tasks.overdue.length === 0 && tasks.upcoming.length === 0 && tasks.completed.length === 0) {
    return `TASKS:

No tasks data available.`;
  }

  let content = `TASKS:\n\n`;

  if (tasks.overdue.length > 0) {
    content += `Overdue Tasks (${tasks.overdue.length}):\n`;
    tasks.overdue.forEach((task, index) => {
      content += `\n${index + 1}. ${task.title}`;
      if (task.type) content += ` [${task.type}]`;
      if (task.dueDate) content += ` - Due: ${task.dueDate}`;
    });
  }

  if (tasks.upcoming.length > 0) {
    content += `\n\nUpcoming Tasks (${tasks.upcoming.length}):\n`;
    tasks.upcoming.slice(0, 5).forEach((task, index) => {
      content += `\n${index + 1}. ${task.title}`;
      if (task.type) content += ` [${task.type}]`;
      if (task.dueDate) content += ` - Due: ${task.dueDate}`;
    });
    if (tasks.upcoming.length > 5) {
      content += `\n... and ${tasks.upcoming.length - 5} more`;
    }
  }

  if (tasks.completed.length > 0) {
    content += `\n\nRecently Completed Tasks (${tasks.completed.length}):\n`;
    tasks.completed.slice(0, 3).forEach((task, index) => {
      content += `\n${index + 1}. ${task.title}`;
      if (task.type) content += ` [${task.type}]`;
    });
  }

  return content;
}

function buildAssessmentSection(context: SessionContext): string {
  if (!context.assessment) {
    return `ASSESSMENT DATA:

No assessment data available for this student.`;
  }

  const { assessment } = context;

  let content = `LATEST ASSESSMENT:

Title: ${assessment.title}`;

  if (assessment.type) {
    content += `\nType: ${assessment.type}`;
  }

  if (assessment.date) {
    content += `\nDate: ${assessment.date}`;
  }

  if (assessment.score) {
    content += `\nScore: ${assessment.score}`;
  }

  if (assessment.result) {
    content += `\nResult: ${assessment.result}`;
  }

  return content;
}

function buildRecommendationsSection(context: SessionContext): string {
  const { recommendations } = context;

  if (
    recommendations.pendingHighRisk.length === 0 &&
    recommendations.pendingOther.length === 0 &&
    recommendations.reviewed.length === 0
  ) {
    return `AI RECOMMENDATIONS:

No AI recommendations available.`;
  }

  let content = `AI RECOMMENDATIONS:\n\n`;

  if (recommendations.pendingHighRisk.length > 0) {
    content += `High Priority Recommendations (${recommendations.pendingHighRisk.length}):\n`;
    recommendations.pendingHighRisk.forEach((rec, index) => {
      content += `\n${index + 1}. ${rec.title}`;
      if (rec.risk) content += ` [Risk: ${rec.risk}]`;
    });
  }

  if (recommendations.pendingOther.length > 0) {
    content += `\n\nOther Pending Recommendations (${recommendations.pendingOther.length}):\n`;
    recommendations.pendingOther.forEach((rec, index) => {
      content += `\n${index + 1}. ${rec.title}`;
      if (rec.risk) content += ` [Risk: ${rec.risk}]`;
    });
  }

  if (recommendations.reviewed.length > 0) {
    content += `\n\nRecently Reviewed Recommendations (${recommendations.reviewed.length}):\n`;
    recommendations.reviewed.slice(0, 3).forEach((rec, index) => {
      content += `\n${index + 1}. ${rec.title}`;
      if (rec.reviewStatus) content += ` - Status: ${rec.reviewStatus}`;
    });
  }

  return content;
}

function buildDataAvailabilitySection(context: SessionContext): string {
  const { dataAvailability } = context.metadata;

  const available: string[] = [];
  const missing: string[] = [];

  if (dataAvailability.student) available.push("Student Profile");
  if (dataAvailability.session) available.push("Current Session");
  if (dataAvailability.previousSession) available.push("Previous Session");
  if (dataAvailability.goals) available.push("Goals");
  if (dataAvailability.sprint) available.push("Sprint Data");
  if (dataAvailability.tasks) available.push("Tasks");
  if (dataAvailability.assessment) available.push("Assessment Data");
  if (dataAvailability.recommendations) available.push("AI Recommendations");

  if (!dataAvailability.previousSession) missing.push("Previous Session");
  if (!dataAvailability.assessment) missing.push("Assessment Data");
  if (!dataAvailability.recommendations) missing.push("AI Recommendations");

  let content = `DATA AVAILABILITY:\n\n`;
  content += `Available Data Sources (${available.length}):\n`;
  content += available.map((s) => `✓ ${s}`).join("\n");

  if (missing.length > 0) {
    content += `\n\nMissing Data Sources (${missing.length}):\n`;
    content += missing.map((s) => `✗ ${s}`).join("\n");
    content += `\n\nNote: When data sources are missing, base your analysis on available data only.`;
  }

  return content;
}

function buildOutputSection(): string {
  const schemaJson = getSessionBriefSchemaJson();

  return `OUTPUT INSTRUCTIONS:

Return ONLY valid JSON.

Do not wrap inside markdown.
Do not explain.
Do not add extra text.
Do not use code fences.
Do not include any text before or after the JSON object.

Output MUST match this schema exactly:

${schemaJson}

FIELD REQUIREMENTS:
- currentSituation: string, 2-4 sentences summarizing the student's current state
- progressSinceLastSession: string, 2-4 sentences describing what changed since the last session
- risks: array of 1-5 strings, each describing a specific risk or concern
- opportunities: array of 1-5 strings, each describing a specific opportunity or positive development
- recommendedDiscussionTopics: array of 2-5 strings, each describing a topic to discuss
- recommendedActions: array of 1-4 strings, each describing a concrete action for the coach
- coachChecklist: array of 2-5 strings, each describing an item to verify or remember
- confidence: number between 0 and 1 reflecting how confident the analysis is

CRITICAL: Your entire response must be a single valid JSON object. Nothing else.`;
}

function buildMetadata(
  context: SessionContext,
  system: string,
  user: string,
  sections: PromptSection[]
): PromptMetadata {
  const fullPrompt = system + "\n\n" + user;
  const characterCount = fullPrompt.length;
  const wordCount = fullPrompt.split(/\s+/).filter(Boolean).length;

  const { dataAvailability } = context.metadata;
  const availableSources: string[] = [];
  const missingSources: string[] = [];

  if (dataAvailability.student) availableSources.push("student");
  if (dataAvailability.session) availableSources.push("session");
  if (dataAvailability.previousSession) availableSources.push("previous-session");
  if (dataAvailability.goals) availableSources.push("goals");
  if (dataAvailability.sprint) availableSources.push("sprint");
  if (dataAvailability.tasks) availableSources.push("tasks");
  if (dataAvailability.assessment) availableSources.push("assessment");
  if (dataAvailability.recommendations) availableSources.push("recommendations");

  if (!dataAvailability.previousSession) missingSources.push("previous-session");
  if (!dataAvailability.assessment) missingSources.push("assessment");
  if (!dataAvailability.recommendations) missingSources.push("recommendations");

  return {
    generatedAt: new Date().toISOString(),
    templateVersion: PROMPT_TEMPLATE_VERSION,
    availableSources,
    missingSources,
    characterCount,
    wordCount,
  };
}
