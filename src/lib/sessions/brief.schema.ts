import { z } from "zod";

export const SessionBriefSchema = z.object({
  currentSituation: z.string().min(1),
  progressSinceLastSession: z.string().min(1),
  risks: z.array(z.string().min(1)),
  opportunities: z.array(z.string().min(1)),
  recommendedDiscussionTopics: z.array(z.string().min(1)),
  recommendedActions: z.array(z.string().min(1)),
  coachChecklist: z.array(z.string().min(1)),
  confidence: z.number().min(0).max(1),
});

export type SessionBrief = z.infer<typeof SessionBriefSchema>;

export function getSessionBriefSchemaJson(): string {
  return JSON.stringify(
    {
      currentSituation:
        "string — concise summary of the student's current state and context",
      progressSinceLastSession:
        "string — what changed or progressed since the previous session",
      risks: [
        "string — specific risk or concern requiring attention",
        "string — another risk",
      ],
      opportunities: [
        "string — specific opportunity or positive development",
        "string — another opportunity",
      ],
      recommendedDiscussionTopics: [
        "string — topic the coach should discuss in this session",
        "string — another topic",
      ],
      recommendedActions: [
        "string — concrete action the coach should take",
        "string — another action",
      ],
      coachChecklist: [
        "string — item to verify or remember during the session",
        "string — another item",
      ],
      confidence: "number between 0 and 1",
    },
    null,
    2
  );
}
