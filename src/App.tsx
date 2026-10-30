import { useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { ScrollScale } from './components/ScrollScale';
import { initSmoothScroll, scrollToY, ScrollTrigger } from './lib/motion';
import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { ProjectDetail } from './pages/ProjectDetail';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';
import { Experience } from './pages/Experience';
import { Achievements } from './pages/Achievements';
import { Skills } from './pages/Skills';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

export function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    initSmoothScroll();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useLayoutEffect(() => {
    scrollToY(0, true);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 450);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <ScrollScale />
      <div className="curtain" key={`c-${pathname}`} aria-hidden="true" />
      <main id="main" className="page" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </main>
    </>
  );
}
