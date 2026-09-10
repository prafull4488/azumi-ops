import { useMemo, useState } from 'react';
import AccordionGallery from '../components/AccordionGallery/AccordionGallery';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

export default function Projects() {
  const { data } = useSiteData();
  const [filter, setFilter] = useState('All');
  const headRef = useReveal();
  const tabsRef = useReveal();
  const galleryRef = useReveal();

  const items = useMemo(() => {
    const list = data.projects.filter(p => filter === 'All' || p.type === filter);
    return list.map(p => ({
      image: p.image,
      label: p.title,
      status: p.type,
      sub: `${p.location} — ${p.one}`
    }));
  }, [data.projects, filter]);

  return (
    <section className="sec projects-sec" id="projects">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Projects</span>
          <h2>Spaces in progress, and spaces complete</h2>
        </div>
        <div className="proj-tabs reveal" ref={tabsRef}>
          {['All', 'Ongoing', 'Completed'].map(f => (
            <button key={f} className={`proj-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="reveal" ref={galleryRef}>
          <AccordionGallery
            key={filter}
            items={items}
            accentColor="#c15f3c"
            overlayColor="#1a130f"
            defaultIndex={Math.min(2, items.length - 1)}
            expandRatio={0.48}
            trigger="hover"
            height={480}
          />
        </div>
      </div>
    </section>
  );
}
