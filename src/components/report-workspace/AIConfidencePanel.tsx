import { Icon } from "@/components/icon";

interface AIConfidencePanelProps {
  confidence: number;
  missingSources: string[];
  suggestions: string[];
  readiness: number;
  readinessLabel: string;
}

export function AIConfidencePanel({
  confidence,
  missingSources,
  suggestions,
  readiness,
  readinessLabel,
}: AIConfidencePanelProps) {
  return (
    <div className="bg-surface-container-low border border-outline-variant p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-mono font-bold uppercase text-on-surface-variant">
          AI Confidence
        </h3>
        <span className="text-xs font-mono font-bold text-primary">
          {confidence}%
        </span>
      </div>
      <div className="w-full bg-surface-variant h-1 mb-6">
        <div
          className="bg-primary h-1"
          style={{ width: `${confidence}%` }}
        />
      </div>

      <p className="text-[11px] font-mono uppercase text-on-surface-variant mb-3">
        Missing Information
      </p>
      <ul className="space-y-2 mb-6">
        {missingSources.map((info, index) => (
          <li
            key={index}
            className="text-xs flex gap-2 items-start text-error"
          >
            <Icon name="error" className="text-sm mt-0.5" />
            {info}
          </li>
        ))}
      </ul>

      <p className="text-[11px] font-mono uppercase text-on-surface-variant mb-3">
        Suggestions
      </p>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            className="w-full text-left p-3 border border-dashed border-outline-variant hover:border-primary text-xs transition-colors group"
          >
            <span className="group-hover:underline">{suggestion}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-outline-variant">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] font-mono uppercase text-on-surface-variant">
            Publishing Readiness
          </p>
          <span className="text-xs font-mono font-bold text-primary">
            {readiness}%
          </span>
        </div>
        <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mb-2">
          <div
            className="bg-primary h-full"
            style={{ width: `${readiness}%` }}
          />
        </div>
        <p className="text-xs font-bold text-primary">{readinessLabel}</p>
      </div>
    </div>
  );
}
