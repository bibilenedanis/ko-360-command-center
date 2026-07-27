import type { AttentionItem as AttentionItemType } from "@/types/koc360";
import { cn } from "@/lib/utils";
import { localizeAttentionCode, localizeLevel, localizeSignalText } from "@/lib/ui/labels";

interface Props {
  item: AttentionItemType;
}

const statusColor: Record<AttentionItemType["status"], string> = {
  DECLINING: "text-destructive",
  DEADLINE: "text-primary",
  "MISSING DATA": "text-secondary",
};

export function AttentionItem({ item }: Props) {
  return (
    <div className="relative p-6 hover:bg-surface-low transition-colors cursor-pointer">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center gap-3">
          <span className="text-lg font-semibold text-primary">{item.name}</span>
          <span
            className={cn(
              "text-xs font-mono font-semibold tracking-wider whitespace-nowrap",
              statusColor[item.status],
            )}
          >
            {localizeAttentionCode(item.status)}
          </span>
        </div>
        <p className="text-secondary text-sm leading-relaxed">
          {localizeSignalText(item.description) || item.description}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <span className="font-mono text-[10px] tracking-wider text-secondary opacity-60">
            ID: {item.studentId}
          </span>
          <span className="font-mono text-[10px] tracking-wider text-secondary opacity-60">
            SEVİYE: {localizeLevel(item.level)}
          </span>
        </div>
      </div>
    </div>
  );
}
