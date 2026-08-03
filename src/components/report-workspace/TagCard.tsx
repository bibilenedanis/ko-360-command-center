import { Icon } from "@/components/icon";

interface TagCardProps {
  title: string;
  icon: string;
  items: string[];
  variant?: "strength" | "challenge";
}

export function TagCard({ title, icon, items, variant = "strength" }: TagCardProps) {
  const isStrength = variant === "strength";

  return (
    <article className="bg-surface border border-outline-variant p-6">
      <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
        <h3 className="text-xs font-mono font-bold uppercase text-on-surface-variant">
          {title}
        </h3>
        <Icon
          name={icon}
          className="text-on-surface-variant cursor-pointer text-[18px]"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
              isStrength
                ? "bg-surface-container-high border border-outline-variant"
                : "border border-outline-variant"
            }`}
          >
            <Icon
              name={isStrength ? "check" : "warning"}
              className="text-sm"
            />
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
