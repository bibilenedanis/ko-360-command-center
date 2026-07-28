import { Icon } from "@/components/icon";

export function SessionNotesPanel() {
  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          <span className="inline-block h-2 w-2 bg-primary" />
          Görüşme Notları
        </h2>
        <span className="border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface">
          Salt okunur
        </span>
      </div>

      <div className="flex items-start gap-3 px-5 py-6">
        <Icon
          name="lock"
          className="mt-0.5 shrink-0 text-[18px] text-on-surface-variant"
        />
        <p className="text-sm leading-relaxed text-on-surface-variant">
          Bu sürümde görüşme notları salt okunur yapıdadır. Not kaydetme
          özelliği sonraki aşamada etkinleştirilecektir.
        </p>
      </div>
    </section>
  );
}
