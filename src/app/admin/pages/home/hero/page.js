'use client';

import Link from 'next/link';
import HeroEditor from '@/app/components/admin/HeroEditor';

export default function HeroEditPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                <Link href="/admin/pages/home" style={{ color: 'rgba(0,0,0,0.6)', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}>
                    Home
                </Link>
                <span style={{ color: 'rgba(0,0,0,0.3)' }}>›</span>
                <span style={{ color: '#000000', fontWeight: '600' }}>Hero Section</span>
            </div>
            <HeroEditor />
        </div>
    );
}
