'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const pathname = usePathname();
    const navRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const [isDark, setIsDark] = useState(false);
    const drawerRef = useRef(null);

    useEffect(() => {
        setIsDark(pathname?.includes('/projects') || pathname?.includes('/process') || pathname?.includes('/studio') || pathname?.includes('/contact'));
    }, [pathname]);

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
            <nav ref={navRef} className={`navbar ${isDark && !menuOpen ? 'navbar--dark' : ''}`}>
                {/* ─── Left: Brand ─── */}
                <Link href="/" className="nav-brand nav-item">
                    <Image
                        src="/images/Blacklogo.png"
                        alt="Cuts & Grooves"
                        width={400}
                        height={140}
                        style={{
                            width: 'auto',
                            height: 'clamp(52px, 6vw, 90px)',
                            filter: 'none',
                            display: 'block',
                        }}
                        priority
                    />
                </Link>

                {/* ─── Center-left: Nav links (comma separated) ─── */}
                <div className="nav-links nav-item">
                    <Link href="/projects" className="nav-link">Our Work</Link>
                    <span className="nav-comma">,</span>
                    <Link href="/process" className="nav-link">Our Approach</Link>
                    <span className="nav-comma">,</span>
                    <Link href="/studio" className="nav-link">About Us</Link>
                </div>

                {/* ─── Right: Contact ─── */}
                <div className="nav-right nav-item">
                    <Link href="/contact" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
                        fontWeight: 500,
                        color: isDark ? '#fff' : '#000',
                        backgroundColor: isDark ? '#000' : 'transparent',
                        border: isDark ? 'none' : '1px solid #000',
                        textDecoration: 'none',
                        padding: '10px 24px',
                        borderRadius: '100px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        lineHeight: 1,
                    }}
                        onMouseEnter={e => {
                            if (isDark) {
                                e.currentTarget.style.backgroundColor = '#1a1a1a';
                            } else {
                                e.currentTarget.style.backgroundColor = '#000';
                                e.currentTarget.style.color = '#fff';
                            }
                        }}
                        onMouseLeave={e => {
                            if (isDark) {
                                e.currentTarget.style.backgroundColor = '#000';
                            } else {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#000';
                            }
                        }}
                    >
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
                        <Link href="/projects" className="drawer-link" onClick={() => setMenuOpen(false)}>Our Work</Link>
                        <Link href="/studio" className="drawer-link" onClick={() => setMenuOpen(false)}>About Us</Link>
                        <Link href="/process" className="drawer-link" onClick={() => setMenuOpen(false)}>Our Approach</Link>
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
