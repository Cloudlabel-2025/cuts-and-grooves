'use client';

import { use } from 'react';
import Link from 'next/link';

const PAGE_ARCHITECTURES = {
    home: [
        { id: 'hero', name: 'Hero Section', description: 'Cinematic entrance and primary narrative' },
        { id: 'works', name: 'Featured Projects', description: 'Curated showcase of projects' },
        { id: 'all-works', name: 'All Projects', description: 'Complete project repository' },
        { id: 'testimonials', name: 'Testimonials', description: 'Client feedback and quotes' },
        { id: 'footer', name: 'Footer', description: 'Contact and social links' },
    ],
    projects: [
        { id: 'grid', name: 'Projects Grid', description: 'Dynamic grid of projects' },
    ],
    process: [
        { id: 'hero', name: 'Process Hero', description: 'Process page introduction' },
        { id: 'method', name: 'Methodology', description: 'Workflow and phases' },
    ],
    studio: [
        { id: 'hero', name: 'Studio Hero', description: 'Studio background' },
        { id: 'about', name: 'About', description: 'Core principles' },
        { id: 'team', name: 'Team', description: 'Team members' },
    ],
    contact: [
        { id: 'hero', name: 'Contact Hero', description: 'Contact page introduction' },
        { id: 'form', name: 'Contact Form', description: 'Inquiry interface' },
        { id: 'info', name: 'Location Info', description: 'Office details' },
    ],
};

export default function GenericPageEditor({ params }) {
    const { page } = use(params);
    const sections = PAGE_ARCHITECTURES[page] || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <div>
                    <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '16px', margin: 0 }}>
                        {page} Page
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '32px', height: '1px', backgroundColor: '#000000' }}></div>
                        <p style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                            Manage sections
                        </p>
                    </div>
                </div>
            </div>

            {/* Sections Grid */}
            {sections.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {sections.map((section) => (
                        <Link
                            key={section.id}
                            href={`/admin/pages/${page}/${section.id}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                padding: '32px',
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#000000', margin: 0, marginBottom: '8px', letterSpacing: '-0.01em' }}>
                                    {section.name}
                                </h3>
                                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)', margin: 0, lineHeight: '1.5' }}>
                                    {section.description}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                                <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Edit</span>
                                <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.3)' }}>→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
                    <div style={{ fontSize: '48px', opacity: 0.2 }}>?</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '12px', letterSpacing: '0.1em', fontWeight: '700', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', margin: 0 }}>No Sections</h3>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', margin: 0, maxWidth: '400px' }}>This page is currently under development or does not support editing yet.</p>
                    </div>
                </div>
            )}

            {/* Preview Link */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ fontSize: '32px' }}>👁</div>
                    <div>
                        <h4 style={{ fontSize: '12px', letterSpacing: '0.1em', fontWeight: '700', color: '#000000', textTransform: 'uppercase', margin: 0, marginBottom: '4px' }}>Preview</h4>
                        <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>View changes in real-time</p>
                    </div>
                </div>
                <Link href={page === 'home' ? '/' : `/${page}`} target="_blank" style={{
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: 'none'
                }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                >
                    Visit Site
                </Link>
            </div>
        </div>
    );
}
