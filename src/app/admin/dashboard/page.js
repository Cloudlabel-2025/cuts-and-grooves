'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.02em', color: '#000000', margin: 0, marginBottom: '8px' }}>
                        Dashboard
                    </h1>
                    <p style={{ fontSize: '13px', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                        Manage your content and settings
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '13px', letterSpacing: '0.1em', fontWeight: '700', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: 0 }}>
                    Quick Actions
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <QuickCard title="Media Library" href="/admin/media" icon="📁" />
                    <QuickCard title="Portfolio" href="/admin/pages/projects" icon="🎨" />
                    <QuickCard title="Home Page" href="/admin/pages/home" icon="🏠" />
                    <QuickCard title="Settings" href="/admin/media" icon="⚙️" />
                </div>
            </div>

            {/* Pages Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h2 style={{ fontSize: '13px', letterSpacing: '0.1em', fontWeight: '700', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: 0 }}>
                    Page Editor
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <PageCard
                        title="Home"
                        description="Hero section, featured works, testimonials"
                        href="/admin/pages/home"
                        icon="🏠"
                    />
                    <PageCard
                        title="Portfolio"
                        description="Project showcase and gallery views"
                        href="/admin/pages/projects"
                        icon="📁"
                    />
                    <PageCard
                        title="Process"
                        description="Methodology and workflow"
                        href="/admin/pages/process"
                        icon="⚡"
                    />
                    <PageCard
                        title="Studio"
                        description="About, team, values, awards"
                        href="/admin/pages/studio"
                        icon="🏛️"
                    />
                    <PageCard
                        title="Contact"
                        description="Location and contact details"
                        href="/admin/pages/contact"
                        icon="✉️"
                    />
                    <SystemCard />
                </div>
            </div>

            {/* System Status */}
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#000000', margin: 0, marginBottom: '8px' }}>
                            System Status
                        </h3>
                        <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', letterSpacing: '0.05em', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                            Real-time information
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        paddingLeft: '16px',
                        paddingRight: '16px',
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
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#000000', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Operational
                        </span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                    <StatusItem label="Database" value="Connected" />
                    <StatusItem label="Media Assets" value="Synced" />
                    <StatusItem label="Last Updated" value="Just now" />
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}

function QuickCard({ title, href, icon }) {
    return (
        <Link
            href={href}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '24px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#000000',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
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
            <div style={{ fontSize: '32px' }}>{icon}</div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#000000', margin: 0, letterSpacing: '0.02em' }}>
                {title}
            </h4>
        </Link>
    );
}

function PageCard({ title, description, href, icon }) {
    return (
        <Link
            href={href}
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
                height: '100%'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                e.currentTarget.style.transform = 'translateY(-8px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{ fontSize: '40px' }}>{icon}</div>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#000000', margin: 0, marginBottom: '8px', letterSpacing: '-0.01em' }}>
                    {title}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: 0, lineHeight: '1.6' }}>
                    {description}
                </p>
            </div>
            <div style={{
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: '600',
                color: 'rgba(0,0,0,0.4)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            }}>
                <span>Edit</span>
                <span>→</span>
            </div>
        </Link>
    );
}

function SystemCard() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '32px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            height: '100%',
            justifyContent: 'space-between'
        }}>
            <div>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📊</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#000000', margin: 0, marginBottom: '8px', letterSpacing: '-0.01em' }}>
                    System Status
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: 0, lineHeight: '1.6' }}>
                    Monitor platform health
                </p>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#000000',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                }}></div>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#000000', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    All Systems Operational
                </span>
            </div>
        </div>
    );
}

function StatusItem({ label, value }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '16px',
            backgroundColor: 'rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '8px'
        }}>
            <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                {label}
            </p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#000000', margin: 0 }}>
                {value}
            </p>
        </div>
    );
}
