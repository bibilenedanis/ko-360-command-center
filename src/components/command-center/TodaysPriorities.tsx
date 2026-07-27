import type { PriorityItem } from "@/types/koc360";
import { PriorityCard } from "./PriorityCard";

interface Props {
  items: PriorityItem[];
}

export function TodaysPriorities({ items }: Props) {
  const pending = items.length;
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end border-b border-outline-variant pb-2">
        <h2 className="text-xl font-semibold text-primary">Bugünün Öncelikleri</h2>
        <span className="text-xs font-mono font-semibold tracking-wider text-secondary opacity-60">
          {pending} BEKLİYOR
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <PriorityCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
