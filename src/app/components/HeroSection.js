'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MorphingLine = ({ children }) => {
    const lineRef = useRef(null);
    const timelineRef = useRef(null);

    const styles = [
        { family: 'var(--font-heading)', weight: '300', italic: 'italic' },
        { family: "'Cormorant Garamond', serif", weight: '300', italic: 'normal' },
        { family: 'var(--font-mono)', weight: '400', italic: 'normal' },
        { family: 'var(--font-accent)', weight: '400', italic: 'normal' },
    ];

    const handleMouseEnter = () => {
        if (!timelineRef.current) {
            timelineRef.current = gsap.timeline({ repeat: -1 });
            styles.forEach((style, index) => {
                const nextStyle = styles[(index + 1) % styles.length];
                timelineRef.current.to(lineRef.current, {
                    fontFamily: nextStyle.family,
                    fontWeight: nextStyle.weight,
                    fontStyle: nextStyle.italic,
                    duration: 0.4,
                    ease: 'power2.inOut',
                    delay: 0.2,
                });
            });
        }
        timelineRef.current.play();
    };

    const handleMouseLeave = () => {
        if (timelineRef.current) {
            timelineRef.current.pause();
            gsap.to(lineRef.current, {
                fontFamily: styles[0].family,
                fontWeight: styles[0].weight,
                fontStyle: styles[0].italic,
                duration: 0.6,
                ease: 'power3.out'
            });
        }
    };

    return (
        <span
            ref={lineRef}
            className="hero-line"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'block', cursor: 'default' }}
        >
            {children}
        </span>
    );
};

export default function HeroSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero text line-by-line clip reveal — after preloader (delayed)
            gsap.fromTo(
                '.hero-line',
                {
                    clipPath: 'inset(100% 0 0 0)',
                    y: 60,
                },
                {
                    clipPath: 'inset(-20% -10% -20% -10%)',
                    y: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power4.out',
                    delay: 3.4,
                }
            );

            // Subtitle fade in
            gsap.fromTo(
                '.hero-subtitle',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    delay: 4,
                }
            );

            // Scroll indicator pulse
            gsap.fromTo(
                '.hero-scroll-indicator',
                { opacity: 0, y: -10 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: 4.5,
                }
            );

            gsap.to('.hero-scroll-indicator', {
                y: 8,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                delay: 5,
            });


            // Parallax on hero video on scroll
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

            // ─── Cinematic scroll transition ───
            const scrollTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=80%',
                    scrub: 1.2,
                    pin: '#hero-pin-container', // Pin the inner container instead of the root
                    pinSpacing: false,
                },
            });

            // Text rises and vanishes
            scrollTl.to(
                '.hero-inner',
                {
                    y: -80,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'none',
                },
                0
            );

            // Scroll indicator hides
            scrollTl.to(
                '.hero-scroll-indicator',
                { opacity: 0, duration: 0.1, ease: 'none' },
                0
            );

            // Video zooms in — like pushing into the scene
            scrollTl.to(
                '.hero-video',
                {
                    scale: 1.3,
                    duration: 0.7,
                    ease: 'none',
                },
                0
            );

            // Overlay gradually darkens to full black
            scrollTl.to(
                '.hero-overlay',
                {
                    background: 'rgba(0, 0, 0, 1)',
                    duration: 0.5,
                    ease: 'none',
                },
                0.2
            );


        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="hero-section" data-nav-theme="dark" style={{ position: 'relative', zIndex: 10 }}>
            <div id="hero-pin-container" style={{ width: '100%', height: '100%' }}>
                <div className="hero-clip-wrapper">
                    <video
                        className="hero-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/videos/luxury-interior.mp4" type="video/mp4" />
                    </video>
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-inner">
                    <h1 className="hero-heading">
                        <MorphingLine>
                            <span style={{ color: '#FDEBD0' }}>We Make your </span>Livin&apos; <span style={{ color: '#FDEBD0' }}>Better</span>
                        </MorphingLine>
                        {/* <MorphingLine>Building with Discipline,</MorphingLine>
                        <MorphingLine>Delivering with Pride.</MorphingLine> */}
                    </h1>
                    <p className="hero-subtitle">
                        An Architecture & Interior Design Studio
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
