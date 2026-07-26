import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/icon";
import type { AttentionItem as AttentionItemType } from "@/types/koc360";
import { AttentionItem } from "./AttentionItem";

interface Props {
  items: AttentionItemType[];
  totalFlagged: number;
}

export function AttentionNeeded({ items, totalFlagged }: Props) {
  return (
    <div className="bg-surface border border-outline-variant rounded overflow-hidden">
      <div className="bg-surface-high px-6 py-4 flex items-center gap-2 border-b border-outline-variant">
        <Icon name="notifications_active" className="text-primary text-[20px]" />
        <h2 className="text-lg font-semibold text-primary">Attention Needed</h2>
      </div>
      <div className="divide-y divide-[color:var(--outline-variant)]">
        {items.map((item) => (
          <AttentionItem key={item.id} item={item} />
        ))}
      </div>
      <div className="p-4 bg-surface-low text-center border-t border-outline-variant">
        <Link
          to="/students"
          search={{ filter: "attention" }}
          className="text-xs font-mono font-semibold tracking-wider text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          View All {totalFlagged} Flagged Students
        </Link>
      </div>
    </div>
  );
}
