'use client';

import { useState, useEffect, useCallback } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';
import RichTextEditor from './RichTextEditor';
import { Loader, EditorHeader, FieldCard, inputStyle, focusIn, focusOut } from './EditorShared';

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
};

const charCount = (html) => stripHtml(html).length;

export default function SustainabilityEditor({ page = 'process', section = 'sustainability' }) {
    const [content, setContent] = useState({ image: '', label: '', heading: '' });
    const [staged, setStaged] = useState({ image: '', label: '', heading: '' });
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
            const loaded = { image: map.image || '', label: map.label || '', heading: map.heading || '' };
            setContent(loaded);
            setStaged(loaded);
        } catch { /* silent */ } finally { setLoading(false); }
    };

    const hasChanges = JSON.stringify(content) !== JSON.stringify(staged);

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const key of Object.keys(staged)) {
                if (staged[key] !== content[key]) {
                    await fetch('/api/content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ page, section, key, value: staged[key] }),
                    });
                }
            }
            setContent({ ...staged });
        } catch { alert('Failed to save.'); } finally { setSaving(false); }
    };

    const handleKeyDown = useCallback((e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            if (hasChanges && !saving) handleSave();
        }
        if (e.key === 'Escape' && hasChanges) {
            e.preventDefault();
            setStaged({ ...content });
        }
    }, [hasChanges, saving, content]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (loading) return <Loader label="Sustainability" />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <EditorHeader
                kicker="Sustainability Section"
                title="Sticky Impact Feature"
                description="Full-screen background image with overlay label and heading."
                hasChanges={hasChanges}
                saving={saving}
                onReset={() => setStaged({ ...content })}
                onSave={handleSave}
                saveLabel="Save Sustainability"
            />

            {/* Status Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Label</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.label.length}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--admin-muted)', marginLeft: '4px' }}>chars</span>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Heading</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{charCount(staged.heading)}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--admin-muted)', marginLeft: '4px' }}>chars</span>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Image</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.image ? 'Set' : 'None'}</strong>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Text fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <FieldCard label="Section Label" hint="Small kicker above heading">
                        <input
                            type="text"
                            value={staged.label}
                            onChange={e => setStaged(s => ({ ...s, label: e.target.value }))}
                            style={inputStyle}
                            onFocus={focusIn} onBlur={focusOut}
                            placeholder="Environmental Impact"
                        />
                    </FieldCard>
                    <FieldCard label="Main Heading" hint="Large statement over the image">
                        <RichTextEditor
                            value={staged.heading}
                            onChange={(val) => setStaged(s => ({ ...s, heading: val }))}
                            placeholder="Building with care — for the land..."
                            minHeight="120px"
                        />
                    </FieldCard>
                </div>

                {/* Image */}
                <FieldCard label="Background Image" hint="Sticky full-screen photo">
                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', background: '#f4f3ef', border: '1px solid var(--admin-border)' }}>
                        {staged.image
                            ? <img src={staged.image} alt="Sustainability" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: '12px', color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>No image selected</div>
                        }
                        <div
                            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        >
                            <CloudinaryUpload folder="process" onUploadSuccess={url => setStaged(s => ({ ...s, image: url }))} />
                        </div>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: '11px', color: 'var(--admin-muted)', textAlign: 'center' }}>Hover image to upload a new background</p>
                    {staged.image && (
                        <button
                            type="button"
                            onClick={() => setStaged(s => ({ ...s, image: '' }))}
                            style={{ display: 'block', width: '100%', marginTop: '8px', padding: '9px', borderRadius: '10px', border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.04)', color: '#c0392b', cursor: 'pointer', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                        >Remove Image</button>
                    )}
                </FieldCard>
            </div>
        </div>
    );
}
