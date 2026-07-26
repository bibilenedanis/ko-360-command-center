import { Icon } from "@/components/icon";
import type { QuickAction } from "@/types/koc360";

interface Props {
  actions: QuickAction[];
}

export function QuickSupport({ actions }: Props) {
  return (
    <section className="space-y-4">
      <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-secondary opacity-60 px-1">
        Quick Support
      </h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="w-full text-left p-4 border border-outline-variant bg-surface hover:bg-surface-high flex justify-between items-center transition-colors rounded"
          >
            <span className="text-base text-primary">{action.label}</span>
            <Icon name={action.icon} className="text-[18px] text-secondary" />
          </button>
        ))}
      </div>
    </section>
  );
}
