'use client';

import { use } from 'react';
import Link from 'next/link';

const PAGE_ARCHITECTURES = {
    home: [
        { id: 'hero', name: 'Identity Hero', description: 'Cinematic entrance, primary narrative, and visual identity node' },
        { id: 'works', name: 'Selected Infrastructure', description: 'Curated showcase of premier architectural records' },
        { id: 'all-works', name: 'Project Matrix', description: 'Complete architectural repository and scatter layout' },
        { id: 'testimonials', name: 'Institutional Narratives', description: 'Client perspectives, quotes, and testimonial nodes' },
        { id: 'footer', name: 'Global Infrastructure', description: 'System footer, contact nodes, and social connectivity' },
    ],
    work: [
        { id: 'hero', name: 'Portfolio Hero', description: 'Curated work portfolio header' },
        { id: 'grid', name: 'Projects Matrix', description: 'Dynamic grid of architectural records' },
    ],
    process: [
        { id: 'hero', name: 'Methodology Hero', description: 'Introduction to technical process' },
        { id: 'method', name: 'Studio Method', description: 'Phase-by-phase architectural workflow' },
    ],
    studio: [
        { id: 'hero', name: 'Identity Hero', description: 'Studio background and vision' },
        { id: 'about', name: 'Philosophy Node', description: 'Core principles and architectural approach' },
        { id: 'team', name: 'Human Capital', description: 'The architectural collective' },
    ],
    contact: [
        { id: 'hero', name: 'Dialogue Hero', description: 'Contact page introduction' },
        { id: 'form', name: 'Narrative Form', description: 'Institutional inquiry interface' },
        { id: 'info', name: 'Geographic Nodes', description: 'Office location and connectivity details' },
    ],
};

export default function GenericPageEditor({ params }) {
    const { page } = use(params);
    const sections = PAGE_ARCHITECTURES[page] || [];

    return (
        <div className="space-y-16">
            <div className="flex justify-between items-end pb-8 border-b border-gray-100">
                <div>
                    <h1 className="text-4xl font-extralight tracking-[0.5em] uppercase mb-4">{page} Architecture</h1>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-[1px] bg-[#A67C52]"></div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Surface Management</p>
                    </div>
                </div>
            </div>

            {sections.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {sections.map((section) => (
                        <Link
                            key={section.id}
                            href={`/admin/pages/${page}/${section.id}`}
                            className="group bg-white border border-gray-100 p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] hover:border-[#A67C52]/20 transition-all duration-700 flex justify-between items-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#A67C52]/5 transition-colors duration-1000"></div>

                            <div className="relative z-10 flex-1 pr-12">
                                <div className="flex items-center space-x-4 mb-3">
                                    <h3 className="text-sm uppercase tracking-[0.4em] group-hover:text-[#A67C52] transition-colors font-bold">{section.name}</h3>
                                    {page === 'home' && section.id === 'hero' && (
                                        <span className="text-[7px] uppercase tracking-[0.2em] font-bold bg-[#A67C52]/10 text-[#A67C52] px-3 py-1 rounded-full border border-[#A67C52]/20">
                                            Visual Canvas Alpha
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] leading-relaxed font-medium">{section.description}</p>
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-[#A67C52] group-hover:bg-white group-hover:shadow-lg group-hover:scale-110 transition-all duration-500 relative z-10">
                                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-[3rem] p-24 text-center space-y-8 shadow-[0_40px_100px_rgba(0,0,0,0.03)]">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-3xl opacity-20">?</div>
                    <div className="space-y-4">
                        <h3 className="text-sm uppercase tracking-[0.4em] font-bold text-gray-300 italic">Page Protocol Missing</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] max-w-sm mx-auto">This architectural domain is currently under development or does not support modular editing yet.</p>
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-[3rem] p-16 shadow-[0_40px_100px_rgba(0,0,0,0.03)] flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl">👁</div>
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.4em] font-bold text-black mb-1">Live Site Synchronizer</h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Preview all {page} changes in real-time</p>
                    </div>
                </div>
                <Link href={page === 'home' ? '/' : `/${page}`} target="_blank" className="px-10 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.5em] rounded-2xl hover:bg-[#A67C52] transition-all duration-500">
                    Visit Site
                </Link>
            </div>
        </div>
    );
}
