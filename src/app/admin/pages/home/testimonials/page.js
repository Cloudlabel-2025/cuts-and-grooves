import Link from 'next/link';
import SectionContentEditor from '@/app/components/admin/SectionContentEditor';
import TestimonialManagement from '@/app/components/admin/TestimonialManagement';

export default function TestimonialsEditPage() {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-3 text-sm">
                <Link href="/admin/pages/home" className="text-gray-400 hover:text-[#A67C52] transition-colors">Home</Link>
                <span className="text-gray-200">›</span>
                <span className="text-gray-800 font-medium">Client Testimonials</span>
            </div>

            <div className="pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-semibold text-black mb-2">Client Testimonials</h1>
                <p className="text-sm text-gray-400">
                    Manage client reviews, quotes, and feedback shown on the home page.
                </p>
            </div>

            <SectionContentEditor
                section="testimonials"
                title="Section Text"
                description="Edit the heading and description above the testimonials."
                fields={[
                    { key: 'heading', label: 'Section Heading', type: 'text' },
                    { key: 'subtext', label: 'Description', type: 'textarea' }
                ]}
            />

            <div className="pt-4">
                <TestimonialManagement />
            </div>
        </div>
    );
}
