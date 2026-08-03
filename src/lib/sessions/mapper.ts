import type { SessionBrief } from "./brief.schema";

export interface SessionBriefDisplayData {
  currentSituation: string;
  progressSinceLastSession: string;
  risks: Array<{ text: string }>;
  opportunities: Array<{ text: string }>;
  discussionTopics: Array<{ text: string }>;
  actions: Array<{ text: string }>;
  checklist: Array<{ text: string }>;
  confidence: number;
  generatedAt: string;
}

export function mapSessionBriefToDisplayData(
  brief: SessionBrief,
  generatedAt: string
): SessionBriefDisplayData {
  return {
    currentSituation: brief.currentSituation,
    progressSinceLastSession: brief.progressSinceLastSession,
    risks: brief.risks.map((text) => ({ text })),
    opportunities: brief.opportunities.map((text) => ({ text })),
    discussionTopics: brief.recommendedDiscussionTopics.map((text) => ({ text })),
    actions: brief.recommendedActions.map((text) => ({ text })),
    checklist: brief.coachChecklist.map((text) => ({ text })),
    confidence: Math.round(brief.confidence * 100),
    generatedAt,
  };
}
