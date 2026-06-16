'use client';

import Link from 'next/link';

const HOME_SECTIONS = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Background video, main heading, and subtitle',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 10h20M8 4v16" />
      </svg>
    ),
    color: '#111',
    bg: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
  },
  {
    id: 'works',
    name: 'Featured Projects',
    description: 'Projects in the scrolling showcase',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
    color: '#9b7448',
    bg: 'linear-gradient(135deg, #fdf8f3, #f5ede4)',
  },
  {
    id: 'all-works',
    name: 'All Projects Gallery',
    description: 'Scattered images and gallery views',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M12 22V12" />
      </svg>
    ),
    color: '#2d6a4f',
    bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
  },
  {
    id: 'testimonials',
    name: 'Client Testimonials',
    description: 'Reviews, quotes, and feedback',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
  },
  {
    id: 'footer',
    name: 'Footer',
    description: 'Contact details and information',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    color: '#dc2626',
    bg: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
  },
];

export default function HomePageEditor() {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="admin-editor-page" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 3vw, 44px)' }}>
      {/* Hero Header */}
      <div className="admin-hero-card">
        <div>
          <span className="admin-kicker">Content Manager</span>
          <h1>Home Page</h1>
          <p>Click on a section below to edit its content, images, and media.</p>
        </div>
        <Link href="/" target="_blank" className="admin-primary-action" style={{ flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '8px' }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Visit Page
        </Link>
      </div>

      {/* Section Stats Grid */}
      <div className="admin-metric-grid" style={{ marginBottom: '4px' }}>
        <div className="admin-metric-card">
          <span>Sections</span>
          <strong>{HOME_SECTIONS.length}</strong>
        </div>
        <div className="admin-metric-card">
          <span>Status</span>
          <strong style={{ color: 'var(--admin-accent)', fontSize: '1rem', letterSpacing: '0.04em' }}>All Editable</strong>
        </div>
        <div className="admin-metric-card">
          <span>Last Updated</span>
          <strong style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--admin-muted)' }}>
            {today}
          </strong>
        </div>
      </div>

      {/* Section Cards */}
      <div>
        <div className="admin-section-heading">
          <h2>Page Sections</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '18px',
        }}>
          {HOME_SECTIONS.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ section }) {
  return (
    <Link
      href={`/admin/pages/home/${section.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        backgroundColor: '#ffffff',
        border: '1px solid var(--admin-border)',
        borderRadius: '22px',
        textDecoration: 'none',
        color: 'var(--admin-text)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: '0 8px 28px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 55px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: '4px',
        background: section.color,
        opacity: 0.6,
        flexShrink: 0,
      }} />

      <div style={{
        padding: '24px 26px 22px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '18px',
        flex: 1,
      }}>
        {/* Icon */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: section.bg,
          color: section.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.3s ease',
        }}
          className="card-icon"
        >
          {section.icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'var(--admin-text)',
            margin: 0,
            marginBottom: '6px',
            letterSpacing: '-0.02em',
          }}>
            {section.name}
          </h3>
          <p style={{
            fontSize: '13px',
            color: 'var(--admin-muted)',
            margin: 0,
            lineHeight: '1.6',
          }}>
            {section.description}
          </p>
        </div>

        {/* Arrow */}
        <div style={{
          fontSize: '20px',
          color: 'var(--admin-muted)',
          transition: 'all 0.3s ease',
          flexShrink: 0,
          marginTop: '4px',
          opacity: 0.4,
        }}>
          →
        </div>
      </div>
    </Link>
  );
}
