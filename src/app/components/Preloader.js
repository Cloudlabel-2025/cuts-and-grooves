'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function Preloader({ onComplete }) {
    const preloaderRef = useRef(null);
    const counterRef = useRef(null);
    const textRef = useRef(null);
    const columnRefs = useRef([]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    if (onComplete) onComplete();
                },
            });

            // Initial state
            gsap.set(columnRefs.current, { yPercent: 0 });
            gsap.set(textRef.current, { yPercent: 100, autoAlpha: 1 }); // Start below
            gsap.set(counterRef.current, { autoAlpha: 1 });

            // 1. Counter (0 -> 100)
            tl.to(counterRef.current, {
                innerText: 100,
                duration: 2.2,
                ease: 'power2.inOut',
                snap: { innerText: 1 },
                onUpdate: function () {
                    if (counterRef.current) {
                        counterRef.current.textContent = Math.round(this.targets()[0].innerText);
                    }
                },
            });

            // 2. Brand Name Reveal (Mask Up)
            tl.to(textRef.current, {
                yPercent: 0,
                duration: 1.2,
                ease: 'power3.out',
            }, '-=1.8');

            // Hold
            tl.to({}, { duration: 0.5 });

            // 3. Exit: Text & Counter Fade Out
            tl.to([textRef.current, counterRef.current], {
                yPercent: -100, // Move up and out
                autoAlpha: 0,
                duration: 0.8,
                ease: 'power3.in',
            });

            // 4. Exit: Columns Stagger Reveal (The "Groove")
            tl.to(columnRefs.current, {
                yPercent: -100,
                duration: 1.2,
                stagger: {
                    each: 0.1,
                    from: 'random',
                },
                ease: 'power4.inOut',
            }, '-=0.4');

        }, preloaderRef);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div ref={preloaderRef} className="preloader">
            {/* Background Columns */}
            <div className="preloader-columns">
                {[...Array(7)].map((_, i) => (
                    <div
                        key={i}
                        ref={el => columnRefs.current[i] = el}
                        className="preloader-column"
                    ></div>
                ))}
            </div>

            {/* Content Override */}
            <div className="preloader-content-wrapper">
                <div className="preloader-brand-mask">
                    <div ref={textRef} className="preloader-logo-wrapper">
                        <Image
                            src="/images/logo.png"
                            alt="Cuts & Grooves"
                            width={120}
                            height={120}
                            className="preloader-logo-img"
                            priority
                        />
                        <div className="preloader-logo-text">
                            <span className="preloader-logo-title">Cuts &amp; Grooves</span>
                            <span className="preloader-logo-subtitle">An Architecture Firm</span>
                        </div>
                    </div>
                </div>
                <div ref={counterRef} className="preloader-counter-large">
                    0
                </div>
            </div>
        </div>
    );
}
