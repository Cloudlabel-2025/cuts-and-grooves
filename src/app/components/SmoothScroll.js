'use client';

import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

function SmoothScroll({ children }) {
    const lenisRef = useRef();

    useEffect(() => {
        function update(time) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        gsap.ticker.add(update);

        // Expose Lenis instance globally for components like Footer scroll-to-top
        if (lenisRef.current?.lenis) {
            window.__lenis = lenisRef.current.lenis;
        }

        return () => {
            gsap.ticker.remove(update);
            delete window.__lenis;
        };
    }, []);

    // Custom Easing (Expo Inverse)
    // t => Math.min(1, 1.001 - Math.pow(2, -10 * t))

    return (
        <ReactLenis
            root
            ref={lenisRef}
            autoRaf={false}
            options={{
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    );
}

export default SmoothScroll;
