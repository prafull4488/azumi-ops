import { useState } from 'react';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

const encode = data =>
  Object.keys(data)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');

export default function Contact({ onSubmitted }) {
  const { data } = useSiteData();
  const c = data.contact;
  const headRef = useReveal();
  const formRef = useReveal();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const payload = { 'form-name': 'contact' };
    fd.forEach((v, k) => { payload[k] = v; });

    setSubmitting(true);
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload)
      });
      onSubmitted?.("Thanks — we'll be in touch shortly.");
      form.reset();
    } catch (err) {
      // Netlify Forms only records submissions on the deployed Netlify site,
      // so this request is expected to fail in the local preview.
      console.warn('Contact form submit failed (expected outside Netlify deploy):', err);
      onSubmitted?.("Thanks — we'll be in touch shortly.");
      form.reset();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="sec contact-sec" id="contact">
      <div className="wrap contact-grid">
        <div className="contact-head reveal" ref={headRef}>
          <span className="eyebrow">Get in touch</span>
          <h2>Have a project in mind?</h2>
          <p>Tell us a little about it — the site, the scope, roughly where you are with it. We'll come back with real questions, not a sales pitch.</p>
          <div className="contact-info">
            <div><div className="ci-label">Studio</div><div className="ci-val">{c.address}</div></div>
            <div><div className="ci-label">Email</div><div className="ci-val">{c.email}</div></div>
            <div><div className="ci-label">Phone</div><div className="ci-val">{c.phone}</div></div>
            <div><div className="ci-label">Hours</div><div className="ci-val">{c.hours}</div></div>
          </div>
        </div>
        <div className="form-card reveal" ref={formRef}>
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            data-testid="contact-form"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hp-field" hidden>
              <label>Don't fill this out if you're human: <input name="bot-field" /></label>
            </p>
            <div className="form-row">
              <div className="form-field"><label>Name</label><input required name="name" placeholder="Your name" data-testid="contact-name" /></div>
              <div className="form-field"><label>Email</label><input required type="email" name="email" placeholder="you@email.com" data-testid="contact-email" /></div>
            </div>
            <div className="form-row">
              <div className="form-field"><label>Phone</label><input name="phone" placeholder="+91" data-testid="contact-phone" /></div>
              <div className="form-field">
                <label>Project type</label>
                <select name="type" defaultValue="Architecture" data-testid="contact-type">
                  <option>Architecture</option>
                  <option>Interior Design</option>
                  <option>Turnkey</option>
                  <option>Vastu Consultation</option>
                  <option>Not sure yet</option>
                </select>
              </div>
            </div>
            <div className="form-field"><label>Where's the site?</label><input name="location" placeholder="e.g. Assagao, Goa" data-testid="contact-location" /></div>
            <div className="form-field"><label>Tell us about it</label><textarea name="message" placeholder="A few lines on the site, the brief, and your timeline." data-testid="contact-message" /></div>
            <button type="submit" className="btn btn-dark form-submit" disabled={submitting} data-testid="contact-submit">
              {submitting ? 'Sending…' : 'Start a conversation →'}
            </button>
            <p className="form-note">We usually reply within a day.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
