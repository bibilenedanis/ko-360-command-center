import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { localizeStatus, localizeSignalText } from "@/lib/ui/labels";
import type { SessionWorkspaceData } from "@/lib/sessions/workspace.server";

interface AIBriefingPanelProps {
  data: SessionWorkspaceData;
}

interface Signal {
  icon: string;
  text: string;
  tone: "warning" | "positive" | "neutral";
}

export function AIBriefingPanel({ data }: AIBriefingPanelProps) {
  const { profile, context } = data;
  const { summary, student } = profile;

  const signals: Signal[] = [];

  if (summary.overdueTasks > 0) {
    signals.push({
      icon: "warning",
      text: `${summary.overdueTasks} gecikmiş görev acil takip gerektiriyor.`,
      tone: "warning",
    });
  }
  if (summary.pendingAIRecommendations > 0) {
    signals.push({
      icon: "flag",
      text: `${summary.pendingAIRecommendations} AI önerisi koç incelemesi bekliyor.`,
      tone: "warning",
    });
  }
  if (summary.activeSprints > 0) {
    signals.push({
      icon: "bolt",
      text: `${summary.activeSprints} aktif sprint yürütülüyor.`,
      tone: "positive",
    });
  }
  if (summary.openGoals > 0) {
    signals.push({
      icon: "flag",
      text: `${summary.openGoals} açık hedef takip ediliyor.`,
      tone: "neutral",
    });
  }

  const attentionEmphasis =
    student.attentionStatus === "Critical"
      ? "critical"
      : student.attentionStatus === "Attention"
        ? "attention"
        : "neutral";

  const reason = student.attentionReason
    ? localizeSignalText(student.attentionReason) || student.attentionReason
    : null;

  const topAI = context.pendingHighRiskAI[0] ?? null;

  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          <span className="inline-block h-2 w-2 bg-primary" />
          AI Görüşme Özeti
        </h2>
        <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          Mevcut verilerden derlenmiştir
        </span>
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6 px-6 py-6 md:border-r md:border-outline-variant">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
              Öğrencinin Mevcut Durumu
              {student.attentionStatus && attentionEmphasis !== "neutral" && (
                <span
                  className={cn(
                    "border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider",
                    attentionEmphasis === "critical"
                      ? "border-destructive/50 bg-destructive/10 text-destructive"
                      : "border-outline-variant bg-surface-high text-on-surface",
                  )}
                >
                  {localizeStatus(student.attentionStatus)}
                </span>
              )}
            </p>
            <p className="text-base leading-relaxed text-on-surface">
              {reason ?? "Bu öğrenci için aktif dikkat sinyali kaydı yok."}
            </p>
          </div>

          {signals.length > 0 ? (
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                Görüşmede Dikkat Edilecekler
              </p>
              <ul className="space-y-2.5">
                {signals.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-on-surface"
                  >
                    <Icon
                      name={s.icon}
                      filled={s.tone === "warning"}
                      className={cn(
                        "mt-0.5 shrink-0 text-[16px]",
                        s.tone === "warning"
                          ? "text-destructive"
                          : "text-on-surface",
                      )}
                    />
                    <span>{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              Şu anda takip gerektiren aktif sinyal yok.
            </p>
          )}
        </div>

        <div className="px-6 py-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
            Öne Çıkan AI Önerisi
          </p>
          {topAI ? (
            <div className="border border-outline-variant bg-surface-low p-4">
              <p className="italic leading-relaxed text-on-surface">
                &ldquo;{topAI.title}&rdquo;
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
                {topAI.detail && (
                  <span>Risk: {localizeStatus(topAI.detail) || topAI.detail}</span>
                )}
                {topAI.status && (
                  <span>· {localizeStatus(topAI.status)}</span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              İnceleme bekleyen AI önerisi yok.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
