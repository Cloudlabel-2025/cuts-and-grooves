'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const pathname = usePathname();
    const navRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(pathname?.includes('/projects') || pathname?.includes('/process') || pathname?.includes('/studio') || pathname?.includes('/contact'));
    }, [pathname]);
    const drawerRef = useRef(null);

    // Live clock
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const mins = now.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? 'PM' : 'AM';
            const h12 = hours % 12 || 12;
            setCurrentTime(`${h12.toString().padStart(2, '0')}:${mins}${period}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 30000);
        return () => clearInterval(interval);
    }, []);

    // Entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.nav-item',
                { opacity: 0, y: -20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    delay: 3.2,
                }
            );
        }, navRef);

        return () => ctx.revert();
    }, []);

    // Scroll-based color switch: white on dark hero → black on white sections
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Slight delay to ensure DOM is ready after navigation
            setTimeout(() => {
                const sections = document.querySelectorAll('[data-nav-theme]');

                sections.forEach((section) => {
                    const theme = section.getAttribute('data-nav-theme');
                    ScrollTrigger.create({
                        trigger: section,
                        start: 'top 50px', // When the section enters the navbar area
                        end: 'bottom 50px', // When it leaves
                        onToggle: (self) => {
                            if (self.isActive) setIsDark(theme === 'light');
                        },
                        onRefresh: (self) => {
                            if (self.isActive) setIsDark(theme === 'light');
                        },
                        // Fallback for enter/leave
                        onEnter: () => setIsDark(theme === 'light'),
                        onEnterBack: () => setIsDark(theme === 'light'),
                    });
                });
            }, 100);
        });

        return () => ctx.revert();
    }, [pathname]);

    // Drawer animation
    useEffect(() => {
        if (!drawerRef.current) return;

        const ctx = gsap.context(() => {
            if (menuOpen) {
                document.body.style.overflow = 'hidden';

                gsap.fromTo(
                    drawerRef.current,
                    { x: '100%' },
                    { x: '0%', duration: 0.8, ease: 'power4.inOut' }
                );

                gsap.fromTo(
                    '.drawer-link',
                    { y: 80, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        stagger: 0.08,
                        ease: 'power3.out',
                        delay: 0.3,
                    }
                );

                gsap.fromTo(
                    '.drawer-social',
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power3.out',
                        delay: 0.7,
                    }
                );
            } else {
                document.body.style.overflow = '';

                gsap.to(drawerRef.current, {
                    x: '100%',
                    duration: 0.6,
                    ease: 'power4.inOut',
                });
            }
        }, drawerRef);

        return () => ctx.revert();
    }, [menuOpen]);

    return (
        <>
            <nav ref={navRef} className={`navbar ${isDark ? 'navbar--dark' : ''}`}>
                {/* ─── Left: Brand ─── */}
                <Link href="/" className="nav-brand nav-item">
                    CUTS &amp; GROOVES
                </Link>

                {/* ─── Center-left: Nav links (comma separated) ─── */}
                <div className="nav-links nav-item">
                    <Link href="/projects" className="nav-link">Work</Link>
                    <span className="nav-comma">,</span>
                    <Link href="/process" className="nav-link">Process</Link>
                    <span className="nav-comma">,</span>
                    <Link href="/studio" className="nav-link">Studio</Link>
                </div>

                {/* ─── Right: Time, Location, Contact ─── */}
                <div className="nav-right nav-item">
                    <span className="nav-meta nav-time">
                        {currentTime}
                    </span>
                    <span className="nav-meta nav-location">
                        India
                    </span>
                    <Link href="/contact" className="nav-contact">
                        Contact
                    </Link>
                </div>

                {/* ─── Hamburger (mobile) ─── */}
                <button
                    className={`nav-hamburger nav-item ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    suppressHydrationWarning={true}
                >
                    <span></span>
                    <span></span>
                </button>
            </nav>

            {/* Fullscreen drawer menu */}
            <div ref={drawerRef} className="drawer-menu">
                <div className="drawer-content">
                    <div className="drawer-links">
                        <Link href="/" className="drawer-link" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link href="/projects" className="drawer-link" onClick={() => setMenuOpen(false)}>Work</Link>
                        <Link href="/studio" className="drawer-link" onClick={() => setMenuOpen(false)}>Studio</Link>
                        <Link href="/process" className="drawer-link" onClick={() => setMenuOpen(false)}>Process</Link>
                        <Link href="/contact" className="drawer-link" onClick={() => setMenuOpen(false)}>Contact</Link>
                    </div>
                    <div className="drawer-social">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </div>
                </div>
            </div>
        </>
    );
}
