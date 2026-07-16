'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/app/components/admin/Toast';

export default function MediaLibrary() {
    const [files, setFiles] = useState([]);
    const [uploadQueue, setUploadQueue] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const toast = useToast();

    const [assets, setAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(true);
    const [assetError, setAssetError] = useState(null);

    const fetchAssets = useCallback(async () => {
        setLoadingAssets(true);
        setAssetError(null);
        try {
            const res = await fetch('/api/cloudinary/assets');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch assets');
            setAssets(data.resources || []);
        } catch (err) {
            console.error(err);
            setAssetError(err.message);
        } finally {
            setLoadingAssets(false);
        }
    }, []);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const addFiles = useCallback((newFiles) => {
        const entries = Array.from(newFiles).map(f => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            file: f,
            name: f.name,
            size: f.size,
            type: f.type,
            progress: 0,
            status: 'pending',
            url: null,
            preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
        }));
        setUploadQueue(prev => [...prev, ...entries]);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [addFiles]);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
    const handleDragLeave = () => setIsDragOver(false);

    const uploadFile = async (entry) => {
        const formData = new FormData();
        formData.append('file', entry.file);
        formData.append('folder', 'media');

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/cloudinary/upload');

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const pct = Math.round((e.loaded / e.total) * 100);
                    setUploadQueue(prev => prev.map(item =>
                        item.id === entry.id ? { ...item, progress: pct, status: 'uploading' } : item
                    ));
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    setUploadQueue(prev => prev.map(item =>
                        item.id === entry.id ? { ...item, progress: 100, status: 'done', url: data.secure_url } : item
                    ));
                    setAssets(prev => [{
                        asset_id: data.asset_id || data.public_id,
                        public_id: data.public_id,
                        format: data.format,
                        resource_type: data.resource_type,
                        secure_url: data.secure_url,
                        created_at: data.created_at,
                    }, ...prev]);
                    resolve(data.secure_url);
                } else {
                    setUploadQueue(prev => prev.map(item =>
                        item.id === entry.id ? { ...item, status: 'error' } : item
                    ));
                    reject(new Error('Upload failed'));
                }
            };

            xhr.onerror = () => {
                setUploadQueue(prev => prev.map(item =>
                    item.id === entry.id ? { ...item, status: 'error' } : item
                ));
                reject(new Error('Network error'));
            };

            xhr.send(formData);
        });
    };

    const uploadAll = async () => {
        const pending = uploadQueue.filter(e => e.status === 'pending');
        if (pending.length === 0) { toast('No pending files to upload.', 'warning'); return; }

        let success = 0;
        let failed = 0;
        for (const entry of pending) {
            try {
                await uploadFile(entry);
                success++;
            } catch {
                failed++;
            }
        }
        if (success > 0) toast(`${success} file${success > 1 ? 's' : ''} uploaded successfully`);
        if (failed > 0) toast(`${failed} upload${failed > 1 ? 's' : ''} failed`, 'error');
    };

    const removeFromQueue = (id) => {
        setUploadQueue(prev => prev.filter(e => e.id !== id));
    };

    const clearQueue = () => {
        if (uploadQueue.some(e => e.status === 'uploading')) {
            toast('Cannot clear while uploading.', 'warning');
            return;
        }
        setUploadQueue([]);
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    };

    const pendingCount = uploadQueue.filter(e => e.status === 'pending').length;
    const doneCount = uploadQueue.filter(e => e.status === 'done').length;
    const uploadingCount = uploadQueue.filter(e => e.status === 'uploading').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)',
                flexWrap: 'wrap', gap: '16px',
            }}>
                <div>
                    <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', color: '#000', margin: 0 }}>
                        Media Library
                    </h1>
                    <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', margin: '8px 0 0' }}>
                        Upload, manage, and organize your image and video assets.
                    </p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        padding: '12px 28px', background: '#000', color: '#fff',
                        border: 'none', borderRadius: '999px', cursor: 'pointer',
                        fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em',
                        textTransform: 'uppercase', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                    onMouseLeave={e => e.currentTarget.style.background = '#000'}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    Upload Media
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={e => { if (e.target.files.length) addFiles(e.target.files); e.target.value = ''; }}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    background: isDragOver ? 'rgba(0,0,0,0.03)' : '#fff',
                    border: `2px dashed ${isDragOver ? '#000' : 'rgba(0,0,0,0.15)'}`,
                    borderRadius: '20px', padding: '48px 32px',
                    textAlign: 'center', cursor: 'pointer',
                    transition: 'all 0.3s ease', position: 'relative',
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '16px',
                        background: isDragOver ? '#000' : 'rgba(0,0,0,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragOver ? '#fff' : 'rgba(0,0,0,0.3)'} strokeWidth="1.8">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: isDragOver ? '#000' : 'rgba(0,0,0,0.6)' }}>
                            {isDragOver ? 'Drop files here' : 'Drag & drop files or click to browse'}
                        </p>
                        <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'rgba(0,0,0,0.4)' }}>
                            Supports images, videos, and documents
                        </p>
                    </div>
                </div>
            </div>

            {/* Upload Queue */}
            {uploadQueue.length > 0 && (
                <div style={{
                    background: '#fff', borderRadius: '20px',
                    border: '1px solid var(--admin-border)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '20px 24px', borderBottom: '1px solid var(--admin-border)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: '12px',
                    }}>
                        <div>
                            <span className="admin-kicker">Upload Queue</span>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>
                                {uploadQueue.length} file{uploadQueue.length !== 1 ? 's' : ''}
                                {doneCount > 0 && ` · ${doneCount} done`}
                                {uploadingCount > 0 && ` · ${uploadingCount} uploading`}
                                {pendingCount > 0 && ` · ${pendingCount} pending`}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {pendingCount > 0 && (
                                <button onClick={uploadAll} style={{
                                    padding: '10px 20px', background: '#000', color: '#fff',
                                    border: 'none', borderRadius: '999px', cursor: 'pointer',
                                    fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em',
                                    textTransform: 'uppercase', transition: 'all 0.2s ease',
                                }}>
                                    Upload {pendingCount > 0 ? `${pendingCount} file${pendingCount > 1 ? 's' : ''}` : 'All'}
                                </button>
                            )}
                            <button onClick={clearQueue} style={{
                                padding: '10px 20px', background: 'transparent', color: '#000',
                                border: '1px solid var(--admin-border)', borderRadius: '999px', cursor: 'pointer',
                                fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em',
                                textTransform: 'uppercase', transition: 'all 0.2s ease',
                            }}>
                                Clear
                            </button>
                        </div>
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                        {uploadQueue.map(entry => (
                            <div key={entry.id} style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '12px 16px', borderRadius: '12px',
                                background: entry.status === 'error' ? 'rgba(211,47,47,0.04)' :
                                    entry.status === 'done' ? 'rgba(46,125,50,0.04)' :
                                    entry.status === 'uploading' ? 'rgba(0,0,0,0.02)' : 'transparent',
                                border: `1px solid ${
                                    entry.status === 'error' ? 'rgba(211,47,47,0.15)' :
                                    entry.status === 'done' ? 'rgba(46,125,50,0.15)' :
                                    'var(--admin-border)'
                                }`,
                            }}>
                                {/* Thumbnail */}
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '8px',
                                    background: '#f4f3ef', overflow: 'hidden', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {entry.preview
                                        ? <img src={entry.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                                    }
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {entry.name}
                                    </p>
                                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--admin-muted)' }}>
                                        {formatSize(entry.size)}
                                        {entry.status === 'done' && ' · Uploaded'}
                                        {entry.status === 'error' && ' · Failed'}
                                    </p>
                                </div>

                                {/* Status */}
                                <div style={{ flexShrink: 0, minWidth: '120px' }}>
                                    {entry.status === 'uploading' ? (
                                        <div style={{
                                            height: '6px', borderRadius: '3px', background: 'var(--admin-border)',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                height: '100%', borderRadius: '3px', background: '#000',
                                                width: `${entry.progress}%`, transition: 'width 0.3s ease',
                                            }} />
                                        </div>
                                    ) : entry.status === 'done' ? (
                                        <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: '700' }}>✓ Done</span>
                                    ) : entry.status === 'error' ? (
                                        <span style={{ fontSize: '12px', color: '#d32f2f', fontWeight: '700' }}>✕ Failed</span>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: 'var(--admin-muted)', fontWeight: '600' }}>Pending</span>
                                    )}
                                </div>

                                {/* Remove button */}
                                {entry.status !== 'uploading' && (
                                    <button onClick={() => removeFromQueue(entry.id)} style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: '16px', color: 'rgba(0,0,0,0.3)', padding: '4px',
                                    }}>✕</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Assets Section */}
            <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '13px', letterSpacing: '0.1em', fontWeight: '700', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: 0 }}>
                        Recent Assets
                    </h2>
                    <span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>Cloudinary-powered</span>
                </div>

                {loadingAssets ? (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--admin-muted)', fontSize: '13px' }}>
                        Loading assets...
                    </div>
                ) : assetError ? (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: '#d32f2f', fontSize: '13px', background: 'rgba(211,47,47,0.05)', borderRadius: '12px' }}>
                        {assetError}
                        <br/><br/>
                        <span style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>Make sure CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set in your .env.local file.</span>
                    </div>
                ) : assets.length === 0 ? (
                    <div style={{ padding: '80px 0', textAlign: 'center', background: '#fafaf8', borderRadius: '16px', border: '1px dashed var(--admin-border)' }}>
                        <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '13px' }}>No assets found in the Cloudinary media folder.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: '16px'
                    }}>
                        {assets.map(asset => (
                            <MediaCard 
                                key={asset.public_id} 
                                asset={asset} 
                                onDelete={(id) => setAssets(prev => prev.filter(a => a.public_id !== id))} 
                            />
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

function MediaCard({ asset, onDelete }) {
    const [showActions, setShowActions] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this asset from Cloudinary?')) return;
        setDeleting(true);
        try {
            const res = await fetch('/api/cloudinary/assets', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_id: asset.public_id })
            });
            if (!res.ok) throw new Error('Delete failed');
            onDelete(asset.public_id);
        } catch (err) {
            console.error(err);
            alert('Failed to delete asset');
            setDeleting(false);
        }
    };

    const isVideo = asset.resource_type === 'video';

    return (
        <div
            style={{
                aspectRatio: '1',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                opacity: deleting ? 0.5 : 1,
            }}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {isVideo ? (
                    <video 
                        src={asset.secure_url} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        muted loop playsInline
                        onMouseEnter={e => e.target.play()} 
                        onMouseLeave={e => e.target.pause()} 
                    />
                ) : (
                    <img 
                        src={asset.secure_url} 
                        alt={asset.public_id} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                )}

                {showActions && !deleting && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px',
                        animation: 'fadeIn 0.2s ease'
                    }}>
                        <button style={{
                            width: '100%', padding: '8px 12px', backgroundColor: '#fff',
                            color: '#000', border: 'none', borderRadius: '6px',
                            fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                        }}
                            onClick={() => window.open(asset.secure_url, '_blank')}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.85)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
                        >View Full</button>
                        <button style={{
                            width: '100%', padding: '8px 12px',
                            backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px',
                            fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                        }}
                            onClick={handleDelete}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d32f2f'; e.currentTarget.style.borderColor = '#d32f2f'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        >Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}
