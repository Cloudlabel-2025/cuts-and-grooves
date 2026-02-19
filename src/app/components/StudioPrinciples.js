'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StudioPrinciples() {
    const sectionRef = useRef(null);
    const pillarsRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Simple fade in for pillars
            gsap.fromTo(pillarsRef.current.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full bg-[#FAFAFA] text-black py-24 md:py-32 px-4 md:px-12"
        >
            <div className="max-w-[1400px] mx-auto">
                {/* 3 PILLARS GRID */}
                <div
                    ref={pillarsRef}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-24 md:mb-32 border-b border-black/10 pb-12"
                >
                    {['Design integrity', 'Innovation', 'Enhanced living'].map((item, i) => (
                        <div key={i} className="flex flex-col">
                            <h3
                                className="text-2xl md:text-3xl font-light tracking-tight"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                {item}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* STUDIO SCOPE & ACTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

                    {/* Left: Section Title small */}
                    <div className="col-span-1 md:col-span-3">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">
                            Studio
                        </span>
                    </div>

                    {/* Middle: Scope Text */}
                    <div className="col-span-1 md:col-span-6">
                        <p className="text-xl md:text-2xl font-light leading-relaxed text-neutral-800">
                            The scope of our Studio covers all stages within Architecture and Interior Design. We offer an end to end level of service from early concepts through to practical completion.
                        </p>

                        {/* LINKS */}
                        <div className="flex gap-12 mt-12 md:mt-16">
                            <a href="/studio" className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:text-neutral-600 transition-colors">
                                Discover
                                <span className="block h-px w-8 bg-black group-hover:w-12 transition-all duration-300" />
                            </a>
                            <a href="/contact" className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:text-neutral-600 transition-colors">
                                Contact Us
                                <span className="block h-px w-8 bg-black group-hover:w-12 transition-all duration-300" />
                            </a>
                        </div>
                    </div>

                    {/* Right: Empty or image could go here later */}
                    <div className="col-span-1 md:col-span-3"></div>
                </div>
            </div>
        </section>
    );
}
