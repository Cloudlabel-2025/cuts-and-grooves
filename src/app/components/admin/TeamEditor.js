'use client';

import { useState, useEffect, useCallback } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';
import { Loader, EditorHeader } from './EditorShared';

export default function TeamEditor({ page = 'studio', section = 'team' }) {
    const [content, setContent] = useState({ members: [] });
    const [staged, setStaged] = useState({ members: [] });
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
            const loaded = { members: map.members || [] };
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
                body: JSON.stringify({ page, section, key: 'members', value: staged.members }),
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

    const addItem = () => setStaged(s => ({ ...s, members: [...s.members, { name: 'New Member', role: 'Architect', image: '' }] }));
    const removeItem = i => setStaged(s => ({ ...s, members: s.members.filter((_, idx) => idx !== i) }));
    const updateItem = (i, field, val) => {
        const items = [...staged.members];
        items[i] = { ...items[i], [field]: val };
        setStaged(s => ({ ...s, members: items }));
    };

    if (loading) return <Loader label="Team" />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <EditorHeader
                kicker="Team Section"
                title="Team Members"
                description={`${staged.members.length} member${staged.members.length !== 1 ? 's' : ''} · names, roles & portraits`}
                hasChanges={hasChanges}
                saving={saving}
                onReset={() => setStaged(JSON.parse(JSON.stringify(content)))}
                onSave={handleSave}
                saveLabel="Save Team"
            />

            {/* Status Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Members</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.members.length}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>With Portraits</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.members.filter(m => m.image).length}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Status</span>
                    <strong style={{ fontSize: '1rem', fontWeight: '700', color: hasChanges ? 'var(--admin-accent)' : '#22c55e' }}>{hasChanges ? 'Unsaved' : 'Saved'}</strong>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
                <div>
                    <span className="admin-kicker" style={{ marginBottom: 0 }}>Roster Ledger</span>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)' }}>{staged.members.length} member{staged.members.length !== 1 ? 's' : ''}</p>
                </div>
                <button type="button" onClick={addItem} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '999px', border: 'none', background: 'var(--admin-text)', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    Add Member
                </button>
            </div>

            {staged.members.length === 0 && (
                <div style={{ padding: '48px', background: '#fff', borderRadius: '16px', border: '1px dashed var(--admin-border)', textAlign: 'center', color: 'var(--admin-muted)', fontSize: '13px' }}>
                    No team members yet. Click &quot;Add Member&quot; to create one.
                </div>
            )}

            {staged.members.map((member, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '18px', border: '1px solid var(--admin-border)', boxShadow: '0 8px 28px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    {/* Card header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid var(--admin-border)', background: 'rgba(250,249,246,0.6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--admin-accent)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '11px', fontWeight: '800' }}>
                                {i + 1}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text)' }}>{member.name || 'Unnamed Member'}</span>
                        </div>
                        <button type="button" onClick={() => removeItem(i)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.04)', color: '#c0392b', cursor: 'pointer', fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" /></svg>
                            Remove
                        </button>
                    </div>

                    {/* Card body */}
                    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '24px', padding: '24px' }}>
                        {/* Image */}
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '10px' }}>Portrait</span>
                            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '1/1', background: '#f4f3ef', border: '1px solid var(--admin-border)' }}>
                                {member.image
                                    ? <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                }
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                >
                                    <CloudinaryUpload folder="studio" onUploadSuccess={url => updateItem(i, 'image', url)} />
                                </div>
                            </div>
                            {member.image && (
                                <button type="button" onClick={() => updateItem(i, 'image', '')} style={{ display: 'block', width: '100%', marginTop: '8px', padding: '8px', borderRadius: '10px', border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.04)', color: '#c0392b', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                                    Remove
                                </button>
                            )}
                        </div>

                        {/* Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '7px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Full Name</label>
                                <input type="text" value={member.name} onChange={e => updateItem(i, 'name', e.target.value)} style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid var(--admin-border)', borderRadius: '12px', background: '#fafaf8', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)' }} placeholder="Priya Kapoor" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '7px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Role / Title</label>
                                <input type="text" value={member.role} onChange={e => updateItem(i, 'role', e.target.value)} style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid var(--admin-border)', borderRadius: '12px', background: '#fafaf8', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)' }} placeholder="Associate Director" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
