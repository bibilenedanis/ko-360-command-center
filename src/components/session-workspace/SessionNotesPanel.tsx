import { Icon } from "@/components/icon";

const SECTIONS = [
  {
    key: "wins",
    label: "Kazanımlar ve İlerleme",
    hint: "Son görüşmeden bu yana neler iyi gitti?",
  },
  {
    key: "challenges",
    label: "Zorluklar ve Engeller",
    hint: "Öğrenciyi neler zorladı?",
  },
  {
    key: "core",
    label: "Temel Görüşme Noktaları",
    hint: "Önemli içgörüler, bakış açısı değişimleri, kırılma anları...",
    highlighted: true,
  },
  {
    key: "commitments",
    label: "Taahhütler ve Çalışmalar",
    hint: "Bir sonraki sprint için acción maddeleri...",
  },
] as const;

export function SessionNotesPanel() {
  return (
    <section className="flex min-h-[560px] flex-col border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Icon name="edit_note" className="text-[18px] text-on-surface-variant" />
          <h2 className="text-sm font-bold text-on-surface">Görüşme Notları</h2>
        </div>
        <span className="border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant">
          Salt Okunur
        </span>
      </div>

      <div className="flex-1 space-y-6 px-5 py-5">
        {SECTIONS.map((s) => (
          <div key={s.key}>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
              {s.label}
            </label>
            <div
              className={
                s.highlighted
                  ? "min-h-[120px] rounded border border-dashed border-outline-variant bg-surface-low p-4"
                  : "min-h-[64px] rounded border border-dashed border-outline-variant bg-surface-low/50 p-4"
              }
            >
              <p className="text-sm italic text-on-surface-variant/70">{s.hint}</p>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-3 border-t border-outline-variant pt-4">
          <Icon name="lock" className="mt-0.5 shrink-0 text-[18px] text-on-surface-variant" />
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Bu sürümde görüşme notları salt okunurdur. Not kaydetme özelliği
            sonraki aşamada etkinleştirilecektir.
          </p>
        </div>
      </div>
    </section>
  );
}
