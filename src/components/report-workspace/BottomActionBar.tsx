import { Icon } from "@/components/icon";

export function BottomActionBar() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-end gap-4 px-4 py-4 bg-surface/80 backdrop-blur-sm border-t border-outline-variant">
      <button
        type="button"
        className="text-on-surface-variant p-2 hover:text-primary transition-colors font-mono font-bold text-xs flex items-center gap-2"
      >
        <Icon name="save" className="text-[18px]" />
        Save Draft
      </button>
      <button
        type="button"
        className="border border-outline text-on-surface p-2 px-6 hover:bg-surface-container transition-colors font-mono font-bold text-xs flex items-center gap-2 rounded-xl"
      >
        <Icon name="check_circle" className="text-[18px]" />
        Approve Report
      </button>
      <button
        type="button"
        className="bg-primary text-on-primary rounded-xl p-2 px-8 font-mono font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <Icon name="publish" className="text-[18px]" />
        Publish Report
      </button>
    </footer>
  );
}
