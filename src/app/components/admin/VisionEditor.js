'use client';

import { useState, useEffect, useCallback } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';
import { Loader, EditorHeader } from './EditorShared';

export default function VisionEditor({ page = 'studio', section = 'vision' }) {
    const [content, setContent] = useState({ items: [] });
    const [staged, setStaged] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch(`/api/content?page=${page}&section=${section}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            const map = {};
            data.forEach(i => { map[i.key] = i.value; });
            const loaded = { items: map.items || [] };
            setContent(loaded);
            setStaged(JSON.parse(JSON.stringify(loaded)));
        } catch { /* silent */ } finally { setLoading(false); }
    };

    const hasChanges = JSON.stringify(content) !== JSON.stringify(staged);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page, section, key: 'items', value: staged.items }),
            });
            setContent(JSON.parse(JSON.stringify(staged)));
        } catch { alert('Failed to save.'); } finally { setSaving(false); }
    };

    const handleKeyDown = useCallback((e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); if (hasChanges && !saving) handleSave(); }
        if (e.key === 'Escape' && hasChanges) { e.preventDefault(); setStaged(JSON.parse(JSON.stringify(content))); }
    }, [hasChanges, saving, content]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const addItem = () => setStaged(s => ({ ...s, items: [...s.items, { title: 'New Vision Pillar', text: '', image: '' }] }));
    const removeItem = i => setStaged(s => ({ ...s, items: s.items.filter((_, idx) => idx !== i) }));
    const updateItem = (i, field, val) => {
        const items = [...staged.items];
        items[i] = { ...items[i], [field]: val };
        setStaged(s => ({ ...s, items }));
    };

    if (loading) return <Loader label="Vision" />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <EditorHeader
                kicker="Vision Section"
                title="Vision & Innovation"
                description={`${staged.items.length} pillar${staged.items.length !== 1 ? 's' : ''} · accordion content with deep narrative`}
                hasChanges={hasChanges}
                saving={saving}
                onReset={() => setStaged(JSON.parse(JSON.stringify(content)))}
                onSave={handleSave}
                saveLabel="Save Vision"
            />

            {/* Status Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Pillars</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.items.length}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>With Images</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.items.filter(i => i.image).length}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Status</span>
                    <strong style={{ fontSize: '1rem', fontWeight: '700', color: hasChanges ? 'var(--admin-accent)' : '#22c55e' }}>{hasChanges ? 'Unsaved' : 'Saved'}</strong>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
                <div>
                    <span className="admin-kicker" style={{ marginBottom: 0 }}>Vision Registry</span>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)' }}>{staged.items.length} pillar{staged.items.length !== 1 ? 's' : ''}</p>
                </div>
                <button type="button" onClick={addItem} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '999px', border: 'none', background: 'var(--admin-text)', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    Add Pillar
                </button>
            </div>

            {staged.items.length === 0 && (
                <div style={{ padding: '48px', background: '#fff', borderRadius: '16px', border: '1px dashed var(--admin-border)', textAlign: 'center', color: 'var(--admin-muted)', fontSize: '13px' }}>
                    No vision pillars yet. Click &quot;Add Pillar&quot; to create one.
                </div>
            )}

            {staged.items.map((item, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '18px', border: '1px solid var(--admin-border)', boxShadow: '0 8px 28px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    {/* Card header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid var(--admin-border)', background: 'rgba(250,249,246,0.6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--admin-accent)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '11px', fontWeight: '800' }}>
                                {i + 1}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text)' }}>{item.title || 'Untitled Pillar'}</span>
                        </div>
                        <button type="button" onClick={() => removeItem(i)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.04)', color: '#c0392b', cursor: 'pointer', fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" /></svg>
                            Remove
                        </button>
                    </div>

                    {/* Card body */}
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', padding: '24px' }}>
                        {/* Image */}
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '10px' }}>Visual Artifact</span>
                            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/5', background: '#f4f3ef', border: '1px solid var(--admin-border)' }}>
                                {item.image
                                    ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                                    </div>
                                }
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                >
                                    <CloudinaryUpload folder="studio" onUploadSuccess={url => updateItem(i, 'image', url)} />
                                </div>
                            </div>
                            {item.image && (
                                <button type="button" onClick={() => updateItem(i, 'image', '')} style={{ display: 'block', width: '100%', marginTop: '8px', padding: '8px', borderRadius: '10px', border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.04)', color: '#c0392b', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                                    Remove
                                </button>
                            )}
                        </div>

                        {/* Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '7px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Pillar Title</label>
                                <input type="text" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid var(--admin-border)', borderRadius: '12px', background: '#fafaf8', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)' }} placeholder="Design Integrity" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '7px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Deep Narrative</label>
                                <textarea value={item.text} onChange={e => updateItem(i, 'text', e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--admin-border)', borderRadius: '12px', background: '#fafaf8', fontSize: '14px', lineHeight: '1.65', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)', resize: 'vertical', minHeight: '140px' }} placeholder="Integrity is not a stylistic choice..." />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
