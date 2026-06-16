'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

const PAGES = [
    { name: 'Home', path: '/' },
    { name: 'Our Work', path: '/projects' },
    { name: 'Our Approach', path: '/process' },
    { name: 'About Us', path: '/studio' },
    { name: 'Contact', path: '/contact' },
];

const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 22px',
    borderRadius: '100px',
    backgroundColor: '#000',
    border: 'none',
    textDecoration: 'none',
    color: '#fff',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
};

const arrowStyle = {
    width: 16,
    height: 16,
    flexShrink: 0,
    display: 'block',
};

export default function FloatingPageNav() {
    const pathname = usePathname();
    const router = useRouter();
    const navRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    const currentIndex = PAGES.findIndex(p => p.path === pathname);
    const prev = currentIndex > 0 ? PAGES[currentIndex - 1] : null;
    const next = currentIndex < PAGES.length - 1 ? PAGES[currentIndex + 1] : null;

    const goTo = useCallback((path) => {
        router.push(path);
    }, [router]);

    const [visible, setVisible] = useState(true);
    const visibleRef = useRef(true);

    useEffect(() => {
        setMounted(true);

        const nav = navRef.current;
        if (nav) {
            gsap.fromTo(nav,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2 }
            );
        }

        const onScroll = () => {
            const scrollBottom = window.scrollY + window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const distFromBottom = docHeight - scrollBottom;
            const shouldHide = distFromBottom < 350;
            if (shouldHide === visibleRef.current) {
                visibleRef.current = !shouldHide;
                setVisible(!shouldHide);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!mounted || currentIndex === -1 || (!prev && !next)) return null;

    return (
        <div ref={navRef} style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
        }}>
            {prev && (
                <button
                    onClick={() => goTo(prev.path)}
                    style={btnStyle}
                    aria-label={`Previous: ${prev.name}`}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#000'}
                >
                    <svg viewBox="0 0 24 24" style={arrowStyle}>
                        <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{prev.name}</span>
                </button>
            )}
            {next && (
                <button
                    onClick={() => goTo(next.path)}
                    style={btnStyle}
                    aria-label={`Next: ${next.name}`}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#000'}
                >
                    <span>{next.name}</span>
                    <svg viewBox="0 0 24 24" style={arrowStyle}>
                        <path d="M9 18l6-6-6-6" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}
        </div>
    );
}
