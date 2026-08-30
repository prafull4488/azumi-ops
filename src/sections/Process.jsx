import { useState } from 'react';
import Stepper, { Step } from '../components/Stepper/Stepper';
import { useSiteData } from '../store/useSiteData';
import { useReveal } from '../hooks/useReveal';

const FILTERS = ['All', 'Architecture', 'Interior', 'Turnkey', 'Vastu'];

export default function Process() {
  const { data } = useSiteData();
  const [filter, setFilter] = useState('All');
  const headRef = useReveal();
  const stepperRef = useReveal();

  return (
    <section className="sec process-sec" id="process">
      <div className="wrap">
        <div className="section-head reveal" ref={headRef}>
          <span className="eyebrow">Process</span>
          <h2>From first sketch to final detail</h2>
          <p style={{ marginTop: 16, color: 'var(--ink-soft)', fontSize: 15, maxWidth: 560 }}>
            Every project moves through these stages — whether you want the full service or just one part of it.
            Filter below to see what applies to your scope.
          </p>
        </div>
        <div className="filters reveal">
          {FILTERS.map(f => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'All' ? 'All services' : f}
            </button>
          ))}
        </div>
        <div className="reveal" ref={stepperRef}>
          <Stepper initialStep={1} backButtonText="Back" nextButtonText="Next step">
            {data.processSteps.map((s, i) => (
              <Step key={s.title}>
                <div className="step-body">
                  <span className="step-num mono">0{i + 1} / 0{data.processSteps.length}</span>
                  <h3>{s.title}</h3>
                  <p className="desc">{s.text}</p>
                  <div className="step-tags">
                    {s.tags.map(t => (
                      <span key={t} className={`tag ${filter !== 'All' && !s.tags.includes(filter) ? 'dim' : ''}`}>{t}</span>
                    ))}
                    {filter !== 'All' && !s.tags.includes(filter) && (
                      <span className="tag" style={{ background: 'var(--coral-pastel)' }}>Not part of {filter}</span>
                    )}
                  </div>
                </div>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
    </section>
  );
}
