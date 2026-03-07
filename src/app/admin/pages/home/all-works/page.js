'use client';

import Link from 'next/link';
import SectionContentEditor from '@/app/components/admin/SectionContentEditor';
import AllWorksMediaEditor from '@/app/components/admin/AllWorksMediaEditor';

export default function AllWorksEditPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                <Link href="/admin/pages/home" style={{ color: 'rgba(0,0,0,0.6)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}>
                    Home
                </Link>
                <span style={{ color: 'rgba(0,0,0,0.3)' }}>›</span>
                <span style={{ color: '#000000', fontWeight: '600' }}>All Projects Gallery</span>
            </div>

            {/* Header */}
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', color: '#000000', margin: 0, marginBottom: '12px' }}>
                    All Projects Gallery
                </h1>
                <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: 0, lineHeight: '1.6' }}>
                    Manage the scattered images, transition visual, and section text.
                </p>
            </div>

            {/* Content Editor */}
            <SectionContentEditor
                section="all-works"
                title="Text Content"
                description="Edit the heading and description for this section."
                fields={[
                    { key: 'heading', label: 'Section Heading', type: 'text' },
                    { key: 'subtext', label: 'Section Description', type: 'textarea' }
                ]}
            />

            {/* Media Editor */}
            <div style={{ paddingTop: '16px' }}>
                <AllWorksMediaEditor />
            </div>
        </div>
    );
}
