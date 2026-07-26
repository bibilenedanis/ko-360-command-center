interface Props {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="bg-surface-lowest border border-outline-variant rounded p-10">
      <p className="text-xs font-mono font-semibold uppercase tracking-widest text-secondary">
        Phase 1 Placeholder
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary">{title}</h1>
      <p className="mt-3 text-secondary text-base leading-relaxed max-w-xl">{description}</p>
    </div>
  );
}
