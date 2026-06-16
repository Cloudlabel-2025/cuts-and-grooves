'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ToastProvider } from '@/app/components/admin/Toast';

export default function AdminLayout({ children }) {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [showLogout, setShowLogout] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const lastActivityRef = useRef(null);

    // Activity-based session keepalive
    const markActive = useCallback(() => {
        lastActivityRef.current = Date.now();
    }, []);

    useEffect(() => {
        lastActivityRef.current = Date.now();
        const events = ['mousedown', 'keydown', 'scroll', 'mousemove', 'touchstart'];
        events.forEach(e => window.addEventListener(e, markActive, { passive: true }));

        // Every 15 minutes, if user was active in the last 15 min, refresh session
        const interval = setInterval(() => {
            const idleMs = Date.now() - (lastActivityRef.current || Date.now());
            if (idleMs < 15 * 60 * 1000) {
                update(); // refreshes the JWT token, extending its expiry
            }
        }, 15 * 60 * 1000);

        return () => {
            events.forEach(e => window.removeEventListener(e, markActive));
            clearInterval(interval);
        };
    }, [markActive, update]);

    const isLoginPage = pathname?.includes('/login');

    if (status === 'loading') {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '48px', height: '48px', border: '2px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTop: '2px solid #000', animation: 'spin 1s linear infinite' }}></div>
                    <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', fontWeight: '500', textTransform: 'uppercase' }}>Loading</span>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated' && !isLoginPage) {
        if (typeof window !== 'undefined') {
            router.push('/admin/login');
        }
        return null;
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <ToastProvider>
        <div className="admin-app-frame" style={{ minHeight: '100vh', backgroundColor: '#f4f3ef', color: '#111', display: 'flex', flexDirection: 'row', fontFamily: 'Inter, sans-serif' }}>
            {/* SIDEBAR */}
            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'admin-sidebar-open' : ''}`}>
                {/* Sidebar Header */}
                <div className="admin-sidebar-header" style={{ padding: '28px 22px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                        <Image src="/images/logo.png" alt="Cuts & Grooves" width={42} height={42} />
                        <div style={{ minWidth: 0 }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>Cuts & Grooves</h2>
                            <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.55)', margin: '5px 0 0 0', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '700' }}>Admin Studio</p>
                        </div>
                    </div>
                    {/* Mobile Close */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="admin-mobile-close"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: '#000',
                            padding: '4px'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Sidebar Nav */}
                <nav style={{ flex: 1, padding: '22px 14px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <SidebarLink href="/admin/dashboard" label="Dashboard" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                        } />
                        <div style={{ padding: '4px 0' }}><div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} /></div>
                        <SidebarLink href="/admin/pages/home" label="Home" pathname={pathname} matchPrefix onClick={() => setIsMobileMenuOpen(false)} icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        } />
                        <SidebarLink href="/admin/pages/projects" label="Portfolio" pathname={pathname} matchPrefix onClick={() => setIsMobileMenuOpen(false)} icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                        } />
                        <SidebarLink href="/admin/pages/process" label="Process" pathname={pathname} matchPrefix onClick={() => setIsMobileMenuOpen(false)} icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        } />
                        <SidebarLink href="/admin/pages/studio" label="Studio" pathname={pathname} matchPrefix onClick={() => setIsMobileMenuOpen(false)} icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        } />
                        <SidebarLink href="/admin/pages/contact" label="Contact" pathname={pathname} matchPrefix onClick={() => setIsMobileMenuOpen(false)} icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        } />
                        <div style={{ padding: '4px 0' }}><div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} /></div>
                        <SidebarLink href="/admin/media" label="Media" pathname={pathname} onClick={() => setIsMobileMenuOpen(false)} icon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                        } />
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div style={{ padding: '16px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                    <button
                        onClick={() => setShowLogout(!showLogout)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#000',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#000',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {session?.user?.email?.[0].toUpperCase() || 'A'}
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ margin: 0, fontSize: '12px', fontWeight: '600' }}>{session?.user?.email?.split('@')[0] || 'Admin'}</p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showLogout ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}><path d="m6 9 6 6 6-6" /></svg>
                    </button>

                    {showLogout && (
                        <div style={{
                            marginTop: '12px',
                            padding: '12px 16px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            border: '1px solid rgba(0,0,0,0.1)'
                        }}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    signOut({ callbackUrl: '/admin/login' });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="admin-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* MAIN CONTENT */}
            <div className="admin-shell-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', overflow: 'hidden', marginLeft: '0' }}>
                {/* TOP NAVBAR */}
                <header className="admin-topbar">
                    {/* Left - Hamburger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="admin-hamburger"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: '#000000'
                        }}
                    >
                        ☰
                    </button>

                    {/* Center */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderRadius: '20px'
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#000000',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                        }}></div>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#000000', letterSpacing: '0.08em', textTransform: 'uppercase' }}>LIVE</span>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <VisitPageButton pathname={pathname} />
                    </div>
                </header>

                {/* MAIN CONTENT AREA */}
                <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f4f3ef' }}>
                    <div className="admin-content-area admin-readable">
                        {children}
                    </div>
                </main>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                /* Desktop sidebar */
                .admin-sidebar {
                    width: 280px;
                    height: 100vh;
                    background-color: #fff;
                    border-right: 1px solid rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                    z-index: 40;
                    position: relative;
                    flex-shrink: 0;
                    transition: transform 0.3s ease;
                }
                .admin-mobile-close { display: none; }
                .admin-hamburger { display: none; }
                .admin-overlay { display: none; }

                .admin-topbar {
                    position: sticky;
                    top: 0;
                    z-index: 30;
                    background-color: #ffffff;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-left: 32px;
                    padding-right: 32px;
                    width: 100%;
                }

                    .admin-content-area {
                        padding: clamp(24px, 3vw, 48px);
                        max-width: 1520px;
                        margin: 0 auto;
                        width: 100%;
                    }

                    .admin-preview-text { display: inline; }

                    @media (min-width: 1280px) {
                        .admin-sidebar { width: 300px; }
                    }

                /* MOBILE / TABLET ( < 1024px ) */
                @media (max-width: 1023px) {
                    .admin-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 100vh;
                        width: 280px;
                        transform: translateX(-100%);
                        z-index: 50;
                        box-shadow: none;
                    }
                    .admin-sidebar-open {
                        transform: translateX(0);
                        box-shadow: 4px 0 24px rgba(0,0,0,0.1);
                    }
                    .admin-mobile-close { display: block; }
                    .admin-hamburger { display: block; }
                    .admin-overlay {
                        display: block;
                        position: fixed;
                        inset: 0;
                        background-color: rgba(0,0,0,0.3);
                        z-index: 45;
                    }
                    .admin-topbar {
                        padding-left: 16px;
                        padding-right: 16px;
                        height: 64px;
                    }
                    .admin-content-area {
                        padding: 18px;
                    }
                    .admin-preview-text { display: none; }
                    .admin-preview-btn {
                        padding: 10px !important;
                    }
                }
            `}</style>
        </div>
        </ToastProvider>
    );
}

function VisitPageButton({ pathname }) {
    const href = (() => {
        if (!pathname) return '/';
        if (pathname.startsWith('/admin/pages/home')) return '/';
        if (pathname.startsWith('/admin/pages/projects')) return '/projects';
        if (pathname.startsWith('/admin/pages/process')) return '/process';
        if (pathname.startsWith('/admin/pages/studio')) return '/studio';
        if (pathname.startsWith('/admin/pages/contact')) return '/contact';
        return '/';
    })();

    return (
        <Link
            href={href}
            target="_blank"
            className="admin-preview-btn"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '10px',
                paddingBottom: '10px',
                backgroundColor: '#000000',
                color: '#ffffff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            <span className="admin-preview-text">Visit Page</span>
        </Link>
    );
}

function SidebarLink({ href, label, pathname, matchPrefix = false, onClick, icon }) {
    const isActive = matchPrefix ? pathname?.startsWith(href) : pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: isActive ? '#fff' : 'rgba(0,0,0,0.75)',
                backgroundColor: isActive ? '#000' : 'transparent',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#000'; }}}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.75)'; }}}
        >
            {icon && (
                <span style={{ opacity: isActive ? 1 : 0.5, flexShrink: 0, display: 'flex' }}>
                    {icon}
                </span>
            )}
            <span>{label}</span>
        </Link>
    );
}
