import { useState } from 'react';
import { SiteDataProvider } from './store/useSiteData';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import About from './sections/About';
import Services from './sections/Services';
import Process from './sections/Process';
import Founder from './sections/Founder';
import Goa from './sections/Goa';
import Journal from './sections/Journal';
import Faq from './sections/Faq';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import AdminGate from './components/AdminGate/AdminGate';
import './sections.css';

const ADMIN_PATH = '/azumiControl';

function SiteContent() {
  const [toast, setToast] = useState('');

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <About />
        <Services />
        <Process />
        <Founder />
        <Goa />
        <Journal />
        <Faq />
        <Contact onSubmitted={showToast} />
      </main>
      <Footer />
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const isAdmin = path === ADMIN_PATH;

  return (
    <SiteDataProvider>
      {isAdmin ? <AdminGate /> : <SiteContent />}
    </SiteDataProvider>
  );
}
