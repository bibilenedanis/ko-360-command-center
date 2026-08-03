import { Icon } from "@/components/icon";

interface QuickAction {
  icon: string;
  title: string;
  description: string;
}

interface QuickActionsPanelProps {
  actions?: QuickAction[];
  regenerateLabel?: string;
  regenerateDescription?: string;
}

const defaultActions: QuickAction[] = [
  {
    icon: "picture_as_pdf",
    title: "Export PDF",
    description: "Create printable version",
  },
  {
    icon: "family_restroom",
    title: "Parent Version",
    description: "Hide coach-only notes",
  },
  {
    icon: "person",
    title: "Student Version",
    description: "Student-friendly wording",
  },
  {
    icon: "share",
    title: "Share Report",
    description: "Generate secure share link",
  },
];

export function QuickActionsPanel({
  actions = defaultActions,
  regenerateLabel = "Regenerate AI",
  regenerateDescription = "Create a new AI draft using updated data",
}: QuickActionsPanelProps) {
  return (
    <div className="bg-surface border border-outline-variant p-6">
      <h3 className="text-xs font-mono font-bold uppercase text-on-surface-variant mb-4">
        Quick Actions
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            type="button"
            className="w-full flex items-center gap-3 p-3 border border-outline-variant hover:bg-surface-container-high transition-colors"
          >
            <Icon name={action.icon} className="text-[20px]" />
            <div className="text-left">
              <p className="text-xs font-mono font-bold">{action.title}</p>
              <p className="text-[11px] text-on-surface-variant">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-outline-variant">
        <button
          type="button"
          className="w-full flex flex-col items-center justify-center p-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase">
            <Icon name="refresh" className="text-sm" />
            {regenerateLabel}
          </div>
          <p className="text-[11px] font-mono lowercase opacity-70">
            {regenerateDescription}
          </p>
        </button>
      </div>
    </div>
  );
}
