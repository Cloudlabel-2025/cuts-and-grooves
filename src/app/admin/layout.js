'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [showLogout, setShowLogout] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div style={{ minHeight: '100vh', backgroundColor: '#fff', color: '#000', display: 'flex', flexDirection: 'row', fontFamily: 'Inter, sans-serif' }}>
            {/* SIDEBAR */}
            <aside style={{
                width: '280px',
                height: '100vh',
                backgroundColor: '#fff',
                borderRight: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 40,
                position: 'relative'
            }}>
                {/* Sidebar Header */}
                <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, letterSpacing: '-0.02em' }}>Admin</h2>
                    <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', margin: '8px 0 0 0', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '500' }}>Dashboard</p>
                </div>

                {/* Sidebar Nav */}
                <nav style={{ flex: 1, padding: '24px 16px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <SidebarLink href="/admin/dashboard" label="Dashboard" pathname={pathname} />
                        <SidebarLink href="/admin/media" label="Media" pathname={pathname} />
                        <SidebarLink href="/admin/pages/home" label="Home" pathname={pathname} matchPrefix />
                        <SidebarLink href="/admin/pages/work" label="Portfolio" pathname={pathname} matchPrefix />
                        <SidebarLink href="/admin/pages/process" label="Process" pathname={pathname} matchPrefix />
                        <SidebarLink href="/admin/pages/studio" label="Studio" pathname={pathname} matchPrefix />
                        <SidebarLink href="/admin/pages/contact" label="Contact" pathname={pathname} matchPrefix />
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div style={{ padding: '16px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
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

                {/* Mobile Close */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                        display: 'none',
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '24px',
                        color: '#000'
                    }}
                    className="lg:hidden"
                >
                    ✕
                </button>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        zIndex: 30,
                        display: 'none'
                    }}
                    className="lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* MAIN CONTENT */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', marginLeft: '0' }}>
                {/* TOP NAVBAR */}
                <header style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 30,
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    width: '100%'
                }}>
                    {/* Left */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '24px',
                            color: '#000000'
                        }}
                        className="lg:hidden"
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
                        <Link
                            href="/"
                            target="_blank"
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
                            Preview
                        </Link>
                    </div>
                </header>

                {/* MAIN CONTENT AREA */}
                <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fff' }}>
                    <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
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
            `}</style>
        </div>
    );
}

function SidebarLink({ href, label, pathname, matchPrefix = false }) {
    const isActive = matchPrefix ? pathname?.startsWith(href) : pathname === href;

    return (
        <Link
            href={href}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? '#fff' : '#000',
                backgroundColor: isActive ? '#000' : 'transparent',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
        >
            <span>{label}</span>
        </Link>
    );
}
