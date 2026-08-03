import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { ReportStatus } from "@/lib/report/report.types";

const sections = [
  { key: "sources", label: "AI Sources", icon: "source" },
  { key: "confidence", label: "Confidence", icon: "analytics" },
  { key: "actions", label: "Actions", icon: "bolt" },
  { key: "history", label: "History", icon: "history" },
  { key: "settings", label: "Settings", icon: "settings" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

interface ReportSidebarProps {
  activeSection?: SectionKey;
  reportStatus?: ReportStatus;
}

export function ReportSidebar({
  activeSection = "sources",
  reportStatus = "draft",
}: ReportSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-surface-container-low border-r border-outline-variant z-20">
      <div className="p-6">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-1">
          Report Workspace
        </h2>
        <p className="text-xs text-on-surface-variant capitalize">{reportStatus}</p>
      </div>

      <nav className="flex-1 flex flex-col">
        <div className="px-2 space-y-1">
          {sections.map((section) => {
            const isActive = section.key === activeSection;
            return (
              <button
                key={section.key}
                type="button"
                className={cn(
                  "flex items-center gap-3 px-4 py-3 w-full text-left transition-colors",
                  isActive
                    ? "border-l-2 border-primary bg-surface-container-high text-primary font-bold"
                    : "text-on-secondary-container hover:bg-surface-container font-semibold",
                )}
              >
                <Icon name={section.icon} className="text-[20px]" />
                <span className="text-xs font-mono uppercase tracking-wider">
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-outline-variant">
        <button
          type="button"
          className="w-full bg-primary text-on-primary py-3 rounded text-xs font-mono font-bold uppercase tracking-wider mb-4 hover:opacity-90 transition-opacity"
        >
          Generate Section
        </button>
        <div className="space-y-1">
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-2 w-full text-on-secondary-container hover:bg-surface-container transition-colors"
          >
            <Icon name="archive" className="text-[20px]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">
              Archive
            </span>
          </button>
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-2 w-full text-on-secondary-container hover:bg-surface-container transition-colors"
          >
            <Icon name="help" className="text-[20px]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">
              Support
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
