import type { StudentProfileRecord } from "@/lib/students/profile.server";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";

interface AIRecommendationsPanelProps {
  items: StudentProfileRecord[];
  pendingCount: number;
}

function riskLevel(detail: string | null): "high" | "medium" | "low" | "none" {
  if (!detail) return "none";
  const d = detail.toLowerCase();
  if (d.includes("high") || d.includes("critical")) return "high";
  if (d.includes("medium") || d.includes("moderate")) return "medium";
  if (d.includes("low")) return "low";
  return "none";
}

function isPending(status: string | null): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  return s.includes("pending") || s === "new" || s === "open";
}

export function AIRecommendationsPanel({
  items,
  pendingCount,
}: AIRecommendationsPanelProps) {
  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <PanelHeader
        title="AI Recommendations"
        count={items.length}
        badge={
          pendingCount > 0
            ? { label: `${pendingCount} pending`, tone: "warning" }
            : undefined
        }
      />

      {items.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {items.map((item) => {
            const risk = riskLevel(item.detail);
            const pending = isPending(item.status);
            return (
              <div
                key={item.id}
                className={cn(
                  "px-5 py-4",
                  risk === "high" && "bg-destructive/5",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Icon
                      name="auto_awesome"
                      filled
                      className={cn(
                        "mt-0.5 shrink-0 text-[16px]",
                        risk === "high"
                          ? "text-destructive"
                          : "text-on-surface-variant",
                      )}
                    />
                    <p className="font-medium leading-snug text-on-surface">
                      {item.title}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {item.detail && (
                      <span
                        className={cn(
                          "border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider",
                          risk === "high"
                            ? "border-destructive/40 bg-destructive/10 text-destructive"
                            : "border-outline-variant bg-surface-high text-on-surface",
                        )}
                      >
                        {item.detail}
                      </span>
                    )}
                    {item.status && (
                      <span
                        className={cn(
                          "text-[10px] font-mono uppercase tracking-wider",
                          pending
                            ? "font-bold text-on-surface"
                            : "text-on-surface-variant",
                        )}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
                {item.date && (
                  <p className="mt-1.5 pl-6 text-[11px] font-mono text-on-surface-variant">
                    Generated {item.date}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          No AI recommendations for this student.
        </p>
      )}
    </section>
  );
}
