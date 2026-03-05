import Link from 'next/link';
import HeroEditor from '@/app/components/admin/HeroEditor';

export default function HeroEditPage() {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-3 text-sm">
                <Link href="/admin/pages/home" className="text-gray-400 hover:text-[#A67C52] transition-colors">Home</Link>
                <span className="text-gray-200">›</span>
                <span className="text-gray-800 font-medium">Hero Section</span>
            </div>
            <HeroEditor />
        </div>
    );
}
