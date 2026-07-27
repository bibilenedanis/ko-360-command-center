import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/icon";

const topNav = [
  { to: "/", label: "Kontrol Merkezi" },
  { to: "/students", label: "Öğrenciler" },
  { to: "/schedule", label: "Takvim" },
  { to: "/resources", label: "Kaynaklar" },
] as const;

export function TopNavigation() {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 h-16 bg-surface border-b border-outline-variant">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <span className="text-2xl font-extrabold tracking-tight text-primary">Koç360</span>
          <nav className="hidden lg:flex items-center gap-8">
            {topNav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="text-xs font-mono font-semibold uppercase text-secondary hover:text-primary transition-colors pb-1 border-b-2 border-transparent data-[status=active]:text-primary data-[status=active]:border-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Takvim"
            className="p-2 rounded-full hover:bg-surface-high transition-colors text-primary"
          >
            <Icon name="calendar_today" className="text-[22px]" />
          </button>
          <div className="w-9 h-9 rounded-full bg-surface-high border border-outline-variant overflow-hidden flex items-center justify-center text-secondary">
            <Icon name="person" className="text-[22px]" />
          </div>
        </div>
      </div>
    </header>
  );
}
