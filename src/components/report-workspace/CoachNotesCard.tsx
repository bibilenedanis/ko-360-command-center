import { Icon } from "@/components/icon";

interface CoachNotesCardProps {
  value: string;
}

export function CoachNotesCard({ value }: CoachNotesCardProps) {
  return (
    <article className="bg-surface border border-outline-variant p-6">
      <div className="flex justify-between items-center mb-2 border-b border-outline-variant pb-2">
        <div className="flex items-center gap-2">
          <Icon name="lock" className="text-on-surface-variant text-sm" />
          <h3 className="text-xs font-mono font-bold uppercase text-on-surface-variant">
            Private Coach Notes
          </h3>
        </div>
        <span className="text-[11px] font-mono text-on-surface-variant">
          Visible only to coaches
        </span>
      </div>
      <textarea
        className="w-full border-none focus:ring-0 p-0 text-sm text-on-surface placeholder:text-outline h-32 resize-none bg-transparent"
        placeholder="Add specific observation details here..."
        defaultValue={value}
        readOnly
      />
    </article>
  );
}
