import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProjectLightbox.css';

export default function ProjectLightbox({ project, onClose }) {
  const images = (project?.gallery?.length ? project.gallery : (project?.image ? [project.image] : []))
    .map(g => (typeof g === 'string' ? { src: g } : g));
  const [index, setIndex] = useState(0);

  const go = useCallback(dir => {
    setIndex(i => (i + dir + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    setIndex(0);
  }, [project]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [go, onClose]);

  if (!project) return null;

  return (
    <div className="lb-overlay" role="dialog" aria-modal="true" aria-label={`${project.title} gallery`} data-testid="project-lightbox" onClick={onClose}>
      <div className="lb-shell" onClick={e => e.stopPropagation()}>
        <div className="lb-topbar">
          <div className="lb-title">
            <span className="lb-status mono">{project.type}</span>
            <h3>{project.title}</h3>
            <p className="lb-sub">{project.location} — {project.one}</p>
          </div>
          <button className="lb-close" onClick={onClose} aria-label="Close gallery" data-testid="lightbox-close">
            <X size={20} />
          </button>
        </div>

        <div className="lb-stage">
          {images.length > 1 && (
            <button className="lb-nav lb-prev" onClick={() => go(-1)} aria-label="Previous image" data-testid="lightbox-prev">
              <ChevronLeft size={26} />
            </button>
          )}
          <div className="lb-figure">
            <img key={index} src={images[index].src} alt={images[index].caption || `${project.title} ${index + 1}`} data-testid="lightbox-image" />
            {images[index].caption && (
              <span className="lb-caption" data-testid="lightbox-caption">{images[index].caption}</span>
            )}
            <span className="lb-counter mono">{index + 1} / {images.length}</span>
          </div>
          {images.length > 1 && (
            <button className="lb-nav lb-next" onClick={() => go(1)} aria-label="Next image" data-testid="lightbox-next">
              <ChevronRight size={26} />
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className="lb-thumbs" data-testid="lightbox-thumbs">
            {images.map((src, i) => (
              <button
                key={`${src.src}-${i}`}
                className={`lb-thumb ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src.src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
