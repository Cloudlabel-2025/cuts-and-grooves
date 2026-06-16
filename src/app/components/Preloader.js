'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function Preloader({ onComplete }) {
    const preloaderRef = useRef(null);
    const counterRef = useRef(null);
    const progressRef = useRef(null);
    const brandRef = useRef(null);
    const sketchRef = useRef(null);
    const lineRefs = useRef([]);
    const panelRefs = useRef([]);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    if (onCompleteRef.current) onCompleteRef.current();
                },
            });

            gsap.set(panelRefs.current, { yPercent: 0 });
            gsap.set(brandRef.current, { y: 34, autoAlpha: 0 });
            gsap.set(sketchRef.current, { autoAlpha: 0, scale: 0.96 });
            gsap.set(lineRefs.current, { scaleX: 0, transformOrigin: 'left center' });
            gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });
            gsap.set('.preloader-measure-tick', { autoAlpha: 0, y: 8 });
            gsap.set(counterRef.current, { innerText: 0, autoAlpha: 0 });

            tl.to(sketchRef.current, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.9,
                ease: 'power3.out',
            });

            tl.to(lineRefs.current, {
                scaleX: 1,
                duration: 1.35,
                stagger: 0.08,
                ease: 'power3.inOut',
            }, '-=0.55');

            tl.to(brandRef.current, {
                y: 0,
                autoAlpha: 1,
                duration: 1,
                ease: 'power4.out',
            }, '-=1.05');

            tl.to(counterRef.current, {
                autoAlpha: 1,
                duration: 0.4,
                ease: 'power2.out',
            }, '-=0.8');

            tl.to(progressRef.current, {
                scaleX: 1,
                duration: 2.1,
                ease: 'power2.inOut',
            }, '-=0.65');

            tl.to(counterRef.current, {
                innerText: 100,
                duration: 2.1,
                ease: 'power2.inOut',
                snap: { innerText: 1 },
                onUpdate: function () {
                    if (counterRef.current) {
                        const value = Math.round(this.targets()[0].innerText).toString().padStart(2, '0');
                        counterRef.current.textContent = `${value}%`;
                    }
                },
            }, '<');

            tl.to('.preloader-measure-tick', {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                stagger: 0.06,
                ease: 'power2.out',
            }, '-=1.2');

            tl.to({}, { duration: 0.35 });

            tl.to([brandRef.current, sketchRef.current, counterRef.current, '.preloader-progress-wrap'], {
                y: -30,
                autoAlpha: 0,
                duration: 0.65,
                ease: 'power3.inOut',
            });

            tl.set(preloaderRef.current, {
                backgroundColor: 'transparent',
            });

            tl.to(panelRefs.current, {
                yPercent: -100,
                duration: 1.05,
                stagger: {
                    each: 0.07,
                    from: 'center',
                },
                ease: 'power4.inOut',
            }, '-=0.25');
        }, preloaderRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={preloaderRef} className="preloader">
            <div className="preloader-panels">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => { panelRefs.current[i] = el; }}
                        className="preloader-panel"
                    ></div>
                ))}
            </div>

            <div className="preloader-plan-grid" aria-hidden="true"></div>

            <div className="preloader-content-wrapper">
                <div ref={sketchRef} className="preloader-sketch" aria-hidden="true">
                    <span className="preloader-plan-label">01 / Studio Plan</span>
                    <span className="preloader-north-mark">N</span>
                    <span ref={(el) => { lineRefs.current[0] = el; }} className="preloader-cut-line preloader-cut-line--top"></span>
                    <span ref={(el) => { lineRefs.current[1] = el; }} className="preloader-cut-line preloader-cut-line--middle"></span>
                    <span ref={(el) => { lineRefs.current[2] = el; }} className="preloader-cut-line preloader-cut-line--bottom"></span>
                    <span ref={(el) => { lineRefs.current[3] = el; }} className="preloader-groove-line preloader-groove-line--left"></span>
                    <span ref={(el) => { lineRefs.current[4] = el; }} className="preloader-groove-line preloader-groove-line--right"></span>
                    <span className="preloader-plan-block preloader-plan-block--large"></span>
                    <span className="preloader-plan-block preloader-plan-block--small"></span>
                </div>

                <div ref={brandRef} className="preloader-brand">
                    <div className="preloader-logo-mark">
                        <Image
                            src="/images/Blacklogo.png"
                            alt="Cuts & Grooves"
                            width={400}
                            height={140}
                            className="preloader-logo-img"
                            priority
                        />
                    </div>
                    <div className="preloader-logo-text">
                        <span className="preloader-kicker">Architecture / Interiors / Execution</span>
                        <span className="preloader-logo-title">Cuts & Grooves</span>
                        <span className="preloader-logo-subtitle">Spatial Design / Material Detail / Thoughtful Living</span>
                    </div>
                </div>

                <div className="preloader-progress-wrap">
                    <div className="preloader-progress-meta">
                        <span>Designing Experience</span>
                        <span ref={counterRef} className="preloader-counter-large">00%</span>
                    </div>
                    <div className="preloader-progress-track">
                        <span ref={progressRef} className="preloader-progress-bar"></span>
                        {[0, 1, 2, 3, 4].map((tick) => (
                            <span key={tick} className="preloader-measure-tick"></span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
