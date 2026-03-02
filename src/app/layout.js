'use client';

import "./globals.css";
import { useState } from 'react';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import FloatingCTA from './components/FloatingCTA';

import SmoothScroll from './components/SmoothScroll';

export default function RootLayout({ children }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>Cuts &amp; Grooves — Interior Design Studio</title>
        <meta name="description" content="Luxury interior design studio crafting bespoke spaces with timeless elegance. Transform your space with our creative vision." />
        <link
          href="https://fonts.googleapis.com/css2?family=Prata&family=Belleza&family=Tenor+Sans&family=Syncopate:wght@400;700&family=Cinzel:wght@400..900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500&family=Pinyon+Script&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <SmoothScroll>
          {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
          <Navbar />
          {children}
          <FloatingCTA />
        </SmoothScroll>
      </body>
    </html>
  );
}
