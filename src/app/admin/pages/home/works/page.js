'use client';

import Link from 'next/link';
import ProjectManagement from '@/app/components/admin/ProjectManagement';

export default function WorksEditPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                <Link href="/admin/pages/home" style={{ color: 'rgba(0,0,0,0.6)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}>
                    Home
                </Link>
                <span style={{ color: 'rgba(0,0,0,0.3)' }}>›</span>
                <span style={{ color: '#000000', fontWeight: '600' }}>Featured Projects</span>
            </div>

            {/* Header */}
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', color: '#000000', margin: 0, marginBottom: '12px' }}>
                    Featured Projects
                </h1>
                <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: 0, lineHeight: '1.6' }}>
                    Add, edit, or remove projects shown in the scrolling showcase.
                </p>
            </div>

            <ProjectManagement />
        </div>
    );
}
