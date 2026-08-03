import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/icon";
import type { ReportStatus } from "@/lib/report/report.types";

interface ReportHeaderProps {
  studentName: string;
  sessionDate: string;
  sprintName: string;
  goal: string;
  completionPercent: number;
  readingTimeMinutes: number;
  lastGeneratedAt: string;
  reportStatus: ReportStatus;
  draftLabel: string;
  reviewLabel: string;
}

export function ReportHeader({
  studentName,
  sessionDate,
  sprintName,
  goal,
  completionPercent,
  readingTimeMinutes,
  lastGeneratedAt,
  reportStatus,
  draftLabel,
  reviewLabel,
}: ReportHeaderProps) {
  return (
    <section className="bg-surface border-b border-outline-variant p-6 sticky top-16 z-10">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link
            to="/students"
            className="mb-2 inline-flex items-center gap-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant transition-opacity hover:opacity-70"
          >
            <Icon name="arrow_back" className="text-[14px]" />
            Back to Students
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              {studentName}
            </h1>
            <span className="px-2 py-0.5 border border-primary text-[11px] font-mono uppercase capitalize">
              {reportStatus}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mb-4">
            Completion: {completionPercent}% | Estimated reading time: {readingTimeMinutes} min
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="font-bold">Session Date:</span> {sessionDate}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">Sprint:</span> {sprintName}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">Goal:</span> {goal}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-4 rounded flex flex-col gap-2 min-w-[240px]">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-mono uppercase text-on-surface-variant">
              Status
            </span>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 bg-surface-variant text-on-surface-variant text-[11px] font-mono rounded">
                {draftLabel}
              </span>
              <span className="px-1.5 py-0.5 bg-primary text-on-primary text-[11px] font-mono rounded">
                {reviewLabel}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="text-xs">
              <p className="text-on-surface-variant">Last Generated:</p>
              <p className="font-bold">{lastGeneratedAt}</p>
            </div>
            <button
              type="button"
              className="border border-outline px-3 py-1.5 text-xs font-mono font-semibold hover:bg-surface-container transition-colors flex items-center gap-1"
            >
              <Icon name="refresh" className="text-sm" />
              Generate Again
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
