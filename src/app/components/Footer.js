'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Footer({ content }) {
    const footerRef = useRef(null);
    const topSectionRef = useRef(null);
    const bottomSectionRef = useRef(null);

    const address = content?.address || "123 Cuts and Grooves.\nCumbum, Theni.\nTamilnadu.";
    const phone = content?.phone || "+91 80157 59988";
    const email = content?.email || "hello@cutsandgrooves.com";

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Animating the top white card to shrink and round its corners
            gsap.to(topSectionRef.current, {
                scale: 0.94,
                borderRadius: '40px',
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top bottom',
                    end: 'bottom bottom',
                    scrub: true,
                }
            });
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit',
        transition: 'opacity 0.3s ease',
        cursor: 'pointer',
    };

    const metaLabelStyle = {
        fontWeight: '700',
        fontSize: '0.9rem',
        minWidth: '40px',
        display: 'inline-block'
    };

    return (
        <div
            ref={footerRef}
            className="main-footer"
            style={{
                position: 'relative',
                zIndex: 10,
                backgroundColor: '#ffffff',
                fontFamily: 'var(--font-body)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >

            {/* --- TOP SECTION (WHITE CARD) --- */}
            <div
                ref={topSectionRef}
                data-nav-theme="light"
                className="footer-top-section"
                style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    padding: '80px 4%',
                    width: '100%',
                    position: 'relative',
                    zIndex: 2,
                    transformOrigin: 'bottom center',
                    willChange: 'transform, border-radius',
                    boxShadow: '0 -30px 60px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ maxWidth: '1920px', margin: '0 auto', width: '100%' }}>
                    {/* Upper Row */}
                    <div className="footer-upper-row" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        gap: '40px',
                        marginBottom: '60px',
                        alignItems: 'flex-start'
                    }}>

                        {/* 1. CTA */}
                        <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingRight: '0', marginBottom: '20px' }}>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                                fontWeight: '300',
                                color: '#000000',
                                lineHeight: '1.1',
                                marginBottom: '10px',
                                letterSpacing: '-0.02em'
                            }}>
                                Talk to us about your project
                            </h2>
                            <a href="/contact" style={{
                                ...linkStyle,
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(1.5rem, 6vw, 2.8rem)',
                                fontWeight: '500',
                                borderBottom: '2px solid #000000',
                                paddingBottom: '2px',
                                lineHeight: '1.1',
                                letterSpacing: '-0.02em'
                            }}>
                                Contact us
                            </a>
                        </div>

                        {/* 2. Nav */}
                        <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px' }}>
                            {['Home', 'Work', 'Studio', 'Process', 'Contact'].map((item) => (
                                <a
                                    key={item}
                                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    style={{ ...linkStyle, fontSize: '1rem', fontWeight: '500' }}
                                    onMouseEnter={(e) => e.target.style.color = '#737373'}
                                    onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* 3. Info */}
                        <div className="footer-contact-info" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '40px', paddingTop: '10px', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <span style={metaLabelStyle}>L</span>
                                <p style={{ fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' }}>
                                    {address}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <span style={metaLabelStyle}>P</span>
                                <a href={`tel:${phone}`} style={{ ...linkStyle, fontSize: '0.9rem', fontWeight: '500' }}>
                                    {phone}
                                </a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <span style={metaLabelStyle}>C</span>
                                <a href={`mailto:${email}`} style={{ ...linkStyle, fontSize: '0.9rem', fontWeight: '500' }}>
                                    {email}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Lower Row */}
                    <div className="footer-lower-row" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid rgba(0,0,0,0.05)',
                        paddingTop: '40px',
                        gap: '30px'
                    }}>
                        <div className="footer-newsletter-wrapper" style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap' }}>Subscribe to our newsletter</span>
                            <div style={{
                                display: 'flex',
                                borderBottom: '1px solid #d4d4d4',
                                paddingBottom: '5px',
                                alignItems: 'center',
                                width: '100%',
                                maxWidth: '350px'
                            }}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    suppressHydrationWarning={true}
                                    style={{ width: '100%', outline: 'none', color: '#000000', border: 'none', background: 'transparent', fontSize: '0.9rem', padding: 0 }}
                                />
                                <button suppressHydrationWarning={true} style={{ marginLeft: '10px', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#000000' }}>&rarr;</button>
                            </div>
                        </div>
                        <div style={{ flex: '1 1 150px', display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={scrollToTop}
                                suppressHydrationWarning={true}
                                style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500', padding: 0, transition: 'color 0.3s ease' }}
                                onMouseEnter={(e) => e.target.style.color = '#000000'}
                                onMouseLeave={(e) => e.target.style.color = '#888888'}
                            >
                                Back to top
                            </button>
                        </div>
                        <div className="footer-social-links" style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <a href="#" style={{ ...linkStyle, fontSize: '0.9rem', fontWeight: '500', color: '#000000' }}>Instagram</a>
                            <a href="#" style={{ ...linkStyle, fontSize: '0.9rem', fontWeight: '500', marginLeft: '2px', color: '#000000' }}>LinkedIn</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM SECTION (MASSIVE BRAND & LEGAL) --- */}
            <div
                data-nav-theme="light"
                style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    padding: '60px 4% 60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2,
                    marginTop: '-2px' // Prevent thin line issue
                }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    gap: '40px'
                }}>
                    {/* Brand Text */}
                    <h2 className="footer-brand-text" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2rem, 11vw, 12rem)',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        color: '#000000',
                        margin: 0,
                        lineHeight: 0.8,
                        textAlign: 'center',
                        width: '100%',
                        paddingBottom: '20px',
                        opacity: 0.9
                    }}>
                        Cuts & Grooves
                    </h2>

                    {/* Legal Row */}
                    <div className="footer-legal-links" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '0.72rem',
                        fontWeight: '300',
                        color: '#000000',
                        width: '100%',
                        gap: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        <span>All rights reserved © Cuts & Grooves 2025</span>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <a href="#" style={{ ...linkStyle, color: '#000000' }}>Privacy policy</a>
                            <a href="#" style={{ ...linkStyle, color: '#000000' }}>Terms of services</a>
                        </div>
                        <a href="#" style={{ ...linkStyle, color: '#000000' }}>Website by <span style={{ textDecoration: 'underline' }}>CHC</span></a>
                    </div>
                </div>
            </div>
        </div>
    );
}
