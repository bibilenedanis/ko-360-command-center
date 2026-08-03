import { cn } from "@/lib/utils";

interface VersionEvent {
  title: string;
  timestamp: string;
  actor: string;
  isLatest?: boolean;
}

interface VersionHistoryTimelineProps {
  events: VersionEvent[];
}

export function VersionHistoryTimeline({ events }: VersionHistoryTimelineProps) {
  return (
    <section className="mt-12">
      <h3 className="text-xs font-mono font-bold uppercase text-on-surface-variant mb-4">
        Version History
      </h3>
      <div className="relative pl-8 border-l border-outline-variant space-y-8">
        {events.map((event, index) => (
          <div key={index} className="relative">
            <div
              className={cn(
                "absolute -left-[37px] top-1 w-4 h-4 rounded-full border-4 border-background",
                event.isLatest ? "bg-primary" : "bg-outline-variant",
              )}
            />
            <div>
              <p
                className={cn(
                  "text-xs font-mono font-bold",
                  event.isLatest ? "text-primary" : "text-on-surface-variant",
                )}
              >
                {event.title}
              </p>
              <p className="text-[11px] font-mono text-on-surface-variant">
                {event.timestamp} • {event.actor}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
