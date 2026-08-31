import { useState } from 'react';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

export default function Services() {
  const { data } = useSiteData();
  const [active, setActive] = useState(0);
  const headRef = useReveal();

  return (
    <section className="sec services-sec" id="services">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Services</span>
          <h2>What we do, and how far we take it</h2>
        </div>
        <div className="services-grid">
          <div className="serv-list">
            {data.services.map((s, i) => (
              <div
                key={s.title}
                className={`serv-item ${i === active ? 'active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <div className="serv-visual">
            {data.services.map((s, i) => (
              <img key={s.title} className={i === active ? 'active' : ''} src={s.image} alt={s.title} />
            ))}
          </div>
        </div>
        <a
          href="#contact"
          className="serv-explore"
          onClick={e => {
            e.preventDefault();
            const el = document.getElementById('contact');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >Explore our services →</a>
      </div>
    </section>
  );
}
