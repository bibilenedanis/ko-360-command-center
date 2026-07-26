import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  filled?: boolean;
  className?: string;
}

export function Icon({ name, filled, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "material-symbols-outlined select-none leading-none",
        filled && "filled",
        className,
      )}
    >
      {name}
    </span>
  );
}
