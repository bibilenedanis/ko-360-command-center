import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { localizeStatus, localizeSignalText } from "@/lib/ui/labels";
import type { SessionWorkspaceData } from "@/lib/sessions/workspace.server";
import type { SessionBriefDisplayData } from "@/lib/sessions/mapper";

interface AIBriefingPanelProps {
  data: SessionWorkspaceData;
  briefData: SessionBriefDisplayData | null;
  isGenerating: boolean;
  onGenerateBrief: () => void;
}

interface Signal {
  icon: string;
  text: string;
  tone: "warning" | "positive" | "neutral";
}

export function AIBriefingPanel({
  data,
  briefData,
  isGenerating,
  onGenerateBrief,
}: AIBriefingPanelProps) {
  const { profile, context } = data;
  const { summary, student } = profile;

  const signals: Signal[] = [];

  if (summary.overdueTasks > 0) {
    signals.push({
      icon: "warning",
      text: `${summary.overdueTasks} gecikmiş görüşme öncesi takip gerektiriyor.`,
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
  const highRiskCount = context.pendingHighRiskAI.filter((r) => {
    const d = (r.detail ?? "").toLowerCase();
    return d.includes("high") || d.includes("critical");
  }).length;

  return (
    <section className="border border-violet-200 bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-violet-200 bg-violet-50/50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-violet-700">
          <Icon name="auto_awesome" filled className="text-[18px]" />
          AI Görüşme Özeti
        </h2>
        <div className="flex items-center gap-3">
          {briefData && (
            <span className="text-[10px] font-mono text-violet-600/70">
              Oluşturulma: {new Date(briefData.generatedAt).toLocaleString("tr-TR")}
            </span>
          )}
          <button
            type="button"
            onClick={onGenerateBrief}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded border border-violet-300 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              name={isGenerating ? "hourglass_empty" : "refresh"}
              className={cn("text-sm", isGenerating && "animate-spin")}
            />
            {isGenerating ? "Oluşturuluyor..." : briefData ? "Yeniden Oluştur" : "AI Özeti Oluştur"}
          </button>
        </div>
      </div>

      {briefData ? (
        <div className="grid grid-cols-1 gap-0 md:grid-cols-12">
          {/* Left: AI-generated briefing */}
          <div className="space-y-5 px-6 py-6 md:col-span-7 md:border-r md:border-outline-variant">
            {/* Current Situation */}
            <div>
              <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                Mevcut Durum
                {student.attentionStatus && attentionEmphasis !== "neutral" && (
                  <span
                    className={cn(
                      "border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider",
                      attentionEmphasis === "critical"
                        ? "border-destructive/50 bg-destructive/10 text-destructive"
                        : "border-outline-variant bg-surface-high text-on-surface"
                    )}
                  >
                    {localizeStatus(student.attentionStatus)}
                  </span>
                )}
              </p>
              <p className="text-sm leading-relaxed text-on-surface">
                {briefData.currentSituation}
              </p>
            </div>

            {/* Progress Since Last Session */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                Son Görüşmeden Bu Yana İlerleme
              </p>
              <p className="text-sm leading-relaxed text-on-surface">
                {briefData.progressSinceLastSession}
              </p>
            </div>

            {/* Risks */}
            {briefData.risks.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-destructive">
                  Riskler
                </p>
                <ul className="space-y-1.5">
                  {briefData.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                      <Icon name="warning" filled className="mt-0.5 shrink-0 text-[14px] text-destructive" />
                      <span>{risk.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Opportunities */}
            {briefData.opportunities.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
                  Fırsatlar
                </p>
                <ul className="space-y-1.5">
                  {briefData.opportunities.map((opp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                      <Icon name="check_circle" filled className="mt-0.5 shrink-0 text-[14px] text-primary" />
                      <span>{opp.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Actions + Checklist + Metrics */}
          <div className="space-y-5 px-6 py-6 md:col-span-5">
            {/* Confidence */}
            <div className="border border-outline-variant bg-surface-low p-3">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                AI Güven Skoru
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums leading-none text-on-surface">
                %{briefData.confidence}
              </p>
            </div>

            {/* Discussion Topics */}
            {briefData.discussionTopics.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-violet-700">
                  Önerilen Görüşme Konuları
                </p>
                <ul className="space-y-1.5">
                  {briefData.discussionTopics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                      <Icon name="chat" className="mt-0.5 shrink-0 text-[14px] text-violet-600" />
                      <span>{topic.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            {briefData.actions.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                  Önerilen Aksiyonlar
                </p>
                <ul className="space-y-1.5">
                  {briefData.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                      <Icon name="arrow_forward" className="mt-0.5 shrink-0 text-[14px] text-on-surface-variant" />
                      <span>{action.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Checklist */}
            {briefData.checklist.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                  Koç Kontrol Listesi
                </p>
                <ul className="space-y-1.5">
                  {briefData.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                      <Icon name="checklist" className="mt-0.5 shrink-0 text-[14px] text-on-surface-variant" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Fallback: Show existing static briefing when no AI brief is generated */
        <div className="grid grid-cols-1 gap-0 md:grid-cols-12">
          {/* Left: situation + signals */}
          <div className="space-y-5 px-6 py-6 md:col-span-7 md:border-r md:border-outline-variant">
            <div>
              <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                Öğrencinin Mevcut Durumu
                {student.attentionStatus && attentionEmphasis !== "neutral" && (
                  <span
                    className={cn(
                      "border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider",
                      attentionEmphasis === "critical"
                        ? "border-destructive/50 bg-destructive/10 text-destructive"
                        : "border-outline-variant bg-surface-high text-on-surface"
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
                            : "text-on-surface"
                        )}
                      />
                      <span>{s.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">
                Şu anda takip gerektiren aktif sinyal yok. AI özeti oluşturmak için yukarıdaki butonu kullanın.
              </p>
            )}
          </div>

          {/* Right: metrics + top recommendation */}
          <div className="space-y-5 px-6 py-6 md:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-outline-variant bg-surface-low p-3">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                  Gecikmiş Görev
                </p>
                <p
                  className={cn(
                    "mt-1 text-xl font-bold tabular-nums leading-none",
                    summary.overdueTasks > 0
                      ? "text-destructive"
                      : "text-on-surface"
                  )}
                >
                  {summary.overdueTasks}
                </p>
              </div>
              <div className="border border-outline-variant bg-surface-low p-3">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                  Bekleyen AI
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums leading-none text-on-surface">
                  {summary.pendingAIRecommendations}
                </p>
              </div>
              {highRiskCount > 0 && (
                <div className="col-span-2 border border-destructive/40 bg-destructive/5 p-3">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-destructive">
                    Yüksek Riskli AI Önerisi
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums leading-none text-destructive">
                    {highRiskCount}
                  </p>
                </div>
              )}
            </div>

            {topAI && (
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-violet-700">
                  Öne Çıkan AI Önerisi
                </p>
                <div className="border border-violet-200 bg-violet-50/40 p-3">
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
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
