'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';

export default function HeroEditor({ page = 'home', section = 'hero' }) {
    const [content, setContent] = useState({
        title: '',
        subtitle: '',
        videoUrl: ''
    });
    const [stagedContent, setStagedContent] = useState({
        title: '',
        subtitle: '',
        videoUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchHeroContent();
    }, []);

    const fetchHeroContent = async () => {
        try {
            const res = await fetch(`/api/content?page=${page}&section=${section}`);
            const data = await res.json();
            const contentMap = {};
            data.forEach(item => {
                contentMap[item.key] = item.value;
            });
            const loadedContent = {
                title: contentMap.title || "We Make Your Livin' Better",
                subtitle: contentMap.subtitle || "Architectural Excellence & Interior Innovation",
                videoUrl: contentMap.videoUrl || "/videos/hero-bg.mp4"
            };
            setContent(loadedContent);
            setStagedContent(loadedContent);
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
            alert('Failed to synchronize architectural changes.');
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
        <div className="space-y-16">
            <div className="flex justify-between items-end pb-8 border-b border-gray-100">
                <div>
                    <h1 className="text-4xl font-extralight tracking-[0.5em] uppercase mb-4">Hero Section</h1>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-[1px] bg-[#A67C52]"></div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Manage background video, heading and subtitle</p>
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                {/* Visual Preview */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Preview</h3>
                        <span className="text-[8px] uppercase tracking-widest text-gray-300">Live</span>
                    </div>
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] bg-black group transition-all duration-700 hover:shadow-[0_60px_150px_rgba(0,0,0,0.15)]">
                        <video
                            key={stagedContent.videoUrl}
                            autoPlay muted loop playsInline
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-1000"
                        >
                            <source src={stagedContent.videoUrl} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-4 leading-tight drop-shadow-2xl" dangerouslySetInnerHTML={{ __html: stagedContent.title }}></h2>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-white/70 font-bold drop-shadow-lg">{stagedContent.subtitle}</p>
                        </div>

                        {/* Asset Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center gap-6 backdrop-blur-md">
                            <div className="text-[10px] uppercase tracking-[0.4em] text-white mb-2 font-bold">Replace Video / Image</div>
                            <div className="flex items-center space-x-4">
                                <CloudinaryUpload
                                    folder="hero"
                                    onUploadSuccess={(url) => setStagedContent({ ...stagedContent, videoUrl: url })}
                                />
                                {stagedContent.videoUrl && !stagedContent.videoUrl.startsWith('/videos/') && (
                                    <button
                                        onClick={() => setStagedContent({ ...stagedContent, videoUrl: '/videos/hero-bg.mp4' })}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-red-600 hover:border-red-600 transition-all"
                                    >
                                        Restore Default
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] text-center font-medium italic">Hover the preview to upload new media</p>
                </div>

                {/* Content Controls */}
                <div className="bg-white p-12 md:p-16 border border-white rounded-[3rem] shadow-[0_50px_150px_-50px_rgba(0,0,0,0.1)] flex flex-col space-y-16 animate-in slide-in-from-right-8 duration-1000 relative overflow-hidden">
                    <div className="space-y-12">
                        <div className="flex flex-col space-y-5 group">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 group-focus-within:text-[#A67C52] transition-colors">
                                    Main Heading (HTML supported)
                                </label>
                                <span className="w-1.5 h-1.5 bg-gray-100 rounded-full"></span>
                            </div>
                            <textarea
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] p-10 text-lg font-medium tracking-tight text-gray-900 focus:outline-none focus:border-[#A67C52]/40 focus:bg-white focus:ring-8 focus:ring-[#A67C52]/5 transition-all duration-500 h-48 resize-none"
                                value={stagedContent.title}
                                onChange={(e) => setStagedContent({ ...stagedContent, title: e.target.value })}
                            />
                            <div className="flex items-center space-x-3 px-4">
                                <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest leading-none">Syntax Guide</span>
                                <div className="h-[1px] flex-1 bg-gray-50"></div>
                                <p className="text-[9px] text-[#A67C52] font-bold uppercase tracking-widest">{'<'}span{'>'}Highlighted Word{'<'}/span{'>'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-5 group">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 group-focus-within:text-[#A67C52] transition-colors">
                                    Subtitle
                                </label>
                                <span className="w-1.5 h-1.5 bg-gray-100 rounded-full"></span>
                            </div>
                            <input
                                className="w-full px-10 py-9 bg-gray-50/50 border border-gray-100 rounded-[2rem] focus:outline-none focus:border-[#A67C52]/40 focus:bg-white focus:ring-8 focus:ring-[#A67C52]/5 transition-all duration-500 text-base font-medium tracking-tight text-gray-900 placeholder:text-gray-200"
                                value={stagedContent.subtitle}
                                onChange={(e) => setStagedContent({ ...stagedContent, subtitle: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleSaveAll}
                                disabled={!hasChanges || saving}
                                className={`flex-1 px-8 py-6 rounded-2xl text-[11px] font-bold uppercase tracking-[0.5em] transition-all duration-500 shadow-xl ${hasChanges && !saving
                                    ? 'bg-black text-white hover:bg-[#A67C52] shadow-black/20 translate-y-0'
                                    : 'bg-gray-100 text-gray-300 cursor-not-allowed translate-y-0'
                                    }`}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            {hasChanges && !saving && (
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-6 bg-white border border-gray-100 text-red-500 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-50 transition-all duration-500"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                        <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-amber-400' : 'bg-green-500'}`}></div>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                                    {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
                                </span>
                            </div>
                            <span className="text-[8px] uppercase tracking-[0.2em] text-gray-300">ID: SECTION_HERO_V1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
