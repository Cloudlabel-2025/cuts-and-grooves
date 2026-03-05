'use client';

import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div className="space-y-24">
            {/* Editorial Header */}
            <div className="flex justify-between items-end pb-12 border-b border-gray-100">
                <div>
                    <h1 className="text-[2.75rem] font-bold tracking-tight text-[#1f2937] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                        Editorial Hub
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#A67C52] font-bold">Manage Your Brand Experience</p>
                </div>
                <div className="hidden lg:flex flex-col items-end">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-1.5">System Status</span>
                    <div className="flex items-center space-x-2.5 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[11px] font-bold tracking-wide text-green-700 uppercase">Live & Synchronized</span>
                    </div>
                </div>
            </div>

            {/* Quick Management Suite */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <QuickCard title="Media Library" detail="Assets / Cloudinary" icon="📁" href="/admin/media" />
                <QuickCard title="Project Records" detail="Portfolio Management" icon="▧" href="/admin/projects" />
                <QuickCard title="Client Feedback" detail="Testimonials" icon="▦" href="/admin/testimonials" />
                <QuickCard title="Global Styles" detail="Theme & Narrative" icon="◈" href="#" />
            </div>

            {/* Visual Site Map */}
            <div className="space-y-12">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">Visual Site Map</h3>
                    <div className="h-[1px] flex-1 mx-10 bg-gradient-to-r from-gray-100 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <PageCard
                        title="Home"
                        description="Main landing experience with cinematic hero and narrative."
                        href="/admin/pages/home"
                        visualCanvas={true}
                        icon="🏠"
                    />
                    <PageCard
                        title="Work"
                        description="Showcase of your architectural and interior design portfolio."
                        href="/admin/pages/work"
                        icon="📂"
                    />
                    <PageCard
                        title="Process"
                        description="Step-by-step breakdown of your studio's methodology."
                        href="/admin/pages/process"
                        icon="⚙️"
                    />
                    <PageCard
                        title="Studio"
                        description="Institutional philosophy and the human capital behind the brand."
                        href="/admin/pages/studio"
                        icon="🏢"
                    />
                    <PageCard
                        title="Contact"
                        description="Direct communication portal and studio location details."
                        href="/admin/pages/contact"
                        icon="✉️"
                    />
                </div>
            </div>

            {/* System Intelligence Feed */}
            <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center space-x-5 mb-10 pb-8 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">✦</div>
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-500">Operational Intelligence</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <IntelligenceItem label="Node Density" value="Stable" color="green" />
                    <IntelligenceItem label="Asset Health" value="100%" color="green" />
                    <IntelligenceItem label="Pending Commits" value="0" color="gray" />
                </div>
            </div>
        </div>
    );
}

function QuickCard({ title, detail, icon, href }) {
    return (
        <Link href={href} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:border-[#A67C52]/20 hover:-translate-y-1 transition-all duration-500 group">
            <div className="flex items-center space-x-6">
                <span className="text-2xl group-hover:scale-110 group-hover:text-[#A67C52] transition-all duration-500">{icon}</span>
                <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1f2937]">{title}</h4>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">{detail}</p>
                </div>
            </div>
        </Link>
    );
}

function PageCard({ title, description, href, visualCanvas, icon }) {
    return (
        <Link href={href} className="bg-white border border-gray-100 p-12 rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
            {visualCanvas && (
                <div className="absolute top-8 right-8 px-4 py-1.5 bg-[#A67C52]/5 rounded-full border border-[#A67C52]/10">
                    <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#A67C52]">Visual Canvas Active</span>
                </div>
            )}

            <div className="text-[2.5rem] mb-10 group-hover:scale-110 group-hover:-rotate-3 origin-bottom-left transition-transform duration-500">{icon}</div>

            <h3 className="text-[2rem] font-bold tracking-tight text-[#1f2937] mb-4 group-hover:text-[#A67C52] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium mb-12 flex-1">{description}</p>

            <div className="pt-8 border-t border-gray-50 flex items-center justify-between text-[10px] uppercase font-bold tracking-[0.3em] text-gray-300 group-hover:text-[#1f2937] transition-colors">
                <span>Edit Content</span>
                <span className="group-hover:translate-x-3 transition-transform duration-500">→</span>
            </div>
        </Link>
    );
}

function IntelligenceItem({ label, value, color }) {
    const colorClass = color === 'green' ? 'bg-green-500' : 'bg-gray-300';
    return (
        <div className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className={`w-2 h-2 rounded-full ${colorClass} shadow-sm`}></div>
            <div>
                <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1.5 font-bold">{label}</p>
                <p className="text-[15px] font-semibold tracking-tight text-gray-900">{value}</p>
            </div>
        </div>
    );
}
