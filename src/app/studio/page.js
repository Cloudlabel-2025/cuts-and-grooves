'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';


const DEFAULT_CONTENT = {
    narrative: {
        heading: 'Cuts & Grooves is an India-based architecture and interior design studio — a practice built on the conviction that the most resonant spaces are not imposed, but revealed.',
        quote: '“Every project is a quiet conversation between what is and what could be. We listen to the land, the light, and the unspoken aspirations of those who will inhabit the space. Our work is not about stamping a signature — it is about arriving at a truth that belongs to the project alone.”',
        valuesText: 'We believe architecture is a practice of attention. Attention to context, craft, and the lived experience of every person who moves through a space. Our process is intimate and immersive — we do not rush toward solutions, but dwell in the questions long enough for the right answers to surface. Each project, regardless of scale, receives the same rigour: a deep respect for material honesty, a sensitivity to natural light and landscape, and a refusal to compromise on the quiet details that separate the ordinary from the inevitable.'
    },
    team: {
        members: [
            { name: "Arjun Mehta", role: "Principal Architect", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
            { name: "Priya Kapoor", role: "Associate Director", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" },
            { name: "Rohan Desai", role: "Senior Architect", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" },
            { name: "Ananya Sharma", role: "Interior Designer", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
            { name: "Vikram Singh", role: "Graduate Architect", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" },
        ]
    },
    vision: {
        items: [
            {
                title: "Design Integrity",
                text: "Integrity is not a stylistic choice — it is the floor beneath every decision we make. We resist the temptation of novelty for its own sake, seeking instead a clarity that endures. Each line, each junction, each material seam is tested against a single question: does it serve the idea? Our design process is one of distillation — removing what is unnecessary until only the essential remains. The result is architecture that does not shout for attention, but earns it through poise, proportion, and an almost invisible rightness.",
                image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
            },
            {
                title: "Innovation",
                text: "We pursue innovation not as a spectacle, but as a quiet discipline — a willingness to question inherited assumptions and to search for better ways of making and meaning. Technology, for us, is a means of sharpening intent, not a end in itself. We study emerging materials, construction methods, and environmental strategies, but we deploy them only when they deepen the narrative of a project. True innovation, we believe, is invisible: it is the smarter plan, the more efficient structure, the space that breathes more lightly on the land.",
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80"
            },
            {
                title: "Enhanced Living",
                text: "Architecture, at its best, is a stage for life. We design not for cameras or critics, but for the quiet rituals of daily existence — the morning light falling across a breakfast table, the breeze that moves through a corridor on a warm afternoon, the sense of arrival as one steps through a threshold. Every spatial decision we make is measured against its impact on human experience. We believe that well-crafted spaces have the power to heal, to inspire, and to connect us more deeply to one another and to the world around us.",
                image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
            }
        ]
    },
    awards: {
        items: [
            {
                year: "2025",
                items: [
                    { project: "Shamiana Luxury Residences", contest: "World Architecture Festival", distinction: "Residential — Completed: Finalist" },
                    { project: "The Verandah House", contest: "Indian Institute of Architects Awards", distinction: "Excellence in Residential Design: Commended" }
                ]
            },
            {
                year: "2024",
                items: [
                    { project: "Bungalow 47", contest: "ArchDaily Interior Design Awards", distinction: "Hospitality Interior: Shortlisted" },
                    { project: "Terraced Retreat", contest: "Dezeen Awards", distinction: "Rural House of the Year: Longlisted" }
                ]
            }
        ]
    },
    careers: {
        heading: 'We are always looking for curious minds and dedicated hands — people who share our belief that architecture is a craft of patience, rigour, and quiet ambition.',
        jobs: [
            { title: "Graduate Architect", type: "Full-time", location: "Bengaluru" },
            { title: "Interior Designer", type: "Full-time", location: "Bengaluru" }
        ]
    }
};

const STUDIO_BUILDING_IMAGE = '/images/All-works-01.jpg';

export default function StudioPage() {
    const containerRef = useRef(null);
    const teamContainerRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [activeVisionIndex, setActiveVisionIndex] = useState(null);
    const [content, setContent] = useState(DEFAULT_CONTENT);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content?page=studio');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();

                if (data && data.length > 0) {
                    const contentMap = {};
                    data.forEach(item => {
                        if (!contentMap[item.section]) contentMap[item.section] = {};
                        contentMap[item.section][item.key] = item.value;
                    });
                    setContent(contentMap);
                }
            } catch (err) {
                console.error('Error fetching studio content:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    useEffect(() => {
        if (!content) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // 1. Narrative/Quote Reveal
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

            // 2. Values Section Reveal
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

            // 3. Vision Section Reveal
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
    }, [loading, content]);

    // Initial loading state (brief pulse before content appears)
    const [initialWait, setInitialWait] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setInitialWait(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (initialWait && loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse">Consulting Studio Archives...</div>
            </div>
        );
    }

    const narrative = { ...DEFAULT_CONTENT.narrative, ...content?.narrative };
    const team = { ...DEFAULT_CONTENT.team, ...content?.team };
    const vision = { ...DEFAULT_CONTENT.vision, ...content?.vision };
    const awardsData = { ...DEFAULT_CONTENT.awards, ...content?.awards };
    const careers = { ...DEFAULT_CONTENT.careers, ...content?.careers };

    const teamMembers = team.members || DEFAULT_CONTENT.team.members;
    const visionItems = vision.items || DEFAULT_CONTENT.vision.items;
    const awards = awardsData.items || DEFAULT_CONTENT.awards.items;
    const jobOffers = careers.jobs || DEFAULT_CONTENT.careers.jobs;
    const introHeading = narrative.heading;
    const quote = narrative.quote;
    const valuesText = narrative.valuesText;
    const careersHeading = careers.heading;

    return (
        <main ref={containerRef} className="studio-page bg-white text-black pt-12" data-nav-theme="light">

            <style jsx>{`
                @media (max-width: 768px) {
                    .studio-page {
                        padding-top: 7rem !important;
                    }
                    .studio-awards-section,
                    .studio-jobs-section {
                        padding-bottom: 80px !important;
                    }
                    .studio-awards-inner,
                    .studio-jobs-inner {
                        padding-top: 60px !important;
                    }
                    .studio-narrative-section {
                        padding: 8vh 4% 8vh !important;
                    }
                }
            `}</style>

            {/* --- NARRATIVE SECTION --- */}
            <section className="studio-narrative-section" style={{ padding: '15vh 4% 15vh' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h1 className="studio-heading" style={{
                        fontSize: 'clamp(1.8rem, 4.2vw, 5.2rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 300,
                        lineHeight: 1.1,
                        maxWidth: '1200px',
                        marginBottom: '15vh',
                        textAlign: 'left',
                        color: '#000',
                        letterSpacing: '-0.02em'
                    }}>
                        {introHeading}
                    </h1>

                    <h2 className="studio-quote" style={{
                        fontSize: 'clamp(1rem, 1.8vw, 2.2rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 300,
                        lineHeight: 1.5,
                        maxWidth: '1100px',
                        margin: '0 auto',
                        textAlign: 'center',
                        color: '#000',
                        letterSpacing: '-0.01em'
                    }}>
                        {quote}
                    </h2>
                </div>
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
                            onMouseLeave={() => setHoveredIndex(null)}
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
                        <div className="team-preview-sticky" style={{ maxWidth: '400px', marginLeft: 'auto' }}>
                            <div style={{
                                width: '100%',
                                aspectRatio: '4/5',
                                backgroundColor: '#f0f0f0',
                                marginBottom: '20px',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={hoveredIndex === null ? STUDIO_BUILDING_IMAGE : teamMembers[hoveredIndex]?.image}
                                    alt={hoveredIndex === null ? 'Architectural building facade' : teamMembers[hoveredIndex]?.name}
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
                                <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                                    {hoveredIndex === null ? '[ Studio ]' : '[ Role ]'}
                                </span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                                    {hoveredIndex === null ? 'Architecture & Interior Design' : teamMembers[hoveredIndex]?.role}
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
                                {valuesText}
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
                            {visionItems.map((item, i) => {
                                const isOpen = activeVisionIndex === i;
                                return (
                                    <div
                                        key={i}
                                        className="vision-item"
                                        onMouseEnter={() => setActiveVisionIndex(i)}
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
            < section className="studio-awards-section" style={{ padding: '0 4% 160px', backgroundColor: '#f9f9f9' }
            }>
                <div className="studio-awards-inner" style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '100px' }}>

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
                        {awards.map((group, i) => (
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
            < section className="studio-jobs-section" style={{ padding: '0 4% 160px', backgroundColor: '#f9f9f9', borderTop: '1px solid #eee' }}>
                <div className="studio-jobs-inner" style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '100px' }}>
                    <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '80px', opacity: 0.4 }}>Job Offers</h3>
                    <div style={{ paddingBottom: '60px' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '60px', maxWidth: '800px', lineHeight: 1.6 }}>
                            {careersHeading}
                        </p>

                        {jobOffers.map((job, i) => (
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
