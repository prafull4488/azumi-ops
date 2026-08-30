import { useState } from 'react';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

export default function Contact({ onSubmitted }) {
  const { data } = useSiteData();
  const c = data.contact;
  const headRef = useReveal();
  const formRef = useReveal();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      e.target.reset();
      onSubmitted?.("Thanks — we'll be in touch shortly.");
    }, 500);
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
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field"><label>Name</label><input required name="name" placeholder="Your name" /></div>
              <div className="form-field"><label>Email</label><input required type="email" name="email" placeholder="you@email.com" /></div>
            </div>
            <div className="form-row">
              <div className="form-field"><label>Phone</label><input name="phone" placeholder="+91" /></div>
              <div className="form-field">
                <label>Project type</label>
                <select name="type" defaultValue="Architecture">
                  <option>Architecture</option>
                  <option>Interior Design</option>
                  <option>Turnkey</option>
                  <option>Vastu Consultation</option>
                  <option>Not sure yet</option>
                </select>
              </div>
            </div>
            <div className="form-field"><label>Where's the site?</label><input name="location" placeholder="e.g. Assagao, Goa" /></div>
            <div className="form-field"><label>Tell us about it</label><textarea name="message" placeholder="A few lines on the site, the brief, and your timeline." /></div>
            <button type="submit" className="btn btn-dark form-submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Start a conversation →'}
            </button>
            <p className="form-note">We usually reply within a day.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
