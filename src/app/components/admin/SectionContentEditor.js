'use client';

import { useState, useEffect } from 'react';

/**
 * SectionContentEditor
 * A reusable component to manage textual content for specific sections.
 */
export default function SectionContentEditor({
    page = 'home',
    section,
    title = "Section Configuration",
    description = "Manage the narrative and visual cues for this segment.",
    fields = [
        { key: 'heading', label: 'Primary Heading', type: 'text' },
        { key: 'subtext', label: 'Secondary Description', type: 'textarea' }
    ]
}) {
    const [content, setContent] = useState({});
    const [stagedContent, setStagedContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSectionContent();
    }, [page, section]);

    const fetchSectionContent = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/content?page=${page}&section=${section}`);
            const data = await res.json();
            const contentMap = {};
            data.forEach(item => {
                contentMap[item.key] = item.value;
            });

            const initialData = {};
            fields.forEach(field => {
                initialData[field.key] = contentMap[field.key] || "";
            });

            setContent(initialData);
            setStagedContent(initialData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = JSON.stringify(content) !== JSON.stringify(stagedContent);

    const handleSaveAll = async () => {
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

    const handleReset = () => {
        setStagedContent(content);
    };

    if (loading) return (
        <div className="flex items-center space-x-4 py-20 opacity-30">
            <div className="w-2 h-2 bg-black animate-bounce"></div>
            <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.3s]"></div>
            <span className="text-[10px] uppercase tracking-[1em] pl-4">Syncing Infrastructure</span>
        </div>
    );

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end pb-8 border-b border-gray-100">
                <div>
                    <h1 className="text-4xl font-extralight tracking-[0.5em] uppercase mb-4">{title}</h1>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-[1px] bg-[#A67C52]"></div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">{description}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-8">
                    {hasChanges && (
                        <div className="flex items-center space-x-3 text-[10px] text-[#A67C52] font-bold uppercase tracking-[0.3em] animate-in fade-in slide-in-from-right-4 duration-500">
                            <span className="w-2 h-2 bg-[#A67C52] rounded-full animate-pulse"></span>
                            <span>Unsaved Changes</span>
                        </div>
                    )}
                    {saving && (
                        <div className="flex items-center space-x-3 text-[10px] text-black animate-pulse font-bold uppercase tracking-[0.3em]">
                            <span className="w-2 h-2 bg-black rounded-full"></span>
                            <span>Saving...</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl bg-white p-12 md:p-16 border border-white rounded-[3rem] shadow-[0_50px_150px_-50px_rgba(0,0,0,0.1)] space-y-12">
                {fields.map((field) => (
                    <div key={field.key} className="flex flex-col space-y-4 group">
                        <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 group-focus-within:text-[#A67C52] transition-colors">
                                {field.label}
                            </label>
                            <span className="w-1.5 h-1.5 bg-gray-100 rounded-full"></span>
                        </div>
                        {field.type === 'textarea' ? (
                            <textarea
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] p-8 text-base font-medium tracking-tight text-gray-900 focus:outline-none focus:border-[#A67C52]/40 focus:bg-white focus:ring-8 focus:ring-[#A67C52]/5 transition-all duration-500 min-h-[160px] resize-none"
                                value={stagedContent[field.key] || ""}
                                onChange={(e) => setStagedContent({ ...stagedContent, [field.key]: e.target.value })}
                            />
                        ) : (
                            <input
                                type="text"
                                className="w-full px-10 py-7 bg-gray-50/50 border border-gray-100 rounded-[2rem] focus:outline-none focus:border-[#A67C52]/40 focus:bg-white focus:ring-8 focus:ring-[#A67C52]/5 transition-all duration-500 text-base font-medium tracking-tight text-gray-900 placeholder:text-gray-200"
                                value={stagedContent[field.key] || ""}
                                onChange={(e) => setStagedContent({ ...stagedContent, [field.key]: e.target.value })}
                            />
                        )}
                    </div>
                ))}

                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={handleSaveAll}
                            disabled={!hasChanges || saving}
                            className={`px-12 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.5em] transition-all duration-500 shadow-xl ${hasChanges && !saving
                                ? 'bg-black text-white hover:bg-[#A67C52] shadow-black/20'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        {hasChanges && !saving && (
                            <button
                                onClick={handleReset}
                                className="px-10 py-5 bg-white border border-gray-100 text-red-500 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-50 transition-all duration-500"
                            >
                                Discard
                            </button>
                        )}
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-gray-300">Section Node: {section.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
}
