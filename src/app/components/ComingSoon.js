'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const ComingSoon = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const glowRef = useRef(null);

  const [email, setEmail] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(titleRef.current,
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.6 }
      )
        .fromTo(contentRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=1"
        );

      // subtle floating glow animation
      gsap.to(glowRef.current, {
        x: 50,
        y: -40,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You're in. We'll notify: ${email}`);
    setEmail('');
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-black text-white overflow-hidden px-6"
    >

      {/* Animated Gradient Background */}
      <div
        ref={glowRef}
        className="absolute w-[600px] h-[600px] bg-gradient-to-r from-green-400/20 via-blue-500/20 to-pink-500/20 blur-[160px] rounded-full"
      />

      {/* Subtle Ambient Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-10 leading-none text-center"
        >
          <span className="bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-transparent bg-clip-text">
            Coming Soon
          </span>
        </h1><br/>

        {/* Subtitle */}
        <div ref={contentRef}>
          <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-16 leading-relaxed text-center">
            We're crafting something exceptional.
            A refined experience that blends design, performance, and purpose.
          </p>

          {/* Footer text */}
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/20">
            LAUNCHING SOON — STAY READY
          </p>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-6 left-6 text-[10px] tracking-[0.4em] text-white/10 uppercase hidden md:block">
        Est. 2026 — Cuts & Grooves
      </div>
    </div>
  );
};

export default ComingSoon;