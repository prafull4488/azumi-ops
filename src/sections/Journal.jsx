import { useMemo, useState } from 'react';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

export default function Journal() {
  const { data } = useSiteData();
  const [tag, setTag] = useState('All');
  const headRef = useReveal();
  const gridRef = useReveal();

  const tags = useMemo(() => ['All', ...new Set(data.journal.map(j => j.tag))], [data.journal]);
  const list = useMemo(() => data.journal.filter(j => tag === 'All' || j.tag === tag), [data.journal, tag]);

  return (
    <section className="sec" id="journal">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Journal</span>
          <h2>Notes on building well in Goa</h2>
        </div>
        <div className="journal-filters reveal">
          {tags.map(t => (
            <button key={t} className={`proj-tab ${tag === t ? 'active' : ''}`} onClick={() => setTag(t)}>{t}</button>
          ))}
        </div>
        <div className="journal-grid reveal" ref={gridRef}>
          {list.map(j => (
            <article className="jcard" key={j.title}>
              <div className="jimg"><img src={j.image} alt={j.title} /></div>
              <div className="jbody">
                <span className="jtag">{j.tag}</span>
                <h3>{j.title}</h3>
                <p className="jexcerpt">{j.excerpt}</p>
                <div className="jmeta">{j.date} · {j.read}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
