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
    <section className="border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          <span className="inline-block h-2 w-2 bg-primary" />
          AI İçgörüleri
        </h2>
        <div className="flex items-center gap-2">
          {pending.length > 0 && (
            <span className="border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface">
              {pending.length} öncelikli
            </span>
          )}
          <span className="text-[11px] font-mono tabular-nums text-on-surface-variant">
            {ordered.length}
          </span>
        </div>
      </div>

      {ordered.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {ordered.map((item) => {
            const risk = riskLevel(item.detail);
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
                        {localizeStatus(item.detail) || item.detail}
                      </span>
                    )}
                    {item.status && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                        {localizeStatus(item.status)}
                      </span>
                    )}
                  </div>
                </div>
                {item.date && (
                  <p className="mt-1.5 pl-6 text-[11px] font-mono text-on-surface-variant">
                    Oluşturuldu: {formatShortDateTR(item.date)}
                  </p>
                )}
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
