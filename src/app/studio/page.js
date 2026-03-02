'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';

const teamMembers = [
    { name: "Morgan Jenkins", role: "Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
    { name: "Clara Mcdonald", role: "Associate", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" },
    { name: "Ethan Hunt", role: "Senior Architect", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" },
    { name: "Sarah Connor", role: "Interior Designer", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
    { name: "John Wick", role: "Graduate Architect", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" },
];

export default function StudioPage() {
    const containerRef = useRef(null);
    const teamContainerRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(0);
    const [activeVisionIndex, setActiveVisionIndex] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // 1. Hero Text Reveal
            const heroText = document.querySelectorAll('.studio-hero h1 span');
            gsap.from(heroText, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.05,
                ease: 'power3.out',
                delay: 0.2
            });

            // 2. Narrative/Quote Reveal
            gsap.from('.studio-quote', {
                opacity: 0,
                y: 40,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.studio-quote',
                    start: 'top 80%',
                }
            });

            // 3. Values Section Reveal
            const values = document.querySelectorAll('.value-item');
            values.forEach((value, i) => {
                gsap.from(value, {
                    opacity: 0,
                    y: 30,
                    duration: 1,
                    delay: i * 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: value,
                        start: 'top 85%',
                    }
                });
            });

            // 4. Vision Section Reveal
            const visionItems = document.querySelectorAll('.vision-item');
            visionItems.forEach((item, i) => {
                gsap.from(item, {
                    opacity: 0,
                    y: 40,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="studio-page bg-white text-black" data-nav-theme="light">
            {/* --- HERO SECTION --- */}
            <section className="studio-hero-section">
                <h1 className="studio-hero-title" style={{
                    fontSize: 'clamp(2rem, 3.5vw, 4rem)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 300,
                    lineHeight: 1.2,
                    maxWidth: '1400px',
                    margin: 0,
                    letterSpacing: '-0.02em'
                }}>
                    {"Cuts & Grooves is a India based architecture & interior design studio.".split(' ').map((word, i) => (
                        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', marginRight: '0.25em' }}>{word}</span>
                    ))}
                </h1>
            </section>

            {/* --- QUOTE SECTION --- */}
            <section style={{ padding: '0 4% 160px' }}>
                <h2 className="studio-quote" style={{
                    fontSize: 'clamp(1.5rem, 2.5vw, 3rem)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 300,
                    lineHeight: 1.3,
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center',
                    color: '#000'
                }}>
                    “Each project embodies the vision and expertise of our designers — transforming ideas into purposeful, enduring spaces.”
                </h2>
            </section>

            {/* --- MEET THE TEAM SECTION --- */}
            <section ref={teamContainerRef} className="studio-team-section">
                <div className="studio-team-grid">

                    {/* LEFT COLUMN: LIST */}
                    <div>
                        <h3 style={{
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '80px',
                            opacity: 0.4
                        }}>Meet the team</h3>

                        <div
                            className="team-list"
                            onMouseLeave={() => setHoveredIndex(0)}
                        >
                            {teamMembers.map((member, i) => (
                                <div
                                    key={i}
                                    className="team-item"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    style={{
                                        padding: '15px 0',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        color: hoveredIndex === i ? '#000' : '#ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px'
                                    }}
                                >
                                    <span style={{
                                        fontSize: 'clamp(2rem, 3.5vw, 4rem)',
                                        fontFamily: 'var(--font-heading)',
                                        fontWeight: hoveredIndex === i ? 500 : 300,
                                        color: hoveredIndex === i ? '#000000' : '#cccccc',
                                        lineHeight: 1.1,
                                        letterSpacing: '-0.02em',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        {member.name}
                                    </span>
                                    <span style={{
                                        opacity: hoveredIndex === i ? 1 : 0,
                                        transform: hoveredIndex === i ? 'translateX(0)' : 'translateX(-10px)',
                                        transition: 'all 0.3s ease',
                                        fontSize: '1.5rem'
                                    }}>→</span>

                                    <div className="team-image-mobile">
                                        <div className="team-image-mobile-inner">
                                            <img src={member.image} alt={member.name} />
                                        </div>
                                        <div className="team-role-mobile">
                                            <span>[ {member.role} ]</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STICKY PREVIEW */}
                    <div className="team-preview-col">
                        <div className="team-preview-sticky">
                            <div style={{
                                width: '100%',
                                aspectRatio: '4/5',
                                backgroundColor: '#f0f0f0',
                                marginBottom: '20px',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={teamMembers[hoveredIndex].image}
                                    alt="Team Member"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'opacity 0.4s ease',
                                        display: 'block'
                                    }}
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                paddingBottom: '10px',
                                borderBottom: '1px solid #000'
                            }}>
                                <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>[ Role ]</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                                    {teamMembers[hoveredIndex].role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- VALUES & VISION SECTION --- */}
            <section className="studio-values-section">
                <div className="studio-container">

                    {/* VALUES */}
                    <div className="values-layout-grid">
                        <div className="section-label-col">
                            <span style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>02</span>
                            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Our values</h3>
                        </div>
                        <div>
                            <p style={{ fontSize: '1.5rem', lineHeight: 1.4, fontWeight: 300, maxWidth: '800px' }}>
                                We deliver a highly personalised service with direct involvement at every stage of the project.Our work is grounded in a deep understanding of context, client priorities, and user experience — ensuring each building is purposeful, enduring, and relevant over time.
                            </p>
                        </div>
                    </div>

                    {/* VISION (ACCORDION) */}
                    <div className="vision-layout-grid">
                        <div className="section-label-col">
                            <span style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>03</span>
                            <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Our vision</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {[
                                {
                                    title: "Design Integrity",
                                    text: "Our design aesthetic is established through a consistent process and a detailed concept brief, which considers client needs, site context, and the future occupiers. We combine and test these elements to create a singular design vision concealing many influencing layers. This singular vision, like a piece of artwork, is unique and individual. We believe the principles of design quality should always be present no matter the project brief or building scale.",
                                    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
                                },
                                {
                                    title: "Innovation",
                                    text: "Cuts and Grooves embraces innovation as a disciplined pursuit, grounded in research and informed by evolving technology. We challenge conventions, explore new methodologies, and contribute fresh thinking to the built environment.Technology is integral to our process — a powerful tool that sharpens precision and expands possibility. Yet creativity remains human at its core. Insight, intuition, and critical thinking guide every decision we make.",
                                    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80"
                                },
                                {
                                    title: "Enhanced Living",
                                    text: "We believe enhanced user experience and well-being should be at the forefront of design. We constantly consider the impact of design on the end user to ensure our designs promote positive human interaction and encourage healthier, enriched experiences.",
                                    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                                }
                            ].map((item, i) => {
                                const isOpen = activeVisionIndex === i; // Changed to use activeVisionIndex
                                return (
                                    <div
                                        key={i}
                                        className="vision-item"
                                        onMouseEnter={() => setActiveVisionIndex(i)} // Changed to use setActiveVisionIndex
                                        style={{
                                            borderTop: '1px solid rgba(0,0,0,0.1)',
                                            padding: '40px 0',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isOpen ? '30px' : '0' }}>
                                            <h4 style={{
                                                fontSize: '2rem',
                                                fontFamily: 'var(--font-heading)',
                                                fontWeight: 300,
                                                margin: 0,
                                                opacity: isOpen ? 1 : 0.6,
                                                transition: 'opacity 0.3s'
                                            }}>{item.title}</h4>
                                            <span style={{
                                                fontSize: '1.5rem',
                                                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s'
                                            }}>+</span>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateRows: isOpen ? '1fr' : '0fr',
                                            transition: 'grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ minHeight: 0 }}>
                                                <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.7, maxWidth: '800px', marginBottom: '40px' }}>
                                                    {item.text}
                                                </p>
                                                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                                                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </section >

            {/* --- AWARDS SECTION --- */}
            < section style={{ padding: '0 4% 160px', backgroundColor: '#f9f9f9' }
            }>
                <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '100px' }}>

                    {/* Header with Number */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '80px', opacity: 0.4 }}>
                        <span style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>04</span>
                        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Awards</h3>
                    </div>

                    {/* Awards Table */}
                    <div className="awards-table">
                        {/* Table Header */}
                        <div className="awards-header-grid">
                            <div>Year</div>
                            <div>Project</div>
                            <div>Contest</div>
                            <div>Distinction</div>
                        </div>

                        {/* Table Content */}
                        {[
                            {
                                year: "2025",
                                items: [
                                    { project: "PNG Waterfront Residences", contest: "Architizer Vision Awards", distinction: "Vision for Localism: Finalist" },
                                    { project: "Ormond House", contest: "Houses Awards", distinction: "House Alteration and Addition over 200sqm: Shortlisted" }
                                ]
                            },
                            {
                                year: "2024",
                                items: [
                                    { project: "The Saint Hotel", contest: "Australian Interior Design Awards", distinction: "Hospitality Design: Shortlisted" },
                                    { project: "The Saint Hotel", contest: "Eat Drink Design Awards", distinction: "Best Restaurant design" }
                                ]
                            }
                        ].map((group, i) => (
                            <div key={i} className="awards-row-grid">
                                <div className="awards-year">{group.year}</div>
                                <div className="awards-items-col">
                                    {group.items.map((item, j) => (
                                        <div key={j} className="award-item-grid">
                                            <span>{item.project}</span>
                                            <span>{item.contest}</span>
                                            <span className="award-distinction">{item.distinction}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* --- JOB OFFERS SECTION --- */}
            < section style={{ padding: '0 4% 160px', backgroundColor: '#f9f9f9', borderTop: '1px solid #eee' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '100px' }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '80px', opacity: 0.4 }}>Job Offers</h3>
                    <div style={{ paddingBottom: '60px' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '60px', maxWidth: '800px', lineHeight: 1.6 }}>
                            We are looking for motivated, curious and dedicated talent who want to contribute to our growth while sharing our values.
                        </p>

                        {[{
                            title: "Graduate Architect",
                            type: "Full-time",
                            location: "Melbourne"
                        }, {
                            title: "Interior Designer",
                            type: "Full-time",
                            location: "Melbourne"
                        }].map((job, i) => (
                            <a key={i} href="mailto:careers@cutsandgrooves.com" className="job-offer-card">
                                <div>
                                    <span className="job-title">{job.title}</span>
                                </div>
                                <div className="job-meta">
                                    <span>{job.type}</span>
                                    <span>{job.location}</span>
                                </div>
                            </a>
                        ))}
                        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }} />
                    </div>
                </div>
            </section >



            <Footer />
        </main >
    );
}
