'use client';

import { useState, useEffect } from 'react';

export default function ContactEditor({ page = 'contact' }) {
    const [content, setContent] = useState({
        heroText: '',
        locations: [],
        instagram: '',
        linkedin: '',
        email: '',
        phone: '',
        studio: '',
        mapIframe: ''
    });
    const [stagedContent, setStagedContent] = useState({
        heroText: '',
        locations: [],
        instagram: '',
        linkedin: '',
        email: '',
        phone: '',
        studio: '',
        mapIframe: ''
    });
    const [newLocation, setNewLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch(`/api/content?page=${page}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            const contentMap = {};
            data.forEach(item => {
                contentMap[item.key] = item.value;
            });

            // Map socials array to flat keys for easier editing if it exists
            const instagram = (contentMap.socials || []).find(s => s.platform === 'Instagram')?.url || '';
            const linkedin = (contentMap.socials || []).find(s => s.platform === 'LinkedIn')?.url || '';

            const loadedContent = {
                heroText: contentMap.heroText || '',
                locations: contentMap.locations || [],
                instagram,
                linkedin,
                email: contentMap.email || '',
                phone: contentMap.phone || '',
                studio: contentMap.studio || '',
                mapIframe: contentMap.mapIframe || ''
            };
            setContent(loadedContent);
            setStagedContent(loadedContent);
        } catch (err) {
            console.error('Failed to fetch contact content:', err);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = JSON.stringify(content) !== JSON.stringify(stagedContent);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Re-map flat social keys back to array
            const socials = [
                { platform: 'Instagram', url: stagedContent.instagram },
                { platform: 'LinkedIn', url: stagedContent.linkedin }
            ];

            const updates = [
                { section: 'hero', key: 'heroText', value: stagedContent.heroText },
                { section: 'hero', key: 'locations', value: stagedContent.locations },
                { section: 'details', key: 'socials', value: socials },
                { section: 'details', key: 'email', value: stagedContent.email },
                { section: 'details', key: 'phone', value: stagedContent.phone },
                { section: 'details', key: 'studio', value: stagedContent.studio },
                { section: 'details', key: 'mapIframe', value: stagedContent.mapIframe }
            ];

            for (const item of updates) {
                await fetch('/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        page,
                        ...item
                    }),
                });
            }
            setContent(stagedContent);
        } catch (err) {
            console.error(err);
            alert('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const addLocation = () => {
        if (!newLocation.trim()) return;
        setStagedContent({
            ...stagedContent,
            locations: [...stagedContent.locations, newLocation.trim()]
        });
        setNewLocation('');
    };

    const removeLocation = (index) => {
        setStagedContent({
            ...stagedContent,
            locations: stagedContent.locations.filter((_, i) => i !== index)
        });
    };

    if (loading) return <div className="p-8 opacity-30 uppercase text-[10px] tracking-widest">Loading Contact Details...</div>;

    return (
        <div className="space-y-16">
            {/* Header */}
            <div className="flex justify-between items-end border-bottom border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light uppercase tracking-tight">Contact Page</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage contact info and studio locations</p>
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
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* HERO SECTION */}
                <div className="space-y-12">
                    <h3 className="text-xl font-medium border-bottom pb-4 border-gray-50">Hero Narrative</h3>

                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Main Statement</label>
                        <textarea
                            className="w-full bg-gray-50 border border-gray-100 p-6 text-xl font-light focus:bg-white focus:border-black outline-none transition-all resize-none min-h-[120px]"
                            value={stagedContent.heroText}
                            onChange={(e) => setStagedContent({ ...stagedContent, heroText: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Operational Locations</label>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className="flex-1 bg-gray-50 border border-gray-100 p-2 text-xs outline-none focus:bg-white"
                                placeholder="Add location..."
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                            />
                            <button onClick={addLocation} className="px-4 py-2 bg-gray-100 text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {stagedContent.locations.map((loc, i) => (
                                <div key={i} className="group flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                                    <span className="text-xs">{loc}</span>
                                    <button
                                        onClick={() => removeLocation(i)}
                                        className="text-gray-400 hover:text-red-500 transition-colors text-[10px]"
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* DETAILS SECTION */}
                <div className="space-y-12">
                    <h3 className="text-xl font-medium border-bottom pb-4 border-gray-50">Studio Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Instagram URL</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-100 p-3 text-xs outline-none focus:bg-white"
                                value={stagedContent.instagram}
                                onChange={(e) => setStagedContent({ ...stagedContent, instagram: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">LinkedIn URL</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-100 p-3 text-xs outline-none focus:bg-white"
                                value={stagedContent.linkedin}
                                onChange={(e) => setStagedContent({ ...stagedContent, linkedin: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Public Email</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-100 p-3 text-xs outline-none focus:bg-white"
                                value={stagedContent.email}
                                onChange={(e) => setStagedContent({ ...stagedContent, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Phone Number</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-100 p-3 text-xs outline-none focus:bg-white"
                                value={stagedContent.phone}
                                onChange={(e) => setStagedContent({ ...stagedContent, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Studio Address</label>
                        <textarea
                            className="w-full bg-gray-50 border border-gray-100 p-6 text-sm outline-none focus:bg-white transition-all resize-none min-h-[100px]"
                            value={stagedContent.studio}
                            onChange={(e) => setStagedContent({ ...stagedContent, studio: e.target.value })}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Location Map Embed URL</label>
                        <p className="text-xs text-gray-500 mb-2">
                            To get this link: Go to Google Maps {'->'} Click 'Share' {'->'} Click 'Embed a map' {'->'} Copy the link inside the <code className="bg-gray-100 px-1 rounded">src="..."</code> attribute.
                            <br /><span className="text-red-400">Do not use regular "Share Link" (maps.app.goo.gl).</span>
                        </p>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-100 p-3 text-xs outline-none focus:bg-white"
                            placeholder="https://www.google.com/maps/embed?pb=..."
                            value={stagedContent.mapIframe}
                            onChange={(e) => setStagedContent({ ...stagedContent, mapIframe: e.target.value })}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
