'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';

export default function SustainabilityEditor({ page = 'process', section = 'sustainability' }) {
    const [content, setContent] = useState({
        image: '',
        label: '',
        heading: ''
    });
    const [stagedContent, setStagedContent] = useState({
        image: '',
        label: '',
        heading: ''
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
                image: contentMap.image || '',
                label: contentMap.label || '',
                heading: contentMap.heading || ''
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
                if (stagedContent[key] !== content[key]) {
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
            setContent(stagedContent);
        } catch (err) {
            console.error(err);
            alert('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 opacity-30 uppercase text-[10px] tracking-widest">Loading Sustainability...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end border-bottom border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light uppercase tracking-tight">Sustainability Section</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage the sticky impact feature</p>
                </div>
                <div className="flex gap-4">
                    {hasChanges && (
                        <button
                            onClick={() => setStagedContent(content)}
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
                        {saving ? 'Saving...' : 'Save Sustainability'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-12">
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
                        <textarea
                            className="w-full bg-gray-50 border border-gray-100 p-6 text-xl font-light focus:bg-white focus:border-black outline-none transition-all resize-none h-[120px]"
                            value={stagedContent.heading}
                            onChange={(e) => setStagedContent({ ...stagedContent, heading: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block">Sticky Background Image</label>
                    <div className="relative aspect-video bg-gray-100 rounded-sm overflow-hidden border border-gray-100 group">
                        {stagedContent.image ? (
                            <img src={stagedContent.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Sustainability Preview" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-300">No Image Selected</div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <CloudinaryUpload
                                folder="process"
                                onUploadSuccess={(url) => setStagedContent({ ...stagedContent, image: url })}
                            />
                        </div>
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 text-center italic">Hover image to upload new background</p>
                </div>
            </div>
        </div>
    );
}
