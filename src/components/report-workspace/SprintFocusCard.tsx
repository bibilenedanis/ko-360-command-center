interface SprintFocusItem {
  title: string;
  detail: string;
}

interface SprintFocusCardProps {
  items: SprintFocusItem[];
}

export function SprintFocusCard({ items }: SprintFocusCardProps) {
  return (
    <article className="bg-surface border border-outline-variant p-6">
      <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
        <h3 className="text-xs font-mono font-bold uppercase text-on-surface-variant">
          Next Sprint Focus
        </h3>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="w-4 h-4 mt-1 border border-primary rounded-full flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">{item.title}</h4>
              <p className="text-xs text-on-surface-variant">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
