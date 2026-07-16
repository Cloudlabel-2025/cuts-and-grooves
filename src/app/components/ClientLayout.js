'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Preloader from './Preloader';
import FloatingCTA from './FloatingCTA';
import FloatingPageNav from './FloatingPageNav';
import SmoothScroll from './SmoothScroll';

// Context so HeroSection can trigger the reveal
export const HeroRevealContext = createContext(null);

export default function ClientLayout({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');
  const isComingSoon = pathname === '/coming-soon';
  const isHomePage = pathname === '/';

  // Ref for the one-shot reveal listener — so we can remove it cleanly
  const revealListenerRef = useRef(null);

  // After preloader completes on the home page: lock scroll and wait for first intent
  useEffect(() => {
    if (!loaded || !isHomePage) return;

    // Lock scroll by preventing default on wheel/touch
    const prevent = (e) => e.preventDefault();
    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });

    // Listen for the FIRST scroll intent and fire reveal
    const onFirstScroll = () => {
      // Remove all listeners immediately so it fires only once
      window.removeEventListener('wheel', prevent, { passive: false });
      window.removeEventListener('touchmove', prevent, { passive: false });
      window.removeEventListener('wheel', onFirstScroll);
      window.removeEventListener('touchstart', onFirstScroll);
      window.removeEventListener('keydown', onFirstScroll);
      revealListenerRef.current = null;

      // Signal the reveal — Navbar + HeroSection will animate
      setHeroRevealed(true);
    };

    revealListenerRef.current = onFirstScroll;
    window.addEventListener('wheel', onFirstScroll, { once: true });
    window.addEventListener('touchstart', onFirstScroll, { once: true });
    window.addEventListener('keydown', onFirstScroll, { once: true });

    return () => {
      window.removeEventListener('wheel', prevent, { passive: false });
      window.removeEventListener('touchmove', prevent, { passive: false });
      if (revealListenerRef.current) {
        window.removeEventListener('wheel', revealListenerRef.current);
        window.removeEventListener('touchstart', revealListenerRef.current);
        window.removeEventListener('keydown', revealListenerRef.current);
      }
    };
  }, [loaded, isHomePage]);

  // After hero is revealed — track scroll for permanent collapse
  useEffect(() => {
    if (isAdminPath || isComingSoon || !loaded || !heroRevealed) return;

    const handleScroll = () => {
      if (window.scrollY > 80) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminPath, isComingSoon, loaded, heroRevealed]);

  // Admin and Coming Soon pages get bare layout
  if (isAdminPath || isComingSoon) {
    return <main>{children}</main>;
  }

  return (
    <HeroRevealContext.Provider value={{ heroRevealed, setHeroRevealed }}>
      <SmoothScroll>
        {!loaded && (
          <Preloader 
            onTextArrived={() => setNavbarVisible(true)} 
            onComplete={() => {
              setNavbarVisible(true);
              setLoaded(true);
            }} 
          />
        )}
        <Navbar preloaderLoaded={navbarVisible || loaded} hasScrolled={hasScrolled} heroRevealed={heroRevealed} />
        <main className={`main-content-layout ${hasScrolled ? 'content-collapsed' : ''}`}>
          {children}
        </main>
        <FloatingPageNav />
        <FloatingCTA />
      </SmoothScroll>
    </HeroRevealContext.Provider>
  );
}
