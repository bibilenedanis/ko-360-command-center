import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { localizeSignalText } from "@/lib/ui/labels";

type AttentionStatus = "Critical" | "Attention" | "On Track" | string | null;

interface BriefSignal {
  icon: string;
  text: string;
  tone: "positive" | "warning" | "neutral";
}

interface StudentBriefProps {
  attentionStatus: AttentionStatus;
  attentionReason: string | null;
  summary: {
    openGoals: number;
    activeSprints: number;
    upcomingSessions: number;
    overdueTasks: number;
    pendingAIRecommendations: number;
  };
  pendingAIRecommendations: Array<{ id: string; title: string; detail: string | null }>;
}

function buildSignals(summary: StudentBriefProps["summary"]): BriefSignal[] {
  const signals: BriefSignal[] = [];

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
      icon: "check_circle",
      text: `${summary.activeSprints} aktif sprint yürütülüyor.`,
      tone: "positive",
    });
  }
  if (summary.upcomingSessions > 0) {
    signals.push({
      icon: "event",
      text: `${summary.upcomingSessions} yaklaşan görüşme planlandı.`,
      tone: "positive",
    });
  }
  if (summary.openGoals > 0) {
    signals.push({
      icon: "target",
      text: `${summary.openGoals} açık hedef devam ediyor.`,
      tone: "neutral",
    });
  }

  return signals;
}

function buildOverallStatus(
  attentionStatus: AttentionStatus,
  attentionReason: string | null,
  summary: StudentBriefProps["summary"],
): string {
  if (attentionReason) return localizeSignalText(attentionReason) || attentionReason;

  if (attentionStatus === "Critical") {
    return "Bu öğrenci acil koçluk müdahalesi gerektiriyor. Aşağıdaki tüm aktif sinyalleri inceleyin.";
  }
  if (attentionStatus === "Attention") {
    return "Bu öğrenci, bir sonraki görüşmeden önce yakından bakılması gereken sinyaller gösteriyor.";
  }
  if (summary.overdueTasks === 0 && summary.pendingAIRecommendations === 0) {
    return "Şu anda kritik bir sinyal yok. Planlı görüşmelerde rutin takibi sürdürün.";
  }
  return "Uygun koçluk aksiyonunu belirlemek için aşağıdaki aktif sinyalleri inceleyin.";
}

function buildCoachingAction(
  summary: StudentBriefProps["summary"],
  pendingAI: Array<{ id: string; title: string; detail: string | null }>,
): string {
  const topAI = pendingAI[0];
  if (topAI) return topAI.title;
  if (summary.overdueTasks > 0)
    return `Bir sonraki görüşmeden önce ${summary.overdueTasks} gecikmiş görevi ele alın.`;
  if (summary.upcomingSessions > 0)
    return "Görüşme materyallerini hazırlayın ve öğrenci ilerleme notlarını gözden geçirin.";
  if (summary.openGoals > 0)
    return "Açık hedeflerin ilerleyişini kontrol edin ve dönüm noktası tarihlerini güncelleyin.";
  return "Bu öğrenci için işaretli acil bir aksiyon yok.";
}

export function StudentBrief({
  attentionStatus,
  attentionReason,
  summary,
  pendingAIRecommendations,
}: StudentBriefProps) {
  const signals = buildSignals(summary);
  const overallStatus = buildOverallStatus(attentionStatus, attentionReason, summary);
  const coachingAction = buildCoachingAction(summary, pendingAIRecommendations);
  const topAI = pendingAIRecommendations[0];

  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          <span className="inline-block h-2 w-2 bg-primary" />
          Koçluk Özeti
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6 px-6 py-6 md:border-r md:border-outline-variant">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
              Mevcut Durum
            </p>
            <p className="text-base leading-relaxed text-on-surface">
              {overallStatus}
            </p>
          </div>

          {signals.length > 0 && (
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                Aktif Sinyaller
              </p>
              <ul className="space-y-2.5">
                {signals.map((signal, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-on-surface">
                    <Icon
                      name={signal.icon}
                      className={cn(
                        "mt-0.5 shrink-0 text-[16px]",
                        signal.tone === "warning"
                          ? "text-destructive"
                          : "text-on-surface",
                      )}
                    />
                    <span>{signal.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {signals.length === 0 && (
            <p className="text-sm text-on-surface-variant">
              Şu anda aktif sinyal yok.
            </p>
          )}
        </div>

        <div className="px-6 py-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
            Koçluk Önerisi
          </p>
          <div className="border border-outline-variant bg-surface-low p-4">
            <p className="italic leading-relaxed text-on-surface">
              &ldquo;{coachingAction}&rdquo;
            </p>
            {topAI?.detail && (
              <p className="mt-2 text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
                Risk: {topAI.detail}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
