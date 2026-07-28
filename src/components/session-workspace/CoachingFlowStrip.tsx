import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "assessment", label: "Değerlendirme", icon: "assignment" },
  { key: "goals", label: "Hedefler", icon: "flag" },
  { key: "sprint", label: "Sprint", icon: "bolt" },
  { key: "session", label: "Görüşme", icon: "play_circle" },
  { key: "report", label: "Rapor", icon: "description" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

interface CoachingFlowStripProps {
  activeStep?: StepKey;
}

export function CoachingFlowStrip({
  activeStep = "session",
}: CoachingFlowStripProps) {
  const activeIndex = STEPS.findIndex((s) => s.key === activeStep);

  return (
    <nav
      aria-label="Koçluk Akışı"
      className="border border-outline-variant bg-surface-lowest px-8 py-5"
    >
      <div className="relative flex items-start justify-between">
        {/* connecting line behind the circles */}
        <div className="absolute left-0 right-0 top-4 h-px bg-outline-variant" />

        {STEPS.map((step, i) => {
          const isActive = step.key === activeStep;
          const isPending = i > activeIndex;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-4 border-background transition-all",
                  isActive
                    ? "h-12 w-12 bg-primary text-on-primary shadow-md"
                    : isPending
                      ? "h-8 w-8 bg-surface-high text-on-surface-variant opacity-50"
                      : "h-8 w-8 bg-surface-lowest border border-outline-variant text-on-surface-variant",
                )}
              >
                <Icon
                  name={step.icon}
                  filled={isActive}
                  className={cn(isActive ? "text-[20px]" : "text-[16px]")}
                />
              </div>
              <span
                className={cn(
                  "text-[11px] font-mono font-semibold uppercase tracking-wider",
                  isActive
                    ? "font-bold text-primary"
                    : isPending
                      ? "text-on-surface-variant opacity-50"
                      : "text-on-surface-variant",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
