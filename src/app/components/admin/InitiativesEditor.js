'use client';

import { useState, useEffect, useCallback } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';
import RichTextEditor from './RichTextEditor';
import { Loader, EditorHeader, FieldCard, textareaStyle, inputStyle, focusIn, focusOut, primaryBtn } from './EditorShared';

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
};

const charCount = (html) => stripHtml(html).length;

export default function InitiativesEditor({ page = 'process', section = 'initiatives' }) {
    const [content, setContent] = useState({ label: '', heading: '', items: [] });
    const [staged, setStaged] = useState({ label: '', heading: '', items: [] });
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
            const loaded = { label: map.label || '', heading: map.heading || '', items: map.items || [] };
            setContent(loaded);
            setStaged(JSON.parse(JSON.stringify(loaded)));
        } catch { /* silent */ } finally { setLoading(false); }
    };

    const hasChanges = JSON.stringify(content) !== JSON.stringify(staged);

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const key of Object.keys(staged)) {
                if (JSON.stringify(staged[key]) !== JSON.stringify(content[key])) {
                    await fetch('/api/content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ page, section, key, value: staged[key] }),
                    });
                }
            }
            setContent(JSON.parse(JSON.stringify(staged)));
        } catch { alert('Failed to save.'); } finally { setSaving(false); }
    };

    const handleKeyDown = useCallback((e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            if (hasChanges && !saving) handleSave();
        }
        if (e.key === 'Escape' && hasChanges) {
            e.preventDefault();
            setStaged(JSON.parse(JSON.stringify(content)));
        }
    }, [hasChanges, saving, content]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const updateItem = (i, field, val) => {
        const items = [...staged.items];
        items[i] = { ...items[i], [field]: val };
        setStaged(s => ({ ...s, items }));
    };

    const addItem = () => setStaged(s => ({ ...s, items: [...s.items, { title: 'New Initiative', subtitle: '', description: '', image: '' }] }));
    const removeItem = i => setStaged(s => ({ ...s, items: s.items.filter((_, idx) => idx !== i) }));

    const totalChars = staged.items.reduce((sum, item) => sum + charCount(item.subtitle) + charCount(item.description), 0);

    if (loading) return <Loader label="Initiatives" />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <EditorHeader
                kicker="Initiatives Section"
                title="Conviction-Driven Actions"
                description={`${staged.items.length} initiative${staged.items.length !== 1 ? 's' : ''} · section label & heading`}
                hasChanges={hasChanges}
                saving={saving}
                onReset={() => setStaged(JSON.parse(JSON.stringify(content)))}
                onSave={handleSave}
                saveLabel="Save Initiatives"
            />

            {/* Status Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Initiatives</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.items.length}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Label</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.label.length}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--admin-muted)', marginLeft: '4px' }}>chars</span>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Heading</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.heading.length}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--admin-muted)', marginLeft: '4px' }}>chars</span>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Story Text</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{totalChars}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--admin-muted)', marginLeft: '4px' }}>chars</span>
                </div>
            </div>

            {/* Section meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FieldCard label="Section Label" hint="Small kicker">
                    <input type="text" value={staged.label}
                        onChange={e => setStaged(s => ({ ...s, label: e.target.value }))}
                        style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                        placeholder="Our Initiatives" />
                </FieldCard>
                <FieldCard label="Main Heading" hint="Large title above the cards">
                    <input type="text" value={staged.heading}
                        onChange={e => setStaged(s => ({ ...s, heading: e.target.value }))}
                        style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                        placeholder="Driven by conviction, proven through action." />
                </FieldCard>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
                <div>
                    <span className="admin-kicker" style={{ marginBottom: 0 }}>Initiative Registry</span>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)' }}>{staged.items.length} item{staged.items.length !== 1 ? 's' : ''}</p>
                </div>
                <button type="button" onClick={addItem} style={{ ...primaryBtn, padding: '10px 20px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    Add Initiative
                </button>
            </div>

            {staged.items.length === 0 && (
                <div style={{ padding: '48px', background: '#fff', borderRadius: '16px', border: '1px dashed var(--admin-border)', textAlign: 'center', color: 'var(--admin-muted)', fontSize: '13px' }}>
                    No initiatives yet. Click &quot;Add Initiative&quot; to create one.
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
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text)' }}>{item.title || 'Untitled Initiative'}</span>
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
                            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '10px' }}>Image</span>
                            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/5', background: '#f4f3ef', border: '1px solid var(--admin-border)' }}>
                                {item.image
                                    ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                                      </div>
                                }
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                >
                                    <CloudinaryUpload folder="process" onUploadSuccess={url => updateItem(i, 'image', url)} />
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
                                <label style={labelStyle}>Title</label>
                                <input type="text" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} style={inputStyle} onFocus={focusIn} onBlur={focusOut} placeholder="Sustainability Action Plan" />
                            </div>
                            <div>
                                <label style={labelStyle}>Subtitle</label>
                                <RichTextEditor
                                    value={item.subtitle}
                                    onChange={(val) => updateItem(i, 'subtitle', val)}
                                    placeholder="Driven by purpose and guided by values..."
                                    minHeight="100px"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Description</label>
                                <RichTextEditor
                                    value={item.description}
                                    onChange={(val) => updateItem(i, 'description', val)}
                                    placeholder="We believe architecture & design can strengthen..."
                                    minHeight="140px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const labelStyle = {
    display: 'block', marginBottom: '7px',
    fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--admin-muted)',
};
