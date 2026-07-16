'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function getResponsiveClipPath(w) {
    if (w < 480) return 'inset(8% 10% 8% 10%)';
    if (w < 768) return 'inset(10% 12% 10% 12%)';
    if (w < 1024) return 'inset(15% 20% 15% 20%)';
    return 'inset(25% 30% 25% 30%)';
}

function getBracketOffset(w) {
    if (w < 768) return 12;
    if (w < 1024) return 16;
    return 20;
}

export default function SelectedWorks({ projects: initialProjects }) {
    const containerRef = useRef(null);
    const projects = useMemo(() => initialProjects || [], [initialProjects]);

    const heading = "Featured Projects";

    const initAnimations = useCallback(() => {
        const clampPath = getResponsiveClipPath(window.innerWidth);
        const bracketOffset = getBracketOffset(window.innerWidth);

        // 1. Cinematic Section Entrance (Heading)
        const entranceTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.works-header-side',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });

        entranceTl
            .from('.works-heading', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
            });

        // 2. Continuous Wave Animation (Small -> Full -> Small)
        const cards = gsap.utils.toArray('.work-card');

        cards.forEach((card) => {
            const inner = card.querySelector('.work-image-container');
            const title = card.querySelector('.work-title');
            const bracketLeft = title.querySelector('.bracket-left');
            const bracketRight = title.querySelector('.bracket-right');

            gsap.set(title, { opacity: 1, y: 0 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                }
            });

            tl.fromTo(
                inner,
                {
                    clipPath: clampPath,
                    filter: 'brightness(0.6)'
                },
                {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    filter: 'brightness(1)',
                    duration: 1,
                    ease: 'power1.out'
                }
            )
                .to(
                    inner,
                    {
                        clipPath: clampPath,
                        filter: 'brightness(0.6)',
                        duration: 1,
                        ease: 'power1.in'
                    }
                );

            const titleTl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                }
            });

            titleTl.fromTo(
                [bracketLeft, bracketRight],
                { x: 0 },
                {
                    x: (i) => i === 0 ? -bracketOffset : bracketOffset,
                    duration: 1,
                    ease: 'power2.out'
                }
            )
                .to(
                    [bracketLeft, bracketRight],
                    { duration: 0.2 }
                )
                .to(
                    [bracketLeft, bracketRight],
                    {
                        x: 0,
                        duration: 0.8,
                        ease: 'power2.inOut'
                    }
                );
        });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            initAnimations();
        }, containerRef);

        const handleResize = () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach(st => st.kill());
            gsap.context(() => {
                initAnimations();
            }, containerRef);
        };

        let resizeTimer;
        const debouncedResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 300);
        };

        window.addEventListener('resize', debouncedResize);

        return () => {
            ctx.revert();
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(resizeTimer);
        };
    }, [projects, initAnimations]);

    return (
        <section ref={containerRef} id="works" className="works-section" data-nav-theme="light">
            <div className="works-inner">
                {/* Side Header */}
                <div className="works-header-side">
                    <h2 className="works-heading">{heading}</h2>
                    {/* Removed content?.subtext block */}
                </div>

                {/* Content Column */}
                <div className="works-content-column">
                    <div className="works-stack">
                        {projects.map((project, i) => (
                            <div key={i} className="work-card">
                                <Link href={`/projects/${project.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <div className="work-card-inner">
                                        <h3 className="work-title">
                                            <span className="bracket-left" style={{ display: 'inline-block' }}>[</span>
                                            <span className="title-text" style={{ padding: '0 10px', display: 'inline-block' }}>{project.title}</span>
                                            <span className="bracket-right" style={{ display: 'inline-block' }}>]</span>
                                        </h3>
                                        <div className="work-image-container">
                                            {project.mainImage ? (
                                                <Image
                                                    src={project.mainImage}
                                                    alt={project.title}
                                                    width={2000}
                                                    height={1200}
                                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                    priority={i === 0}
                                                    unoptimized
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d4d4d4' }}>Visuals in Progress</span>
                                                </div>
                                            )}
                                            <div className="work-overlay">
                                                <div className="work-meta">
                                                    <span>{project.category}</span>
                                                    <span>{project.year}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>


                </div>
            </div>

            {/* New Scattered Section */}

        </section>
    );
}
