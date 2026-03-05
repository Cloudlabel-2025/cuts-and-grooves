import Link from 'next/link';
import SectionContentEditor from '@/app/components/admin/SectionContentEditor';
import AllWorksMediaEditor from '@/app/components/admin/AllWorksMediaEditor';

export default function AllWorksEditPage() {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-3 text-sm">
                <Link href="/admin/pages/home" className="text-gray-400 hover:text-[#A67C52] transition-colors">Home</Link>
                <span className="text-gray-200">›</span>
                <span className="text-gray-800 font-medium">All Projects Gallery</span>
            </div>

            <div className="pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-semibold text-black mb-2">All Projects Gallery</h1>
                <p className="text-sm text-gray-400">
                    Manage the scattered images, transition visual, and section text.
                </p>
            </div>

            <SectionContentEditor
                section="all-works"
                title="Text Content"
                description="Edit the heading and description for this section."
                fields={[
                    { key: 'heading', label: 'Section Heading', type: 'text' },
                    { key: 'subtext', label: 'Section Description', type: 'textarea' }
                ]}
            />

            <div className="pt-4">
                <AllWorksMediaEditor />
            </div>
        </div>
    );
}
