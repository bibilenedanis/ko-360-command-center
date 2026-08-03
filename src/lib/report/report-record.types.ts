import type { ReportOutput } from "@/lib/ai/schema";

export type ReportStatus = "draft" | "reviewing" | "approved" | "published" | "archived";

export interface ReportRecord {
  id: string;
  studentId: string;
  sessionId: string;
  version: number;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  generatedBy: string;
  reportOutput: ReportOutput;
  promptVersion: string;
  provider: string;
  model: string;
  confidence: number;
  sourceCoverage: number;
  generationDuration: number;
}

export interface ReportRecordMetadata {
  promptVersion: string;
  provider: string;
  model: string;
  confidence: number;
  sourceCoverage: number;
  generationDuration: number;
}
