'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader, EditorHeader } from './EditorShared';

export default function AwardsEditor({ page = 'studio', section = 'awards' }) {
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

    const totalAwards = staged.items.reduce((sum, g) => sum + g.items.length, 0);

    const addYearGroup = () => setStaged(s => ({ ...s, items: [{ year: new Date().getFullYear().toString(), items: [{ project: 'New Project', contest: '', distinction: '' }] }, ...s.items] }));
    const removeYearGroup = (i) => setStaged(s => ({ ...s, items: s.items.filter((_, idx) => idx !== i) }));
    const updateYear = (i, val) => {
        const items = [...staged.items];
        items[i] = { ...items[i], year: val };
        setStaged(s => ({ ...s, items }));
    };
    const addItemToYear = (gi) => {
        const items = [...staged.items];
        items[gi].items.push({ project: '', contest: '', distinction: '' });
        setStaged(s => ({ ...s, items }));
    };
    const removeItemFromYear = (gi, ii) => {
        const items = [...staged.items];
        items[gi].items = items[gi].items.filter((_, idx) => idx !== ii);
        setStaged(s => ({ ...s, items }));
    };
    const updateItem = (gi, ii, field, val) => {
        const items = [...staged.items];
        items[gi].items[ii] = { ...items[gi].items[ii], [field]: val };
        setStaged(s => ({ ...s, items }));
    };

    if (loading) return <Loader label="Awards" />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <EditorHeader
                kicker="Awards Section"
                title="Awards & Distinctions"
                description={`${staged.items.length} year group${staged.items.length !== 1 ? 's' : ''} · ${totalAwards} total entr${totalAwards !== 1 ? 'ies' : 'y'}`}
                hasChanges={hasChanges}
                saving={saving}
                onReset={() => setStaged(JSON.parse(JSON.stringify(content)))}
                onSave={handleSave}
                saveLabel="Save Awards"
            />

            {/* Status Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Year Groups</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.items.length}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Total Entries</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{totalAwards}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Status</span>
                    <strong style={{ fontSize: '1rem', fontWeight: '700', color: hasChanges ? 'var(--admin-accent)' : '#22c55e' }}>{hasChanges ? 'Unsaved' : 'Saved'}</strong>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
                <div>
                    <span className="admin-kicker" style={{ marginBottom: 0 }}>Accolade Ledger</span>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)' }}>{staged.items.length} year group{staged.items.length !== 1 ? 's' : ''}</p>
                </div>
                <button type="button" onClick={addYearGroup} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '999px', border: 'none', background: 'var(--admin-text)', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    Add Year
                </button>
            </div>

            {staged.items.length === 0 && (
                <div style={{ padding: '48px', background: '#fff', borderRadius: '16px', border: '1px dashed var(--admin-border)', textAlign: 'center', color: 'var(--admin-muted)', fontSize: '13px' }}>
                    No award entries yet. Click &quot;Add Year&quot; to create one.
                </div>
            )}

            {staged.items.map((group, gi) => (
                <div key={gi} style={{ background: '#fff', borderRadius: '18px', border: '1px solid var(--admin-border)', boxShadow: '0 8px 28px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    {/* Card header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid var(--admin-border)', background: 'rgba(250,249,246,0.6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--admin-accent)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '11px', fontWeight: '800' }}>
                                {gi + 1}
                            </div>
                            <input type="text" value={group.year} onChange={e => updateYear(gi, e.target.value)} style={{ fontSize: '14px', fontWeight: '700', color: 'var(--admin-text)', border: 'none', background: 'transparent', outline: 'none', width: '60px', fontFamily: 'inherit' }} />
                            <span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{group.items.length} entr{group.items.length !== 1 ? 'ies' : 'y'}</span>
                        </div>
                        <button type="button" onClick={() => removeYearGroup(gi)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.04)', color: '#c0392b', cursor: 'pointer', fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" /></svg>
                            Remove
                        </button>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {group.items.map((item, ii) => (
                            <div key={ii} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr 40px', gap: '12px', alignItems: 'start', padding: '16px', background: '#fafaf8', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Project</label>
                                    <input type="text" value={item.project} onChange={e => updateItem(gi, ii, 'project', e.target.value)} style={{ width: '100%', height: '36px', padding: '0 10px', border: '1px solid var(--admin-border)', borderRadius: '8px', background: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)' }} placeholder="Project name" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Contest</label>
                                    <input type="text" value={item.contest} onChange={e => updateItem(gi, ii, 'contest', e.target.value)} style={{ width: '100%', height: '36px', padding: '0 10px', border: '1px solid var(--admin-border)', borderRadius: '8px', background: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)' }} placeholder="Award body" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Distinction</label>
                                    <input type="text" value={item.distinction} onChange={e => updateItem(gi, ii, 'distinction', e.target.value)} style={{ width: '100%', height: '36px', padding: '0 10px', border: '1px solid var(--admin-border)', borderRadius: '8px', background: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)' }} placeholder="Finalist / Shortlisted" />
                                </div>
                                <button type="button" onClick={() => removeItemFromYear(gi, ii)} style={{ marginTop: '20px', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.04)', color: '#c0392b', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '14px' }}>
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addItemToYear(gi)} style={{ padding: '12px', borderRadius: '12px', border: '1px dashed var(--admin-border)', background: 'transparent', color: 'var(--admin-muted)', cursor: 'pointer', fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.2s' }}>
                            + Add Entry to {group.year}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
