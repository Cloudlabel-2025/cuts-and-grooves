'use client';

import ProjectManagement from '@/app/components/admin/ProjectManagement';

export default function AdminProjectsPage() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
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

            {/* Project Management Component */}
            <ProjectManagement />
        </div>
    );
}
