import { Icon } from "@/components/icon";
import type { DailyBrief as DailyBriefType } from "@/types/koc360";

interface Props {
  brief: DailyBriefType;
}

export function DailyBrief({ brief }: Props) {
  const { greeting, body, highlight } = brief;

  const rendered = highlight && body.includes(highlight)
    ? body.split(highlight).flatMap((chunk, i, arr) =>
        i < arr.length - 1
          ? [chunk, <span key={i} className="underline decoration-2 underline-offset-4">{highlight}</span>]
          : [chunk],
      )
    : [body];

  return (
    <div className="bg-surface-lowest border border-outline-variant rounded p-8 md:p-10">
      <header className="flex items-center gap-2 mb-5">
        <Icon name="auto_awesome" filled className="text-primary text-[20px]" />
        <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-secondary">
          AI Daily Brief
        </h2>
      </header>
      <p className="text-2xl md:text-[32px] leading-tight font-semibold tracking-tight text-primary">
        {greeting}{" "}
        {rendered.map((node, i) => (
          <span key={i}>{node}</span>
        ))}
      </p>
    </div>
  );
}
