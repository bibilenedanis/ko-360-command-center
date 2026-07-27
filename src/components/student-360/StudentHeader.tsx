import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { localizeStatus } from "@/lib/ui/labels";

type AttentionStatus = "Critical" | "Attention" | "On Track" | string | null;

interface StudentHeaderProps {
  name: string;
  studentId: string;
  educationLevel: string | null;
  status: string | null;
  attentionStatus: AttentionStatus;
  attentionReason: string | null;
}

function attentionEmphasis(s: AttentionStatus): "critical" | "attention" | "neutral" {
  if (s === "Critical") return "critical";
  if (s === "Attention") return "attention";
  return "neutral";
}

export function StudentHeader({
  name,
  studentId,
  educationLevel,
  status,
  attentionStatus,
}: StudentHeaderProps) {
  const emphasis = attentionEmphasis(attentionStatus);

  return (
    <header>
      <Link
        to="/students"
        search={{ filter: "all" }}
        className="mb-3 inline-flex items-center gap-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant transition-opacity hover:opacity-70"
      >
        <Icon name="arrow_back" className="text-[14px]" />
        Öğrenciler
      </Link>

      <div className="flex flex-col gap-4 border border-outline-variant bg-surface-lowest p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-outline-variant bg-surface-high">
            <Icon name="person" className="text-[32px] text-on-surface-variant" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-on-surface">
                {name}
              </h1>
              {status && (
                <span className="bg-primary px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-on-primary">
                  {localizeStatus(status) || status}
                </span>
              )}
              {attentionStatus && emphasis !== "neutral" && (
                <span
                  className={cn(
                    "border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider",
                    emphasis === "critical"
                      ? "border-destructive/50 bg-destructive/10 text-destructive"
                      : "border-outline-variant bg-surface-high text-on-surface",
                  )}
                >
                  {localizeStatus(attentionStatus)}
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant">
              {studentId !== "—" && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Icon name="badge" className="text-[14px]" />
                  {studentId}
                </span>
              )}
              {educationLevel && (
                <span className="flex items-center gap-1.5">
                  <Icon name="school" className="text-[14px]" />
                  {educationLevel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
