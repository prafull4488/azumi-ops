import { useState } from 'react';
import { useSiteData } from '../store/useSiteData';

export default function Hero() {
  const { data } = useSiteData();
  const h = data.hero;
  const [videoFailed, setVideoFailed] = useState(false);

  const words = h.line2.trim().split(' ');
  const lastWord = words.pop();
  const leadWords = words.join(' ');

  return (
    <section className="hero-sec" id="hero" data-testid="hero-section">
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="hero-kicker mono" data-testid="hero-kicker">
            <span className="hero-kicker-line" />
            {h.line1} · Goa
          </span>

          <h1 className="hero-title" data-testid="hero-title">
            {leadWords} <em>{lastWord}</em>
          </h1>

          <p className="hero-eyebrow-tag mono">{h.eyebrow}</p>

          <p className="hero-sub" data-testid="hero-sub">{h.sub}</p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary" data-testid="hero-view-work-btn">View our work →</a>
            <a href="#contact" className="btn btn-outline" data-testid="hero-contact-btn">Start a conversation</a>
          </div>

          <div className="hero-meta" data-testid="hero-meta">
            <div className="hm-item"><span className="hm-num">38+</span><span className="hm-label">Projects delivered</span></div>
            <span className="hm-div" />
            <div className="hm-item"><span className="hm-num">Woman-led</span><span className="hm-label">Studio & practice</span></div>
            <span className="hm-div" />
            <div className="hm-item"><span className="hm-num">Goa · Karnataka</span><span className="hm-label">& beyond</span></div>
          </div>
        </div>

        <div className="hero-figure" data-testid="hero-figure">
          <div className="hero-figure-glow" aria-hidden="true" />
          <div className="hero-figure-frame">
            {h.video && !videoFailed ? (
              <video
                className="hero-figure-media"
                src={h.video}
                poster={h.image}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onError={() => setVideoFailed(true)}
                data-testid="hero-video"
              />
            ) : (
              <img className="hero-figure-media" src={h.image} alt="Azumi Designs architecture" data-testid="hero-image" />
            )}
            <span className="hero-figure-cap mono">{h.caption}</span>
          </div>
        </div>
      </div>

      <a href="#projects" className="hero-scroll mono" data-testid="hero-scroll-hint" aria-label="Scroll to explore">
        <span>{h.scrollHint}</span>
        <span className="hero-scroll-line" />
      </a>
    </section>
  );
}
