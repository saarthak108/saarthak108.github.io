import { useState, type FormEvent } from 'react';
import { identity, socials } from '../data/profile';
import { EmailButton } from '../components/EmailButton';
import { useMotion, useTitle } from '../lib/useMotion';

// FormSubmit relays messages to the inbox without a backend (works on GitHub Pages).
// The first submission sends a one-time activation email to the address below.
const ENDPOINT = `https://formsubmit.co/ajax/${identity.email}`;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  useTitle('Contact');
  const root = useMotion<HTMLDivElement>();
  const [status, setStatus] = useState<Status>('idle');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `Portfolio enquiry from ${data.name}`, _template: 'table', _captcha: 'false' }),
      });
      // FormSubmit answers 200 even when it refuses (e.g. not activated yet), so check its verdict.
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || String(res.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <div ref={root}>
      <section className="contact wrap" data-section="Contact">
        <div className="rule-label mono"><span>07 / Contact</span><span className="dim">{identity.location}</span></div>
        <h1 className="contact__title display" data-reveal>
          Ready to build <em className="serif">your world?</em>
        </h1>
        <p className="phead__lede" data-reveal>
          Send a brief — or even a rough idea. You’ll get a plan, timeline and quote within 48 hours.
        </p>

        <div className="contact__email" data-reveal>
          <EmailButton />
        </div>

        <div className="contact__grid">
          <form className="form" onSubmit={submit} data-reveal>
            <span className="mono label">Write a message</span>
            <label>
              <span className="mono">Name</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              <span className="mono">Email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span className="mono">Project / message</span>
              <textarea name="message" rows={5} required />
            </label>
            <input type="text" name="_honey" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="form__foot">
              <button className="btn btn--solid" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message →'}
              </button>
              <p className="mono form__status" role="status">
                {status === 'sent' && 'Thank you — message sent.'}
                {status === 'error' && `Couldn’t send. Please use the Email me button above.`}
              </p>
            </div>
          </form>

          <div className="channels" data-reveal>
            <span className="mono label">Elsewhere</span>
            <ul>
              {socials.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      <span className="channels__name display">{s.label}</span>
                      <span className="mono dim">{s.handle} ↗</span>
                    </a>
                  ) : (
                    <span className="channels__pending">
                      <span className="channels__name display">{s.label}</span>
                      <span className="mono pending">{s.handle}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
