import { Icon } from "@/components/icon";
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
    });
  }

  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          <span className="inline-block h-2 w-2 bg-primary" />
          Görüşme Gündemi
        </h2>
        <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          Mevcut kayıtlardan
        </span>
      </div>

      <div className="px-5 py-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          Görüşmede Ele Alınabilecek Konular
        </p>

        {items.length > 0 ? (
          <ul className="space-y-2.5">
            {items.map((item) => (
              <li key={item.key} className="flex items-start gap-3">
                <Icon
                  name={item.icon}
                  className="mt-0.5 shrink-0 text-[16px] text-on-surface-variant"
                />
                <div className="min-w-0">
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
