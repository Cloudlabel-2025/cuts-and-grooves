'use client';

import { use } from 'react';
import Link from 'next/link';
import HeroEditor from '@/app/components/admin/HeroEditor';
import VisualCanvasEditor from '@/app/components/admin/VisualCanvasEditor';
import ProjectManagement from '@/app/components/admin/ProjectManagement';
import ProcessNarrativeEditor from '@/app/components/admin/ProcessNarrativeEditor';
import SustainabilityEditor from '@/app/components/admin/SustainabilityEditor';
import InitiativesEditor from '@/app/components/admin/InitiativesEditor';
import AccreditationsEditor from '@/app/components/admin/AccreditationsEditor';
import StudioNarrativeEditor from '@/app/components/admin/StudioNarrativeEditor';
import TeamEditor from '@/app/components/admin/TeamEditor';
import VisionEditor from '@/app/components/admin/VisionEditor';
import AwardsEditor from '@/app/components/admin/AwardsEditor';
import CareersEditor from '@/app/components/admin/CareersEditor';

export default function DynamicSectionEditor({ params }) {
    const { page, section } = use(params);

    const isHero     = section.toLowerCase().includes('hero');
    const isHomeHero = page === 'home' && isHero;
    const pageLabel  = page.charAt(0).toUpperCase() + page.slice(1);

    return (
        <>
            <div className="admin-editor-page space-y-12">
                {isHomeHero ? (
                    <VisualCanvasEditor page={page} section={section} />
                ) : isHero ? (
                    <HeroEditor page={page} section={section} />
                ) : page === 'projects' && section === 'grid' ? (
                    <ProjectManagement />
                ) : page === 'process' && section === 'narrative' ? (
                    <ProcessNarrativeEditor />
                ) : page === 'process' && section === 'sustainability' ? (
                    <SustainabilityEditor />
                ) : page === 'process' && section === 'initiatives' ? (
                    <InitiativesEditor />
                ) : page === 'process' && section === 'accreditations' ? (
                    <AccreditationsEditor />
                ) : page === 'studio' && section === 'narrative' ? (
                    <StudioNarrativeEditor />
                ) : page === 'studio' && section === 'team' ? (
                    <TeamEditor />
                ) : page === 'studio' && section === 'vision' ? (
                    <VisionEditor />
                ) : page === 'studio' && section === 'awards' ? (
                    <AwardsEditor />
                ) : page === 'studio' && section === 'careers' ? (
                    <CareersEditor />
                ) : null}
            </div>

            {/* Back to {pageLabel} — floated at bottom-center */}
            <div style={{
                position: 'fixed',
                bottom: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
            }}>
                <Link
                    href={`/admin/pages/${page}`}
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
                    Back to {pageLabel}
                </Link>
            </div>
        </>
    );
}
