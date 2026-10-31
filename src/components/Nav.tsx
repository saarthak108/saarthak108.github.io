import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { nav, identity } from '../data/profile';
import { scrollToY, setScrollLocked } from '../lib/motion';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  // Links to the current page don't navigate, so send them back to the top instead.
  const toTop = (to: string) => () => {
    if (to === pathname) {
      setOpen(false);
      scrollToY(0);
    }
  };

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    setScrollLocked(open);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <Link to="/" onClick={toTop('/')} className="nav__brand" aria-label={`${identity.name} — home`}>
        <span className="nav__mark" aria-hidden="true">
          <svg viewBox="0 0 32 32"><path d="M5 26 16 6l11 20" /><path d="M10 26h12" className="accent" /></svg>
        </span>
        <span className="nav__name">Saarthak<span>Maharana</span></span>
      </Link>

      <nav className="nav__links" aria-label="Primary">
        <NavLink to="/" end onClick={toTop('/')} className="nav__link">Home</NavLink>
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} onClick={toTop(n.to)} className="nav__link">{n.label}</NavLink>
        ))}
      </nav>

      <Link to="/contact" onClick={toTop('/contact')} className="btn btn--solid nav__cta">Contact</Link>

      <button className="nav__burger" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <i /><i />
      </button>

      {/* Portalled: the header's backdrop-filter would otherwise trap this fixed overlay. */}
      {createPortal(
      <div id="mobile-menu" className="menu" hidden={!open}>
        <ol className="menu__list">
          {[{ to: '/', label: 'Home' }, ...nav, { to: '/contact', label: 'Contact' }].map((n, i) => (
            <li key={n.to} style={{ ['--i' as string]: i }}>
              <NavLink to={n.to} end={n.to === '/'} onClick={toTop(n.to)}>
                <span className="mono">{String(i).padStart(2, '0')}</span>
                {n.label}
              </NavLink>
            </li>
          ))}
        </ol>
        <p className="menu__foot mono">{identity.role} — {identity.location}</p>
      </div>,
      document.body,
      )}
    </header>
  );
}
