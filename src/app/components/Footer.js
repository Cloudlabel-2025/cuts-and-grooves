'use client';

import { useState } from 'react';

export default function Footer({ content }) {
    const address = content?.address || "Cumbum, Theni,\nTamil Nadu.";
    const phone = content?.phone || "+91 80157 59988";
    const email = content?.email || "hello@cutsandgrooves.com";

    const [emailValue, setEmailValue] = useState('');
    const [emailStatus, setEmailStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!emailValue.trim() || !emailValue.includes('@')) {
            setEmailStatus('error');
            return;
        }
        setEmailStatus('success');
        setEmailValue('');
        setTimeout(() => setEmailStatus(''), 4000);
    };

    const scrollToTop = () => {
        const lenis = window.__lenis;
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.5 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const linkStyle = {
        color: '#000',
        textDecoration: 'none',
        transition: 'opacity 0.3s ease',
        fontSize: '1rem',
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
    };

    const labelStyle = {
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.8)',
        display: 'block',
        marginBottom: 16,
        fontFamily: 'var(--font-body)',
    };

    return (
        <footer style={{
            width: '100%',
            backgroundColor: '#ffffff',
            color: '#000',
            padding: '60px 5% 32px',
            fontFamily: 'var(--font-body)',
            borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
            <div style={{
                maxWidth: 1400,
                margin: '0 auto',
                width: '100%',
            }}>

                {/* CTA */}
                <div style={{
                    marginBottom: 40,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: 40,
                }}>
                    <p style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
                        fontWeight: 300,
                        color: 'rgba(0,0,0,0.5)',
                        lineHeight: 1.3,
                        letterSpacing: '-0.01em',
                        margin: 0,
                        maxWidth: 500,
                    }}>
                        Let&rsquo;s build something beautiful together
                    </p>
                    <a href="/contact" style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: '#fff',
                        backgroundColor: '#000',
                        textDecoration: 'none',
                        padding: '16px 36px',
                        borderRadius: '100px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.3s ease',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#1a1a1a';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = '#000';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >Start a project &rarr;</a>
                </div>

                {/* GRID */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.5fr 1fr 1.3fr',
                    gap: 32,
                    padding: '32px 0',
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                }}>
                    {/* Navigate */}
                    <div>
                        <span style={labelStyle}>Navigate</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'Our Work', href: '/projects' },
                                { label: 'Our Approach', href: '/process' },
                                { label: 'About Us', href: '/studio' },
                                { label: 'Contact', href: '/contact' },
                            ].map(item => (
                                <a key={item.label} href={item.href} style={linkStyle}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.4'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >{item.label}</a>
                            ))}
                        </div>
                    </div>

                    {/* Studio */}
                    <div>
                        <span style={labelStyle}>Studio</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <p style={{ ...linkStyle, margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{address}</p>
                            <a href={`tel:${phone}`} style={linkStyle}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.4'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >{phone}</a>
                            <a href={`mailto:${email}`} style={linkStyle}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.4'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >{email}</a>
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <span style={labelStyle}>Connect</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {['Instagram', 'LinkedIn'].map(social => (
                                <a key={social} href="#" style={linkStyle}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.4'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >{social}</a>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <span style={labelStyle}>Newsletter</span>
                        <form onSubmit={handleSubmit} style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1.5px solid #000',
                            paddingBottom: 6,
                        }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={emailValue}
                                onChange={e => setEmailValue(e.target.value)}
                                suppressHydrationWarning
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 400,
                                    color: '#000',
                                    padding: 0,
                                    fontFamily: 'var(--font-body)',
                                }}
                            />
                            <button type="submit" suppressHydrationWarning style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                color: '#000',
                                padding: '0 0 0 10px',
                                transition: 'opacity 0.3s ease',
                                fontFamily: 'var(--font-body)',
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.4'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >Submit</button>
                        </form>
                        {emailStatus === 'success' && (
                            <span style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: 8, display: 'block', fontWeight: 500 }}>Thank you for subscribing!</span>
                        )}
                        {emailStatus === 'error' && (
                            <span style={{ fontSize: '0.85rem', color: '#dc2626', marginTop: 8, display: 'block', fontWeight: 500 }}>Please enter a valid email.</span>
                        )}
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    paddingTop: 20,
                    fontSize: '0.85rem',
                    fontWeight: 400,
                    color: 'rgba(0,0,0,0.8)',
                }}>
                    <span>&copy; {new Date().getFullYear()} Cuts &amp; Grooves. All rights reserved.</span>
                    <div style={{ display: 'flex', gap: 32 }}>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#000'}
                            onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
                        >Privacy</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#000'}
                            onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
                        >Terms</a>
                        <button onClick={scrollToTop} suppressHydrationWarning style={{
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            fontSize: 'inherit',
                            fontFamily: 'inherit',
                            padding: 0,
                            transition: 'color 0.3s ease',
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#000'}
                            onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
                        >Back to top &uarr;</button>
                    </div>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                        <a href="/admin/login" target="_blank" style={{
                            color: 'rgba(0,0,0,0.6)',
                            fontSize: '0.72rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                            fontWeight: 500,
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#000'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
                        >Admin</a>
                        <a href="https://cloudheard.org/" target="_blank" style={{
                            color: 'rgba(0,0,0,0.6)',
                            fontSize: '0.72rem',
                            letterSpacing: '0.04em',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                            fontWeight: 500,
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#000'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
                        >Site by <span style={{ color: '#1028dbff' }}>CHC</span></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
