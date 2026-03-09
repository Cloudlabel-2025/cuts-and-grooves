'use client';

import { use } from 'react';
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
import Link from 'next/link';

export default function DynamicSectionEditor({ params }) {
    const { page, section } = use(params);

    // For now, we use HeroEditor for all 'hero' sections across all pages.
    // For Home Hero, we use the new Visual Canvas Editor.
    const isHero = section.toLowerCase().includes('hero');
    const isHomeHero = page === 'home' && isHero;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center space-x-6 text-[10px] uppercase font-bold tracking-[0.4em]">
                <Link href={`/admin/pages/${page}`} className="text-gray-400 hover:text-[#A67C52] transition-colors">
                    {page}
                </Link>
                <span className="text-gray-200">/</span>
                <span className="text-black">{section}</span>
            </div>

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
            ) : (
                <div className="bg-white border border-gray-100 rounded-[3.5rem] p-24 text-center space-y-10 shadow-[0_50px_150px_-50px_rgba(0,0,0,0.05)] border-white">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-4xl opacity-20 grayscale">⚒</div>
                    <div className="space-y-4">
                        <h3 className="text-sm uppercase tracking-[0.5em] font-bold text-black italic">Editor in Development</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                            The specialized interface for the <span className="text-[#A67C52] font-bold">{section}</span> segment is currently being architecturalized.
                        </p>
                    </div>
                </div>
            )}

            <div className="fixed bottom-12 right-12 z-50">
                <Link
                    href={`/admin/pages/${page}`}
                    className="flex items-center space-x-4 bg-white/80 backdrop-blur-xl border border-gray-100 px-8 py-4 rounded-2xl shadow-2xl hover:bg-black hover:text-white transition-all duration-500 group"
                >
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Return to Surface</span>
                </Link>
            </div>
        </div>
    );
}
