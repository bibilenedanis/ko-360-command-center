import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

type AttentionStatus = "Critical" | "Attention" | "On Track" | string | null;

interface StudentHeaderProps {
  name: string;
  studentId: string;
  educationLevel: string | null;
  status: string | null;
  attentionStatus: AttentionStatus;
  attentionReason: string | null;
}

function attentionEmphasis(status: AttentionStatus): "critical" | "attention" | "neutral" {
  if (status === "Critical") return "critical";
  if (status === "Attention") return "attention";
  return "neutral";
}

export function StudentHeader({
  name,
  studentId,
  educationLevel,
  status,
  attentionStatus,
  attentionReason,
}: StudentHeaderProps) {
  const emphasis = attentionEmphasis(attentionStatus);

  return (
    <header className="space-y-5">
      <Link
        to="/students"
        search={{ filter: "all" }}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-on-surface-variant transition-opacity hover:opacity-70"
      >
        <Icon name="arrow_back" className="text-[16px]" />
        Students
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-on-surface-variant">
            Student 360
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-on-surface md:text-4xl">
            {name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-on-surface-variant">
            <span className="font-mono">{studentId}</span>
            {educationLevel && (
              <>
                <span aria-hidden className="opacity-40">•</span>
                <span>{educationLevel}</span>
              </>
            )}
            {status && (
              <>
                <span aria-hidden className="opacity-40">•</span>
                <span>{status}</span>
              </>
            )}
          </div>
        </div>

        {attentionStatus && (
          <div
            className={cn(
              "shrink-0 rounded border px-5 py-4 lg:max-w-md",
              emphasis === "critical" &&
                "border-destructive/50 bg-destructive/5",
              emphasis === "attention" &&
                "border-outline-variant bg-surface-high",
              emphasis === "neutral" &&
                "border-outline-variant bg-surface",
            )}
          >
            <div className="flex items-center gap-2">
              <Icon
                name={
                  emphasis === "critical"
                    ? "priority_high"
                    : emphasis === "attention"
                      ? "notifications_active"
                      : "check_circle"
                }
                filled={emphasis === "critical"}
                className={cn(
                  "text-[18px]",
                  emphasis === "critical"
                    ? "text-destructive"
                    : "text-on-surface-variant",
                )}
              />
              <p
                className={cn(
                  "text-[10px] font-mono uppercase tracking-wider",
                  emphasis === "critical"
                    ? "text-destructive"
                    : "text-on-surface-variant",
                )}
              >
                Attention Status
              </p>
            </div>
            <p
              className={cn(
                "mt-2 font-semibold",
                emphasis === "critical"
                  ? "text-destructive"
                  : "text-on-surface",
              )}
            >
              {attentionStatus}
            </p>
            {attentionReason && (
              <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                {attentionReason}
              </p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
