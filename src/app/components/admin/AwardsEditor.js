'use client';

import { useState, useEffect } from 'react';

export default function AwardsEditor({ page = 'studio', section = 'awards' }) {
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

    const handleAddYearGroup = () => {
        const newGroup = {
            year: new Date().getFullYear().toString(),
            items: [{ project: 'New Project', contest: '', distinction: '' }]
        };
        setStagedContent({ ...stagedContent, items: [newGroup, ...stagedContent.items] });
    };

    const handleRemoveYearGroup = (index) => {
        const newGroups = stagedContent.items.filter((_, i) => i !== index);
        setStagedContent({ ...stagedContent, items: newGroups });
    };

    const handleUpdateYear = (index, value) => {
        const newGroups = [...stagedContent.items];
        newGroups[index] = { ...newGroups[index], year: value };
        setStagedContent({ ...stagedContent, items: newGroups });
    };

    const handleAddItemToYear = (yearIndex) => {
        const newGroups = [...stagedContent.items];
        newGroups[yearIndex].items.push({ project: '', contest: '', distinction: '' });
        setStagedContent({ ...stagedContent, items: newGroups });
    };

    const handleRemoveItemFromYear = (yearIndex, itemIndex) => {
        const newGroups = [...stagedContent.items];
        newGroups[yearIndex].items = newGroups[yearIndex].items.filter((_, i) => i !== itemIndex);
        setStagedContent({ ...stagedContent, items: newGroups });
    };

    const handleUpdateItem = (yearIndex, itemIndex, field, value) => {
        const newGroups = [...stagedContent.items];
        newGroups[yearIndex].items[itemIndex] = { ...newGroups[yearIndex].items[itemIndex], [field]: value };
        setStagedContent({ ...stagedContent, items: newGroups });
    };

    if (loading) return <div className="p-8 opacity-30 uppercase text-[10px] tracking-widest">Loading Awards...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end border-bottom border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light uppercase tracking-tight">Awards & Distinctions</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage industry recognitions by year</p>
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
                        {saving ? 'Saving...' : 'Save Awards'}
                    </button>
                </div>
            </div>

            <div className="space-y-16">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300 italic">Accolade Ledger</h3>
                    <button
                        onClick={handleAddYearGroup}
                        className="text-[10px] uppercase tracking-widest font-bold text-[#A67C52] hover:text-black transition-colors flex items-center gap-2"
                    >
                        <span className="text-lg">+</span> Register New Year
                    </button>
                </div>

                <div className="space-y-12 max-w-5xl">
                    {stagedContent.items.map((group, yearIndex) => (
                        <div key={yearIndex} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                            <div className="bg-gray-50/50 p-6 flex justify-between items-center border-bottom border-gray-100">
                                <input
                                    type="text"
                                    className="bg-transparent text-xl font-bold tracking-tight outline-none w-24 border-bottom border-transparent focus:border-black"
                                    value={group.year}
                                    onChange={(e) => handleUpdateYear(yearIndex, e.target.value)}
                                />
                                <button
                                    onClick={() => handleRemoveYearGroup(yearIndex)}
                                    className="text-[9px] uppercase tracking-widest text-gray-300 hover:text-red-500 font-bold transition-colors"
                                >
                                    Delete Year Block
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                {group.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_2fr_40px] gap-6 items-end pb-6 border-bottom border-gray-50 last:border-0 last:pb-0">
                                        <div className="space-y-2">
                                            <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Project</label>
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-bottom border-gray-100 py-1 text-sm outline-none focus:border-black transition-all"
                                                value={item.project}
                                                onChange={(e) => handleUpdateItem(yearIndex, itemIndex, 'project', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Contest / Body</label>
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-bottom border-gray-100 py-1 text-sm outline-none focus:border-black transition-all"
                                                value={item.contest}
                                                onChange={(e) => handleUpdateItem(yearIndex, itemIndex, 'contest', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Distinction</label>
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-bottom border-gray-100 py-1 text-sm outline-none focus:border-black transition-all italic text-gray-400"
                                                value={item.distinction}
                                                onChange={(e) => handleUpdateItem(yearIndex, itemIndex, 'distinction', e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItemFromYear(yearIndex, itemIndex)}
                                            className="text-gray-200 hover:text-red-500 transition-colors p-2 text-xl"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddItemToYear(yearIndex)}
                                    className="w-full py-4 text-[9px] uppercase tracking-widest font-bold text-gray-400 border border-dashed border-gray-100 rounded-xl hover:bg-gray-50 hover:text-black transition-all"
                                >
                                    + Add Item to {group.year}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
