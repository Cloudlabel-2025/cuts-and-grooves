'use client';

import "./globals.css";
import { useState } from 'react';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';

import SmoothScroll from './components/SmoothScroll';

export default function RootLayout({ children }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>Cuts &amp; Grooves — Interior Design Studio</title>
        <meta name="description" content="Luxury interior design studio crafting bespoke spaces with timeless elegance. Transform your space with our creative vision." />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500&family=Pinyon+Script&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <SmoothScroll>
          {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
