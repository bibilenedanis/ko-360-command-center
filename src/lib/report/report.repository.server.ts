import type { ReportRecord, ReportStatus } from "./report-record.types";
import type { ReportOutput } from "@/lib/ai/schema";

const reportStore = new Map<string, ReportRecord>();

let idCounter = 0;

function generateId(): string {
  idCounter += 1;
  return `report_${Date.now()}_${idCounter}`;
}

export async function createDraft(params: {
  studentId: string;
  sessionId: string;
  reportOutput: ReportOutput;
  promptVersion: string;
  provider: string;
  model: string;
  confidence: number;
  sourceCoverage: number;
  generationDuration: number;
}): Promise<ReportRecord> {
  const existingDrafts = await listSessionReports(params.sessionId);
  const nextVersion = existingDrafts.length > 0
    ? Math.max(...existingDrafts.map((r) => r.version)) + 1
    : 1;

  const now = new Date().toISOString();
  const record: ReportRecord = {
    id: generateId(),
    studentId: params.studentId,
    sessionId: params.sessionId,
    version: nextVersion,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    generatedBy: "ai",
    reportOutput: params.reportOutput,
    promptVersion: params.promptVersion,
    provider: params.provider,
    model: params.model,
    confidence: params.confidence,
    sourceCoverage: params.sourceCoverage,
    generationDuration: params.generationDuration,
  };

  reportStore.set(record.id, record);
  return record;
}

export async function getDraft(reportId: string): Promise<ReportRecord | null> {
  return reportStore.get(reportId) || null;
}

export async function getLatestDraftForSession(sessionId: string): Promise<ReportRecord | null> {
  const drafts = await listSessionReports(sessionId);
  if (drafts.length === 0) return null;
  return drafts.sort((a, b) => b.version - a.version)[0];
}

export async function updateDraft(
  reportId: string,
  updates: {
    reportOutput?: ReportOutput;
    status?: ReportStatus;
  }
): Promise<ReportRecord | null> {
  const existing = reportStore.get(reportId);
  if (!existing) return null;

  const updated: ReportRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  reportStore.set(reportId, updated);
  return updated;
}

export async function listStudentReports(studentId: string): Promise<ReportRecord[]> {
  const reports: ReportRecord[] = [];
  for (const record of reportStore.values()) {
    if (record.studentId === studentId) {
      reports.push(record);
    }
  }
  return reports.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listSessionReports(sessionId: string): Promise<ReportRecord[]> {
  const reports: ReportRecord[] = [];
  for (const record of reportStore.values()) {
    if (record.sessionId === sessionId) {
      reports.push(record);
    }
  }
  return reports.sort((a, b) => b.version - a.version);
}

export async function deleteDraft(reportId: string): Promise<boolean> {
  return reportStore.delete(reportId);
}

export async function getReportVersionHistory(sessionId: string): Promise<ReportRecord[]> {
  return listSessionReports(sessionId);
}
