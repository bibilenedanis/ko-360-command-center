import { Icon } from "@/components/icon";
import type { PriorityItem } from "@/types/koc360";
import { cn } from "@/lib/utils";

interface Props {
  item: PriorityItem;
}

export function PriorityCard({ item }: Props) {
  const isCritical = item.category === "CRITICAL";

  return (
    <button
      type="button"
      className="group text-left bg-surface-lowest border border-outline-variant p-6 rounded hover:border-primary transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <span
          className={cn(
            "px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider",
            isCritical
              ? "bg-primary text-primary-foreground"
              : "border border-outline-variant text-secondary",
          )}
        >
          {item.category}
        </span>
        <Icon
          name="arrow_forward"
          className="text-secondary text-[20px] group-hover:text-primary transition-colors"
        />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-1">{item.title}</h3>
      <p className="text-secondary text-sm leading-relaxed">{item.description}</p>
    </button>
  );
}
