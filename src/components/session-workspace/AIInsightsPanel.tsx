import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { localizeStatus, formatShortDateTR } from "@/lib/ui/labels";
import type { StudentProfileRecord } from "@/lib/students/profile.server";

interface AIInsightsPanelProps {
  pending: StudentProfileRecord[];
  others: StudentProfileRecord[];
}

function riskLevel(detail: string | null): "high" | "medium" | "low" | "none" {
  const d = (detail ?? "").toLowerCase();
  if (d.includes("high") || d.includes("critical")) return "high";
  if (d.includes("medium") || d.includes("moderate")) return "medium";
  if (d.includes("low")) return "low";
  return "none";
}

export function AIInsightsPanel({ pending, others }: AIInsightsPanelProps) {
  const ordered = [...pending, ...others];

  return (
    <section className="border border-violet-200 bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-violet-200 bg-violet-50/50 px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-violet-700">
          <Icon name="insights" filled className="text-[18px]" />
          AI Önerileri
        </h2>
        <div className="flex items-center gap-2">
          {pending.length > 0 && (
            <span className="rounded border border-violet-300 bg-violet-100 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-violet-700">
              {pending.length} öncelikli
            </span>
          )}
          <span className="text-[11px] font-mono tabular-nums text-on-surface-variant">
            {ordered.length}
          </span>
        </div>
      </div>

      {ordered.length > 0 ? (
        <div className="space-y-3 px-5 py-4">
          {ordered.map((item) => {
            const risk = riskLevel(item.detail);
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg border p-3",
                  risk === "high"
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-violet-200 bg-violet-50/40",
                )}
              >
                <div className="flex items-start gap-2.5">
                  <Icon
                    name="auto_awesome"
                    filled
                    className={cn(
                      "mt-0.5 shrink-0 text-[16px]",
                      risk === "high" ? "text-destructive" : "text-violet-600",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-on-surface">
                      {item.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {item.detail && (
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider",
                            risk === "high"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-violet-100 text-violet-700",
                          )}
                        >
                          {localizeStatus(item.detail) || item.detail}
                        </span>
                      )}
                      {item.status && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                          {localizeStatus(item.status)}
                        </span>
                      )}
                    </div>
                    {item.date && (
                      <p className="mt-1.5 text-[11px] font-mono text-on-surface-variant">
                        Oluşturuldu: {formatShortDateTR(item.date)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          Bu öğrenci için aktif AI önerisi bulunmuyor.
        </p>
      )}
    </section>
  );
}
