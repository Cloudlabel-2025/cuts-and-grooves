'use client';

import Link from 'next/link';
import SectionContentEditor from '@/app/components/admin/SectionContentEditor';
import TestimonialManagement from '@/app/components/admin/TestimonialManagement';

export default function TestimonialsEditPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                <Link href="/admin/pages/home" style={{ color: 'rgba(0,0,0,0.6)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}>
                    Home
                </Link>
                <span style={{ color: 'rgba(0,0,0,0.3)' }}>›</span>
                <span style={{ color: '#000000', fontWeight: '600' }}>Client Testimonials</span>
            </div>

            {/* Header */}
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', color: '#000000', margin: 0, marginBottom: '12px' }}>
                    Client Testimonials
                </h1>
                <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', margin: 0, lineHeight: '1.6' }}>
                    Manage client reviews, quotes, and feedback shown on the home page.
                </p>
            </div>

            {/* Content Editor */}
            <SectionContentEditor
                section="testimonials"
                title="Section Text"
                description="Edit the heading and description above the testimonials."
                fields={[
                    { key: 'heading', label: 'Section Heading', type: 'text' },
                    { key: 'subtext', label: 'Description', type: 'textarea' }
                ]}
            />

            {/* Testimonial Management */}
            <div style={{ paddingTop: '16px' }}>
                <TestimonialManagement />
            </div>
        </div>
    );
}
