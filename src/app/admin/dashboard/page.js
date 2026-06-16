'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useKeyboardShortcut } from '@/app/components/admin/useKeyboardShortcut';

const quickLinks = [
    { title: 'Home Page', href: '/admin/pages/home', label: 'Hero, works, testimonials', icon: '🏠' },
    { title: 'Portfolio', href: '/admin/pages/projects', label: 'Projects and gallery', icon: '🖼' },
    { title: 'Studio', href: '/admin/pages/studio', label: 'Team, values, awards', icon: '🏛' },
    { title: 'Media', href: '/admin/media', label: 'Images and upload tools', icon: '📁' },
];

const pageLinks = [
    { title: 'Process', href: '/admin/pages/process', description: 'Methodology, sustainability, accreditations' },
    { title: 'Contact', href: '/admin/pages/contact', description: 'Locations, social links, enquiry details' },
    { title: 'Home Footer', href: '/admin/pages/home/footer', description: 'Footer content and public contact surface' },
    { title: 'Testimonials', href: '/admin/pages/home/testimonials', description: 'Client quotes and carousel entries' },
];

export default function AdminDashboard() {
    const [currentTime, setCurrentTime] = useState('');

    useKeyboardShortcut('g', true, () => {
        window.open('/admin/media', '_self');
    });

    const greeting = (() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    })();

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="admin-dashboard-v2">
            <header className="admin-hero-card">
                <div>
                    <span className="admin-kicker">{greeting}</span>
                    <h1>Admin Studio</h1>
                    <p>Manage the public website with clearer sections, readable controls, and quick access to the content clients update most often.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', background: 'rgba(0,0,0,0.05)', borderRadius: '999px',
                        fontSize: '12px', fontWeight: '600', color: 'rgba(0,0,0,0.6)',
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {currentTime}
                    </div>
                    <Link href="/" target="_blank" className="admin-primary-action">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Preview Website
                    </Link>
                </div>
            </header>

            <section className="admin-metric-grid">
                <Metric title="Public Site" value="Live" subtitle="All pages active" />
                <Metric title="Content Areas" value="12+" subtitle="Editable sections" accent />
                <Metric title="Media System" value="Cloud" subtitle="Cloudinary CDN" />
                <Metric title="Shortcut" value="Ctrl+G" subtitle="Open Media" />
            </section>

            <section>
                <div className="admin-section-heading">
                    <span className="admin-kicker">Primary Tools</span>
                    <h2>Quick Actions</h2>
                </div>
                <div className="admin-action-grid">
                    {quickLinks.map((item) => (
                        <Link key={item.href} href={item.href} className="admin-action-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                                <div>
                                    <span style={{ fontWeight: '700' }}>{item.title}</span>
                                    <p style={{ margin: '2px 0 0', fontWeight: '400' }}>{item.label}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <div className="admin-section-heading">
                    <span className="admin-kicker">Editors</span>
                    <h2>Page Surfaces</h2>
                </div>
                <div className="admin-list-panel">
                    {pageLinks.map((item) => (
                        <Link key={item.href} href={item.href} className="admin-list-row">
                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Open
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Keyboard Shortcuts Reference */}
            <section style={{
                background: '#fff', borderRadius: '20px',
                border: '1px solid var(--admin-border)',
                padding: '24px 28px',
            }}>
                <div className="admin-section-heading">
                    <span className="admin-kicker">Productivity</span>
                    <h2>Keyboard Shortcuts</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
                    {[
                        { keys: 'Esc', action: 'Close forms / modals' },
                        { keys: 'Ctrl+G', action: 'Go to Media Library' },
                        { keys: 'Ctrl+S', action: 'Save current form (on editors)' },
                    ].map(s => (
                        <div key={s.keys} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '10px 14px', background: 'rgba(0,0,0,0.03)',
                            borderRadius: '10px',
                        }}>
                            <kbd style={{
                                padding: '4px 10px', background: '#fff', borderRadius: '6px',
                                border: '1px solid var(--admin-border)', fontSize: '11px',
                                fontWeight: '700', fontFamily: 'monospace', color: '#000',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}>{s.keys}</kbd>
                            <span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{s.action}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function Metric({ title, value, subtitle, accent = false }) {
    return (
        <div className="admin-metric-card">
            <span>{title}</span>
            <strong>{value}</strong>
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--admin-muted)' }}>{subtitle}</p>}
        </div>
    );
}
