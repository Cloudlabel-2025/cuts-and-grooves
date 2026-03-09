'use client';

import Link from 'next/link';

const PROCESS_SECTIONS = [
    {
        id: 'narrative',
        name: 'Narrative Section',
        description: 'Manage introductory text blocks',
        icon: '📖',
    },
    {
        id: 'sustainability',
        name: 'Sustainability Section',
        description: 'Sticky background and environmental impact heading',
        icon: '🌿',
    },
    {
        id: 'initiatives',
        name: 'Initiatives Section',
        description: 'Manage specialized action items and graphics',
        icon: '⚡',
    },
    {
        id: 'accreditations',
        name: 'Accreditations',
        description: 'Certification registry and affiliations',
        icon: '🎖️',
    },
];

export default function ProcessPageEditor() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header */}
            <div style={{ paddingBottom: '24px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', color: '#000000', margin: 0, marginBottom: '12px' }}>
                    Process Page
                </h1>
                <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: 0, lineHeight: '1.6' }}>
                    Configure the architectural methodology and conviction-driven sections.
                </p>
            </div>

            {/* Section Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px'
            }}>
                {PROCESS_SECTIONS.map((section) => (
                    <SectionCard key={section.id} section={section} />
                ))}
            </div>

            {/* Preview Button */}
            <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
                <Link
                    href="/process"
                    target="_blank"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'rgba(0,0,0,0.6)',
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Preview Process Page
                </Link>
            </div>
        </div>
    );
}

function SectionCard({ section }) {
    return (
        <Link
            href={`/admin/pages/process/${section.id}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '24px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#000000',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Icon */}
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0
            }}>
                {section.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#000000', margin: 0, marginBottom: '4px', letterSpacing: '-0.01em' }}>
                    {section.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)', margin: 0, lineHeight: '1.5' }}>
                    {section.description}
                </p>
            </div>

            {/* Arrow */}
            <div style={{
                fontSize: '18px',
                color: 'rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                flexShrink: 0
            }}>
                →
            </div>
        </Link>
    );
}
