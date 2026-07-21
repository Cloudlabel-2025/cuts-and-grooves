'use client';

import { useEffect, useRef, useState, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroRevealContext } from './ClientLayout';

gsap.registerPlugin(ScrollTrigger);


export default function HeroSection({ content }) {
    const sectionRef = useRef(null);
    const clipWrapperRef = useRef(null);
    const videoRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [scrollReady, setScrollReady] = useState(false);
    const ctx = useContext(HeroRevealContext);
    const heroRevealed = ctx?.heroRevealed ?? true; // default true on non-home pages

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const title = content?.title || "Spaces Made for Living";
    const subtitle = content?.subtitle || "Architecture & Interior Design Studio";
    const videoUrl = content?.videoUrl || "/videos/luxury-interior.mp4";

    // ─── PHASE A: Pinned state entrance (after preloader, before first scroll) ───
    // Hero starts as a small centered rectangle; text lines are hidden initially
    useEffect(() => {
        if (heroRevealed) return; // Skip pinned state if already revealed (e.g. non-home page)

        const gsapCtx = gsap.context(() => {
            // Set the clip wrapper to a small centered rectangle initially
            gsap.set(clipWrapperRef.current, {
                width: '70vw',
                height: '55vh',
                top: '50%',
                left: '50%',
                xPercent: -50,
                yPercent: -50,
                position: 'absolute',
                borderRadius: '8px',
                overflow: 'hidden',
            });

            // Animate the rectangle gently appearing after preloader panels clear
            gsap.fromTo(
                clipWrapperRef.current,
                { opacity: 0, scale: 0.96 },
                { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
            );
        }, sectionRef);

        return () => gsapCtx.revert();
    }, [heroRevealed]);

    // ─── PHASE B: First-scroll reveal ───
    // Hero expands from rectangle to fullscreen; text lines appear
    useEffect(() => {
        if (!heroRevealed || scrollReady) return;

        const gsapCtx = gsap.context(() => {
            const revealTl = gsap.timeline({
                onComplete: () => {
                    setScrollReady(true);
                    ScrollTrigger.refresh();
                }
            });

            // Expand the hero clip wrapper to fullscreen
            revealTl.to(clipWrapperRef.current, {
                width: '100%',
                height: '100%',
                top: '0%',
                left: '0%',
                xPercent: 0,
                yPercent: 0,
                borderRadius: '0px',
                duration: 1.45,
                ease: 'power4.inOut',
            }, 0);

            // Hero text clip reveal — after hero expands
            revealTl.fromTo(
                '.hero-line',
                { clipPath: 'inset(100% 0 0 0)', y: 60 },
                {
                    clipPath: 'inset(-20% -10% -20% -10%)',
                    y: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power4.out',
                },
                0.6
            );

            // Subtitle fade in
            revealTl.fromTo(
                '.hero-subtitle',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                1.0
            );

            // Scroll indicator
            revealTl.fromTo(
                '.hero-scroll-indicator',
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                1.3
            );

        }, sectionRef);

        return () => gsapCtx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [heroRevealed]);

    // ─── PHASE C: Scroll-based animations (after hero is fully revealed) ───
    useEffect(() => {
        if (!scrollReady) return;

        const gsapCtx = gsap.context(() => {
            // Scroll indicator bounce loop
            gsap.to('.hero-scroll-indicator', {
                y: 8,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
            });

            // Parallax on scroll
            gsap.to('.hero-video', {
                y: 150,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Cinematic scroll transition
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=80%',
                    scrub: 1.2,
                    pin: '#hero-pin-container',
                    pinSpacing: false,
                },
            });

            scrollTl.to('.hero-inner', { y: -80, opacity: 0, duration: 0.3, ease: 'none' }, 0);
            scrollTl.to('.hero-scroll-indicator', { opacity: 0, duration: 0.1, ease: 'none' }, 0);
            scrollTl.to('.hero-video', { scale: 1.3, duration: 0.7, ease: 'none' }, 0);
            scrollTl.to('.hero-overlay', { background: 'rgba(0, 0, 0, 1)', duration: 0.5, ease: 'none' }, 0.2);

        }, sectionRef);

        return () => gsapCtx.revert();
    }, [scrollReady]);

    // Non-home pages: run the full original animation immediately
    useEffect(() => {
        if (!heroRevealed || scrollReady) return; // handled by Phase B + C above
        if (ctx !== null) return; // on home page, handled by Phase B

        // This branch runs only on non-home pages where HeroRevealContext is null
        const gsapCtx = gsap.context(() => {
            gsap.fromTo('.hero-line',
                { clipPath: 'inset(100% 0 0 0)', y: 60 },
                { clipPath: 'inset(-20% -10% -20% -10%)', y: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out', delay: 3.4 }
            );
            gsap.fromTo('.hero-subtitle',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 4 }
            );
            gsap.fromTo('.hero-scroll-indicator',
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 4.5 }
            );
            gsap.to('.hero-scroll-indicator', { y: 8, duration: 1.2, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 5 });
            gsap.to('.hero-video', {
                y: 150, ease: 'none',
                scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
            const scrollTl = gsap.timeline({
                scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=80%', scrub: 1.2, pin: '#hero-pin-container', pinSpacing: false },
            });
            scrollTl.to('.hero-inner', { y: -80, opacity: 0, duration: 0.3, ease: 'none' }, 0);
            scrollTl.to('.hero-scroll-indicator', { opacity: 0, duration: 0.1, ease: 'none' }, 0);
            scrollTl.to('.hero-video', { scale: 1.3, duration: 0.7, ease: 'none' }, 0);
            scrollTl.to('.hero-overlay', { background: 'rgba(0, 0, 0, 1)', duration: 0.5, ease: 'none' }, 0.2);
        }, sectionRef);

        return () => gsapCtx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isVideo = (url) => {
        if (!url) return true;
        return url.match(/\.(mp4|webm|ogg)$|video\/upload/);
    };

    return (
        <section ref={sectionRef} className="hero-section" data-nav-theme="dark" style={{ position: 'relative', zIndex: 10 }}>
            <div id="hero-pin-container" style={{ width: '100%', height: '100%' }}>
                <div
                    ref={clipWrapperRef}
                    className={`hero-clip-wrapper ${!heroRevealed ? 'hero-clip-wrapper--pinned' : ''}`}
                >
                    {isMobile ? (
                        <img
                            src="/images/hero-poster.jpg"
                            alt={title}
                            className="hero-video object-cover"
                            style={{ width: '100%', height: '110%' }}
                        />
                    ) : isVideo(videoUrl) ? (
                        <video
                            ref={videoRef}
                            className="hero-video"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            poster="/images/hero-poster.jpg"
                            key={videoUrl}
                        >
                            <source src={videoUrl} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={videoUrl}
                            alt={title}
                            className="hero-video object-cover"
                            style={{ width: '100%', height: '110%' }}
                        />
                    )}
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-inner">
                    <h1 className="hero-heading">
                        <span className="hero-line" style={{ display: 'block', cursor: 'default' }}>
                            <span dangerouslySetInnerHTML={{ __html: title }}></span>
                        </span>
                    </h1>
                    <p className="hero-subtitle">
                        {subtitle}
                    </p>
                </div>
                <div className="hero-scroll-indicator">
                    <span>Scroll</span>
                    <svg width="14" height="30" viewBox="0 0 14 30" fill="none">
                        <line x1="7" y1="0" x2="7" y2="28" stroke="white" strokeWidth="1.5" />
                        <polyline points="2,23 7,28 12,23" stroke="white" strokeWidth="1.5" fill="none" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
