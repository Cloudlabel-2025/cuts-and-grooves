'use client';

import { useState, useEffect, useRef, createContext } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Preloader from './Preloader';
import FloatingCTA from './FloatingCTA';
import FloatingPageNav from './FloatingPageNav';
import SmoothScroll from './SmoothScroll';

// Context so HeroSection can trigger the reveal
export const HeroRevealContext = createContext(null);

const BRAND = 'CUTS & GROOVES';
const SLICES = [
  { top: 0, bottom: 78 },
  { top: 18, bottom: 58 },
  { top: 39, bottom: 38 },
  { top: 60, bottom: 18 },
  { top: 80, bottom: 0 },
];

function IntroBrandLayer({ phase }) {
  return (
    <div className={`intro-brand-layer intro-brand-layer--${phase}`} aria-hidden="true">
      <div className="intro-brand-word">
        {SLICES.map((slice, index) => (
          <span
            key={index}
            className="intro-brand-slice"
            style={{ clipPath: `inset(${slice.top}% 0 ${slice.bottom}% 0)` }}
          >
            {BRAND}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');
  const isComingSoon = pathname === '/coming-soon';
  const isHomePage = pathname === '/';
  const [loaded, setLoaded] = useState(!isHomePage);
  const [navbarVisible, setNavbarVisible] = useState(!isHomePage);
  const [heroRevealed, setHeroRevealed] = useState(!isHomePage);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [introPhase, setIntroPhase] = useState('center');
  const [introBrandVisible, setIntroBrandVisible] = useState(isHomePage);
  const revealListenerRef = useRef(null);
  const introTimerRefs = useRef([]);

  useEffect(() => {
    introTimerRefs.current.forEach((timer) => window.clearTimeout(timer));
    introTimerRefs.current = [];

    const frame = window.requestAnimationFrame(() => {
      if (isHomePage) {
        setLoaded(false);
        setNavbarVisible(false);
        setHeroRevealed(false);
        setHasScrolled(false);
        setIntroPhase('center');
        setIntroBrandVisible(true);
        window.scrollTo(0, 0);
      } else {
        setLoaded(true);
        setNavbarVisible(true);
        setHeroRevealed(true);
        setHasScrolled(false);
        setIntroPhase('center');
        setIntroBrandVisible(false);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isHomePage]);

  useEffect(() => {
    if (!loaded || !isHomePage || heroRevealed) return;

    const prevent = (e) => e.preventDefault();
    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });

    const onFirstScroll = () => {
      window.removeEventListener('wheel', prevent, { passive: false });
      window.removeEventListener('touchmove', prevent, { passive: false });
      window.removeEventListener('wheel', onFirstScroll);
      window.removeEventListener('touchstart', onFirstScroll);
      window.removeEventListener('keydown', onFirstScroll);
      revealListenerRef.current = null;
      setIntroPhase('exiting');
      setHeroRevealed(true);
      introTimerRefs.current.push(window.setTimeout(() => setHasScrolled(true), 1450));
      introTimerRefs.current.push(window.setTimeout(() => setIntroBrandVisible(false), 1750));
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
  }, [loaded, isHomePage, heroRevealed]);

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

  const stackVisible = isHomePage && introBrandVisible && introPhase !== 'exiting';

  return (
    <HeroRevealContext.Provider value={{ heroRevealed, setHeroRevealed }}>
      <SmoothScroll>
        {isHomePage && introBrandVisible && <IntroBrandLayer phase={introPhase} />}
        {isHomePage && !loaded && (
          <Preloader
            onTextArrived={() => {
              setIntroPhase('top');
              window.setTimeout(() => setNavbarVisible(true), 420);
            }}
            onComplete={() => setLoaded(true)}
          />
        )}
        <Navbar
          preloaderLoaded={navbarVisible || loaded}
          hasScrolled={hasScrolled}
          heroRevealed={heroRevealed}
          introStackVisible={stackVisible}
        />
        <main className={`main-content-layout ${hasScrolled || !stackVisible ? 'content-collapsed' : ''}`}>
          {children}
        </main>
        <FloatingPageNav />
        <FloatingCTA />
      </SmoothScroll>
    </HeroRevealContext.Provider>
  );
}
