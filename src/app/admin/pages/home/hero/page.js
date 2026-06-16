'use client';

import Link from 'next/link';
import HeroEditor from '@/app/components/admin/HeroEditor';

export default function HeroEditPage() {
  return (
    <div>
      <HeroEditor />
      <FloatingReturn />
    </div>
  );
}

function FloatingReturn() {
  return (
    <div style={{
      position: 'sticky',
      bottom: '24px',
      zIndex: 40,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none',
      marginTop: '-12px',
    }}>
      <Link
        href="/admin/pages/home"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 22px',
          borderRadius: '999px',
          border: '1px solid var(--admin-border)',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          color: 'var(--admin-text)',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '0.06em',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          pointerEvents: 'auto',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
