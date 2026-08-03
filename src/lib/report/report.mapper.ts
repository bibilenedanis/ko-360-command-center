import type { ReportWorkspaceData, ReportSource } from "./report.types";

export function getUsedSources(data: ReportWorkspaceData): ReportSource[] {
  return data.sources.items.filter((s) => !s.isMissing);
}

export function getMissingSources(data: ReportWorkspaceData): ReportSource[] {
  return data.sources.items.filter((s) => s.isMissing);
}

export function getLatestVersion(data: ReportWorkspaceData) {
  return data.report.versions[0] ?? null;
}

export function getVersionHistory(data: ReportWorkspaceData) {
  return data.report.versions.map((v) => ({
    id: v.id,
    title: v.timelineDescription,
    timestamp: v.createdAt,
    actor: `By ${v.createdBy}`,
    isLatest: v === data.report.versions[0],
  }));
}
