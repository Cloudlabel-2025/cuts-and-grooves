'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../../data/projects';
import Footer from '../../components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetail() {
    const { slug } = useParams();
    const router = useRouter();
    const project = projects.find(p => p.slug === slug);
    const projectIndex = projects.findIndex(p => p.slug === slug);
    const nextProject = projects[(projectIndex + 1) % projects.length];

    const heroRef = useRef(null);
    const containerRef = useRef(null);
    const navRef = useRef(null);

    // Redirect if project doesn't exist
    useEffect(() => {
        if (!project) {
            router.push('/projects');
        }
    }, [project, router]);

    useEffect(() => {
        if (!project) return;

        const ctx = gsap.context(() => {
            // Hero Image Zoom Out (Entrance)
            gsap.fromTo('.project-hero-img',
                { scale: 1.2 },
                { scale: 1, duration: 2.5, ease: 'power2.out' }
            );

            // Title Reveal
            gsap.fromTo('.project-hero-title span',
                { yPercent: 100 },
                { yPercent: 0, duration: 1.5, stagger: 0.1, ease: 'power4.out', delay: 0.2 }
            );

            // Parallax on Gallery Images... (existing logic)
            gsap.utils.toArray('.gallery-img-wrapper').forEach((img, i) => {
                const speed = 0.5 + (i % 3) * 0.2;
                gsap.to(img, {
                    y: -100 * speed,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                });
            });

            // Meta Info stagger reveal
            gsap.from('.meta-item', {
                opacity: 0,
                y: 20,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.project-meta',
                    start: 'top 80%',
                }
            });

            // --- FIXED BACK BUTTON LOGIC ---
            gsap.fromTo('.fixed-back-button',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, delay: 1, ease: 'power3.out' }
            );

            // Hide fixed button when reaching the next project section or footer
            ScrollTrigger.create({
                trigger: '.next-project-teaser',
                start: 'top bottom', // When teaser enters screen
                onEnter: () => gsap.to('.fixed-back-button', { opacity: 0, scale: 0.9, duration: 0.4 }),
                onLeaveBack: () => gsap.to('.fixed-back-button', { opacity: 1, scale: 1, duration: 0.4 })
            });

            // Reveal Next Project Section content
            gsap.from('.next-project-card', {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.next-project-teaser',
                    start: 'top 85%',
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, [project]);

    if (!project) return null;

    return (
        <main ref={containerRef} className="project-detail bg-white">
            {/* --- CINEMATIC HERO --- */}
            <section
                ref={heroRef}
                data-nav-theme="dark"
                style={{
                    position: 'relative',
                    height: '100vh',
                    width: '100%',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                <img
                    className="project-hero-img"
                    src={project.mainImage}
                    alt={project.title}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.7
                    }}
                />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff' }}>
                    <div style={{ overflow: 'hidden' }}>
                        <h1 className="project-hero-title" style={{ fontSize: 'clamp(4rem, 12vw, 15rem)', fontFamily: 'var(--font-heading)', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
                            {project.title.split(' ').map((word, i) => (
                                <span key={i} style={{ display: 'inline-block' }}>{word}&nbsp;</span>
                            ))}
                        </h1>
                    </div>
                    <p style={{ marginTop: '20px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.8 }}>
                        {project.category} — {project.location}
                    </p>
                </div>
            </section>

            {/* --- PROJECT NARRATIVE & META --- */}
            <section
                data-nav-theme="light"
                style={{
                    padding: '120px 4% 80px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gap: '40px',
                    position: 'relative'
                }}
            >
                <div className="project-meta" style={{ gridColumn: 'span 4' }}>
                    <div className="meta-item" style={{ marginBottom: '40px' }}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Project Year</span>
                        <p style={{ fontSize: '1.5rem', marginTop: '8px' }}>{project.year}</p>
                    </div>
                    <div className="meta-item" style={{ marginBottom: '40px' }}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Location</span>
                        <p style={{ fontSize: '1.5rem', marginTop: '8px' }}>{project.location}</p>
                    </div>
                </div>
                <div style={{ gridColumn: 'span 8', maxWidth: '800px' }}>
                    <p className="meta-item" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 3rem)', lineHeight: 1.3, fontFamily: 'var(--font-heading)', marginBottom: '60px' }}>
                        {project.description}
                    </p>
                </div>
            </section>

            {/* --- GALLERY STORYTELLING --- */}
            <section
                className="gallery-storytelling-section"
                data-nav-theme="light"
                style={{ padding: '0 4% 80px' }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4vw', alignItems: 'start' }}>
                    {project.gallery.map((img, i) => (
                        <div
                            key={i}
                            className="gallery-img-wrapper"
                            style={{
                                gridColumn: i === 0 ? 'span 2' : 'span 1',
                                marginBottom: '4vw',
                                overflow: 'hidden',
                                borderRadius: '2px'
                            }}
                        >
                            <img
                                src={img}
                                alt={`${project.title} detail ${i}`}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* --- NEXT PROJECT TEASER SECTION --- */}
            <section
                className="next-project-teaser"
                data-nav-theme="light"
                style={{
                    padding: '60px 4% 100px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff'
                }}
            >
                <Link
                    href={`/projects/${nextProject.slug}`}
                    className="next-project-card"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: '6px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        minWidth: 'clamp(160px, 18vw, 220px)',
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        border: '1px solid #222'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    <div style={{ width: '60px', height: '45px', overflow: 'hidden', borderRadius: '2px' }}>
                        <img
                            src={nextProject.mainImage}
                            alt={nextProject.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div style={{ paddingRight: '10px' }}>
                        <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 400, fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>{nextProject.title}</span>
                        <span style={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, marginTop: '1px' }}>Next project</span>
                    </div>
                </Link>
            </section>

            <Footer />

            {/* --- PERSISTENT FLOATING BACK BUTTON --- */}
            <div
                className="fixed-back-button"
                style={{
                    position: 'fixed',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    pointerEvents: 'auto'
                }}
            >
                <Link
                    href="/projects"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        fontFamily: 'sans-serif',
                        whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.backgroundColor = '#222'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#000'; }}
                >
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>‹</span>
                    <span>Back to all works</span>
                </Link>
            </div>
        </main>
    );
}
