'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scatteredImages = [
    // Layer 1: Background
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', x: '5%', y: '10%', w: '18vw', h: '30vh', speed: 0.15, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80', x: '80%', y: '15%', w: '15vw', h: '25vh', speed: 0.2, z: 1 },

    // Layer 2: Mid
    { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', x: '15%', y: '60%', w: '20vw', h: '28vh', speed: 0.4, z: 5 },
    { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80', x: '70%', y: '50%', w: '16vw', h: '32vh', speed: 0.5, z: 5 },

    // Layer 3: Foreground
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', x: '-5%', y: '40%', w: '22vw', h: '35vh', speed: 1.0, z: 15 },
    { src: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80', x: '85%', y: '70%', w: '25vw', h: '40vh', speed: 0.9, z: 15 },
    { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=400&q=80', x: '25%', y: '90%', w: '10vw', h: '14vh', speed: 0.8, z: 12 },

    // Denser Scatter
    { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80', x: '10%', y: '-10%', w: '14vw', h: '20vh', speed: 0.6, z: 3 },
    { src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80', x: '60%', y: '-5%', w: '13vw', h: '19vh', speed: 0.7, z: 4 },
    { src: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=600&q=80', x: '90%', y: '40%', w: '14vw', h: '22vh', speed: 0.5, z: 2 },
    { src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', x: '35%', y: '110%', w: '16vw', h: '24vh', speed: 1.1, z: 14 },
    { src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80', x: '5%', y: '80%', w: '12vw', h: '16vh', speed: 0.4, z: 6 },
    { src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', x: '50%', y: '70%', w: '9vw', h: '12vh', speed: 0.25, z: 2 },
    { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80', x: '75%', y: '95%', w: '14vw', h: '18vh', speed: 0.85, z: 13 },
];

const mobileScatteredImages = [
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', x: '5%', y: '10%', w: '40vw', h: '20vh', speed: 0.15, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80', x: '55%', y: '15%', w: '35vw', h: '15vh', speed: 0.2, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', x: '10%', y: '45%', w: '45vw', h: '20vh', speed: 0.4, z: 5 },
    { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80', x: '50%', y: '65%', w: '35vw', h: '25vh', speed: 0.5, z: 5 },
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', x: '-10%', y: '30%', w: '50vw', h: '25vh', speed: 1.0, z: 15 },
    { src: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80', x: '60%', y: '75%', w: '45vw', h: '30vh', speed: 0.9, z: 15 },
];

const transitionImage = '/images/All-works-01.jpg';

const visionItems = [
    { title: 'Design integrity', desc: 'At the core of every structure lies intention.We integrate advanced research and evolving technology with a distinctly human sensibility — because innovation without intuition is incomplete.Our process challenges convention, tests boundaries, and explores possibilities beyond the expected. Each solution is thoughtfully engineered, creatively envisioned, and uncompromising in execution.' },
    { title: 'Innovation', desc: 'We combine rigorous research, advanced technology, and refined craftsmanship to redefine what’s possible. Yet we believe true innovation is not purely technical — it is human.Every breakthrough we pursue is guided by insight, experience, and an uncompromising pursuit of better solutions. We challenge limits, rethink conventions, and transform complexity into clarity.Because progress is not about change for the sake of it — it is about building smarter, stronger, and ahead of time.' },
    { title: 'Enhanced Living', desc: 'Well-being is not an afterthought — it is the foundation. We design spaces that elevate everyday life, where light, proportion, material, and flow work in harmony. Every environment is thoughtfully crafted to encourage connection, comfort, and clarity. Our approach goes beyond structure. We create living experiences — spaces that nurture balance, inspire interaction, and enhance the rhythm of modern life.' }
];

export default function AllWorkScatter() {
    const containerRef = useRef(null);
    const pinRef = useRef(null);
    const textRef = useRef(null);
    const imagesRef = useRef([]);

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
    const descTextRef = useRef(null);
    const titleRefs = useRef([]);

    const [isReady, setIsReady] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
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

        // CALCULATE PRECISE WIDTHS FOR SCROLL
        const calculateScrollDistances = () => {
            // Default fallback
            let move1 = window.innerWidth * 0.6;
            let move2 = window.innerWidth * 1.1;

            if (titleRefs.current[0] && titleRefs.current[1]) {
                const w1 = titleRefs.current[0].offsetWidth;
                const w2 = titleRefs.current[1].offsetWidth;
                const gap = window.innerWidth * 0.04; // 4vw gap in pixels

                move1 = w1 + gap;
                move2 = move1 + w2 + gap;
            }
            return { move1, move2 };
        };

        const { move1, move2 } = calculateScrollDistances();

        const ctx = gsap.context(() => {
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

            const isMobile = window.innerWidth < 1024;

            // --- PHASE 1: SCATTER PARALLAX & TEXT ZOOM (0 -> 1.0) ---

            // Initial Scale
            tl.to(textRef.current, { scale: 1.15, duration: 0.5, ease: 'power1.inOut' }, 0);

            // Parallax
            imagesRef.current.forEach((img, i) => {
                if (!img) return;
                const speed = scatteredImages[i].speed;
                const movementY = -(window.innerHeight * 1.5 * speed);
                tl.to(img, { y: movementY, ease: 'none', duration: 1 }, 0);
            });

            // Fade Out Scattered Images
            tl.to(imagesRef.current, { opacity: 0, display: 'none', duration: 0.2, stagger: { amount: 0.1, from: "random" } }, 0.6);

            // PORTAL TRANSITION SETUP
            const oRect = oSpanRef.current.getBoundingClientRect();
            const pinRect = pinRef.current.getBoundingClientRect();
            const textRect = textRef.current.getBoundingClientRect();

            const ox = oRect.left + oRect.width / 2 - textRect.left;
            const oy = oRect.top + oRect.height / 2 - textRect.top;
            gsap.set(textRef.current, { transformOrigin: `${ox}px ${oy}px` });

            const centerX = oRect.left + oRect.width / 2 - pinRect.left;
            const centerY = oRect.top + oRect.height / 2 - pinRect.top;
            const startSize = '12vmin';

            gsap.set(independentPortalRef.current, {
                left: centerX, top: centerY, xPercent: -50, yPercent: -50, width: startSize, height: startSize, borderRadius: '50%',
            });

            // ANIMATION: Portal Text Zoom & Image Expand (Significantly slowed down)
            // Start: 0.5. Duration: 2.0. End: 2.5
            tl.to(independentPortalRef.current, { opacity: 1, duration: 0.1 }, 0.5);
            tl.to(textRef.current, { scale: 300, duration: 2.0, ease: 'power2.in' }, 0.6); // Start zoom just after visibility
            tl.to(independentPortalRef.current, {
                top: 0, left: 0, xPercent: 0, yPercent: 0, width: '100vw', height: '100vh', borderRadius: '0%', duration: 2.0, ease: 'power2.in',
            }, 0.6);

            tl.to([leftTextRef.current, rightTextRef.current, countRef.current], { opacity: 0, duration: 0.1 }, 1.5); // Fade text earlier mid-zoom
            tl.to(oSpanRef.current, { color: 'transparent', duration: 0.05 }, 1.6);


            // --- PHASE 2: VISION LAYOUT BUILD (Starts at 3.0 -> End 4.0 approx)---

            // 1. Reveal Layout Container
            tl.to(visionUIContainerRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.1 }, 3.0);

            // 2. Animate Horizontal Line (Independent)
            tl.fromTo(lineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.inOut' }, 3.1);

            // 3. Fade In Labels (03, VISION)
            tl.fromTo([label03Ref.current, labelVisionRef.current], { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3 }, 3.3);

            // 4. Fade In Titles Strip
            tl.fromTo(titlesStripRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 3.4);

            // 5. Fade In Description
            tl.fromTo(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 3.5);

            // --- PHASE 3: HORIZONTAL SCROLL & VERTICAL LINE GROWTH (Starts at 4.5 -> End) ---

            // Start Delay: Add "read time" (3.5 -> 4.5 pause)
            tl.to({}, { duration: 1.0 }, 3.5);

            const scrollStart = 4.5;
            const stepDuration = 2.5;
            const scrollEnd = scrollStart + stepDuration * 2 + 0.5; // Two moves + pause

            // ** VERTICAL LINE ANIMATION (SYNCED WITH SCROLL) **
            // Starts at scrollStart, Ends at scrollEnd
            tl.fromTo(verticalLineRef.current,
                { height: '0vh', opacity: 0 },
                { height: '100vh', opacity: 0.5, duration: (scrollEnd - scrollStart), ease: 'none' },
                scrollStart
            );

            // --- SCROLL SEQUENCE ---

            // Step 1: Move to "Innovation"
            tl.to(titlesStripRef.current, { x: -move1, duration: stepDuration, ease: 'power1.inOut' }, scrollStart);

            // Color Swaps
            tl.to(titleRefs.current[0], { color: 'rgba(255,255,255,0.3)', duration: 1.5, ease: 'power1.inOut' }, scrollStart);
            tl.to(titleRefs.current[1], { color: '#ffffff', duration: 1.5, ease: 'power1.inOut' }, scrollStart + 0.5);

            // Description Swap
            tl.to(descTextRef.current, { opacity: 0, duration: 0.3 }, scrollStart + 0.2);
            tl.call(() => { if (descTextRef.current) descTextRef.current.innerText = visionItems[1].desc; }, null, scrollStart + 0.6);
            tl.to(descTextRef.current, { opacity: 1, duration: 0.3 }, scrollStart + 0.7);


            // Step 2: Move to "Enhanced Living"
            // Pause: scrollStart + stepDuration -> + 0.5
            tl.to({}, { duration: 0.5 }, scrollStart + stepDuration);

            const step2Start = scrollStart + stepDuration + 0.5;

            // Move
            tl.to(titlesStripRef.current, { x: -move2, duration: stepDuration, ease: 'power1.inOut' }, step2Start);

            // Color Swaps
            tl.to(titleRefs.current[1], { color: 'rgba(255,255,255,0.3)', duration: 1.5, ease: 'power1.inOut' }, step2Start);
            tl.to(titleRefs.current[2], { color: '#ffffff', duration: 1.5, ease: 'power1.inOut' }, step2Start + 0.5);

            // Description Swap
            tl.to(descTextRef.current, { opacity: 0, duration: 0.3 }, step2Start + 0.2);
            tl.call(() => { if (descTextRef.current) descTextRef.current.innerText = visionItems[2].desc; }, null, step2Start + 0.6);
            tl.to(descTextRef.current, { opacity: 1, duration: 0.3 }, step2Start + 0.7);

            // Final Hold
            tl.to({}, { duration: 1.0 });

        }, containerRef);

        return () => ctx.revert();
    }, [isReady]);

    const textPartStyle = {
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(3rem, 6vw, 6rem)',
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
            style={{
                position: 'relative',
                height: '1200vh',
                width: '100%',
                backgroundColor: '#ffffff',
                overflow: 'hidden'
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
                <div className="absolute inset-0 pointer-events-none">
                    {(mounted && isMobile ? mobileScatteredImages : scatteredImages).map((img, i) => (
                        <div
                            key={i}
                            ref={el => imagesRef.current[i] = el}
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
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                            />
                        </div>
                    ))}
                </div>

                {/* 2. Text Layer (All Work) */}
                <div
                    ref={textRef}
                    className="portal-text-container"
                    style={{ zIndex: 20, position: 'relative', textAlign: 'center', pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}
                >
                    <Link href="/projects" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: '0px' }}>
                        <span ref={leftTextRef} style={textPartStyle}>All W</span>
                        <div style={{ position: 'relative', display: 'inline-block', width: 'auto', height: 'auto' }}>
                            <span ref={oSpanRef} style={textPartStyle}>o</span>
                        </div>
                        <span ref={rightTextRef} style={textPartStyle}>rk</span>
                        <sup ref={countRef} style={{ fontSize: '1.5rem', fontWeight: 300, marginLeft: '8px', zIndex: 2 }}>(27)</sup>
                    </Link>
                </div>

                {/* 3. INDEPENDENT PORTAL IMAGE (Background) */}
                <div
                    ref={independentPortalRef}
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
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 30,
                        opacity: 0, pointerEvents: 'none',
                        color: '#ffffff',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center'
                    }}
                >
                    {/* Horizontal Line Container (FLEX LAYOUT for GAPS) */}
                    <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', padding: '0 4vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

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
                        style={{
                            position: 'absolute', bottom: '0', right: '8vw', // Aligned near 'VISION', Set BOTTOM
                            width: '1px', height: '0', // Start height 0
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            zIndex: 35
                        }}
                    />

                    {/* Titles Strip (Strictly Positioned ABOVE line) */}
                    <div
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
                                    style={{
                                        fontSize: 'clamp(3.5rem, 6vw, 6rem)',
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

                    {/* Description Paragraph (Below Line, Right Aligned) */}
                    <div
                        ref={descRef}
                        style={{
                            position: 'absolute',
                            top: mounted && window.innerWidth < 768 ? '65%' : '55%',
                            right: mounted && window.innerWidth < 768 ? '4vw' : '15vw',
                            left: mounted && window.innerWidth < 768 ? '4vw' : 'auto',
                            width: mounted && window.innerWidth < 768 ? 'auto' : 'clamp(300px, 30vw, 500px)',
                            textAlign: 'left'
                        }}
                    >
                        <p
                            ref={descTextRef}
                            style={{
                                fontSize: 'clamp(1rem, 1.2vw, 1.4rem)',
                                lineHeight: 1.5,
                                fontFamily: 'var(--font-body)',
                                fontWeight: 300
                            }}
                        >
                            {visionItems[0].desc}
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
