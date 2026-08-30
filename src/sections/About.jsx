import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

export default function About() {
  const { data } = useSiteData();
  const a = data.about;
  const leftRef = useReveal();
  const rightRef = useReveal();

  return (
    <section className="sec" id="about">
      <div className="wrap about-grid">
        <div className="reveal" ref={leftRef}>
          <p className="about-statement">{a.statementPre}<em>{a.statementEm}</em>{a.statementPost}</p>
          <p className="about-body">{a.body}</p>
        </div>
        <div className="pillars reveal" ref={rightRef}>
          {a.pillars.map((p, i) => (
            <div className="pillar" key={p.title}>
              <div className="num mono">0{i + 1}</div>
              <div><h4>{p.title}</h4><p>{p.text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
