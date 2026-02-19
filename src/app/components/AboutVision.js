'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutVision() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Main Content Sequenced Reveal — triggered when content enters
            const contentTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.about-content',
                    start: 'top 75%',
                }
            });

            // Quote -> Description -> Values
            contentTl
                .fromTo('.about-quote',
                    { clipPath: 'inset(100% 0 0 0)', y: 40 },
                    { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.2, ease: 'power4.out' }
                )
                .fromTo('.about-description',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
                    '-=0.6'
                )
                .fromTo('.value-item',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
                    '-=0.4'
                );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="about-section" style={{ position: 'relative', zIndex: 20, padding: 0, background: '#ffffff' }}>
            {/* ─── Content Section ─── */}
            <div style={{ background: 'var(--gray-100)', padding: 'clamp(80px, 10vw, 160px) clamp(24px, 4vw, 60px)' }}>
                <div className="about-content">
                    <blockquote className="about-quote">
                        &ldquo;Each project is unique, responding to context, craft,
                        and the people who inhabit the space.&rdquo;
                    </blockquote>

                    <p className="about-description">
                        Cuts &amp; Grooves is a design studio crafting bespoke interiors and
                        architecture. With experience covering residential, hospitality,
                        commercial, and cultural spaces, we believe human touch must drive
                        creativity. Our lasting impact will be thoughtful, context-led spaces
                        that honour their histories and stand as enduring contributions.
                    </p>
                </div>

                <div className="values-grid">
                    <div className="value-item">
                        <h3>Design Integrity</h3>
                        <p>
                            A consistent process and detailed concept brief that considers
                            client needs, site context, and future occupiers.
                        </p>
                    </div>
                    <div className="value-item">
                        <h3>Innovation</h3>
                        <p>
                            We welcome innovation through research and technology while
                            believing human touch must drive creativity.
                        </p>
                    </div>
                    <div className="value-item">
                        <h3>Enhanced Living</h3>
                        <p>
                            Well-being at the forefront — designs that promote positive
                            interaction and encourage enriched experiences.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
