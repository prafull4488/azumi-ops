import { useEffect, useState } from 'react';

const LINKS = [
  ['Projects', '#projects'], ['Studio', '#about'], ['Services', '#services'],
  ['Process', '#process'], ['Founder', '#founder'], ['Journal', '#journal'], ['FAQ', '#faq']
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav-site ${scrolled ? 'scrolled' : ''}`}>
      <div className="navrow">
        <a href="#hero" className="brand" data-testid="nav-brand"><img src="/images/logo/Azumi_designs.png" alt="Azumi Designs" /></a>
        <nav className="links">
          {LINKS.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a href="#contact" className="nav-cta">Start a conversation →</a>
        <button className="nav-burger" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>{open ? '×' : '☰'}</button>
      </div>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {LINKS.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a href="#contact" onClick={() => setOpen(false)}>Start a conversation →</a>
      </div>
    </header>
  );
}
