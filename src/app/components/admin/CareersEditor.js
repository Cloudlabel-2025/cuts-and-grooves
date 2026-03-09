'use client';

import { useState, useEffect } from 'react';

export default function CareersEditor({ page = 'studio', section = 'careers' }) {
    const [content, setContent] = useState({
        heading: '',
        jobs: []
    });
    const [stagedContent, setStagedContent] = useState({
        heading: '',
        jobs: []
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
                jobs: contentMap.jobs || []
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

    const handleAddJob = () => {
        const newJob = {
            title: 'New Position',
            type: 'Full-time',
            location: 'Melbourne'
        };
        setStagedContent({ ...stagedContent, jobs: [...stagedContent.jobs, newJob] });
    };

    const handleRemoveJob = (index) => {
        const newJobs = stagedContent.jobs.filter((_, i) => i !== index);
        setStagedContent({ ...stagedContent, jobs: newJobs });
    };

    const handleUpdateJob = (index, field, value) => {
        const newJobs = [...stagedContent.jobs];
        newJobs[index] = { ...newJobs[index], [field]: value };
        setStagedContent({ ...stagedContent, jobs: newJobs });
    };

    if (loading) return <div className="p-8 opacity-30 uppercase text-[10px] tracking-widest">Loading Careers...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end border-bottom border-gray-100 pb-8">
                <div>
                    <h2 className="text-3xl font-light uppercase tracking-tight">Careers & Job Offers</h2>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage open positions and recruitment text</p>
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
                        {saving ? 'Saving...' : 'Save Careers'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 max-w-4xl pb-12 border-bottom border-gray-50">
                <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Recruitment Heading</label>
                    <textarea
                        className="w-full bg-gray-50 border border-gray-100 p-6 text-xl font-light focus:bg-white focus:border-black outline-none transition-all resize-none min-h-[120px]"
                        value={stagedContent.heading}
                        onChange={(e) => setStagedContent({ ...stagedContent, heading: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-16">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300 italic">Position Registry</h3>
                    <button
                        onClick={handleAddJob}
                        className="text-[10px] uppercase tracking-widest font-bold text-[#A67C52] hover:text-black transition-colors flex items-center gap-2"
                    >
                        <span className="text-lg">+</span> Post New Position
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 max-w-4xl">
                    {stagedContent.jobs.map((job, index) => (
                        <div key={index} className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm space-y-6 relative group">
                            <button
                                onClick={() => handleRemoveJob(index)}
                                className="absolute top-6 right-6 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest font-bold"
                            >
                                Remove
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Position Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-bottom border-gray-100 py-1 text-sm font-bold outline-none focus:border-black transition-all"
                                        value={job.title}
                                        onChange={(e) => handleUpdateJob(index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Employment Type</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-bottom border-gray-100 py-1 text-sm outline-none focus:border-black transition-all"
                                        value={job.type}
                                        onChange={(e) => handleUpdateJob(index, 'type', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Location</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-bottom border-gray-100 py-1 text-sm outline-none focus:border-black transition-all"
                                        value={job.location}
                                        onChange={(e) => handleUpdateJob(index, 'location', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
