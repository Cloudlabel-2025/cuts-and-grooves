'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar({ preloaderLoaded, hasScrolled, heroRevealed }) {
    const pathname = usePathname();
    const navRef = useRef(null);
    const topRowRef = useRef(null);
    const brandTextRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);
    const [isDark, setIsDark] = useState(() => {
        return pathname?.includes('/projects') || pathname?.includes('/process') || pathname?.includes('/studio') || pathname?.includes('/contact');
    });

    const [scrolled, setScrolled] = useState(false);
    const drawerRef = useRef(null);

    // Sync state if pathname changes in render
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setIsDark(pathname?.includes('/projects') || pathname?.includes('/process') || pathname?.includes('/studio') || pathname?.includes('/contact'));
    }

    // Scroll listener: local scrolled state (only after hero is revealed)
    useEffect(() => {
        if (!preloaderLoaded || !heroRevealed) return;

        const handleScroll = () => {
            if (window.scrollY > 80) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [preloaderLoaded, heroRevealed]);

    // Entrance animation for nav items (fires after preloader on non-home, or after reveal on home)
    useEffect(() => {
        if (!preloaderLoaded) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.nav-bottom-row .nav-item',
                { opacity: 0, y: -20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                }
            );
        }, navRef);

        return () => ctx.revert();
    }, [preloaderLoaded]);

    // ─── HERO REVEAL ANIMATION ───
    // When heroRevealed fires: brand bar slides up, small logo fades in
    useEffect(() => {
        if (!heroRevealed || !topRowRef.current) return;

        const tl = gsap.timeline();

        // 1. Slide the brand bar upward off screen
        tl.to(topRowRef.current, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power3.inOut',
        }, 0);

        // 2. Fade out the massive text slightly ahead of the bar sliding out
        if (brandTextRef.current) {
            tl.to(brandTextRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
            }, 0);
        }

        // 3. After bar is gone, snap height to 0 to avoid layout gap
        tl.set(topRowRef.current, { display: 'none' }, 0.85);

    }, [heroRevealed]);

    // Scroll-based color switch: white on dark hero → black on white sections
    useEffect(() => {
        const ctx = gsap.context(() => {
            setTimeout(() => {
                const sections = document.querySelectorAll('[data-nav-theme]');

                sections.forEach((section) => {
                    const theme = section.getAttribute('data-nav-theme');
                    ScrollTrigger.create({
                        trigger: section,
                        start: 'top 50px',
                        end: 'bottom 50px',
                        onToggle: (self) => {
                            if (self.isActive) setIsDark(theme === 'light');
                        },
                        onRefresh: (self) => {
                            if (self.isActive) setIsDark(theme === 'light');
                        },
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

    const navbarClass = `navbar ${isDark && !menuOpen ? 'navbar--dark' : ''} ${!preloaderLoaded ? 'navbar--loading' : ''} ${scrolled ? 'navbar--scrolled' : ''} ${hasScrolled ? 'navbar--collapsed-permanent' : ''}`.trim();

    return (
        <>
            <nav ref={navRef} className={navbarClass}>
                {/* ─── Top Row: Massive Brand Text — pinned state after preloader ─── */}
                <div 
                    ref={topRowRef} 
                    className="nav-top-row"
                    style={{ display: preloaderLoaded ? 'flex' : 'none' }}
                >
                    <Link ref={brandTextRef} href="/" className="nav-center-brand-text">
                        Cuts & Grooves
                    </Link>
                </div>

                {/* ─── Bottom Row: Navigation Items ─── */}
                <div className="nav-bottom-row">
                    {/* ─── Left: Brand Logo ─── */}
                    <Link href="/" className="nav-brand nav-item">
                        <Image
                            src="/images/Blacklogo.png"
                            alt="Cuts & Grooves"
                            width={400}
                            height={140}
                            style={{
                                width: 'auto',
                                height: 'clamp(52px, 6vw, 90px)',
                                display: 'block',
                            }}
                            priority
                        />
                    </Link>

                    {/* ─── Center-left: Nav Links ─── */}
                    <div className="nav-links nav-item">
                        <Link href="/projects" className="nav-link">Our Work</Link>
                        <span className="nav-comma">,</span>
                        <Link href="/process" className="nav-link">Our Approach</Link>
                        <span className="nav-comma">,</span>
                        <Link href="/studio" className="nav-link">About Us</Link>
                    </div>

                    {/* ─── Right: Contact ─── */}
                    <div className="nav-right nav-item">
                        <Link href="/contact" className="nav-link">
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
                </div>
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
