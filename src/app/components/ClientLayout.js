'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Preloader from './Preloader';
import FloatingCTA from './FloatingCTA';
import SmoothScroll from './SmoothScroll';

export default function ClientLayout({ children }) {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');
  const isComingSoon = pathname === '/coming-soon';

  // Admin and Coming Soon pages get bare layout (no navbar/footer/scroll)
  if (isAdminPath || isComingSoon) {
    return <main>{children}</main>;
  }

  // Normal public pages get full layout
  return (
    <SmoothScroll>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <Navbar />
      <main>{children}</main>
      <FloatingCTA />
    </SmoothScroll>
  );
}
