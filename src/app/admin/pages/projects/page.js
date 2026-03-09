'use client';

import ProjectManagement from '@/app/components/admin/ProjectManagement';
import Link from 'next/link';

export default function AdminProjectsPage() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0 }}>
                        Portfolio
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                        <div style={{ width: '32px', height: '1px', backgroundColor: '#000000' }}></div>
                        <p style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                            Project Management
                        </p>
                    </div>
                </div>
                <Link href="/projects" target="_blank" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 24px',
                    backgroundColor: '#000',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Visit Site
                </Link>
            </div>

            {/* Project Management Component */}
            <ProjectManagement />
        </div>
    );
}
