import { useEffect, useRef, useState } from 'react';
import { identity } from '../data/profile';
import { isTouch } from '../lib/motion';

const to = encodeURIComponent(identity.email);
const options = [
  { label: 'Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}` },
  { label: 'Outlook', href: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}` },
  { label: 'Mail app', href: `mailto:${identity.email}` },
];

/**
 * "Email me" without printing the address on the page. Phones open the mail app directly;
 * on desktop (where mailto: often has no app behind it) a small menu offers webmail or copying.
 */
export function EmailButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1400);
    } catch {
      window.location.href = `mailto:${identity.email}`;
    }
  };

  return (
    <div className="email" ref={box}>
      <button
        className="btn btn--solid"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (isTouch() ? (window.location.href = `mailto:${identity.email}`) : setOpen((o) => !o))}
      >
        ✉ Email me
      </button>
      {open && (
        <div className="email__menu mono" role="menu">
          {options.map((o) => (
            <a key={o.label} role="menuitem" href={o.href} target={o.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" onClick={() => setOpen(false)}>
              {o.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
          <button role="menuitem" onClick={copy}>{copied ? 'Copied ✓' : 'Copy address'}</button>
        </div>
      )}
    </div>
  );
}
