'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';

export default function TeamEditor({ page = 'studio', section = 'team' }) {
    const [content, setContent] = useState({
        members: []
    });
    const [stagedContent, setStagedContent] = useState({
        members: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch(`/api/content?page=${page}&section=${section}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            const contentMap = {};
            data.forEach(item => {
                contentMap[item.key] = item.value;
            });
            const loadedContent = {
                members: contentMap.members || []
            };
            setContent(loadedContent);
            setStagedContent(loadedContent);
        } catch (err) {
            console.error('Failed to fetch content:', err);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = JSON.stringify(content) !== JSON.stringify(stagedContent);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page,
                    section,
                    key: 'members',
                    value: stagedContent.members,
                }),
            });
            setContent(JSON.parse(JSON.stringify(stagedContent)));
        } catch (err) {
            console.error(err);
            alert('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddItem = () => {
        const newItem = {
            name: 'New Member',
            role: 'Architect',
            image: ''
        };
        setStagedContent({ ...stagedContent, members: [...stagedContent.members, newItem] });
    };

    const handleRemoveItem = (index) => {
        const newItems = stagedContent.members.filter((_, i) => i !== index);
        setStagedContent({ ...stagedContent, members: newItems });
    };

    const handleUpdateItem = (index, field, value) => {
        const newItems = [...stagedContent.members];
        newItems[index] = { ...newItems[index], [field]: value };
        setStagedContent({ ...stagedContent, members: newItems });
    };

    if (loading) return <div className="p-8 opacity-30 uppercase text-[10px] tracking-widest">Loading Team...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end border-bottom border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light uppercase tracking-tight">Team Members</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage the studio roster</p>
                </div>
                <div className="flex gap-4">
                    {hasChanges && (
                        <button
                            onClick={() => setStagedContent(JSON.parse(JSON.stringify(content)))}
                            className="px-6 py-2 text-[10px] uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Reset
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className={`px-8 py-2 text-[10px] uppercase tracking-widest transition-all ${hasChanges && !saving ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {saving ? 'Saving...' : 'Save Team'}
                    </button>
                </div>
            </div>

            <div className="space-y-16">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300 italic">Roster Ledger</h3>
                    <button
                        onClick={handleAddItem}
                        className="text-[10px] uppercase tracking-widest font-bold text-[#A67C52] hover:text-black transition-colors flex items-center gap-2"
                    >
                        <span className="text-lg">+</span> Recruit New Member
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-12 max-w-5xl">
                    {stagedContent.members.map((member, index) => (
                        <div key={index} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-8 relative group">
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="absolute top-6 right-6 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest font-bold"
                            >
                                Remove
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-12">
                                <div className="space-y-4">
                                    <div className="relative aspect-[1/1] bg-gray-50 rounded-2xl overflow-hidden border border-gray-50">
                                        {member.image ? (
                                            <img src={member.image} className="w-full h-full object-cover" alt={member.name} />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-300">No Photo</div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm p-2">
                                            <CloudinaryUpload
                                                folder="studio"
                                                onUploadSuccess={(url) => handleUpdateItem(index, 'image', url)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-bottom border-gray-100 py-2 text-xl font-light focus:border-black outline-none transition-all"
                                            value={member.name}
                                            onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Role / Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-bottom border-gray-100 py-2 text-xl font-light focus:border-black outline-none transition-all italic text-gray-400"
                                            value={member.role}
                                            onChange={(e) => handleUpdateItem(index, 'role', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
