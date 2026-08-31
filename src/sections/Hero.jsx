import LightRays from '../components/LightRays/LightRays';
import ScrollExpand from '../components/ScrollExpand/ScrollExpand';
import MaskedHeading from '../components/MaskedHeading/MaskedHeading';
import { useSiteData } from '../store/useSiteData';

export default function Hero() {
  const { data } = useSiteData();
  const h = data.hero;

  return (
    <section className="hero-sec" id="hero">
      <div style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
        <LightRays raysOrigin="top-center" raysColor="#d4f000" raysSpeed={1.1} lightSpread={0.9} rayLength={1.3} noiseAmount={0.06} distortion={0.03} mouseInfluence={0.08} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ScrollExpand
          src={h.image}
          alt="Azumi Designs architecture"
          useWindowScroll
          scrollDistance={1.0}
          holdDistance={0.25}
          startWidth={20}
          startHeight={28}
          startRadius={18}
          mediaZoom={1.15}
          overlayScrim={0.18}
          scrollHint={h.scrollHint}
          title={
            <MaskedHeading
              text={h.line1}
              tag="div"
              mediaType="image"
              src={h.image}
              reveal="rise"
              trigger="mount"
              textScale={0.15}
              parallax={18}
              drift={10}
              tracking={-0.03}
            />
          }
        >
          <div className="hero-overlay-content">
            <span className="hero-eyebrow-tag mono">{h.eyebrow}</span>
            <h2 style={{ color: '#fff', fontSize: 'clamp(28px,4vw,44px)' }}>{h.line2}</h2>
            <p className="hero-sub">{h.sub}</p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">View our work →</a>
              <a href="#contact" className="btn btn-ghost">Start a conversation</a>
            </div>
          </div>
        </ScrollExpand>
      </div>
    </section>
  );
}
