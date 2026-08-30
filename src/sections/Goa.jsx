import { useMemo } from 'react';
import Masonry from '../components/Masonry/Masonry';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

export default function Goa() {
  const { data } = useSiteData();
  const headRef = useReveal();
  const gridRef = useReveal();

  const items = useMemo(() => data.goa.map((g, i) => ({
    id: String(i + 1), img: g.image, url: '#goa', height: g.height || 380, label: g.label
  })), [data.goa]);

  return (
    <section className="sec goa-sec" id="goa">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Context</span>
          <h2>Designing with Goa</h2>
          <p>The climate, landscape and material culture of Goa are part of how we think about architecture — not a backdrop, but a set of instructions.</p>
        </div>
        <div className="goa-masonry-wrap reveal" ref={gridRef}>
          <Masonry items={items} animateFrom="bottom" stagger={0.06} scaleOnHover hoverScale={0.97} blurToFocus colorShiftOnHover={false} />
        </div>
      </div>
    </section>
  );
}
