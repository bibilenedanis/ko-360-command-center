import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "assessment", label: "Değerlendirme", icon: "assignment" },
  { key: "goals", label: "Hedefler", icon: "flag" },
  { key: "sprint", label: "Sprint", icon: "bolt" },
  { key: "session", label: "Görüşme", icon: "forum" },
  { key: "report", label: "Rapor", icon: "description" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

interface CoachingFlowStripProps {
  activeStep?: StepKey;
}

export function CoachingFlowStrip({
  activeStep = "session",
}: CoachingFlowStripProps) {
  return (
    <section
      aria-label="Koçluk Akışı"
      className="border border-outline-variant bg-surface-lowest px-5 py-4"
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
        Koçluk Akışı
      </p>
      <ol className="flex flex-wrap items-center gap-1.5">
        {STEPS.map((step, i) => {
          const active = step.key === activeStep;
          return (
            <li key={step.key} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center gap-2 border px-3 py-1.5",
                  active
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant bg-surface-high text-on-surface-variant",
                )}
              >
                <Icon
                  name={step.icon}
                  filled={active}
                  className="text-[14px]"
                />
                <span
                  className={cn(
                    "text-[11px] font-mono font-semibold uppercase tracking-wider",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <Icon
                  name="chevron_right"
                  className="text-[16px] text-on-surface-variant"
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
