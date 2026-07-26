import { Icon } from "@/components/icon";

export function FloatingActionButton() {
  return (
    <button
      type="button"
      aria-label="Create"
      className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform z-40"
    >
      <Icon name="add" className="text-[26px]" />
    </button>
  );
}
