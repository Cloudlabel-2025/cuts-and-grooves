'use client';

import { useState, useEffect } from 'react';

const SECTIONS = [
    { id: 'hero', name: 'Hero Section', keys: ['title', 'subtitle', 'videoUrl'] },
    { id: 'works', name: 'Selected Works', keys: ['heading'] },
    { id: 'testimonials', name: 'Testimonials', keys: ['heading'] },
    { id: 'footer', name: 'Footer', keys: ['address', 'email', 'phone'] },
];

export default function ContentManagement() {
    const [selectedSection, setSelectedSection] = useState(SECTIONS[0]);
    const [content, setContent] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, [selectedSection]);

    const fetchContent = async () => {
        try {
            const res = await fetch(`/api/content?page=home&section=${selectedSection.id}`);
            const data = await res.json();
            const contentMap = {};
            data.forEach(item => {
                contentMap[item.key] = item.value;
            });
            setContent(contentMap);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (key, value) => {
        setSaving(true);
        try {
            await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page: 'home',
                    section: selectedSection.id,
                    key,
                    value,
                }),
            });
            setContent(prev => ({ ...prev, [key]: value }));
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex space-x-10 h-full">
            <div className="w-64 space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-6">Sections</h3>
                {SECTIONS.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setSelectedSection(section)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-xs uppercase tracking-widest transition-all ${selectedSection.id === section.id ? 'bg-[#FDEBD0] text-black' : 'text-gray-400 hover:text-white hover:bg-[#111]'
                            }`}
                    >
                        {section.name}
                    </button>
                ))}
            </div>

            <div className="flex-1 space-y-8 bg-[#111] p-10 border border-[#222] rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl uppercase tracking-widest font-light">{selectedSection.name}</h2>
                    {saving && <span className="text-[10px] text-[#FDEBD0] animate-pulse uppercase tracking-widest">Saving changes...</span>}
                </div>

                <div className="space-y-6">
                    {selectedSection.keys.map(key => (
                        <div key={key}>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">{key}</label>
                            <textarea
                                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-4 text-sm focus:border-[#FDEBD0] focus:outline-none transition-colors"
                                rows={3}
                                value={content[key] || ''}
                                onChange={(e) => setContent(prev => ({ ...prev, [key]: e.target.value }))}
                                onBlur={(e) => handleUpdate(key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
