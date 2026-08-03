/**
 * Prompt section builders.
 * 
 * Each function builds a specific section of the prompt.
 * Sections are reusable and can be combined in different ways.
 */

import type { ReportContext } from './context.types';

/**
 * Build the system prompt section that defines the AI's role and behavior.
 */
export function buildSystemSection(): string {
  return `You are an expert educational coach assistant for Koç360, a coaching platform that helps students achieve their academic and personal goals.

Your role is to generate comprehensive coaching reports based on session data, student progress, and coaching observations.

CRITICAL RULES:
- Never invent facts or make assumptions beyond the provided data
- Use ONLY the information explicitly provided in the context
- Never diagnose the student with any medical or psychological conditions
- Never label the student (e.g., "lazy", "gifted", "problematic")
- Never exaggerate or minimize achievements or challenges
- If information is missing or insufficient, explicitly state: "Insufficient evidence to determine..."
- Write like an educational coach, NOT like a psychologist or therapist
- Be constructive and solution-focused
- Be objective and evidence-based
- Explain your reasoning when making observations
- Highlight uncertainty when appropriate
- Use professional but warm language
- Focus on growth and progress, not just problems
- Provide actionable recommendations when data supports them

TONE:
- Professional yet approachable
- Encouraging but realistic
- Evidence-based and specific
- Future-oriented and actionable
- Respectful of the student's autonomy and dignity`;
}

/**
 * Build the role and context section.
 */
export function buildRoleSection(context: ReportContext): string {
  const studentName = context.student.name;
  const sessionDate = context.session.date || 'Unknown date';
  const sprintName = context.sprint?.title || 'Current sprint';
  
  return `COACHING CONTEXT:

You are writing a coaching report for ${studentName}.
Session Date: ${sessionDate}
Sprint: ${sprintName}

This report will be shared with the student and potentially their parents. It should be clear, actionable, and focused on growth.`;
}

/**
 * Build the student profile section.
 */
export function buildStudentSection(context: ReportContext): string {
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
  
  if (student.attentionStatus && student.attentionStatus !== 'On Track') {
    content += `\n\nATTENTION REQUIRED: ${student.attentionStatus}`;
    if (student.attentionReason) {
      content += `\nReason: ${student.attentionReason}`;
    }
  }
  
  return content;
}

/**
 * Build the session notes section.
 */
export function buildSessionNotesSection(context: ReportContext): string {
  const { sessionNotes } = context;
  
  let content = `SESSION NOTES:

Wins & Progress:
${sessionNotes.winsAndProgress || 'No data available'}

Challenges & Obstacles:
${sessionNotes.challengesAndObstacles || 'No data available'}

Core Notes:
${sessionNotes.coreNotes || 'No data available'}

Commitments:
${sessionNotes.commitments || 'No data available'}`;
  
  return content;
}

/**
 * Build the assessment section.
 */
export function buildAssessmentSection(context: ReportContext): string {
  if (!context.assessment) {
    return `ASSESSMENT DATA:

No assessment data available for this student.`;
  }
  
  const { assessment } = context;
  
  let content = `ASSESSMENT DATA:

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

/**
 * Build the goals section.
 */
export function buildGoalsSection(context: ReportContext): string {
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

/**
 * Build the sprint section.
 */
export function buildSprintSection(context: ReportContext): string {
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

/**
 * Build the tasks section.
 */
export function buildTasksSection(context: ReportContext): string {
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
      if (task.status) content += ` - Status: ${task.status}`;
    });
  }
  
  if (tasks.upcoming.length > 0) {
    content += `\n\nUpcoming Tasks (${tasks.upcoming.length}):\n`;
    tasks.upcoming.forEach((task, index) => {
      content += `\n${index + 1}. ${task.title}`;
      if (task.type) content += ` [${task.type}]`;
      if (task.dueDate) content += ` - Due: ${task.dueDate}`;
      if (task.status) content += ` - Status: ${task.status}`;
    });
  }
  
  if (tasks.completed.length > 0) {
    content += `\n\nRecently Completed Tasks (${tasks.completed.length}):\n`;
    tasks.completed.slice(0, 5).forEach((task, index) => {
      content += `\n${index + 1}. ${task.title}`;
      if (task.type) content += ` [${task.type}]`;
    });
    if (tasks.completed.length > 5) {
      content += `\n... and ${tasks.completed.length - 5} more`;
    }
  }
  
  return content;
}

/**
 * Build the recommendations section.
 */
export function buildRecommendationsSection(context: ReportContext): string {
  const { recommendations } = context;
  
  if (recommendations.pendingHighRisk.length === 0 && 
      recommendations.pendingOther.length === 0 && 
      recommendations.reviewed.length === 0) {
    return `AI RECOMMENDATIONS:

No AI recommendations available.`;
  }
  
  let content = `AI RECOMMENDATIONS:\n\n`;
  
  if (recommendations.pendingHighRisk.length > 0) {
    content += `High Priority Recommendations (${recommendations.pendingHighRisk.length}):\n`;
    recommendations.pendingHighRisk.forEach((rec, index) => {
      content += `\n${index + 1}. ${rec.title}`;
      if (rec.risk) content += ` [Risk: ${rec.risk}]`;
      if (rec.generatedAt) content += ` - Generated: ${rec.generatedAt}`;
    });
  }
  
  if (recommendations.pendingOther.length > 0) {
    content += `\n\nOther Pending Recommendations (${recommendations.pendingOther.length}):\n`;
    recommendations.pendingOther.forEach((rec, index) => {
      content += `\n${index + 1}. ${rec.title}`;
      if (rec.risk) content += ` [Risk: ${rec.risk}]`;
      if (rec.generatedAt) content += ` - Generated: ${rec.generatedAt}`;
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

/**
 * Build the data availability section.
 */
export function buildDataAvailabilitySection(context: ReportContext): string {
  const { dataAvailability } = context.metadata;
  
  const available: string[] = [];
  const missing: string[] = [];
  
  if (dataAvailability.student) available.push('Student Profile');
  if (dataAvailability.session) available.push('Session Data');
  if (dataAvailability.sessionNotes) available.push('Session Notes');
  if (dataAvailability.assessment) available.push('Assessment Data');
  if (dataAvailability.goals) available.push('Goals');
  if (dataAvailability.sprint) available.push('Sprint Data');
  if (dataAvailability.tasks) available.push('Tasks');
  if (dataAvailability.recommendations) available.push('AI Recommendations');
  
  if (!dataAvailability.coachNotes) missing.push('Coach Notes');
  if (!dataAvailability.parentFeedback) missing.push('Parent Feedback');
  if (!dataAvailability.previousReports) missing.push('Previous Reports');
  
  let content = `DATA AVAILABILITY:\n\n`;
  content += `Available Data Sources (${available.length}):\n`;
  content += available.map(s => `✓ ${s}`).join('\n');
  
  if (missing.length > 0) {
    content += `\n\nMissing Data Sources (${missing.length}):\n`;
    content += missing.map(s => `✗ ${s}`).join('\n');
    content += `\n\nNote: When data sources are missing, explicitly state "Insufficient evidence to determine..." rather than making assumptions.`;
  }
  
  return content;
}

/**
 * Build the output instructions section.
 */
export function buildOutputSection(): string {
  return `OUTPUT INSTRUCTIONS:

Generate a comprehensive coaching report with the following sections:

1. EXECUTIVE SUMMARY
   - Brief overview of the session
   - Key highlights and main takeaways
   - Overall student trajectory

2. STRENGTHS & PROGRESS
   - Specific achievements and wins
   - Skills demonstrated
   - Positive patterns observed
   - Evidence-based observations

3. CHALLENGES & AREAS FOR GROWTH
   - Specific obstacles encountered
   - Patterns that need attention
   - Root causes (if evident from data)
   - Impact on progress

4. SESSION INSIGHTS
   - Key observations from the session
   - Behavioral patterns
   - Engagement level
   - Connection to goals

5. RECOMMENDATIONS
   - Specific, actionable next steps
   - Short-term priorities (next 1-2 weeks)
   - Medium-term focus (current sprint)
   - Resources or support needed

6. COMMITMENTS & FOLLOW-UP
   - What the student committed to
   - Follow-up actions for the coach
   - Check-in points
   - Success metrics

FORMATTING RULES:
- Use clear, professional language
- Be specific and evidence-based
- Use bullet points for lists
- Keep paragraphs concise (3-4 sentences max)
- Use headings and subheadings for structure
- Total length: 800-1200 words`;
}
