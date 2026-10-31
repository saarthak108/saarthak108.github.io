import { Link, useLocation } from 'react-router-dom';
import { identity, nav, socials } from '../data/profile';
import { EmailButton } from './EmailButton';

export function Footer() {
  const { pathname } = useLocation();
  const onContact = pathname === '/contact';

  return (
    <footer className="footer" data-section={onContact ? undefined : 'Contact'}>
      {!onContact && (
        <div className="footer__cta wrap">
          <p className="label mono">Next — Contact</p>
          <Link to="/contact" className="footer__big display">
            Have a world <em className="serif">in mind?</em>
            <span className="footer__arrow" aria-hidden="true">→</span>
          </Link>
          <div className="footer__actions">
            <EmailButton />
          </div>
        </div>
      )}
      <div className="footer__bar wrap">
        <div className="footer__col">
          <span className="mono label">Index</span>
          <Link to="/">Home</Link>
          {nav.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer__col">
          <span className="mono label">Elsewhere</span>
          {socials.filter((s) => s.href).map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label} ↗</a>
          ))}
        </div>
        <div className="footer__col footer__col--meta">
          <span className="mono label">Based in</span>
          <span>{identity.location}</span>
          <span className="mono dim">© {identity.name} {new Date().getFullYear()}</span>
        </div>
      </div>
      <div className="footer__word display" aria-hidden="true">SAARTHAK</div>
    </footer>
  );
}
