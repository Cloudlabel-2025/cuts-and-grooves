'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';

const DEFAULT_SCATTER_IMAGES = [
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', x: '5%', y: '10%', w: '18vw', h: '30vh', speed: 0.15, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80', x: '80%', y: '15%', w: '15vw', h: '25vh', speed: 0.2, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', x: '15%', y: '60%', w: '20vw', h: '28vh', speed: 0.4, z: 5 },
    { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80', x: '70%', y: '50%', w: '16vw', h: '32vh', speed: 0.5, z: 5 },
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', x: '-5%', y: '40%', w: '22vw', h: '35vh', speed: 1.0, z: 15 },
    { src: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80', x: '85%', y: '70%', w: '25vw', h: '40vh', speed: 0.9, z: 15 },
    { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=400&q=80', x: '25%', y: '90%', w: '10vw', h: '14vh', speed: 0.8, z: 12 },
    { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80', x: '10%', y: '-10%', w: '14vw', h: '20vh', speed: 0.6, z: 3 },
    { src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80', x: '60%', y: '-5%', w: '13vw', h: '19vh', speed: 0.7, z: 4 },
    { src: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=600&q=80', x: '90%', y: '40%', w: '14vw', h: '22vh', speed: 0.5, z: 2 },
    { src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', x: '35%', y: '110%', w: '16vw', h: '24vh', speed: 1.1, z: 14 },
    { src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80', x: '5%', y: '80%', w: '12vw', h: '16vh', speed: 0.4, z: 6 },
    { src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', x: '50%', y: '70%', w: '9vw', h: '12vh', speed: 0.25, z: 2 },
    { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80', x: '75%', y: '95%', w: '14vw', h: '18vh', speed: 0.85, z: 13 },
];

const DEFAULT_MOBILE_SCATTER_IMAGES = [
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', x: '5%', y: '10%', w: '40vw', h: '20vh', speed: 0.15, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80', x: '55%', y: '15%', w: '35vw', h: '15vh', speed: 0.2, z: 1 },
    { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', x: '10%', y: '45%', w: '45vw', h: '20vh', speed: 0.4, z: 5 },
    { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80', x: '50%', y: '65%', w: '35vw', h: '25vh', speed: 0.5, z: 5 },
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', x: '-10%', y: '30%', w: '50vw', h: '25vh', speed: 1.0, z: 15 },
    { src: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80', x: '60%', y: '75%', w: '45vw', h: '30vh', speed: 0.9, z: 15 },
];

const DEFAULT_VISION_ITEMS = [
    { title: 'Design integrity', desc: 'At the core of every structure lies intention.We integrate advanced research and evolving technology with a distinctly human sensibility — because innovation without intuition is incomplete.Our process challenges convention, tests boundaries, and explores possibilities beyond the expected. Each solution is thoughtfully engineered, creatively envisioned, and uncompromising in execution.' },
    { title: 'Innovation', desc: 'We combine rigorous research, advanced technology, and refined craftsmanship to redefine what’s possible. Yet we believe true innovation is not purely technical — it is human.Every breakthrough we pursue is guided by insight, experience, and an uncompromising pursuit of better solutions. We challenge limits, rethink conventions, and transform complexity into clarity.Because progress is not about change for the sake of it — it is about building smarter, stronger, and ahead of time.' },
    { title: 'Enhanced Living', desc: 'Well-being is not an afterthought — it is the foundation. We design spaces that elevate everyday life, where light, proportion, material, and flow work in harmony. Every environment is thoughtfully crafted to encourage connection, comfort, and clarity. Our approach goes beyond structure. We create living experiences — spaces that nurture balance, inspire interaction, and enhance the rhythm of modern life.' }
];

export default function AllWorksMediaEditor({ page = 'home', section = 'all-works' }) {
    const [transitionImage, setTransitionImage] = useState('');
    const [stagedTransitionImage, setStagedTransitionImage] = useState('');
    const [scatterImages, setScatterImages] = useState([]);
    const [stagedScatterImages, setStagedScatterImages] = useState([]);
    const [mobileScatterImages, setMobileScatterImages] = useState([]);
    const [stagedMobileScatterImages, setStagedMobileScatterImages] = useState([]);
    const [heading, setHeading] = useState('All Work');
    const [stagedHeading, setStagedHeading] = useState('All Work');
    const [visionItems, setVisionItems] = useState(DEFAULT_VISION_ITEMS);
    const [stagedVisionItems, setStagedVisionItems] = useState(DEFAULT_VISION_ITEMS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('transition');
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch(`/api/content?page=${page}&section=${section}`);
            const data = await res.json();
            const contentMap = {};
            data.forEach(item => {
                contentMap[item.key] = item.value;
            });

            const loadedTransition = contentMap.transitionImage || '/images/All-works-01.jpg';
            setTransitionImage(loadedTransition);
            setStagedTransitionImage(loadedTransition);

            const loadedScatter = contentMap.scatterImages
                ? (typeof contentMap.scatterImages === 'string' ? JSON.parse(contentMap.scatterImages) : contentMap.scatterImages)
                : DEFAULT_SCATTER_IMAGES;
            setScatterImages(loadedScatter);
            setStagedScatterImages(JSON.parse(JSON.stringify(loadedScatter)));

            const loadedMobileScatter = contentMap.mobileScatterImages
                ? (typeof contentMap.mobileScatterImages === 'string' ? JSON.parse(contentMap.mobileScatterImages) : contentMap.mobileScatterImages)
                : DEFAULT_MOBILE_SCATTER_IMAGES;
            setMobileScatterImages(loadedMobileScatter);
            setStagedMobileScatterImages(JSON.parse(JSON.stringify(loadedMobileScatter)));

            const loadedHeading = contentMap.heading || 'All Work';
            setHeading(loadedHeading);
            setStagedHeading(loadedHeading);

            const loadedVision = contentMap.visionItems
                ? (typeof contentMap.visionItems === 'string' ? JSON.parse(contentMap.visionItems) : contentMap.visionItems)
                : DEFAULT_VISION_ITEMS;
            setVisionItems(loadedVision);
            setStagedVisionItems(JSON.parse(JSON.stringify(loadedVision)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges =
        stagedTransitionImage !== transitionImage ||
        stagedHeading !== heading ||
        JSON.stringify(stagedVisionItems) !== JSON.stringify(visionItems) ||
        JSON.stringify(stagedScatterImages) !== JSON.stringify(scatterImages) ||
        JSON.stringify(stagedMobileScatterImages) !== JSON.stringify(mobileScatterImages);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = [];

            if (stagedTransitionImage !== transitionImage) {
                updates.push(fetch('/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page, section, key: 'transitionImage', value: stagedTransitionImage }),
                }));
            }
            if (JSON.stringify(stagedScatterImages) !== JSON.stringify(scatterImages)) {
                updates.push(fetch('/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page, section, key: 'scatterImages', value: stagedScatterImages }),
                }));
            }
            if (JSON.stringify(stagedMobileScatterImages) !== JSON.stringify(mobileScatterImages)) {
                updates.push(fetch('/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page, section, key: 'mobileScatterImages', value: stagedMobileScatterImages }),
                }));
            }
            if (stagedHeading !== heading) {
                updates.push(fetch('/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page, section, key: 'heading', value: stagedHeading }),
                }));
            }
            if (JSON.stringify(stagedVisionItems) !== JSON.stringify(visionItems)) {
                updates.push(fetch('/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page, section, key: 'visionItems', value: stagedVisionItems }),
                }));
            }

            await Promise.all(updates);
            setTransitionImage(stagedTransitionImage);
            setHeading(stagedHeading);
            setVisionItems(JSON.parse(JSON.stringify(stagedVisionItems)));
            setScatterImages(JSON.parse(JSON.stringify(stagedScatterImages)));
            setMobileScatterImages(JSON.parse(JSON.stringify(stagedMobileScatterImages)));
        } catch (err) {
            console.error(err);
            alert('Failed to save media changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setStagedTransitionImage(transitionImage);
        setStagedHeading(heading);
        setStagedVisionItems(JSON.parse(JSON.stringify(visionItems)));
        setStagedScatterImages(JSON.parse(JSON.stringify(scatterImages)));
        setStagedMobileScatterImages(JSON.parse(JSON.stringify(mobileScatterImages)));
    };

    const updateScatterImage = (index, field, value, isMobile = false) => {
        if (isMobile) {
            const updated = [...stagedMobileScatterImages];
            updated[index] = { ...updated[index], [field]: value };
            setStagedMobileScatterImages(updated);
        } else {
            const updated = [...stagedScatterImages];
            updated[index] = { ...updated[index], [field]: value };
            setStagedScatterImages(updated);
        }
    };

    const removeScatterImage = (index, isMobile = false) => {
        if (isMobile) {
            setStagedMobileScatterImages(stagedMobileScatterImages.filter((_, i) => i !== index));
        } else {
            setStagedScatterImages(stagedScatterImages.filter((_, i) => i !== index));
        }
    };

    const addScatterImage = (isMobile = false) => {
        const newImage = isMobile
            ? { src: '', x: '10%', y: '10%', w: '40vw', h: '20vh', speed: 0.5, z: 5 }
            : { src: '', x: '10%', y: '10%', w: '16vw', h: '24vh', speed: 0.5, z: 5 };
        if (isMobile) {
            setStagedMobileScatterImages([...stagedMobileScatterImages, newImage]);
        } else {
            setStagedScatterImages([...stagedScatterImages, newImage]);
        }
    };

    if (loading) return (
        <div className="flex items-center space-x-4 py-20 opacity-30">
            <div className="w-2 h-2 bg-black animate-bounce"></div>
            <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.3s]"></div>
            <span className="text-[10px] uppercase tracking-[1em] pl-4">Syncing Media Assets</span>
        </div>
    );

    const renderImageList = (images, isMobile) => (
        <div className="space-y-4">
            {images.map((img, index) => (
                <div key={index} className="bg-gray-50/50 border border-gray-100 rounded-[2rem] overflow-hidden transition-all duration-500">
                    {/* Header Row */}
                    <div
                        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedIndex(expandedIndex === `${isMobile ? 'm' : 'd'}-${index}` ? null : `${isMobile ? 'm' : 'd'}-${index}`)}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-white flex-shrink-0">
                                {img.src ? (
                                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200 text-[8px] uppercase font-bold">Empty</div>
                                )}
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">
                                    Image {index + 1}
                                </span>
                                <span className="text-[8px] text-gray-300 block uppercase tracking-widest mt-0.5">
                                    z:{img.z} · speed:{img.speed} · {img.x},{img.y}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeScatterImage(index, isMobile); }}
                                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm"
                            >
                                ×
                            </button>
                            <span className={`text-gray-300 transition-transform duration-300 ${expandedIndex === `${isMobile ? 'm' : 'd'}-${index}` ? 'rotate-180' : ''}`}>
                                ▾
                            </span>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedIndex === `${isMobile ? 'm' : 'd'}-${index}` && (
                        <div className="px-6 pb-6 space-y-6 border-t border-gray-100 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Image Upload */}
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400">Image Source</label>
                                <div className="flex items-center space-x-4">
                                    <CloudinaryUpload
                                        folder="all-works"
                                        onUploadSuccess={(url) => updateScatterImage(index, 'src', url, isMobile)}
                                    />
                                    <span className="text-[8px] text-gray-300 uppercase tracking-widest">or paste url below</span>
                                </div>
                                <input
                                    type="text"
                                    value={img.src}
                                    onChange={(e) => updateScatterImage(index, 'src', e.target.value, isMobile)}
                                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-[#A67C52]/40 focus:ring-4 focus:ring-[#A67C52]/5 text-xs text-gray-700 font-mono"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Position & Size Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { key: 'x', label: 'X Position' },
                                    { key: 'y', label: 'Y Position' },
                                    { key: 'w', label: 'Width' },
                                    { key: 'h', label: 'Height' },
                                    { key: 'speed', label: 'Speed' },
                                    { key: 'z', label: 'Z-Index' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="space-y-2">
                                        <label className="text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400">{label}</label>
                                        <input
                                            type={key === 'speed' || key === 'z' ? 'number' : 'text'}
                                            step={key === 'speed' ? '0.05' : key === 'z' ? '1' : undefined}
                                            value={img[key]}
                                            onChange={(e) => updateScatterImage(index, key, key === 'speed' ? parseFloat(e.target.value) || 0 : key === 'z' ? parseInt(e.target.value) || 0 : e.target.value, isMobile)}
                                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-[#A67C52]/40 text-xs text-gray-700 text-center"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Image preview */}
                            {img.src && (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Add new image button */}
            <button
                type="button"
                onClick={() => addScatterImage(isMobile)}
                className="w-full py-5 border-2 border-dashed border-gray-100 rounded-[2rem] text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold hover:border-[#A67C52] hover:text-[#A67C52] transition-all duration-500 flex items-center justify-center space-x-3"
            >
                <span className="text-lg">+</span>
                <span>Add Image Node</span>
            </button>
        </div>
    );

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end pb-8 border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-extralight tracking-[0.3em] uppercase mb-3">Visual Assets</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-[1px] bg-[#A67C52]"></div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Manage scatter images and transition media</p>
                    </div>
                </div>
                <div className="flex items-center space-x-8">
                    {hasChanges && (
                        <div className="flex items-center space-x-3 text-[10px] text-[#A67C52] font-bold uppercase tracking-[0.3em]">
                            <span className="w-2 h-2 bg-[#A67C52] rounded-full animate-pulse"></span>
                            <span>Unsaved Changes</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-50 p-1.5 rounded-2xl">
                {[
                    { id: 'transition', label: 'Transition Image' },
                    { id: 'desktop', label: `Desktop Scatter (${stagedScatterImages.length})` },
                    { id: 'mobile', label: `Mobile Scatter (${stagedMobileScatterImages.length})` },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 text-[10px] uppercase tracking-[0.3em] font-bold rounded-xl transition-all duration-500 ${activeTab === tab.id
                            ? 'bg-white text-black shadow-lg'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white p-8 md:p-12 border border-gray-100 rounded-[3rem] shadow-[0_50px_150px_-50px_rgba(0,0,0,0.05)]">
                {activeTab === 'transition' && (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">
                                Portal Transition Image
                            </label>
                            <p className="text-[9px] text-gray-300 uppercase tracking-[0.2em]">
                                This image appears during the &quot;All Work&quot; portal zoom transition. Recommended: 1920×1080 or larger.
                            </p>
                        </div>

                        {/* Preview */}
                        <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-gray-100 bg-gray-50 group">
                            {stagedTransitionImage && (
                                <img src={stagedTransitionImage} alt="Transition preview" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.4em] text-white font-bold mb-2">Replace Transition Image</span>
                                <CloudinaryUpload
                                    folder="all-works"
                                    onUploadSuccess={(url) => setStagedTransitionImage(url)}
                                />
                                {stagedTransitionImage !== '/images/All-works-01.jpg' && (
                                    <button
                                        onClick={() => setStagedTransitionImage('/images/All-works-01.jpg')}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest font-bold hover:bg-red-600 hover:border-red-600 transition-all"
                                    >
                                        Restore Default
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] text-center font-medium italic">
                            Hover to access media uplink
                        </p>

                        <div className="pt-12 space-y-12 border-t border-gray-100 mt-12">
                            <div>
                                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-6">Text Content</h3>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400">Section Heading</label>
                                        <input
                                            type="text"
                                            value={stagedHeading}
                                            onChange={(e) => setStagedHeading(e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#A67C52]/40 text-xs text-gray-700"
                                        />
                                    </div>

                                    {stagedVisionItems.map((item, idx) => (
                                        <div key={idx} className="space-y-4 pt-6 first:pt-0">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#A67C52]"></div>
                                                <label className="text-[9px] uppercase tracking-[0.4em] font-bold text-gray-600">Vision Step {idx + 1}</label>
                                            </div>
                                            <div className="space-y-3 pl-4">
                                                <div className="space-y-2">
                                                    <label className="text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400">Title</label>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => {
                                                            const newItems = [...stagedVisionItems];
                                                            newItems[idx].title = e.target.value;
                                                            setStagedVisionItems(newItems);
                                                        }}
                                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-[#A67C52]/40 text-xs text-gray-700 font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[8px] uppercase tracking-[0.3em] font-bold text-gray-400">Description</label>
                                                    <textarea
                                                        value={item.desc}
                                                        onChange={(e) => {
                                                            const newItems = [...stagedVisionItems];
                                                            newItems[idx].desc = e.target.value;
                                                            setStagedVisionItems(newItems);
                                                        }}
                                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-[#A67C52]/40 text-xs text-gray-700 leading-relaxed h-32 resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'desktop' && renderImageList(stagedScatterImages, false)}
                {activeTab === 'mobile' && renderImageList(stagedMobileScatterImages, true)}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        className={`px-12 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.5em] transition-all duration-500 shadow-xl ${hasChanges && !saving
                            ? 'bg-black text-white hover:bg-[#A67C52] shadow-black/20'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {saving ? 'Syncing...' : 'Finalize Media'}
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
                <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-amber-400' : 'bg-green-500'}`}></div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                        {hasChanges ? 'Pending Synchronization' : 'Fully Synchronized'}
                    </span>
                </div>
            </div>
        </div>
    );
}
