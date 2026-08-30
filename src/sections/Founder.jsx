import FounderCard from '../components/FounderCard/FounderCard';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

export default function Founder() {
  const { data } = useSiteData();
  const f = data.founder;
  const headRef = useReveal();
  const textRef = useReveal();
  const cardRef = useReveal();

  return (
    <section className="sec founder-sec" id="founder">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Founder</span>
          <h2>The person behind Azumi Designs</h2>
        </div>
        <div className="founder-flex">
          <div className="founder-text reveal" ref={textRef}>
            <span className="quote-mark">“</span>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: 480 }}>
              For an entrepreneurial practice, the founder is part of the brand. Azumi is woman-led not as a tagline,
              but because of how {f.name.split(' ')[0]} runs every site visit, every material choice, every client conversation.
            </p>
          </div>
          <div className="reveal" ref={cardRef} style={{ margin: '0 auto' }}>
            <FounderCard
              photo={f.photo}
              name={f.name}
              role={f.role}
              statement={f.statement}
              practice={f.practice}
              focus={f.focus}
              available={f.available}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
