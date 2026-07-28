import { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { SessionWorkspaceSession } from "@/lib/sessions/workspace.server";

interface SaveSessionNotesFn {
  (input: {
    data: {
      sessionId: string;
      winsAndProgress: string;
      challengesAndObstacles: string;
      coreNotes: string;
      commitments: string;
    };
  }): Promise<{ ok: true } | { ok: false; reason: string }>;
}

interface SessionNotesPanelProps {
  session: SessionWorkspaceSession;
  onSave: SaveSessionNotesFn;
}

interface Section {
  key: keyof Pick<
    SessionWorkspaceSession,
    "winsAndProgress" | "challengesAndObstacles" | "coreNotes" | "commitments"
  >;
  label: string;
  hint: string;
  highlighted?: boolean;
}

const sections: Section[] = [
  {
    key: "winsAndProgress",
    label: "Kazanımlar ve İlerleme",
    hint: "Son görüşmeden bu yana neler iyi gitti?",
  },
  {
    key: "challengesAndObstacles",
    label: "Zorluklar ve Engeller",
    hint: "Öğrenciyi neler zorladı?",
  },
  {
    key: "coreNotes",
    label: "Temel Görüşme Noktaları",
    hint: "Önemli içgörüler, bakış açısı değişimleri, kırılma anları...",
    highlighted: true,
  },
  {
    key: "commitments",
    label: "Taahhütler ve Çalışmalar",
    hint: "Bir sonraki sprint için takip maddeleri...",
  },
];

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export function SessionNotesPanel({ session, onSave }: SessionNotesPanelProps) {
  const router = useRouter();
  const [draft, setDraft] = useState({
    winsAndProgress: session.winsAndProgress,
    challengesAndObstacles: session.challengesAndObstacles,
    coreNotes: session.coreNotes,
    commitments: session.commitments,
  });

  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    setDraft({
      winsAndProgress: session.winsAndProgress,
      challengesAndObstacles: session.challengesAndObstacles,
      coreNotes: session.coreNotes,
      commitments: session.commitments,
    });
    setSaveState("idle");
  }, [
    session.winsAndProgress,
    session.challengesAndObstacles,
    session.coreNotes,
    session.commitments,
  ]);

  const isDirty =
    draft.winsAndProgress !== session.winsAndProgress ||
    draft.challengesAndObstacles !== session.challengesAndObstacles ||
    draft.coreNotes !== session.coreNotes ||
    draft.commitments !== session.commitments;

  const handleFieldChange = (
    key: keyof typeof draft,
    value: string,
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (saveState === "saved" || saveState === "error") {
      setSaveState("dirty");
    } else if (saveState === "idle") {
      setSaveState("dirty");
    }
  };

  const handleSave = async () => {
    setSaveState("saving");

    const result = await onSave({
      data: {
        sessionId: session.id,
        winsAndProgress: draft.winsAndProgress,
        challengesAndObstacles: draft.challengesAndObstacles,
        coreNotes: draft.coreNotes,
        commitments: draft.commitments,
      },
    });

    if (result.ok) {
      setSaveState("saved");
      await router.invalidate();
    } else {
      setSaveState("error");
    }
  };

  return (
    <section className="flex flex-col border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3">
        <div className="flex items-center gap-2">
          <Icon name="edit_note" className="text-[18px] text-on-surface-variant" />
          <h2 className="text-sm font-bold text-on-surface">Görüşme Notları</h2>
        </div>
        <SaveStateBadge state={saveState} isDirty={isDirty} />
      </div>

      <div className="flex-1 divide-y divide-outline-variant">
        {sections.map((s) => {
          const value = draft[s.key];
          return (
            <div key={s.key} className="px-5 py-3.5">
              <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                {s.label}
              </label>
              <textarea
                value={value}
                onChange={(e) => handleFieldChange(s.key, e.target.value)}
                placeholder={s.hint}
                rows={3}
                className={cn(
                  "mt-1.5 w-full resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-0",
                  s.highlighted && "border-l-2 border-outline-variant pl-3",
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant bg-surface-low/40 px-5 py-3">
        <div className="flex-1">
          {saveState === "error" && (
            <p className="text-xs text-destructive">Görüşme notları kaydedilemedi.</p>
          )}
          {saveState === "saved" && (
            <p className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Icon name="check_circle" className="text-[16px]" />
              Notlar kaydedildi
            </p>
          )}
          {saveState === "idle" && !isDirty && (
            <p className="text-xs text-on-surface-variant">
              Değişiklik yapılmadı
            </p>
          )}
          {saveState === "dirty" && isDirty && (
            <p className="text-xs text-on-surface-variant">
              Kaydedilmemiş değişiklikler var
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || saveState === "saving"}
          className={cn(
            "flex items-center gap-2 rounded border px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-opacity",
            !isDirty || saveState === "saving"
              ? "cursor-not-allowed border-outline-variant bg-surface-high text-on-surface-variant opacity-50"
              : "border-outline-variant bg-surface text-on-surface hover:opacity-70",
          )}
        >
          {saveState === "saving" ? (
            <>
              <Icon name="hourglass_empty" className="text-[16px]" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Icon name="save" className="text-[16px]" />
              Notları Kaydet
            </>
          )}
        </button>
      </div>
    </section>
  );
}

function SaveStateBadge({
  state,
  isDirty,
}: {
  state: SaveState;
  isDirty: boolean;
}) {
  if (state === "saving") {
    return (
      <span className="border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant">
        Kaydediliyor
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span className="border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant">
        Kaydedildi
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="border border-destructive bg-destructive/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-destructive">
        Hata
      </span>
    );
  }
  if (isDirty || state === "dirty") {
    return (
      <span className="border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant">
        Değişti
      </span>
    );
  }
  return (
    <span className="border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant">
      Kayıtlı
    </span>
  );
}
