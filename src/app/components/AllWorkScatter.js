'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const defaultScatteredImages = [
    // Layer 1: Background (far spread, covering edges)
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', x: '2%', y: '2%', w: '20vw', h: '28vh', speed: 0.15, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80', x: '78%', y: '3%', w: '18vw', h: '24vh', speed: 0.2, z: 1 },
    { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80', x: '38%', y: '0%', w: '16vw', h: '22vh', speed: 0.18, z: 1 },

    // Layer 2: Mid (upper half)
    { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', x: '10%', y: '20%', w: '22vw', h: '30vh', speed: 0.4, z: 5 },
    { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80', x: '65%', y: '22%', w: '20vw', h: '28vh', speed: 0.45, z: 5 },
    { src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80', x: '45%', y: '18%', w: '15vw', h: '20vh', speed: 0.5, z: 4 },

    // Layer 3: Mid (lower half)
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', x: '3%', y: '55%', w: '24vw', h: '32vh', speed: 0.8, z: 10 },
    { src: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80', x: '72%', y: '58%', w: '26vw', h: '36vh', speed: 0.85, z: 10 },
    { src: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=600&q=80', x: '30%', y: '52%', w: '18vw', h: '24vh', speed: 0.6, z: 6 },

    // Layer 4: Foreground (bottom and accents)
    { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=400&q=80', x: '18%', y: '78%', w: '16vw', h: '20vh', speed: 1.0, z: 15 },
    { src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', x: '55%', y: '82%', w: '20vw', h: '26vh', speed: 1.1, z: 14 },
    { src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80', x: '85%', y: '75%', w: '14vw', h: '18vh', speed: 0.9, z: 12 },
    { src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', x: '48%', y: '40%', w: '12vw', h: '16vh', speed: 0.35, z: 3 },
    { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80', x: '92%', y: '40%', w: '16vw', h: '20vh', speed: 0.7, z: 8 },
];

const defaultMobileScatteredImages = [
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', x: '-2%', y: '1%', w: '48vw', h: '18vh', speed: 0.15, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80', x: '52%', y: '3%', w: '46vw', h: '16vh', speed: 0.2, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', x: '3%', y: '22%', w: '45vw', h: '18vh', speed: 0.4, z: 5 },
    { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80', x: '52%', y: '24%', w: '45vw', h: '17vh', speed: 0.45, z: 5 },
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', x: '2%', y: '44%', w: '46vw', h: '18vh', speed: 0.8, z: 10 },
    { src: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80', x: '52%', y: '45%', w: '46vw', h: '19vh', speed: 0.85, z: 10 },
    { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=400&q=80', x: '-2%', y: '68%', w: '48vw', h: '18vh', speed: 1.0, z: 15 },
    { src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', x: '50%', y: '70%', w: '48vw', h: '18vh', speed: 1.1, z: 14 },
];

const defaultTransitionImage = '/images/All-works-01.jpg';

const defaultVisionItems = [
    { title: 'Design Integrity', desc: 'Every great structure begins with intent. We bring together thoughtful research, evolving technology, and a deep understanding of human experience — because the best design serves both the mind and the spirit. Our process challenges convention, tests boundaries, and pursues ideas beyond the expected. Each solution is carefully considered, creatively realised, and built to endure.' },
    { title: 'Innovation', desc: 'True innovation lives at the intersection of research, craft, and intuition. We explore new possibilities without losing sight of what makes a space feel right — light, proportion, material, and flow. Every idea is shaped by experience and refined through collaboration. Progress, for us, is not change for its own sake. It is about building smarter, stronger, and more meaningfully.' },
    { title: 'Enhanced Living', desc: 'Well-being is not an afterthought — it is where we begin. We design spaces that elevate everyday life, where light falls softly, materials speak honestly, and every room feels like it belongs. Our environments are crafted to encourage connection, comfort, and clarity. We do not just build structures. We create places to live, grow, and return to.' }
];

export default function AllWorkScatter({ projects, content }) {
    const containerRef = useRef(null);
    const pinRef = useRef(null);
    const textRef = useRef(null);
    const imagesRef = useRef([]);

    const heading = content?.heading || "All Work";
    const displayProjects = projects || [];
    const count = displayProjects.length;

    // Use content from DB if available, otherwise fall back to hardcoded defaults
    const resolveArray = (val, fallback) => {
        if (!val) return fallback;
        if (typeof val === 'string') { try { return JSON.parse(val); } catch { return fallback; } }
        return Array.isArray(val) ? val : fallback;
    };
    const scatteredImages = resolveArray(content?.scatterImages, defaultScatteredImages);
    const mobileScatteredImages = resolveArray(content?.mobileScatterImages, defaultMobileScatteredImages);
    const visionItems = resolveArray(content?.visionItems, defaultVisionItems);
    const transitionImage = content?.transitionImage || defaultTransitionImage;

    // Independent Refs
    const leftTextRef = useRef(null);
    const oSpanRef = useRef(null);
    const rightTextRef = useRef(null);
    const countRef = useRef(null);

    // Portal
    const independentPortalRef = useRef(null);

    // Vision Refs
    const visionUIContainerRef = useRef(null);
    const lineRef = useRef(null);
    const verticalLineRef = useRef(null);
    const label03Ref = useRef(null);
    const labelVisionRef = useRef(null);
    const titlesStripRef = useRef(null);
    const descRef = useRef(null);
    const descTextRefs = useRef([]);
    const titleRefs = useRef([]);

    const [isReady, setIsReady] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sectionHeight, setSectionHeight] = useState('1200vh');

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            const w = window.innerWidth;
            setIsMobile(w < 1024);
            if (w < 1024) setSectionHeight('100vh');
            else setSectionHeight('1200vh');
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const isMobileAnim = window.innerWidth < 1024;

        // Kill any stale ScrollTriggers for this container before re-creating
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === containerRef.current) {
                st.kill();
            }
        });

        const calculateScrollDistances = () => {
            let move1 = window.innerWidth * 0.6;
            let move2 = window.innerWidth * 1.1;

            if (titleRefs.current[0] && titleRefs.current[1]) {
                const w1 = titleRefs.current[0].offsetWidth;
                const w2 = titleRefs.current[1].offsetWidth;
                const gap = window.innerWidth * 0.04;

                move1 = w1 + gap;
                move2 = move1 + w2 + gap;
            }
            return { move1, move2 };
        };

        const { move1, move2 } = calculateScrollDistances();

        const ctx = gsap.context(() => {
            if (isMobileAnim) {
                // Mobile: no scroll animation — static vision items rendered via JSX
            } else {
                // Desktop: full pinned animation
                const activeImages = scatteredImages;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                        pin: '#all-work-pin-container',
                        invalidateOnRefresh: true,
                    }
                });

                const validImages = imagesRef.current.filter(Boolean);

                validImages.forEach((img, i) => {
                    const imgData = activeImages[i];
                    if (!imgData) return;
                    const speed = imgData.speed;
                    const movementY = -(window.innerHeight * 1.5 * speed);
                    const scaleUp = 1 + (speed * 0.6);
                    tl.to(img, { y: movementY, scale: scaleUp, ease: 'none', duration: 1.2 }, 0);
                });

                tl.to(validImages, { opacity: 0, display: 'none', duration: 0.15, stagger: { amount: 0.05, from: "random" } }, 1.0);

                const oRect = oSpanRef.current.getBoundingClientRect();
                const pinRect = pinRef.current.getBoundingClientRect();

                const centerX = oRect.left + oRect.width / 2 - pinRect.left;
                const centerY = oRect.top + oRect.height / 2 - pinRect.top;
                const startSize = '12vmin';

                gsap.set(independentPortalRef.current, {
                    left: centerX, top: centerY, xPercent: -50, yPercent: -50, width: startSize, height: startSize, borderRadius: '50%',
                });

                tl.to(independentPortalRef.current, { opacity: 1, duration: 0.1 }, 0.7);
                tl.to(independentPortalRef.current, {
                    top: 0, left: 0, xPercent: 0, yPercent: 0, width: '100vw', height: '100vh', borderRadius: '0%', duration: 0.6, ease: 'power2.inOut',
                }, 0.7);

                tl.to([leftTextRef.current, rightTextRef.current, countRef.current], { opacity: 0, duration: 0.1 }, 1.0);
                tl.to(oSpanRef.current, { color: 'transparent', duration: 0.05 }, 1.1);

                tl.to(visionUIContainerRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.2 }, 1.5);
                tl.fromTo(lineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.inOut' }, 1.6);
                tl.fromTo([label03Ref.current, labelVisionRef.current], { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3 }, 1.7);
                tl.fromTo(titlesStripRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 1.8);
                gsap.set(descTextRefs.current[0], { y: 20 });
                tl.to(descTextRefs.current[0], { opacity: 1, y: 0, duration: 0.4 }, 1.9);

                tl.to({}, { duration: 1.0 }, 2.3);

                const scrollStart = 3.3;
                const stepDuration = 2.5;
                const scrollEnd = scrollStart + stepDuration * 2 + 0.5;

                tl.fromTo(verticalLineRef.current,
                    { height: '0vh', opacity: 0 },
                    { height: '100vh', opacity: 0.5, duration: (scrollEnd - scrollStart), ease: 'none' },
                    scrollStart
                );

                tl.to(titlesStripRef.current, { x: -move1, duration: stepDuration, ease: 'power1.inOut' }, scrollStart);
                tl.to(titleRefs.current[0], { color: 'rgba(255,255,255,0.3)', duration: 1.5, ease: 'power1.inOut' }, scrollStart);
                tl.to(titleRefs.current[1], { color: '#ffffff', duration: 1.5, ease: 'power1.inOut' }, scrollStart + 0.5);
                tl.to(descTextRefs.current[0], { opacity: 0, duration: 0.3 }, scrollStart + 0.2);
                tl.to(descTextRefs.current[1], { opacity: 1, duration: 0.3 }, scrollStart + 0.7);

                tl.to({}, { duration: 0.5 }, scrollStart + stepDuration);

                const step2Start = scrollStart + stepDuration + 0.5;

                tl.to(titlesStripRef.current, { x: -move2, duration: stepDuration, ease: 'power1.inOut' }, step2Start);
                tl.to(titleRefs.current[1], { color: 'rgba(255,255,255,0.3)', duration: 1.5, ease: 'power1.inOut' }, step2Start);
                tl.to(titleRefs.current[2], { color: '#ffffff', duration: 1.5, ease: 'power1.inOut' }, step2Start + 0.5);
                tl.to(descTextRefs.current[1], { opacity: 0, duration: 0.3 }, step2Start + 0.2);
                tl.to(descTextRefs.current[2], { opacity: 1, duration: 0.3 }, step2Start + 0.7);

                tl.to({}, { duration: 1.0 });
            }
        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, [isReady, isMobile]);

    const textPartStyle = {
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2.2rem, 6vw, 6rem)',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        color: 'rgba(0, 0, 0, 0.85)',
        position: 'relative',
        zIndex: 2,
    };

    return (
        <section
            ref={containerRef}
            data-nav-theme="light"
            className="allwork-section"
            style={{
                position: 'relative',
                height: sectionHeight,
                width: '100%',
                backgroundColor: '#ffffff',
            }}
        >
            <div
                ref={pinRef}
                id="all-work-pin-container"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* 1. Scattered Images Layer */}
                <div className="allwork-scatter-layer absolute inset-0 pointer-events-none">
                    {(() => { imagesRef.current = []; return null; })()}
                    {(mounted && isMobile ? mobileScatteredImages : scatteredImages).map((img, i) => (
                        <div
                            key={i}
                            ref={el => { if (el) imagesRef.current[i] = el; }}
                            style={{
                                position: 'absolute',
                                left: img.x,
                                top: img.y,
                                width: img.w,
                                height: img.h,
                                zIndex: img.z,
                            }}
                        >
                            <img
                                src={img.src}
                                alt="Project"
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                            />
                        </div>
                    ))}
                </div>

                {/* 2. Text Layer (All Work) */}
                <div
                    ref={textRef}
                    className="allwork-heading-layer portal-text-container"
                    style={{ zIndex: 20, position: 'relative', textAlign: 'center', pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '90vw' }}
                >
                    <Link href="/projects" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: '0px' }}>
                        {(() => {
                            const oIndex = heading.toLowerCase().indexOf('o');
                            if (oIndex !== -1) {
                                const leftPart = heading.slice(0, oIndex);
                                const oPart = heading[oIndex];
                                const rightPart = heading.slice(oIndex + 1);
                                return (
                                    <>
                                        <span ref={leftTextRef} style={textPartStyle}>{leftPart}</span>
                                        <div style={{ position: 'relative', display: 'inline-block', width: 'auto', height: 'auto' }}>
                                            <span ref={oSpanRef} style={textPartStyle}>{oPart}</span>
                                        </div>
                                        <span ref={rightTextRef} style={textPartStyle}>{rightPart}</span>
                                    </>
                                );
                            }
                            return <span style={textPartStyle}>{heading}</span>;
                        })()}
                        <sup ref={countRef} className="allwork-count" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.5rem)', fontWeight: 300, marginLeft: '8px', zIndex: 2 }}>({count})</sup>
                    </Link>
                </div>

                {/* 3. INDEPENDENT PORTAL IMAGE (Background) */}
                <div
                    ref={independentPortalRef}
                    className="allwork-portal-layer"
                    style={{
                        position: 'absolute', overflow: 'hidden', zIndex: 10, opacity: 0, backgroundColor: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <img src={transitionImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))', pointerEvents: 'none' }} />
                </div>

                {/* 4. VISION UI OVERLAY (Reference Design) */}
                <div
                    ref={visionUIContainerRef}
                    className="allwork-vision-layer"
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 30,
                        opacity: 0, pointerEvents: 'none',
                        color: '#ffffff',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center'
                    }}
                >
                    {/* Horizontal Line Container (FLEX LAYOUT for GAPS) */}
                    <div className="allwork-line-row" style={{ position: 'absolute', top: '50%', left: '0', width: '100%', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                        {/* 03 */}
                        <span ref={label03Ref} style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)', fontWeight: 300 }}>03</span>

                        {/* Line with Gaps */}
                        <div ref={lineRef} style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.4)', margin: '0 3vw', transformOrigin: 'left' }} />

                        {/* VISION */}
                        <span ref={labelVisionRef} style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)', fontWeight: 300, letterSpacing: '0.1em' }}>VISION</span>
                    </div>

                    {/* NEW VERTICAL LINE (Right Side) */}
                    {/* CHANGED: Anchor to BOTTOM. Animation will naturally go UP. */}
                    <div
                        ref={verticalLineRef}
                        className="allwork-vertical-line"
                        style={{
                            position: 'absolute', bottom: '0', right: '8vw',
                            width: '1px', height: '0',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            zIndex: 35
                        }}
                    />

                    {/* Titles Strip (Strictly Positioned ABOVE line) */}
                    {!isMobile && (
                    <div
                        className="allwork-titles-wrapper"
                        style={{ position: 'absolute', top: '35%', left: '0', width: '100%', overflow: 'hidden' }}
                    >
                        <div
                            ref={titlesStripRef}
                            style={{
                                display: 'flex',
                                gap: '4vw', // REDUCED GAP
                                paddingLeft: '4vw', // Start flush with '03' label roughly
                                whiteSpace: 'nowrap',
                                transform: 'translateX(0)',
                                willChange: 'transform',
                                alignItems: 'baseline'
                            }}
                        >
                            {visionItems.map((item, i) => (
                                <h2
                                    key={i}
                                    ref={el => titleRefs.current[i] = el}
                                    className="allwork-vision-title"
                                    style={{
                                        fontSize: 'clamp(2rem, 6vw, 6rem)',
                                        fontFamily: 'var(--font-heading)',
                                        fontWeight: 400,
                                        letterSpacing: '-0.02em',
                                        color: i === 0 ? '#ffffff' : 'rgba(255,255,255,0.3)',
                                        transition: 'color 0.5s ease',
                                    }}
                                >
                                    {item.title}
                                </h2>
                            ))}
                        </div>
                    </div>
                    )}

                    {/* Description Paragraphs (Below Line, Right Aligned) */}
                    {!isMobile && (
                    <div
                        ref={descRef}
                        className="allwork-desc-container"
                        style={{
                            position: 'absolute',
                            top: mounted && isMobile ? '60%' : '55%',
                            right: mounted && isMobile ? '4vw' : '15vw',
                            left: mounted && isMobile ? '4vw' : 'auto',
                            width: mounted && isMobile ? 'auto' : 'clamp(300px, 30vw, 500px)',
                            textAlign: 'left'
                        }}
                    >
                        {visionItems.map((item, i) => (
                                <p
                                key={i}
                                ref={el => descTextRefs.current[i] = el}
                                className={`allwork-desc-text ${i === 0 ? 'allwork-desc-first' : ''}`}
                                style={{
                                    fontSize: 'clamp(0.8rem, 1.2vw, 1.4rem)',
                                    lineHeight: 1.5,
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 300,
                                    opacity: i === 0 ? 1 : 0,
                                    margin: 0,
                                    position: i === 0 ? 'relative' : 'absolute',
                                    top: 0, left: 0, right: 0
                                }}
                            >
                                {item.desc}
                            </p>
                        ))}
                    </div>
                    )}

                    {mounted && isMobile && (
                        <div className="allwork-mobile-vision">
                            {visionItems.map((item, i) => (
                                <div key={i} className="allwork-mobile-vision-item">
                                    <h2 className="allwork-mobile-vision-title">{item.title}</h2>
                                    <p className="allwork-mobile-vision-desc">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
