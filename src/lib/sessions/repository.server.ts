import type { SessionBrief } from "./brief.schema";

export interface SessionBriefRecord {
  id: string;
  sessionId: string;
  studentId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  brief: SessionBrief;
  promptVersion: string;
  provider: string;
  model: string;
  confidence: number;
  generationDuration: number;
}

const briefStore = new Map<string, SessionBriefRecord>();

let idCounter = 0;

function generateId(): string {
  idCounter += 1;
  return `brief_${Date.now()}_${idCounter}`;
}

export async function createSessionBrief(params: {
  sessionId: string;
  studentId: string;
  brief: SessionBrief;
  promptVersion: string;
  provider: string;
  model: string;
  confidence: number;
  generationDuration: number;
}): Promise<SessionBriefRecord> {
  const existingBriefs = await listSessionBriefs(params.sessionId);
  const nextVersion =
    existingBriefs.length > 0
      ? Math.max(...existingBriefs.map((b) => b.version)) + 1
      : 1;

  const now = new Date().toISOString();
  const record: SessionBriefRecord = {
    id: generateId(),
    sessionId: params.sessionId,
    studentId: params.studentId,
    version: nextVersion,
    createdAt: now,
    updatedAt: now,
    brief: params.brief,
    promptVersion: params.promptVersion,
    provider: params.provider,
    model: params.model,
    confidence: params.confidence,
    generationDuration: params.generationDuration,
  };

  briefStore.set(record.id, record);
  return record;
}

export async function getSessionBrief(
  briefId: string
): Promise<SessionBriefRecord | null> {
  return briefStore.get(briefId) || null;
}

export async function getLatestSessionBrief(
  sessionId: string
): Promise<SessionBriefRecord | null> {
  const briefs = await listSessionBriefs(sessionId);
  if (briefs.length === 0) return null;
  return briefs.sort((a, b) => b.version - a.version)[0];
}

export async function listSessionBriefs(
  sessionId: string
): Promise<SessionBriefRecord[]> {
  const briefs: SessionBriefRecord[] = [];
  for (const record of briefStore.values()) {
    if (record.sessionId === sessionId) {
      briefs.push(record);
    }
  }
  return briefs.sort((a, b) => b.version - a.version);
}

export async function listStudentBriefs(
  studentId: string
): Promise<SessionBriefRecord[]> {
  const briefs: SessionBriefRecord[] = [];
  for (const record of briefStore.values()) {
    if (record.studentId === studentId) {
      briefs.push(record);
    }
  }
  return briefs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteSessionBrief(briefId: string): Promise<boolean> {
  return briefStore.delete(briefId);
}
