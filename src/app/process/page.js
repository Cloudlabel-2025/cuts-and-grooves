'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';

export default function ProcessPage() {
    const containerRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // 1. Unified Text Highlight Effect (Hero + Narrative)
            const highlightTexts = gsap.utils.toArray('.reveal-text, .narrative-paragraph');
            highlightTexts.forEach((p) => {
                // We keep the inner structure for reveal-text but wrap content if needed
                // For narrative-paragraph, we do the split logic
                if (p.classList.contains('narrative-paragraph')) {
                    const words = p.innerText.split(' ');
                    p.innerHTML = words.map(word => `<span style="opacity: 0.2; transition: opacity 0.1s ease">${word} </span>`).join('');
                } else {
                    // For hero text, it's already split in the JSX, we just need to target the inner spans
                    const innerSpans = p.querySelectorAll('span > span');
                    innerSpans.forEach(s => {
                        s.style.opacity = '0.2';
                        s.style.transition = 'opacity 0.1s ease';
                    });
                }

                const targetSpans = p.querySelectorAll('span > span, span');
                const finalSpans = Array.from(targetSpans).filter(s => s.innerText.trim().length > 0);

                gsap.to(finalSpans, {
                    opacity: 1,
                    color: '#000',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: p,
                        start: 'top 75%',
                        end: 'bottom 25%',
                        scrub: true,
                    }
                });
            });

            // 2. Initial Entry Reveal (Transform only)
            gsap.from('.reveal-text span > span', {
                y: 100,
                duration: 1.2,
                stagger: 0.08,
                ease: 'power3.out',
            });

            // 3. Sticky Sustainability Section Effect
            ScrollTrigger.create({
                trigger: '.sustainability-container',
                start: 'top top',
                end: 'bottom bottom',
                pin: '.sustainability-sticky-box',
                pinSpacing: false
            });

            // 4. Section reveals for initiatives
            gsap.utils.toArray('.initiative-card').forEach((card, i) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 60,
                    duration: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const initiatives = [
        {
            title: "Sustainability Action Plan",
            subtitle: "Driven by purpose and guided by values, we translate our environmental commitments into clear, measurable actions. From responsible material selection to long-term performance strategies, sustainability is embedded into every phase of our process.",
            image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=1200&q=80",
            description: "We believe Architecture & Design can strengthen people’s connection to place, enrich daily life, and preserve the cultural narratives that shape communities. Our Sustainability Action Plan ensures that these principles are not aspirational — but operational."
        },
        {
            title: "Reconciliation Action Plan",
            subtitle: "Building trust, inspiring confidence, delivering excellence.",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            description: "Our approach is grounded in respect, collaboration, and meaningful engagement. We actively seek to understand the histories and communities connected to the places we build, ensuring our work contributes positively and responsibly to its social and cultural context. Our lasting impact lies in thoughtful, context-led buildings that honour their histories while strengthening the neighbourhoods they serve."
        },
        {
            title: "Quality Management System",
            subtitle: "Precision in every detail of our methodology.",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
            description: "Each project responds to multiple influences — context, client vision, technical requirements, and user experience. No outcome is shaped by a single perspective. Our Quality Management System ensures disciplined processes, rigorous review, and consistent excellence from concept through completion."
        },
        {
            title: "100% Green Power",
            subtitle: "Committed to a sustainable and connected built world.",
            image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
            description: "We operate with renewable energy to minimise our environmental footprint and support a more responsible future. Our thoughtful designs stand as enduring contributions — reducing impact while enhancing the environments in which they exist."
        }
    ];

    return (
        <main ref={containerRef} className="process-page bg-white text-black">
            {/* --- HERO SECTION --- */}
            <section
                className="process-hero-section"
                data-nav-theme="light"
            >
                <h1 className="reveal-text" style={{
                    fontSize: 'clamp(1.8rem, 3.2vw, 3.2rem)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 300,
                    lineHeight: 1.15,
                    letterSpacing: '-0.025em',
                    maxWidth: '1200px',
                    margin: 0
                }}>
                    {"Our projects are shaped by a deliberate balance of influences — the character of the site, the clarity of the client’s brief, our architectural vision, and the lived experience of the end user.".split(' ').map((word, i) => (
                        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
                            <span style={{ display: 'inline-block' }}>{word}&nbsp;</span>
                        </span>
                    ))}
                </h1>
            </section>

            {/* --- NARRATIVE SECTION (TEXT HIGHLIGHT) --- */}
            <section
                className="process-narrative-section"
                data-nav-theme="light"
            >
                <div style={{ maxWidth: '1400px' }}>
                    <h2 className="narrative-paragraph" style={{
                        fontSize: 'clamp(1.6rem, 2.8vw, 3.2rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 300,
                        lineHeight: 1.3,
                        marginBottom: '60px',
                        letterSpacing: '-0.01em',
                        color: '#000'
                    }}>
                        “Each element informs the other. Context grounds the design. The brief defines direction. Our aspirations elevate the outcome. User experience ensures purpose."
                    </h2>
                    <p className="narrative-paragraph" style={{
                        fontSize: 'clamp(0.95rem, 1.25vw, 1.35rem)',
                        lineHeight: 1.7,
                        maxWidth: '850px',
                        fontWeight: 400,
                        color: '#000'
                    }}>
                        We believe architecture has the power to strengthen the bond between people and place.Through thoughtful, context-led design, we create buildings that enrich daily life and respect the cultural narratives that shape communities. Our ambition is not simply to construct — but to contribute.To deliver spaces that honour their history, elevate their surroundings, and endure with purpose in a more connected built world.
                    </p>
                </div>
            </section>

            {/* --- SUSTAINABILITY STICKY SECTION --- */}
            <section className="sustainability-container" data-nav-theme="dark" style={{ position: 'relative', overflow: 'visible', minHeight: '200vh' }}>
                <div className="sustainability-sticky-box" style={{ height: '100vh', width: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden', zIndex: 1 }}>
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
                        alt="Sustainability"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0))' }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2, padding: '120vh 4% 160px', color: '#fff' }}>
                    <div style={{ maxWidth: '800px', backgroundColor: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)', padding: '60px', borderRadius: '4px' }}>
                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2rem', opacity: 0.8, fontWeight: 600 }}>Environmental Impact</span>
                        <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 3.5rem)', marginTop: '20px', fontWeight: 300, fontFamily: 'var(--font-heading)' }}>
                            Building with care — for the land, the community, and generations ahead.
                        </h3>
                    </div>
                </div>
            </section>

            {/* --- INITIATIVES SECTION --- */}
            <section
                className="process-section"
                data-nav-theme="light"
                style={{ padding: '160px 4%', backgroundColor: '#fff', position: 'relative', zIndex: 3 }}
            >
                <div style={{ marginBottom: '120px' }}>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2rem', opacity: 0.4, fontWeight: 600 }}>Our Initiatives</span>
                    <h3 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 4rem)', marginTop: '24px', fontWeight: 300, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>Driven by conviction, proven through action.</h3>
                </div>

                <div className="initiatives-grid" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '160px'
                }}>
                    {initiatives.map((init, i) => (
                        <div key={i} className="initiative-card" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(12, 1fr)',
                            gap: '60px',
                            alignItems: 'center'
                        }}>
                            <div style={{ gridColumn: i % 2 === 0 ? 'span 5' : '8 / span 5', order: i % 2 === 0 ? 1 : 2 }}>
                                <h4 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.8rem)', fontWeight: 300, fontFamily: 'var(--font-heading)', marginBottom: '32px' }}>{init.title}</h4>
                                <p style={{ fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.6, marginBottom: '40px', fontWeight: 400 }}>{init.subtitle}</p>
                                <p style={{ fontSize: '1rem', opacity: 0.4, lineHeight: 1.6 }}>{init.description}</p>
                                <div style={{ marginTop: '48px', height: '1px', width: '80px', backgroundColor: '#000', opacity: 0.3 }} />
                            </div>
                            <div style={{
                                gridColumn: i % 2 === 0 ? '7 / span 6' : 'span 6',
                                order: i % 2 === 0 ? 2 : 1,
                                overflow: 'hidden',
                                borderRadius: '2px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.05)'
                            }}>
                                <img
                                    src={init.image}
                                    alt={init.title}
                                    style={{ width: '100%', height: '700px', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- ACCREDITATIONS --- */}
            <section
                className="process-section"
                data-nav-theme="light"
                style={{ padding: '120px 4% 160px', textAlign: 'center', backgroundColor: '#fff', borderTop: '1px solid #f8f8f8' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', gap: '100px', flexWrap: 'wrap', alignItems: 'center', opacity: 0.3 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.2em', fontFamily: 'var(--font-heading)' }}>ISO 9001 CERTIFIED</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.2em', fontFamily: 'var(--font-heading)' }}>ARCHITECTS REGISTRATION BOARD</div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
