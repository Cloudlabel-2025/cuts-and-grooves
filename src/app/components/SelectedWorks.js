'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SelectedWorks({ projects: initialProjects }) {
    const listRef = useRef(null);
    const containerRef = useRef(null);
    const projects = initialProjects || [];

    const heading = "Selected Works";

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Cinematic Section Entrance (Heading + Count)
            gsap.set(['.works-heading', '.works-count'], { y: 50, opacity: 0 });

            const entranceTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.works-header-side',
                    start: 'top 85%',
                },
            });

            entranceTl
                .to('.works-heading', {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                })
                .to(
                    '.works-count',
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                    },
                    '-=1'
                );

            // 2. Continuous Wave Animation (Small -> Full -> Small)
            const cards = gsap.utils.toArray('.work-card');

            cards.forEach((card, i) => {
                const inner = card.querySelector('.work-image-container');
                const title = card.querySelector('.work-title');
                const bracketLeft = title.querySelector('.bracket-left');
                const bracketRight = title.querySelector('.bracket-right');

                // Ensure initial state
                gsap.set(title, { opacity: 1, y: 0 });

                // MAIN SCROLL TIMELINE (Linked to card's transit through viewport)
                const isMobile = window.innerWidth < 1024;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom', // Enters viewport
                        end: 'bottom top',   // Leaves viewport
                        scrub: 1,            // Smooth scrub
                    }
                });

                // PHASE 1: EXPAND (0% -> 50% scroll ie. Bottom -> Center)
                tl.fromTo(
                    inner,
                    {
                        clipPath: isMobile ? 'inset(15% 15% 15% 15%)' : 'inset(25% 30% 25% 30%)',
                        filter: 'brightness(0.6)'
                    },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        filter: 'brightness(1)',
                        duration: 1,
                        ease: 'power1.out'
                    }
                )
                    // PHASE 2: SHRINK (50% -> 100% scroll ie. Center -> Top)
                    .to(
                        inner,
                        {
                            clipPath: isMobile ? 'inset(15% 15% 15% 15%)' : 'inset(25% 30% 25% 30%)',
                            filter: 'brightness(0.6)',
                            duration: 1,
                            ease: 'power1.in'
                        }
                    );

                // TITLE BRACKETS (Independent Fast Animation)
                const titleTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    }
                });

                // Expand Brackets Even Slower (0-50% of scroll timeline)
                titleTl.fromTo(
                    [bracketLeft, bracketRight],
                    { x: 0 },
                    {
                        x: (i) => i === 0 ? -20 : 20, // Small, subtle expansion
                        duration: 1,
                        ease: 'power2.out'
                    }
                )
                    // HOLD at width (50-60% of scroll)
                    .to(
                        [bracketLeft, bracketRight],
                        { duration: 0.2 }
                    )
                    // Shrink Brackets (60-100% of scroll)
                    .to(
                        [bracketLeft, bracketRight],
                        {
                            x: 0,
                            duration: 0.8,
                            ease: 'power2.inOut'
                        }
                    );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [projects]);

    return (
        <section ref={containerRef} id="works" className="works-section" data-nav-theme="light">
            <div className="works-inner">
                {/* Side Header */}
                <div className="works-header-side">
                    <h2 className="works-heading">{heading}</h2>
                    <span className="works-count">({projects.length})</span>
                    {/* Removed content?.subtext block */}
                </div>

                {/* Content Column */}
                <div className="works-content-column">
                    <div className="works-stack">
                        {projects.map((project, i) => (
                            <div key={i} className="work-card">
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
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-[10px] uppercase tracking-widest text-gray-300">Visual Asset Pending</span>
                                            </div>
                                        )}
                                        <div className="work-overlay">
                                            <div className="work-meta">
                                                <span>{project.type}</span>
                                                <span>{project.year}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>

            {/* New Scattered Section */}

        </section>
    );
}
