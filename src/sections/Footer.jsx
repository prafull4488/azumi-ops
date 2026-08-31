import { useSiteData } from '../store/useSiteData';

export default function Footer({ onOpenAdmin }) {
  const { data } = useSiteData();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col">
            <div className="foot-brand"><img src="/images/logo/Azumi_designs.png" alt="Azumi Designs" style={{ height: 28, marginRight: 8 }} /> Azumi Designs</div>
            <p className="foot-desc">
              Azumi Designs is a woman-led architecture and interior design studio in Goa.
              Project availability, scope and fees vary by site and phase — see a proposal for binding terms.
            </p>
          </div>
          <div className="foot-col">
            <h5>Studio</h5>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#founder">Founder</a>
          </div>
          <div className="foot-col">
            <h5>Resources</h5>
            <a href="#journal">Journal</a>
            <a href="#faq">FAQ</a>
            <a href="#process">Process</a>
          </div>
          <div className="foot-col">
            <h5>Legal</h5>
            <span>Privacy policy</span>
            <span>Terms of use</span>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <a href="#contact">Get in touch</a>
            <span>{data.contact.email}</span>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Azumi Designs. All rights reserved.</span>
          <button className="foot-admin" onClick={onOpenAdmin}>Admin</button>
        </div>
      </div>
    </footer>
  );
}
