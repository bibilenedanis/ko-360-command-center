import { Icon } from "@/components/icon";

interface AISummarySection {
  label: string;
  content: string;
}

interface AISummaryCardProps {
  sections: AISummarySection[];
}

export function AISummaryCard({ sections }: AISummaryCardProps) {
  return (
    <article className="bg-surface border border-outline-variant p-6">
      <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
        <h3 className="text-xs font-mono font-bold uppercase text-on-surface-variant">
          AI Summary
        </h3>
        <Icon name="edit" className="text-on-surface-variant cursor-pointer text-[18px]" />
      </div>
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-1">
            <p className="text-[11px] font-mono uppercase text-on-surface-variant">
              {section.label}
            </p>
            <p className="text-sm text-on-surface leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
