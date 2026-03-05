import Link from 'next/link';
import SectionContentEditor from '@/app/components/admin/SectionContentEditor';

export default function FooterEditPage() {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-3 text-sm">
                <Link href="/admin/pages/home" className="text-gray-400 hover:text-[#A67C52] transition-colors">Home</Link>
                <span className="text-gray-200">›</span>
                <span className="text-gray-800 font-medium">Footer</span>
            </div>

            <div className="pb-6 border-b border-gray-100">
                <h1 className="text-2xl font-semibold text-black mb-2">Footer</h1>
                <p className="text-sm text-gray-400">
                    Update the contact details shown in the website footer.
                </p>
            </div>

            <SectionContentEditor
                section="footer"
                title="Contact Information"
                description="These details appear in the footer of every page."
                fields={[
                    { key: 'address', label: 'Office Address', type: 'textarea' },
                    { key: 'phone', label: 'Phone Number', type: 'text' },
                    { key: 'email', label: 'Email Address', type: 'text' }
                ]}
            />
        </div>
    );
}
