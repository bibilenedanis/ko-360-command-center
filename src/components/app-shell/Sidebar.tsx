import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const primaryNav = [
  { to: "/", label: "Command Center", icon: "dashboard" },
  { to: "/students", label: "Students", icon: "group" },
  { to: "/schedule", label: "Schedule", icon: "event_note" },
  { to: "/resources", label: "Resources", icon: "menu_book" },
] as const;

const bottomNav = [
  { to: "/", label: "Settings", icon: "settings" },
  { to: "/", label: "Help", icon: "help" },
] as const;

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-surface-lowest border-r border-outline-variant z-40">
      <div className="px-6 py-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">Koç360</h1>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-secondary font-mono">
          Coach Dashboard
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {primaryNav.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-high transition-colors data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
          >
            <Icon name={item.icon} className="text-[20px]" />
            <span className={cn("text-xs font-mono font-semibold uppercase")}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-6 space-y-1">
        {bottomNav.map((item) => (
          <button
            key={item.label}
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-high transition-colors"
          >
            <Icon name={item.icon} className="text-[20px]" />
            <span className="text-xs font-mono font-semibold uppercase">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
