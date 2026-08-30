import { useState } from 'react';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

export default function Faq() {
  const { data } = useSiteData();
  const [open, setOpen] = useState(0);
  const introRef = useReveal();
  const listRef = useReveal();

  return (
    <section className="sec faq-sec" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-intro reveal" ref={introRef}>
          <span className="eyebrow">FAQ</span>
          <h2>Questions we hear often</h2>
          <p>Short and useful. For anything specific to your site or your budget, write to us directly — a person replies.</p>
          <div className="faq-stats">
            <div><div className="fs-num">24h</div><div className="fs-label">Reply time</div></div>
            <div><div className="fs-num">100%</div><div className="fs-label">Site visits, on request</div></div>
          </div>
          <a href="#contact" className="btn btn-dark faq-cta">Email the studio</a>
        </div>
        <div className="faq-list reveal" ref={listRef}>
          {data.faq.map((f, i) => (
            <div key={f.q} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-q"><span>{f.q}</span><span className="faq-plus">+</span></div>
              <div className="faq-a-wrap"><div className="faq-a-inner"><p className="faq-a">{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
