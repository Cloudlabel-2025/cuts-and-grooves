'use client';

import Link from 'next/link';

const HOME_SECTIONS = [
    {
        id: 'hero',
        name: 'Hero Section',
        description: 'Background video or image, main heading, and subtitle',
        gradient: 'from-amber-500/10 to-orange-500/5',
        iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" />
            </svg>
        ),
    },
    {
        id: 'works',
        name: 'Featured Projects',
        description: 'Projects displayed in the scrolling showcase',
        gradient: 'from-blue-500/10 to-indigo-500/5',
        iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        id: 'all-works',
        name: 'All Projects Gallery',
        description: 'Scattered images, transition visual, and section text',
        gradient: 'from-purple-500/10 to-pink-500/5',
        iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
        ),
    },
    {
        id: 'testimonials',
        name: 'Client Testimonials',
        description: 'Reviews, quotes, and client feedback',
        gradient: 'from-emerald-500/10 to-teal-500/5',
        iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 'footer',
        name: 'Footer',
        description: 'Contact details — address, phone, and email',
        gradient: 'from-gray-500/10 to-slate-500/5',
        iconBg: 'bg-gray-100 text-gray-600 border-gray-200',
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
        ),
    },
];

export default function HomePageEditor() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="pb-6">
                <h1 className="text-2xl font-semibold text-black mb-2">Home Page</h1>
                <p className="text-sm text-gray-400">
                    Click on a section below to edit its content, images, and media.
                </p>
            </div>

            {/* Section Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {HOME_SECTIONS.map((section) => (
                    <Link
                        key={section.id}
                        href={`/admin/pages/home/${section.id}`}
                        className={`group relative bg-white border border-gray-100 p-6 rounded-xl hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-5 overflow-hidden`}
                    >
                        {/* Subtle gradient background on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                        {/* Icon */}
                        <div className={`relative w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0 ${section.iconBg} transition-all duration-300 group-hover:scale-110`}>
                            {section.icon}
                        </div>

                        {/* Text */}
                        <div className="relative flex-1 min-w-0">
                            <h3 className="text-[13px] font-semibold text-gray-800 mb-0.5 group-hover:text-black transition-colors">
                                {section.name}
                            </h3>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                {section.description}
                            </p>
                        </div>

                        {/* Arrow */}
                        <div className="relative text-gray-200 group-hover:text-gray-500 transition-all">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-4 pt-4">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-5 py-3 text-[12px] font-medium text-gray-500 bg-white border border-gray-100 rounded-lg hover:border-[#A67C52]/30 hover:text-[#A67C52] hover:shadow-md transition-all"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Preview Website
                </Link>
            </div>
        </div>
    );
}
