import Link from 'next/link';
import ProjectManagement from '@/app/components/admin/ProjectManagement';

export default function WorksEditPage() {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-3 text-sm">
                <Link href="/admin/pages/home" className="text-gray-400 hover:text-[#A67C52] transition-colors">Home</Link>
                <span className="text-gray-200">›</span>
                <span className="text-gray-800 font-medium">Featured Projects</span>
            </div>

            <div className="pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-semibold text-black mb-2">Featured Projects</h1>
                <p className="text-sm text-gray-400">
                    Add, edit, or remove projects shown in the scrolling showcase.
                </p>
            </div>

            <ProjectManagement />
        </div>
    );
}
