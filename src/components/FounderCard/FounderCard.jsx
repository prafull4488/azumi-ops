import { useEffect, useRef } from 'react';
import './FounderCard.css';

export default function FounderCard({
  photo,
  name,
  role,
  statement,
  practice,
  focus,
  available,
  blurStrength = 6,
  color = '#faf7ec',
  metalness = 0.55,
  roughness = 0.22,
  overlayColor = 'rgba(22,26,18,0.28)',
  displacementStrength = 10,
  noiseScale = 1.3,
  specularConstant = 1.1,
  grayscale = 0,
  glassDistortion = 6,
  className = ''
}) {
  const photoRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const photoEl = photoRef.current;
    if (!card || !photoEl) return;
    const onMove = e => {
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      photoEl.style.transform = `scale(1.12) translate(${-nx * 14}px, ${-ny * 14}px)`;
    };
    const onLeave = () => { photoEl.style.transform = 'scale(1.08) translate(0,0)'; };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const baseFrequency = 0.025 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation
  };

  return (
    <div ref={cardRef} className={`founder-card-container ${className}`} style={cssVariables}>
      <svg className="founder-svg-filters" aria-hidden="true">
        <defs>
          <filter id="founder-metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={displacementStrength} xChannelSelector="R" yChannelSelector="G" result="rippled" />
            <feSpecularLighting in="noiseAlpha" surfaceScale={displacementStrength} specularConstant={specularConstant} specularExponent="18" lightingColor="#faf7ec" result="light">
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="solidAlpha" />
            <feMorphology in="solidAlpha" operator="erode" radius="40" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap"><feFuncA type="linear" slope="0.5" intercept="0" /></feComponentTransfer>
            <feDisplacementMap in="metallic-result" in2="glassMap" scale={glassDistortion} xChannelSelector="A" yChannelSelector="A" result="final" />
          </filter>
        </defs>
      </svg>

      <img ref={photoRef} src={photo} alt={name} className="founder-photo-bg" />
      <div className="founder-noise" />
      <div className="founder-sheen" />
      <div className="founder-border" />

      <div className="founder-content">
        <div className="fc-header">
          <span className="fc-badge">Founder &amp; Principal Architect</span>
        </div>
        <div className="fc-body">
          <h3 className="fc-name">{name}</h3>
          <p className="fc-role">{role}</p>
          <p className="fc-statement">{statement}</p>
        </div>
        <div className="fc-footer">
          <div className="fc-meta"><span className="fc-label">Practice</span><span className="fc-val">{practice}</span></div>
          <div className="fc-meta"><span className="fc-label">Focus</span><span className="fc-val">{focus}</span></div>
          <div className="fc-meta"><span className="fc-label">Availability</span><span className="fc-val">{available}</span></div>
        </div>
      </div>
    </div>
  );
}
