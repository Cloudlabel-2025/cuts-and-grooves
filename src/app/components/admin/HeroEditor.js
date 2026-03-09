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
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        fetchHeroContent();
    }, []);

    const fetchHeroContent = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const res = await fetch(`/api/content?page=${page}&section=${section}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error('Failed to fetch');
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
            console.error('Failed to fetch content:', err);
            const defaultContent = {
                title: "We Make Your Livin' Better",
                subtitle: "Architectural Excellence & Interior Innovation",
                videoUrl: "/videos/hero-bg.mp4"
            };
            setContent(defaultContent);
            setStagedContent(defaultContent);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '80px', paddingBottom: '80px', opacity: 0.3 }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></div>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '-0.2s' }}></div>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '-0.4s' }}></div>
            <span style={{ fontSize: '10px', letterSpacing: '0.1em', paddingLeft: '16px', textTransform: 'uppercase', fontWeight: '600' }}>Loading</span>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <div>
                    <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '16px', margin: 0 }}>
                        Hero Section
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '32px', height: '1px', backgroundColor: '#000000' }}></div>
                        <p style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                            Manage background video, heading and subtitle
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {hasChanges && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px', color: '#000000', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', animation: 'fadeIn 0.5s ease' }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                            <span>Unsaved Changes</span>
                        </div>
                    )}
                    {saving && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px', color: '#000000', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', animation: 'pulse 1s infinite' }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%' }}></span>
                            <span>Saving...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
                {/* Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '8px', paddingRight: '8px' }}>
                        <h3 style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', fontWeight: '700', textTransform: 'uppercase', margin: 0 }}>
                            Preview
                        </h3>
                        <span style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', fontWeight: '600' }}>Live</span>
                    </div>
                    <div style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.1)',
                        backgroundColor: '#000000',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {stagedContent.videoUrl && stagedContent.videoUrl.startsWith('http') ? (
                            <video
                                key={stagedContent.videoUrl}
                                autoPlay muted loop playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                            >
                                <source src={stagedContent.videoUrl} type="video/mp4" />
                            </video>
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                <div style={{ fontSize: '48px' }}>🎬</div>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>Upload video to preview</p>
                            </div>
                        )}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                            pointerEvents: 'none'
                        }}></div>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '48px',
                            textAlign: 'center',
                            pointerEvents: 'none'
                        }}>
                            <h2 style={{
                                fontSize: '28px',
                                fontWeight: '300',
                                letterSpacing: '-0.01em',
                                color: '#ffffff',
                                marginBottom: '16px',
                                lineHeight: 1.3,
                                textShadow: '0 4px 12px rgba(0,0,0,0.3)'
                            }} dangerouslySetInnerHTML={{ __html: stagedContent.title }}></h2>
                            <p style={{
                                fontSize: '12px',
                                letterSpacing: '0.1em',
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}>
                            </p>
                        </div>

                        {/* Upload Overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isHovered ? 1 : 0,
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            pointerEvents: isHovered ? 'auto' : 'none',
                            backdropFilter: 'blur(8px)'
                        }}>
                            <div style={{
                                transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                transitionDelay: '0.1s'
                            }}>
                                <CloudinaryUpload
                                    folder="hero"
                                    onUploadSuccess={(url) => setStagedContent({ ...stagedContent, videoUrl: url })}
                                />
                            </div>
                        </div>
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', letterSpacing: '0.05em', textAlign: 'center', fontWeight: '500', textTransform: 'uppercase', margin: 0 }}>
                        Hover to upload new media
                    </p>
                </div>

                {/* Form Controls */}
                <div style={{
                    backgroundColor: '#ffffff',
                    padding: '48px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '48px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                        {/* Title Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '16px', paddingRight: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', margin: 0 }}>
                                    Main Heading (HTML supported)
                                </label>
                                <span style={{ width: '6px', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '50%' }}></span>
                            </div>
                            <textarea
                                style={{
                                    width: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    letterSpacing: '-0.01em',
                                    color: '#000000',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    height: '120px',
                                    resize: 'none',
                                    fontFamily: 'inherit'
                                }}
                                value={stagedContent.title}
                                onChange={(e) => setStagedContent({ ...stagedContent, title: e.target.value })}
                                onFocus={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                                }}
                            />
                        </div>

                        {/* Subtitle Input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '16px', paddingRight: '16px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', margin: 0 }}>
                                    Subtitle
                                </label>
                                <span style={{ width: '6px', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '50%' }}></span>
                            </div>
                            <input
                                type="text"
                                style={{
                                    width: '100%',
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    letterSpacing: '-0.01em',
                                    color: '#000000',
                                    fontFamily: 'inherit'
                                }}
                                value={stagedContent.subtitle}
                                onChange={(e) => setStagedContent({ ...stagedContent, subtitle: e.target.value })}
                                onFocus={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                                }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                onClick={handleSaveAll}
                                disabled={!hasChanges || saving}
                                style={{
                                    flex: 1,
                                    paddingLeft: '24px',
                                    paddingRight: '24px',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s ease',
                                    border: 'none',
                                    cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
                                    backgroundColor: hasChanges && !saving ? '#000000' : 'rgba(0,0,0,0.1)',
                                    color: hasChanges && !saving ? '#ffffff' : 'rgba(0,0,0,0.3)'
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            {hasChanges && !saving && (
                                <button
                                    onClick={handleReset}
                                    style={{
                                        paddingLeft: '24px',
                                        paddingRight: '24px',
                                        paddingTop: '12px',
                                        paddingBottom: '12px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        color: '#ff4444',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#ffffff';
                                    }}
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: hasChanges ? '#ff9800' : '#4caf50'
                                }}></div>
                                <span style={{ fontSize: '10px', letterSpacing: '0.05em', color: 'rgba(0,0,0,0.5)', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                                    {hasChanges ? 'Unsaved changes' : 'All saved'}
                                </span>
                            </div>
                            <span style={{ fontSize: '9px', letterSpacing: '0.05em', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase' }}>HERO_V1</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
