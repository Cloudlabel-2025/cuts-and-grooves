'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Nav } from 'react-bootstrap';
import { useState } from 'react';
// Import Bootstrap CSS for base styling (Tailwind overrides where necessary)
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [showLogout, setShowLogout] = useState(false);

    const isLoginPage = pathname?.includes('/login');

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-[#A67C52] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-400 tracking-widest uppercase">Loading...</span>
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
        <div className="min-h-screen bg-[#fcfcfc] text-black d-flex font-sans" style={{ fontFamily: 'var(--font-heading), sans-serif' }}>
            {/* React Bootstrap Driven Sidebar */}
            <aside className="bg-white border-end border-gray-100 d-flex flex-column min-vh-100 sticky-top z-10" style={{ width: '260px', boxShadow: '2px 0 24px -12px rgba(0,0,0,0.03)' }}>

                {/* Logo Stacking (Matching New Reference) */}
                <div className="px-4 py-3 d-flex flex-column gap-1 border-bottom border-gray-100 mb-1">
                    <span className="text-black fw-bold tracking-tight lh-1" style={{ fontSize: '20px' }}>Cuts & Grooves</span>
                    <span className="text-gray-400 fw-bold text-uppercase mt-1 tracking-widest" style={{ fontSize: '9px', letterSpacing: '0.25em' }}>Admin</span>
                </div>

                {/* React Bootstrap Navigation */}
                <Nav className="flex-column flex-grow-1 py-1" style={{ overflowY: 'hidden' }}>

                    {/* General Section */}
                    <div className="mb-2">
                        <h3 className="text-gray-400 fw-bold text-uppercase px-4 mb-1 tracking-widest" style={{ fontSize: '9.5px', letterSpacing: '0.25em' }}>General</h3>
                        <Nav className="flex-column">
                            <BootstrapNavLink href="/admin/dashboard" label="Dashboard" icon="dashboard" pathname={pathname} />
                            <BootstrapNavLink href="/admin/media" label="Media Library" icon="media" pathname={pathname} />
                        </Nav>
                    </div>

                    {/* Pages Section */}
                    <div>
                        <h3 className="text-gray-400 fw-bold text-uppercase px-4 mb-1 tracking-widest" style={{ fontSize: '9.5px', letterSpacing: '0.25em' }}>Pages</h3>
                        <Nav className="flex-column">
                            <BootstrapNavLink href="/admin/pages/home" label="Home" icon="home" pathname={pathname} matchPrefix />
                            <BootstrapNavLink href="/admin/pages/work" label="Work" icon="work" pathname={pathname} matchPrefix />
                            <BootstrapNavLink href="/admin/pages/process" label="Process" icon="process" pathname={pathname} matchPrefix />
                            <BootstrapNavLink href="/admin/pages/studio" label="Studio" icon="studio" pathname={pathname} matchPrefix />
                            <BootstrapNavLink href="/admin/pages/contact" label="Contact" icon="contact" pathname={pathname} matchPrefix />
                        </Nav>
                    </div>
                </Nav>

                {/* Footer (Matching New Reference) */}
                <div className="px-0 py-2 border-top border-gray-100 mt-auto">
                    <div
                        className="d-flex align-items-center mb-0 position-relative p-2 px-4 rounded-3 transition-colors w-100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowLogout(!showLogout)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        {/* Single User Identity Circle */}
                        <div className="position-relative flex-shrink-0 d-flex align-items-center justify-content-center bg-white border border-gray-200 rounded-circle text-[#A67C52] fw-bold shadow-sm" style={{ width: '38px', height: '38px', fontSize: '15px' }}>
                            {session?.user?.email?.[0].toUpperCase() || 'A'}
                        </div>

                        {/* Indentation for spacing between A and email */}
                        <div className="d-flex flex-column min-w-0 flex-grow-1 ps-4">
                            <p className="text-[#001738] fw-bold tracking-tight text-truncate m-0" style={{ fontSize: '12.5px' }}>{session?.user?.email || 'admin@candg.com'}</p>
                            <span className="text-[#A67C52] fw-semibold text-uppercase mt-1" style={{ fontSize: '8.5px', letterSpacing: '0.2em' }}>Administrator</span>
                        </div>
                    </div>

                    {showLogout && (
                        <div className="mt-2 border-top border-gray-50 pt-1">
                            <Nav.Link
                                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                                className="d-flex align-items-center justify-content-between px-4 py-2 transition-all duration-300 hover:bg-gray-50"
                                style={{ borderRadius: '0', cursor: 'pointer' }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <span className="d-flex align-items-center justify-content-center text-gray-400" style={{ width: '18px' }}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                    </span>
                                    <span className="tracking-tight text-[#001738] fw-semibold" style={{ fontSize: '13px' }}>Logout</span>
                                </div>
                            </Nav.Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 w-100">
                {/* Seamless Top Bar */}
                <header className="h-[88px] border-b border-gray-100 d-flex align-items-center justify-content-between px-10 bg-white/80 backdrop-blur-md sticky-top z-50">
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-flex align-items-center justify-content-center w-6 h-6 rounded-circle bg-green-50">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-circle animate-pulse"></div>
                        </div>
                        <span className="text-[10px] text-uppercase tracking-[0.25em] text-gray-400 fw-bold">Admin Panel Live</span>
                    </div>

                    <Link
                        href="/"
                        target="_blank"
                        className="d-flex align-items-center gap-2 px-6 py-2 text-[10px] fw-bold text-uppercase text-gray-600 hover:text-[#A67C52] bg-gray-50 rounded-pill text-decoration-none border border-transparent hover:border-[#A67C52]/20 transition-all duration-300"
                        style={{ letterSpacing: '0.2em' }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Visit Site
                    </Link>
                </header>

                <main className="flex-1 overflow-auto overflow-x-hidden">
                    <div className="p-8 md:p-12 lg:p-16 max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function BootstrapNavLink({ href, label, icon, pathname, matchPrefix = false }) {
    const isActive = matchPrefix
        ? pathname?.startsWith(href)
        : pathname === href;

    const renderIcon = (isActive) => {
        const strokeWidth = isActive ? "2.5" : "1.75";
        switch (icon) {
            case 'dashboard':
                return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>;
            case 'media':
                return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
            case 'home':
                return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
            case 'work':
                return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
            case 'process':
                return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
            case 'studio':
                return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>;
            case 'contact':
                return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
            default:
                return null;
        }
    };

    return (
        <Nav.Link
            as={Link}
            href={href}
            className={`d-flex align-items-center justify-content-between px-4 py-1.5 transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-[#A67C52] to-[#cba37b]' : 'hover:bg-gray-50'}`}
            style={{ borderRadius: '0' }}
        >
            <div className="d-flex align-items-center gap-3">
                <span className={`d-flex align-items-center justify-content-center ${isActive ? 'text-black' : 'text-gray-400'}`} style={{ width: '18px' }}>
                    {renderIcon(isActive)}
                </span>
                <span className={`tracking-tight ${isActive ? 'text-black fw-bold' : 'text-[#001738] fw-semibold'}`} style={{ fontSize: '13px' }}>{label}</span>
            </div>

            {/* Trailing white dot for active state */}
            {isActive && (
                <div className="bg-white rounded-circle shadow-sm" style={{ width: '5px', height: '5px' }}></div>
            )}
        </Nav.Link>
    );
}
