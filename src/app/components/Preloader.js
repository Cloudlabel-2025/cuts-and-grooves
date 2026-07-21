'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete, onTextArrived }) {
    const preloaderRef = useRef(null);
    const counterRef = useRef(null);
    const metaRefs = useRef([]);
    const onCompleteRef = useRef(onComplete);
    const onTextArrivedRef = useRef(onTextArrived);

    useEffect(() => {
        onCompleteRef.current = onComplete;
        onTextArrivedRef.current = onTextArrived;
    }, [onComplete, onTextArrived]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const progress = { value: 0 };
            const tl = gsap.timeline({
                defaults: { ease: 'power4.out' },
                onComplete: () => {
                    document.body.style.overflow = '';
                    onCompleteRef.current?.();
                },
            });

            gsap.set(metaRefs.current, { autoAlpha: 0, y: 14 });
            gsap.set(counterRef.current, { textContent: '0%' });

            tl.to(metaRefs.current, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.08,
            });

            tl.to(progress, {
                value: 100,
                duration: 1.8,
                ease: 'power2.inOut',
                onUpdate: () => {
                    if (counterRef.current) {
                        counterRef.current.textContent = `${Math.round(progress.value)}%`;
                    }
                },
            }, '-=0.85');

            tl.to({}, { duration: 0.28 });

            tl.to(metaRefs.current, {
                autoAlpha: 0,
                y: -12,
                duration: 0.35,
                stagger: 0.04,
                ease: 'power2.in',
            });

            tl.call(() => {
                onTextArrivedRef.current?.();
            });

            tl.to(preloaderRef.current, {
                yPercent: -100,
                duration: 0.95,
                ease: 'power4.inOut',
            }, '+=0.08');
        }, preloaderRef);

        return () => {
            document.body.style.overflow = '';
            ctx.revert();
        };
    }, []);

    return (
        <div ref={preloaderRef} className="preloader preloader--slice" aria-label="Loading Cuts and Grooves">
            <div className="preloader-meta preloader-meta--left" ref={(el) => { metaRefs.current[0] = el; }}>
                <span>Design studio</span>
                <span>Architecture &amp; interior</span>
            </div>

            <div className="preloader-meta preloader-meta--center" ref={(el) => { metaRefs.current[1] = el; }}>
                <span>Cuts &amp; Grooves</span>
                <span>India</span>
            </div>

            <div className="preloader-meta preloader-meta--right" ref={(el) => { metaRefs.current[2] = el; }}>
                <span>Loading</span>
                <span ref={counterRef}>0%</span>
            </div>

            <span className="sr-only">CUTS &amp; GROOVES</span>
        </div>
    );
}
