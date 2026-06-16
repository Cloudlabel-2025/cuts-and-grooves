'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader, EditorHeader, focusIn, focusOut, primaryBtn } from './EditorShared';

export default function AccreditationsEditor({ page = 'process', section = 'accreditations' }) {
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

    const updateItem = (i, val) => {
        const items = [...staged.items];
        items[i] = val;
        setStaged(s => ({ ...s, items }));
    };

    const totalChars = staged.items.reduce((sum, item) => sum + item.length, 0);

    if (loading) return <Loader label="Accreditations" />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <EditorHeader
                kicker="Accreditations Section"
                title="Certifications & Affiliations"
                description="Industry certifications shown at the bottom of the process page."
                hasChanges={hasChanges}
                saving={saving}
                onReset={() => setStaged(JSON.parse(JSON.stringify(content)))}
                onSave={handleSave}
                saveLabel="Save Accreditations"
            />

            {/* Status Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Total Certifications</span>
                    <strong style={{ fontSize: '1.5rem', lineHeight: 1, fontWeight: '700', color: 'var(--admin-text)' }}>{staged.items.length}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Total Characters</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{totalChars}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Average Length</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.items.length ? Math.round(totalChars / staged.items.length) : 0}</strong>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
                <div>
                    <span className="admin-kicker" style={{ marginBottom: 0 }}>Certification Registry</span>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)' }}>{staged.items.length} certification{staged.items.length !== 1 ? 's' : ''} registered</p>
                </div>
                <button type="button" onClick={() => setStaged(s => ({ ...s, items: [...s.items, ''] }))} style={{ ...primaryBtn, padding: '10px 20px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    Add Certification
                </button>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {staged.items.length === 0 && (
                    <div style={{ padding: '48px', background: '#fff', borderRadius: '16px', border: '1px dashed var(--admin-border)', textAlign: 'center', color: 'var(--admin-muted)', fontSize: '13px' }}>
                        No certifications registered yet.
                    </div>
                )}
                {staged.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(155,116,72,0.1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--admin-accent)" strokeWidth="2"><circle cx="12" cy="8" r="6" /><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" /></svg>
                        </div>
                        <input
                            type="text"
                            value={item}
                            onChange={e => updateItem(i, e.target.value)}
                            placeholder="ISO 9001 CERTIFIED"
                            style={{ flex: 1, height: '40px', padding: '0 14px', border: '1px solid var(--admin-border)', borderRadius: '10px', background: '#fafaf8', fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                            onFocus={focusIn} onBlur={focusOut}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--admin-muted)', flexShrink: 0, minWidth: '28px', textAlign: 'right' }}>{item.length}</span>
                        <button type="button" onClick={() => setStaged(s => ({ ...s, items: s.items.filter((_, idx) => idx !== i) }))}
                            style={{ width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0, border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.04)', color: '#c0392b', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
