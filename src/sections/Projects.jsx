import { useMemo, useState } from 'react';
import AccordionGallery from '../components/AccordionGallery/AccordionGallery';
import ProjectLightbox from '../components/ProjectLightbox/ProjectLightbox';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

export default function Projects() {
  const { data } = useSiteData();
  const [filter, setFilter] = useState('All');
  const [openProject, setOpenProject] = useState(null);
  const headRef = useReveal();
  const tabsRef = useReveal();
  const galleryRef = useReveal();

  const filtered = useMemo(
    () => data.projects.filter(p => filter === 'All' || p.type === filter),
    [data.projects, filter]
  );

  const items = useMemo(() => filtered.map(p => ({
    image: p.image,
    label: p.title,
    status: p.type,
    sub: `${p.location} — ${p.one}`
  })), [filtered]);

  return (
    <section className="sec projects-sec" id="projects">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Projects</span>
          <h2>Spaces in progress, and spaces complete</h2>
        </div>
        <div className="proj-tabs reveal" ref={tabsRef}>
          {['All', 'Ongoing', 'Completed'].map(f => (
            <button
              key={f}
              className={`proj-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              data-testid={`projects-filter-${f.toLowerCase()}`}
            >{f}</button>
          ))}
        </div>
        <div className="reveal" ref={galleryRef}>
          <AccordionGallery
            key={filter}
            items={items}
            accentColor="#b5687a"
            overlayColor="#241a20"
            defaultIndex={Math.min(2, items.length - 1)}
            expandRatio={0.48}
            trigger="hover"
            height={480}
            onOpen={i => setOpenProject(filtered[i])}
          />
        </div>
        <p className="proj-hint mono">Hover to browse · click the open project to see its full gallery</p>
      </div>

      {openProject && (
        <ProjectLightbox project={openProject} onClose={() => setOpenProject(null)} />
      )}
    </section>
  );
}
