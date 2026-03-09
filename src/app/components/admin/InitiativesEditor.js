'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';

export default function InitiativesEditor({ page = 'process', section = 'initiatives' }) {
    const [content, setContent] = useState({
        label: '',
        heading: '',
        items: []
    });
    const [stagedContent, setStagedContent] = useState({
        label: '',
        heading: '',
        items: []
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
                label: contentMap.label || '',
                heading: contentMap.heading || '',
                items: contentMap.items || []
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
            const keys = Object.keys(stagedContent);
            for (const key of keys) {
                if (JSON.stringify(stagedContent[key]) !== JSON.stringify(content[key])) {
                    await fetch('/api/content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            page,
                            section,
                            key,
                            value: stagedContent[key],
                        }),
                    });
                }
            }
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
            title: 'New Initiative',
            subtitle: '',
            image: '',
            description: ''
        };
        setStagedContent({ ...stagedContent, items: [...stagedContent.items, newItem] });
    };

    const handleRemoveItem = (index) => {
        const newItems = stagedContent.items.filter((_, i) => i !== index);
        setStagedContent({ ...stagedContent, items: newItems });
    };

    const handleUpdateItem = (index, field, value) => {
        const newItems = [...stagedContent.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setStagedContent({ ...stagedContent, items: newItems });
    };

    if (loading) return <div className="p-8 opacity-30 uppercase text-[10px] tracking-widest">Loading Initiatives...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end border-bottom border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light uppercase tracking-tight">Initiatives Section</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage conviction-driven action items</p>
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
                        {saving ? 'Saving...' : 'Save Initiatives'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl pb-12 border-bottom border-gray-50">
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Section Label</label>
                    <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-100 p-4 font-medium focus:bg-white focus:border-black outline-none transition-all"
                        value={stagedContent.label}
                        onChange={(e) => setStagedContent({ ...stagedContent, label: e.target.value })}
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Main Heading</label>
                    <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-100 p-4 font-light text-xl focus:bg-white focus:border-black outline-none transition-all"
                        value={stagedContent.heading}
                        onChange={(e) => setStagedContent({ ...stagedContent, heading: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-16">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300 italic">Initiative Ledger</h3>
                    <button
                        onClick={handleAddItem}
                        className="text-[10px] uppercase tracking-widest font-bold text-[#A67C52] hover:text-black transition-colors flex items-center gap-2"
                    >
                        <span className="text-lg">+</span> Register New Initiative
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {stagedContent.items.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-100 p-12 rounded-[2rem] shadow-[0_30px_100px_-40px_rgba(0,0,0,0.03)] space-y-8 relative group">
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="absolute top-8 right-8 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest font-bold"
                            >
                                De-register
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12">
                                <div className="space-y-6">
                                    <div className="relative aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden border border-gray-50">
                                        {item.image ? (
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-300">No Registry Graphic</div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm p-4">
                                            <CloudinaryUpload
                                                folder="process"
                                                onUploadSuccess={(url) => handleUpdateItem(index, 'image', url)}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[8px] uppercase tracking-widest text-gray-300 text-center italic">Initiative Artifact</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Initiative Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border-bottom border-gray-100 py-2 text-xl font-light focus:border-black outline-none transition-all"
                                            value={item.title}
                                            onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Supporting Subtitle</label>
                                        <textarea
                                            className="w-full bg-gray-50 border border-gray-100 p-4 text-sm leading-relaxed focus:bg-white focus:border-black outline-none transition-all resize-none h-24"
                                            value={item.subtitle}
                                            onChange={(e) => handleUpdateItem(index, 'subtitle', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Deep Narrative Description</label>
                                        <textarea
                                            className="w-full bg-gray-50 border border-gray-100 p-4 text-xs leading-relaxed opacity-60 focus:bg-white focus:border-black focus:opacity-100 outline-none transition-all resize-none h-32"
                                            value={item.description}
                                            onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
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
