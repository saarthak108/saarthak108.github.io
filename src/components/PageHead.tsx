import type { ReactNode } from 'react';

/** Shared editorial page opener: index label, huge title, optional lede + aside. */
export function PageHead({ index, label, title, lede, aside }: { index: string; label: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="phead wrap" data-section={label}>
      <div className="rule-label mono">
        <span>{index} / {label}</span>
        {aside && <span className="dim">{aside}</span>}
      </div>
      <h1 className="phead__title display" data-reveal>{title}</h1>
      {lede && <p className="phead__lede" data-reveal style={{ ['--d' as string]: '120ms' }}>{lede}</p>}
    </header>
  );
}
