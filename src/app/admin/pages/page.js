'use client';

import Link from 'next/link';

const PAGES = [
    {
        href: '/admin/pages/home',
        name: 'Home',
        description: 'Hero, featured works, testimonials, footer content.',
        sections: 5,
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        href: '/admin/pages/projects',
        name: 'Portfolio',
        description: 'Create, edit, and feature portfolio projects.',
        sections: 1,
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
            </svg>
        ),
    },
    {
        href: '/admin/pages/process',
        name: 'Process',
        description: 'Narrative, sustainability, initiatives, accreditations.',
        sections: 4,
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
    },
    {
        href: '/admin/pages/studio',
        name: 'Studio',
        description: 'Narrative, team, vision, awards, careers.',
        sections: 5,
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        href: '/admin/pages/contact',
        name: 'Contact',
        description: 'Contact form details and office information.',
        sections: 1,
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
    },
];

export default function AdminPagesIndex() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <StatCard label="Total Pages" value={PAGES.length} />
                <StatCard label="Total Sections" value={PAGES.reduce((a, p) => a + p.sections, 0)} accent />
                <StatCard label="Status" value="Live" />
            </div>

            {/* Header */}
            <div style={{
                padding: '24px 28px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(250,249,246,0.88))',
                border: '1px solid var(--admin-border)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
            }}>
                <span className="admin-kicker">Site Pages</span>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', letterSpacing: '-0.025em' }}>Page Editor</h1>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
                    Select a page to edit its sections and content.
                </p>
            </div>

            {/* Page cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {PAGES.map(page => (
                    <Link
                        key={page.href}
                        href={page.href}
                        style={{
                            display: 'flex', flexDirection: 'column', gap: '16px',
                            padding: '24px', background: '#fff', textDecoration: 'none',
                            color: 'var(--admin-text)', border: '1px solid var(--admin-border)',
                            borderRadius: '18px', boxShadow: '0 8px 28px rgba(0,0,0,0.05)',
                            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
                    >
                        {/* Icon */}
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '14px',
                            background: 'rgba(155,116,72,0.08)', border: '1px solid rgba(155,116,72,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--admin-accent)', flexShrink: 0,
                        }}>
                            {page.icon}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                            <span className="admin-kicker" style={{ marginBottom: '4px' }}>{page.name}</span>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-muted)', lineHeight: 1.55 }}>
                                {page.description}
                            </p>
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--admin-border)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>
                                {page.sections} section{page.sections !== 1 ? 's' : ''}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-accent)' }}>Edit</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--admin-accent)" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function StatCard({ label, value, accent = false }) {
    return (
        <div style={{
            padding: '20px 22px', background: '#fff', borderRadius: '16px',
            border: `1px solid ${accent ? 'rgba(155,116,72,0.22)' : 'var(--admin-border)'}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: accent ? 'var(--admin-accent)' : 'var(--admin-muted)', display: 'block', marginBottom: '8px' }}>{label}</span>
            <strong style={{ fontSize: '2rem', lineHeight: 1, fontWeight: '700', color: accent ? 'var(--admin-accent)' : 'var(--admin-text)' }}>{value}</strong>
        </div>
    );
}
