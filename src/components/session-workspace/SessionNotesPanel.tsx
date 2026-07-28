import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { SessionWorkspaceSession } from "@/lib/sessions/workspace.server";

interface SessionNotesPanelProps {
  session: SessionWorkspaceSession;
}

interface Section {
  key: string;
  label: string;
  hint: string;
  value: string;
  highlighted?: boolean;
}

export function SessionNotesPanel({ session }: SessionNotesPanelProps) {
  const sections: Section[] = [
    {
      key: "wins",
      label: "Kazanımlar ve İlerleme",
      hint: "Son görüşmeden bu yana neler iyi gitti?",
      value: session.winsAndProgress,
    },
    {
      key: "challenges",
      label: "Zorluklar ve Engeller",
      hint: "Öğrenciyi neler zorladı?",
      value: session.challengesAndObstacles,
    },
    {
      key: "core",
      label: "Temel Görüşme Noktaları",
      hint: "Önemli içgörüler, bakış açısı değişimleri, kırılma anları...",
      value: session.coreNotes,
      highlighted: true,
    },
    {
      key: "commitments",
      label: "Taahhütler ve Çalışmalar",
      hint: "Bir sonraki sprint için takip maddeleri...",
      value: session.commitments,
    },
  ];

  return (
    <section className="flex flex-col border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
        <div className="flex items-center gap-2">
          <Icon name="edit_note" className="text-[18px] text-on-surface-variant" />
          <h2 className="text-sm font-bold text-on-surface">Görüşme Notları</h2>
        </div>
        <span className="border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant">
          Salt Okunur
        </span>
      </div>

      <div className="flex-1 divide-y divide-outline-variant">
        {sections.map((s) => {
          const hasContent = s.value.trim().length > 0;
          return (
            <div key={s.key} className="px-5 py-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                {s.label}
              </p>
              {hasContent ? (
                <p
                  className={cn(
                    "mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-on-surface",
                    s.highlighted && "border-l-2 border-outline-variant pl-3",
                  )}
                >
                  {s.value}
                </p>
              ) : (
                <p
                  className={cn(
                    "mt-1.5 text-sm leading-relaxed text-on-surface-variant/70",
                    s.highlighted && "border-l-2 border-outline-variant pl-3",
                  )}
                >
                  {s.hint}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2.5 border-t border-outline-variant bg-surface-low/40 px-5 py-3">
        <Icon name="lock" className="mt-0.5 shrink-0 text-[16px] text-on-surface-variant" />
        <p className="text-xs leading-relaxed text-on-surface-variant">
          Bu sürümde görüşme notları salt okunurdur. Not kaydetme özelliği
          sonraki aşamada etkinleştirilecektir.
        </p>
      </div>
    </section>
  );
}
