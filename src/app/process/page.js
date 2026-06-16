'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
gsap.registerPlugin(ScrollTrigger);

const defaultContent = {
    narrative: {
        heading: "We believe the most resonant spaces are not designed — they are distilled. Every line, material, and shadow emerges from a process of deep inquiry, fearless iteration, and quiet mastery.",
        subtext: "Our approach never follows a formula. Each project is a living dialogue — between light and material, tradition and innovation, the client's vision and the site's innate character. We listen first, design second, and refine until every detail feels inevitable. This is not rapid production; it is patient cultivation. The result is architecture that breathes, endures, and quietly transforms the way people inhabit space."
    },
    sustainability: {
        label: "Sustainability",
        heading: "We build not for the season, but for the generations that follow.",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
    },
    initiatives: {
        label: "Our Process",
        heading: "Three movements, one conviction.",
        items: [
            {
                title: "Immerse & Uncover",
                subtitle: "Deep listening meets forensic curiosity.",
                description: "Before a single line is drawn, we steep ourselves in the world of the project. We study how the sun travels across the site, how the wind moves through the corridors, how the existing architecture speaks. Conversations with you are not interviews — they are excavations of memory, desire, and instinct. This phase yields not a brief, but a belief system that will guide every decision that follows.",
                image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
            },
            {
                title: "Craft & Challenge",
                subtitle: "The studio as an atelier of restless creativity.",
                description: "Armed with insight, our studio becomes a workshop of possibilities. We sketch, model, test, and dismantle our own ideas with relentless honesty. Materials are touched, light is studied in motion, proportions are questioned. This is where intuition meets precision — where the raw energy of creativity is shaped into a coherent spatial language. We do not settle for the first beautiful answer; we search for the truest one.",
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            },
            {
                title: "Deliver & Protect",
                subtitle: "The gap between vision and reality is measured in care.",
                description: "Execution is where most designs falter. We bridge the distance with obsessive attention to craft, coordination, and site presence. Every junction, finish, and tolerance is verified against the original intent. We work alongside artisans, engineers, and builders — not as overseers, but as collaborators who speak the language of both poetry and precision. The completed space is not a departure from the vision; it is the vision, realised.",
                image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&q=80"
            }
        ]
    },
    accreditations: {
        items: [
            "IIA — Bengaluru",
            "LEED AP — BD+C",
            "RIBA — Chartered",
            "GRIHA — Accredited Professional",
            "WELL AP — v2"
        ]
    }
};

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
                    if (data && data.length > 0) {
                        const contentMap = {};
                        data.forEach(item => {
                            if (!contentMap[item.section]) contentMap[item.section] = {};
                            contentMap[item.section][item.key] = item.value;
                        });
                        setContent(contentMap);
                    } else {
                        setContent(defaultContent);
                    }
                } else {
                    setContent(defaultContent);
                }
            } catch (err) {
                console.error('Failed to fetch process content:', err);
                setContent(defaultContent);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        if (loading || !content) return;

        const ctx = gsap.context(() => {
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

            ScrollTrigger.create({
                trigger: '.sustainability-container',
                start: 'top top',
                end: 'bottom bottom',
                pin: '.sustainability-sticky-box',
                pinSpacing: false
            });

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

    const narrative = { ...defaultContent.narrative, ...content?.narrative };
    const sustainability = { ...defaultContent.sustainability, ...content?.sustainability };
    const initiatives = { ...defaultContent.initiatives, ...content?.initiatives };
    const accreditations = { ...defaultContent.accreditations, ...content?.accreditations };

    const initiativeItems = initiatives?.items || defaultContent.initiatives.items;
    const accreditationItems = accreditations?.items || defaultContent.accreditations.items;

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
                    <div className="sustainability-text-card" style={{ maxWidth: '800px', backgroundColor: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(5px)', padding: '60px', borderRadius: '4px' }}>
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
                        <div key={i} className={`initiative-card ${i % 2 === 0 ? 'initiative-normal' : 'initiative-reverse'}`}>
                            <div className="initiative-text">
                                <h4 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.8rem)', fontWeight: 300, fontFamily: 'var(--font-heading)', marginBottom: '32px' }}>{init.title}</h4>
                                <p style={{ fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.6, marginBottom: '40px', fontWeight: 400 }}>{init.subtitle}</p>
                                <p style={{ fontSize: '1rem', opacity: 0.4, lineHeight: 1.6 }}>{init.description}</p>
                                <div style={{ marginTop: '48px', height: '1px', width: '80px', backgroundColor: '#000', opacity: 0.3 }} />
                            </div>
                            <div className="initiative-image-wrap">
                                <img
                                    src={init.image}
                                    alt={init.title}
                                    className="initiative-img"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <style jsx>{`
                    .initiative-card {
                        display: grid;
                        grid-template-columns: 1fr 1.2fr;
                        gap: 60px;
                        align-items: center;
                    }
                    .initiative-reverse {
                        direction: rtl;
                    }
                    .initiative-reverse > * {
                        direction: ltr;
                    }
                    .initiative-image-wrap {
                        overflow: hidden;
                        border-radius: 2px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.05);
                    }
                    .initiative-img {
                        width: 100%;
                        height: auto;
                        aspect-ratio: 3/4;
                        object-fit: cover;
                    }
                    @media (max-width: 1024px) {
                        .initiative-card {
                            grid-template-columns: 1fr;
                            gap: 40px;
                        }
                        .initiative-reverse {
                            direction: ltr;
                        }
                        .initiative-img {
                            aspect-ratio: 16/9;
                        }
                    }
                    @media (max-width: 768px) {
                        .initiatives-grid {
                            gap: 80px !important;
                        }
                        .initiative-card {
                            gap: 30px;
                        }
                        .process-page > section:first-of-type {
                            padding-top: 100px !important;
                        }
                        .sustainability-text-card {
                            padding: 30px !important;
                        }
                        .process-accreditations {
                            gap: 40px !important;
                        }
                    }
                `}</style>
            </section>

            {/* --- ACCREDITATIONS --- */}
            <section
                className="process-section"
                data-nav-theme="light"
                style={{ padding: '120px 4% 160px', textAlign: 'center', backgroundColor: '#fff', borderTop: '1px solid #f8f8f8' }}
            >
                <div className="process-accreditations" style={{ display: 'flex', justifyContent: 'center', gap: '100px', flexWrap: 'wrap', alignItems: 'center', opacity: 0.3 }}>
                    {accreditationItems.map((item, i) => (
                        <div key={i} style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.2em', fontFamily: 'var(--font-heading)' }}>{item}</div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
