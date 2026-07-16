'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function Preloader({ onComplete, onTextArrived }) {
    const preloaderRef = useRef(null);
    const counterRef = useRef(null);
    const progressRef = useRef(null);
    const brandRef = useRef(null);
    const brandTitleRef = useRef(null); // "Cuts & Grooves" span
    const logoMarkRef = useRef(null);   // the image + kicker + subtitle
    const panelRefs = useRef([]);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;
    const onTextArrivedRef = useRef(onTextArrived);
    onTextArrivedRef.current = onTextArrived;

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
            gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' });
            gsap.set('.preloader-measure-tick', { autoAlpha: 0, y: 8 });
            gsap.set(counterRef.current, { innerText: 0, autoAlpha: 0 });

            // 1. Reveal Brand and Counter
            tl.to(brandRef.current, {
                y: 0,
                autoAlpha: 1,
                duration: 1.1,
                ease: 'power4.out',
            });

            tl.to(counterRef.current, {
                autoAlpha: 1,
                duration: 0.5,
                ease: 'power2.out',
            }, '-=0.9');

            // 2. Progress Bar (0 → 100)
            tl.to(progressRef.current, {
                scaleX: 1,
                duration: 2.1,
                ease: 'power2.inOut',
            }, '-=0.55');

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

            // Hold briefly
            tl.to({}, { duration: 0.35 });

            // 3. Fade out everything EXCEPT the title text
            tl.to([logoMarkRef.current, counterRef.current, '.preloader-progress-wrap'], {
                autoAlpha: 0,
                duration: 0.4,
                ease: 'power2.in',
            });

            // Set display: 'none' on the logo mark container so it does not affect centering of brandRef
            tl.set(logoMarkRef.current, { display: 'none' });

            // 4. Grab current position of the brand block, then fly title to the top
            tl.call(() => {
                const brandEl = brandRef.current;
                if (!brandEl) return;
                const brandRect = brandEl.getBoundingClientRect();

                // Convert the brand wrapper to fixed so it can travel outside overflow:hidden
                gsap.set(brandEl, {
                    position: 'fixed',
                    top: brandRect.top,
                    left: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#000000',
                    padding: '20px 0',
                    zIndex: 10001,
                    margin: 0,
                });
            });

            // Animate the brand wrapper up to the very top (in timeline)
            tl.to(brandRef.current, {
                top: 0,
                duration: 0.8,
                ease: 'power3.inOut',
            });

            // Simultaneously scale title text (in timeline)
            tl.to(brandTitleRef.current, {
                fontSize: '11.5vw',
                color: '#ffffff',
                letterSpacing: '-0.01em',
                fontWeight: 500,
                textTransform: 'uppercase',
                duration: 0.8,
                ease: 'power3.inOut',
            }, '<');

            // Trigger the callback to mount the navbar's top row underneath
            tl.call(() => {
                if (onTextArrivedRef.current) onTextArrivedRef.current();
            });

            // Immediately hide the preloader traveling text on the next frame
            tl.set(brandRef.current, { display: 'none' });

            // 5. Make preloader background transparent, then stagger reveal panels
            tl.set(preloaderRef.current, { backgroundColor: 'transparent' });

            tl.to(panelRefs.current, {
                yPercent: -100,
                duration: 1.05,
                stagger: {
                    each: 0.07,
                    from: 'center',
                },
                ease: 'power4.inOut',
            }, '-=0.3');

            // Small buffer so React can render navbar before preloader unmounts
            tl.to({}, { duration: 0.12 });

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
                <div ref={brandRef} className="preloader-brand">
                    {/* Logo image + kicker + subtitle — faded out before text travels */}
                    <div ref={logoMarkRef} className="preloader-logo-top-group">
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
                        <div className="preloader-logo-extra">
                            <span className="preloader-kicker">Architecture / Interiors / Execution</span>
                            <span className="preloader-logo-subtitle">Spatial Design / Material Detail / Thoughtful Living</span>
                        </div>
                    </div>

                    {/* The title that will travel to the top */}
                    <span ref={brandTitleRef} className="preloader-logo-title">
                        Cuts &amp; Grooves
                    </span>
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
