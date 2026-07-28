import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { StudentProfileRecord } from "@/lib/students/profile.server";

interface SessionAgendaPanelProps {
  activeSprint: StudentProfileRecord | null;
  activeGoal: StudentProfileRecord | null;
  overdueTasks: StudentProfileRecord[];
}

interface AgendaItem {
  key: string;
  source: string;
  title: string;
  icon: string;
  urgent?: boolean;
}

export function SessionAgendaPanel({
  activeSprint,
  activeGoal,
  overdueTasks,
}: SessionAgendaPanelProps) {
  const items: AgendaItem[] = [];

  if (activeSprint?.detail) {
    items.push({
      key: `sprint-${activeSprint.id}`,
      source: "Aktif Sprint Odağı",
      title: activeSprint.detail,
      icon: "bolt",
    });
  }
  if (activeGoal) {
    items.push({
      key: `goal-${activeGoal.id}`,
      source: "Aktif Hedef",
      title: activeGoal.title,
      icon: "flag",
    });
  }
  for (const task of overdueTasks.slice(0, 4)) {
    items.push({
      key: `task-${task.id}`,
      source: "Gecikmiş Görev",
      title: task.title,
      icon: "warning",
      urgent: true,
    });
  }

  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          <span className="inline-block h-2 w-2 bg-primary" />
          Görüşme Gündemi
        </h2>
      </div>

      <div className="px-5 py-4">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          Mevcut öğrenci kayıtlarından oluşturulan görüşme bağlamı
        </p>

        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.key}
                className={cn(
                  "flex items-start gap-3 rounded border px-3 py-2.5",
                  item.urgent
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-outline-variant bg-surface-low",
                )}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-outline-variant bg-surface-lowest">
                  <Icon
                    name={item.icon}
                    className={cn(
                      "text-[14px]",
                      item.urgent ? "text-destructive" : "text-on-surface-variant",
                    )}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                    {item.source}
                  </p>
                  <p className="text-sm leading-snug text-on-surface">
                    {item.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-on-surface-variant">
            Görüşme gündemi oluşturmak için kullanılabilecek aktif kayıt
            bulunmuyor.
          </p>
        )}
      </div>
    </section>
  );
}
