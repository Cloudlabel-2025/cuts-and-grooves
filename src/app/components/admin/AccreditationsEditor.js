'use client';

import { useState, useEffect } from 'react';

export default function AccreditationsEditor({ page = 'process', section = 'accreditations' }) {
    const [content, setContent] = useState({
        items: []
    });
    const [stagedContent, setStagedContent] = useState({
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
            await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page,
                    section,
                    key: 'items',
                    value: stagedContent.items,
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
        setStagedContent({ ...stagedContent, items: [...stagedContent.items, ''] });
    };

    const handleUpdateItem = (index, value) => {
        const newItems = [...stagedContent.items];
        newItems[index] = value;
        setStagedContent({ ...stagedContent, items: newItems });
    };

    const handleRemoveItem = (index) => {
        const newItems = stagedContent.items.filter((_, i) => i !== index);
        setStagedContent({ ...stagedContent, items: newItems });
    };

    if (loading) return <div className="p-8 opacity-30 uppercase text-[10px] tracking-widest">Loading Accreditations...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end border-bottom border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light uppercase tracking-tight">Accreditations Section</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage certifications and professional affiliations</p>
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
                        {saving ? 'Saving...' : 'Save Accreditations'}
                    </button>
                </div>
            </div>

            <div className="space-y-8 max-w-2xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300 italic">Certification Registry</h3>
                    <button
                        onClick={handleAddItem}
                        className="text-[10px] uppercase tracking-widest font-bold text-[#A67C52] hover:text-black transition-colors"
                    >
                        + Add Certification
                    </button>
                </div>

                <div className="space-y-4">
                    {stagedContent.items.map((item, index) => (
                        <div key={index} className="flex gap-4 group">
                            <input
                                type="text"
                                className="flex-1 bg-gray-50 border-bottom border-gray-100 py-3 px-2 text-sm uppercase tracking-widest focus:border-black outline-none transition-all font-bold"
                                value={item}
                                onChange={(e) => handleUpdateItem(index, e.target.value)}
                                placeholder="CERTIFICATION NAME"
                            />
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="text-gray-200 hover:text-red-500 transition-colors p-2"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    {stagedContent.items.length === 0 && (
                        <p className="text-center py-12 text-[10px] uppercase tracking-widest text-gray-300 border-2 border-dashed border-gray-50 rounded-xl italic">No certifications registered</p>
                    )}
                </div>
            </div>
        </div>
    );
}
