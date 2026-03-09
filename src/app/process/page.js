'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';

export default function ProcessPage() {
    const containerRef = useRef(null);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content?page=process');
                if (res.ok) {
                    const data = await res.json();
                    const contentMap = {};
                    data.forEach(item => {
                        if (!contentMap[item.section]) contentMap[item.section] = {};
                        contentMap[item.section][item.key] = item.value;
                    });
                    setContent(contentMap);
                }
            } catch (err) {
                console.error('Failed to fetch process content:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        if (loading || !content) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // 1. Text Highlight Effect (Narrative)
            const highlightTexts = gsap.utils.toArray('.narrative-paragraph');
            highlightTexts.forEach((p) => {
                const words = p.innerText.split(' ');
                p.innerHTML = words.map(word => `<span style="opacity: 0.2; transition: opacity 0.1s ease">${word} </span>`).join('');

                const targetSpans = p.querySelectorAll('span');
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

            // 2. Sticky Sustainability Section Effect
            ScrollTrigger.create({
                trigger: '.sustainability-container',
                start: 'top top',
                end: 'bottom bottom',
                pin: '.sustainability-sticky-box',
                pinSpacing: false
            });

            // 3. Section reveals for initiatives
            gsap.utils.toArray('.initiative-card').forEach((card) => {
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
    }, [loading, content]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                <div style={{ fontSize: '12px', letterSpacing: '0.4em', opacity: 0.3, textTransform: 'uppercase' }}>Tracing Process...</div>
            </div>
        );
    }

    const narrative = content?.narrative || {};
    const sustainability = content?.sustainability || {};
    const initiatives = content?.initiatives || {};
    const accreditations = content?.accreditations || {};

    const initiativeItems = initiatives.items || [];
    const accreditationItems = accreditations.items || [];

    return (
        <main ref={containerRef} className="process-page bg-white text-black">
            {/* --- NARRATIVE SECTION (TEXT HIGHLIGHT) --- */}
            <section
                className="process-narrative-section"
                data-nav-theme="light"
                style={{ paddingTop: '160px' }}
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
                        {narrative.heading}
                    </h2>
                    <p className="narrative-paragraph" style={{
                        fontSize: 'clamp(0.95rem, 1.25vw, 1.35rem)',
                        lineHeight: 1.7,
                        maxWidth: '850px',
                        fontWeight: 400,
                        color: '#000'
                    }}>
                        {narrative.subtext}
                    </p>
                </div>
            </section>

            {/* --- SUSTAINABILITY STICKY SECTION --- */}
            <section className="sustainability-container" data-nav-theme="dark" style={{ position: 'relative', overflow: 'visible', minHeight: '200vh' }}>
                <div className="sustainability-sticky-box" style={{ height: '100vh', width: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden', zIndex: 1 }}>
                    <img
                        src={sustainability.image}
                        alt="Sustainability"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0))' }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2, padding: '120vh 4% 160px', color: '#fff' }}>
                    <div style={{ maxWidth: '800px', backgroundColor: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)', padding: '60px', borderRadius: '4px' }}>
                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2rem', opacity: 0.8, fontWeight: 600 }}>{sustainability.label}</span>
                        <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 3.5rem)', marginTop: '20px', fontWeight: 300, fontFamily: 'var(--font-heading)' }}>
                            {sustainability.heading}
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
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2rem', opacity: 0.4, fontWeight: 600 }}>{initiatives.label}</span>
                    <h3 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 4rem)', marginTop: '24px', fontWeight: 300, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>{initiatives.heading}</h3>
                </div>

                <div className="initiatives-grid" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '160px'
                }}>
                    {initiativeItems.map((init, i) => (
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
                    {accreditationItems.map((item, i) => (
                        <div key={i} style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.2em', fontFamily: 'var(--font-heading)' }}>{item}</div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
