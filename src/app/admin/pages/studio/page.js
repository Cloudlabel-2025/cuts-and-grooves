'use client';

import Link from 'next/link';

const STUDIO_SECTIONS = [
    {
        id: 'narrative',
        name: 'Narrative & Quote',
        description: 'Introductory heading, impact quote, and values text for the studio page.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        ),
        fields: ['Heading', 'Quote', 'Values Text'],
    },
    {
        id: 'team',
        name: 'Team Members',
        description: 'Studio roster with name, role, and portrait image for each member.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        ),
        fields: ['Member Name', 'Role', 'Portrait'],
    },
    {
        id: 'vision',
        name: 'Vision & Innovation',
        description: 'Strategic pillars with accordion content, images, and deep narrative.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        ),
        fields: ['Pillar Title', 'Deep Narrative', 'Visual Artifact'],
    },
    {
        id: 'awards',
        name: 'Awards & Distinctions',
        description: 'Industry recognitions and project honours organised by year.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg>
        ),
        fields: ['Year', 'Project', 'Contest', 'Distinction'],
    },
    {
        id: 'careers',
        name: 'Careers & Job Offers',
        description: 'Recruitment heading and open positions with type and location.',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        ),
        fields: ['Recruitment Text', 'Position Title', 'Type', 'Location'],
    },
];

export default function StudioPageEditor() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '16px' }}>
                {STUDIO_SECTIONS.map(s => (
                    <div key={s.id} style={{ padding: '18px 20px', background: '#fff', borderRadius: '16px', border: '1px solid var(--admin-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '8px' }}>{s.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{s.fields.length} field{s.fields.length !== 1 ? 's' : ''}</span>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div style={{
                padding: '24px 28px',
                background: 'linear-gradient(135deg,rgba(255,255,255,0.98),rgba(250,249,246,0.88))',
                border: '1px solid var(--admin-border)', borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
            }}>
                <span className="admin-kicker">Studio Page</span>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', letterSpacing: '-0.025em' }}>Page Editor</h1>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
                    Select a section below to edit its content, images, and copy.
                </p>
            </div>

            {/* Section cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
                {STUDIO_SECTIONS.map(section => (
                    <SectionCard key={section.id} section={section} />
                ))}
            </div>
        </div>
    );
}

function SectionCard({ section }) {
    return (
        <Link
            href={`/admin/pages/studio/${section.id}`}
            style={{
                display: 'flex', flexDirection: 'column', gap: '16px',
                padding: '24px', background: '#fff', textDecoration: 'none', color: 'var(--admin-text)',
                border: '1px solid var(--admin-border)', borderRadius: '18px',
                boxShadow: '0 8px 28px rgba(0,0,0,0.05)',
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
                {section.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                <span className="admin-kicker" style={{ marginBottom: '4px' }}>{section.name}</span>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-muted)', lineHeight: 1.55 }}>
                    {section.description}
                </p>
            </div>

            {/* Fields list */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {section.fields.map(f => (
                    <span key={f} style={{
                        padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
                        fontWeight: '600', letterSpacing: '0.04em',
                        background: 'rgba(0,0,0,0.04)', color: 'var(--admin-muted)',
                        border: '1px solid var(--admin-border)',
                    }}>{f}</span>
                ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--admin-border)' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-accent)' }}>Edit Section</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--admin-accent)" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
        </Link>
    );
}
