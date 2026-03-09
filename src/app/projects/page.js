'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index }) => {
    const cardRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance animation: Shutter reveal
            gsap.fromTo(cardRef.current,
                { clipPath: 'inset(100% 0 0 0)', y: 50 },
                {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    y: 0,
                    duration: 1.5,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 95%',
                    }
                }
            );

            // Parallax on image
            gsap.to(imageRef.current, {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            });
        }, cardRef);

        return () => ctx.revert();
    }, []);

    // Varied card sizes for cinematic masonry
    let cardClass = 'card-standard';
    if (index % 7 === 0) cardClass = 'card-large';
    else if (index % 5 === 0) cardClass = 'card-tall';
    else if (index % 3 === 0) cardClass = 'card-wide';

    const paddingBottom = cardClass === 'card-large' ? '100%' :
        cardClass === 'card-tall' ? '140%' :
            cardClass === 'card-wide' ? '70%' : '125%';

    return (
        <Link
            href={`/projects/${project.slug}`}
            ref={cardRef}
            className={`project-card ${cardClass}`}
            style={{
                position: 'relative',
                display: 'block',
                textDecoration: 'none',
                color: '#000',
                marginBottom: '4vw',
                cursor: 'pointer'
            }}
        >
            <div style={{ paddingBottom, position: 'relative', overflow: 'hidden', backgroundColor: '#f0f0f0', borderRadius: '1px' }}>
                <img
                    ref={imageRef}
                    src={project.mainImage}
                    alt={project.title}
                    loading="lazy"
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        left: 0,
                        width: '100%',
                        height: '120%',
                        objectFit: 'cover',
                        willChange: 'transform',
                    }}
                />
                <div className="project-image-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.05)', opacity: 0, transition: 'opacity 0.6s ease' }} />
            </div>

            <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>
                    {project.title}
                </h3>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, margin: '4px 0 0 0' }}>
                    {project.category}
                </p>
            </div>

            <style jsx>{`
                .project-card:hover .project-image-overlay { opacity: 1; }
                .card-large { grid-column: span 2; grid-row: span 2; }
                .card-tall { grid-column: span 1; grid-row: span 2; }
                .card-wide { grid-column: span 2; grid-row: span 1; }
                .card-standard { grid-column: span 1; grid-row: span 1; }

                @media (max-width: 1200px) {
                    .card-large, .card-wide { grid-column: span 2; }
                }
                @media (max-width: 800px) {
                    .card-large, .card-tall, .card-wide, .card-standard { grid-column: span 4; margin-top: 0 !important; }
                }
            `}</style>
        </Link>
    );
};

export default function Projects() {
    const containerRef = useRef(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (err) {
                console.error('Portfolio fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();

        const ctx = gsap.context(() => {
            gsap.from('.projects-title span', {
                yPercent: 110,
                duration: 1.4,
                stagger: 0.12,
                ease: 'power4.out',
                delay: 0.4
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="projects-page bg-white" data-nav-theme="light" style={{ minHeight: '100vh', position: 'relative' }}>
            {/* --- HERO HEADER --- */}
            <header
                data-nav-theme="light"
                style={{
                    padding: '160px 4% 60px'
                }}
            >
                <div style={{ overflow: 'hidden' }}>
                    <h1 className="projects-title" style={{ fontSize: 'clamp(2.5rem, 8vw, 10rem)', fontFamily: 'var(--font-heading)', fontWeight: 400, letterSpacing: '-0.03em', margin: 0 }}>
                        <span style={{ display: 'inline-block' }}>All&nbsp;</span>
                        <span style={{ display: 'inline-block' }}>works({projects.length})</span>
                    </h1>
                </div>
            </header>

            {/* --- GALLERY GRID --- */}
            <section
                data-nav-theme="light"
                style={{
                    padding: '0 4% 120px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridAutoRows: 'minmax(200px, auto)',
                    gap: '2vw',
                    minHeight: '400px'
                }}
            >
                {loading ? (
                    <div style={{ gridColumn: 'span 4', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                        <div style={{ fontSize: '12px', letterSpacing: '0.2em', opacity: 0.4, textTransform: 'uppercase' }}>Retrieving archive...</div>
                    </div>
                ) : projects.length > 0 ? (
                    projects.map((project, i) => (
                        <ProjectCard key={project._id || project.id} project={project} index={i} />
                    ))
                ) : (
                    <div style={{ gridColumn: 'span 4', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                        <div style={{ fontSize: '12px', letterSpacing: '0.2em', opacity: 0.4, textTransform: 'uppercase' }}>Registry Empty</div>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
