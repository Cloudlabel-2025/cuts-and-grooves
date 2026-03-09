'use client';

import { useState, useEffect } from 'react';

export default function StudioNarrativeEditor({ page = 'studio', section = 'narrative' }) {
    const [content, setContent] = useState({
        heading: '',
        quote: '',
        valuesText: ''
    });
    const [stagedContent, setStagedContent] = useState({
        heading: '',
        quote: '',
        valuesText: ''
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
                heading: contentMap.heading || '',
                quote: contentMap.quote || '',
                valuesText: contentMap.valuesText || ''
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

    if (loading) return <div className="p-8 opacity-30 uppercase text-[10px] tracking-widest">Loading Studio Narrative...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end border-bottom border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light uppercase tracking-tight">Narrative & Quote</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage global studio messaging</p>
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
                        {saving ? 'Saving...' : 'Save Narrative'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 max-w-4xl">
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Introductory Heading</label>
                    <textarea
                        className="w-full bg-gray-50 border border-gray-100 p-6 text-2xl font-light focus:bg-white focus:border-black outline-none transition-all resize-none min-h-[100px]"
                        value={stagedContent.heading}
                        onChange={(e) => setStagedContent({ ...stagedContent, heading: e.target.value })}
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Studio Quote (Impact Text)</label>
                    <textarea
                        className="w-full bg-gray-50 border border-gray-100 p-6 text-xl font-light focus:bg-white focus:border-black outline-none transition-all resize-none min-h-[120px]"
                        value={stagedContent.quote}
                        onChange={(e) => setStagedContent({ ...stagedContent, quote: e.target.value })}
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Introductory Values Text</label>
                    <textarea
                        className="w-full bg-gray-50 border border-gray-100 p-6 text-sm leading-relaxed focus:bg-white focus:border-black outline-none transition-all resize-none min-h-[200px]"
                        value={stagedContent.valuesText}
                        onChange={(e) => setStagedContent({ ...stagedContent, valuesText: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
