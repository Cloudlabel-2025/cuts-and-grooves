'use client';

import { useState, useEffect, useRef } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';

export default function VisualCanvasEditor({ page = 'home', section = 'hero' }) {
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
    const [isDragging, setIsDragging] = useState(false);

    const dropZoneRef = useRef(null);

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
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setStagedContent(content);
    };

    const handleTextChange = (key, value) => {
        setStagedContent(prev => ({ ...prev, [key]: value }));
    };

    // Media Upload Logic via Cloudinary
    const handleUpload = async (file) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset);
        formData.append('folder', 'hero');

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                { method: 'POST', body: formData }
            );
            const data = await response.json();
            if (data.secure_url) {
                setStagedContent(prev => ({ ...prev, videoUrl: data.secure_url }));
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Visual asset integration failed.');
        }
    };

    const isVideo = (url) => {
        if (!url) return true;
        return url.match(/\.(mp4|webm|ogg)$|video\/upload/);
    };

    return (
        <div className="relative w-full h-[80vh] bg-black rounded-[4rem] overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,0.3)] group/canvas">
            {/* Background Visual Engine (Live-like) */}
            <div
                className={`absolute inset-0 transition-all duration-1000 ${isDragging ? 'scale-95 opacity-50 blur-lg' : 'scale-100 opacity-100'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleUpload(file);
                }}
            >
                {isVideo(stagedContent.videoUrl) ? (
                    <video
                        key={stagedContent.videoUrl}
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={stagedContent.videoUrl} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        src={stagedContent.videoUrl}
                        alt="Hero background"
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Drag & Drop Indicator Overlay */}
            {isDragging && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#A67C52]/20 backdrop-blur-3xl animate-in fade-in duration-300">
                    <div className="w-32 h-32 border-2 border-dashed border-white rounded-full flex items-center justify-center mb-8 animate-pulse text-4xl text-white">
                        +
                    </div>
                    <p className="text-white text-[10px] uppercase tracking-[0.8em] font-bold mb-4">Inject Media Asset</p>
                    <div className="flex flex-col items-center space-y-2 px-8 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <span className="text-[8px] text-white/50 uppercase tracking-[0.3em]">Recommended Specification</span>
                        <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">3840 x 2160 Pixels (16:9)</span>
                    </div>
                </div>
            )}

            {/* Content Canvas (Inline Editing) */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center text-white pointer-events-none">
                <div className="max-w-4xl space-y-12 pointer-events-auto">
                    {/* Primary Narrative */}
                    <h1
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextChange('title', e.target.innerHTML)}
                        className="text-4xl md:text-6xl font-extralight tracking-tight leading-tight outline-none focus:ring-4 focus:ring-[#A67C52]/30 p-8 rounded-[2rem] transition-all cursor-text hover:bg-white/5"
                        dangerouslySetInnerHTML={{ __html: stagedContent.title }}
                    />

                    {/* Secondary Description */}
                    <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextChange('subtitle', e.target.innerText)}
                        className="text-[10px] md:text-sm uppercase tracking-[0.6em] font-bold text-white/60 outline-none focus:ring-4 focus:ring-[#A67C52]/30 px-12 py-4 rounded-xl transition-all cursor-text hover:bg-white/5"
                    >
                        {stagedContent.subtitle}
                    </p>
                </div>
            </div>

            {/* Bottom Command Bar (Stays pinned to bottom of the canvas) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-6 backdrop-blur-2xl bg-white/10 border border-white/20 p-4 rounded-[2.5rem] shadow-2xl transition-all duration-700 hover:bg-white/20">
                <div className="px-8 py-4 border-r border-white/10 flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-[#A67C52] animate-pulse' : 'bg-green-500'}`}></div>
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/70">
                        {hasChanges ? 'Awaiting Commits' : 'Engine Synced'}
                    </span>
                </div>

                <div className="flex items-center space-x-3 p-1">
                    {hasChanges && (
                        <button
                            onClick={handleReset}
                            className="px-8 py-3 bg-white/10 text-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-red-500 transition-all border border-white/5"
                        >
                            Discard
                        </button>
                    )}
                    <button
                        onClick={handleSaveAll}
                        disabled={!hasChanges || saving}
                        className={`px-12 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-[0.5em] transition-all ${hasChanges && !saving
                            ? 'bg-white text-black hover:bg-[#A67C52] hover:text-white'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                            }`}
                    >
                        {saving ? 'Synchronizing...' : 'Finalize Edits'}
                    </button>
                </div>
            </div>

            {/* Canvas Hint (Top Right) */}
            <div className="absolute top-12 right-12 z-30 pointer-events-none">
                <div className="flex flex-col items-end space-y-2 opacity-40 group-hover/canvas:opacity-100 transition-all duration-1000">
                    <span className="text-[8px] text-white uppercase tracking-[0.5em] font-bold">Visual Canvas Alpha V1</span>
                    <span className="text-[7px] text-white/50 uppercase tracking-[0.3em]">Drag-n-Drop Media Active</span>
                    <div className="pt-2 flex flex-col items-end">
                        <span className="text-[6px] text-white/30 uppercase tracking-[0.2em]">Ideal Scale</span>
                        <span className="text-[8px] text-[#A67C52] uppercase tracking-[0.1em] font-bold">3840 x 2160 PX</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
