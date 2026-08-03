/**
 * Prompt builder for AI report generation.
 * 
 * This module converts a ReportContext into a complete prompt document
 * that can be sent to any LLM provider.
 */

import type { ReportContext } from './context.types';
import type { PromptDocument, PromptMetadata, PromptSection } from './prompt.types';
import {
  buildSystemSection,
  buildRoleSection,
  buildStudentSection,
  buildSessionNotesSection,
  buildAssessmentSection,
  buildGoalsSection,
  buildSprintSection,
  buildTasksSection,
  buildRecommendationsSection,
  buildDataAvailabilitySection,
  buildOutputSection,
} from './prompt.sections';
import { PROMPT_TEMPLATE_VERSION } from './prompt.templates';

/**
 * Build a complete prompt document from a ReportContext.
 * 
 * This is the main entry point for prompt generation. It takes a ReportContext
 * (which contains all the data needed for a report) and produces a PromptDocument
 * that can be sent to any LLM provider.
 * 
 * @param context - The report context containing all data sources
 * @returns A complete prompt document ready to be sent to an LLM
 * 
 * @example
 * ```typescript
 * const context = await buildReportContext(sessionId);
 * const prompt = buildReportPrompt(context);
 * 
 * // Now send prompt.system and prompt.user to your LLM provider
 * const output = await callLLM({
 *   system: prompt.system,
 *   user: prompt.user,
 * });
 * ```
 */
export function buildReportPrompt(context: ReportContext): PromptDocument {
  // Build individual sections
  const sections: PromptSection[] = [
    {
      id: 'role',
      title: 'Role & Context',
      content: buildRoleSection(context),
      order: 1,
    },
    {
      id: 'student',
      title: 'Student Profile',
      content: buildStudentSection(context),
      order: 2,
    },
    {
      id: 'session-notes',
      title: 'Session Notes',
      content: buildSessionNotesSection(context),
      order: 3,
    },
    {
      id: 'assessment',
      title: 'Assessment Data',
      content: buildAssessmentSection(context),
      order: 4,
    },
    {
      id: 'goals',
      title: 'Goals',
      content: buildGoalsSection(context),
      order: 5,
    },
    {
      id: 'sprint',
      title: 'Sprint Data',
      content: buildSprintSection(context),
      order: 6,
    },
    {
      id: 'tasks',
      title: 'Tasks',
      content: buildTasksSection(context),
      order: 7,
    },
    {
      id: 'recommendations',
      title: 'AI Recommendations',
      content: buildRecommendationsSection(context),
      order: 8,
    },
    {
      id: 'data-availability',
      title: 'Data Availability',
      content: buildDataAvailabilitySection(context),
      order: 9,
    },
    {
      id: 'output-instructions',
      title: 'Output Instructions',
      content: buildOutputSection(),
      order: 10,
    },
  ];

  // Sort sections by order
  sections.sort((a, b) => a.order - b.order);

  // Build the system prompt
  const system = buildSystemSection();

  // Build the user prompt by combining all sections
  const userSections = sections.map((section) => section.content);
  const user = userSections.join('\n\n---\n\n');

  // Build metadata
  const metadata = buildMetadata(context, system, user, sections);

  return {
    system,
    user,
    metadata,
    sections,
  };
}

/**
 * Build metadata about the generated prompt.
 */
function buildMetadata(
  context: ReportContext,
  system: string,
  user: string,
  sections: PromptSection[]
): PromptMetadata {
  const fullPrompt = system + '\n\n' + user;
  
  // Calculate character and word counts
  const characterCount = fullPrompt.length;
  const wordCount = fullPrompt.split(/\s+/).filter(Boolean).length;
  
  // Determine available and missing sources
  const { dataAvailability } = context.metadata;
  const availableSources: string[] = [];
  const missingSources: string[] = [];
  
  if (dataAvailability.student) availableSources.push('student');
  if (dataAvailability.session) availableSources.push('session');
  if (dataAvailability.sessionNotes) availableSources.push('session-notes');
  if (dataAvailability.assessment) availableSources.push('assessment');
  if (dataAvailability.goals) availableSources.push('goals');
  if (dataAvailability.sprint) availableSources.push('sprint');
  if (dataAvailability.tasks) availableSources.push('tasks');
  if (dataAvailability.recommendations) availableSources.push('recommendations');
  
  if (!dataAvailability.coachNotes) missingSources.push('coach-notes');
  if (!dataAvailability.parentFeedback) missingSources.push('parent-feedback');
  if (!dataAvailability.previousReports) missingSources.push('previous-reports');
  
  return {
    generatedAt: new Date().toISOString(),
    templateVersion: PROMPT_TEMPLATE_VERSION,
    availableSources,
    missingSources,
    characterCount,
    wordCount,
  };
}
