'use client';

import { useState, useEffect, useCallback } from 'react';
import RichTextEditor from './RichTextEditor';
import { Loader, EditorHeader, FieldCard } from './EditorShared';

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
};

const charCount = (html) => stripHtml(html).length;

export default function CareersEditor({ page = 'studio', section = 'careers' }) {
    const [content, setContent] = useState({ heading: '', jobs: [] });
    const [staged, setStaged] = useState({ heading: '', jobs: [] });
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
            const loaded = { heading: map.heading || '', jobs: map.jobs || [] };
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
        if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); if (hasChanges && !saving) handleSave(); }
        if (e.key === 'Escape' && hasChanges) { e.preventDefault(); setStaged(JSON.parse(JSON.stringify(content))); }
    }, [hasChanges, saving, content]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const addJob = () => setStaged(s => ({ ...s, jobs: [...s.jobs, { title: 'New Position', type: 'Full-time', location: 'Bengaluru' }] }));
    const removeJob = (i) => setStaged(s => ({ ...s, jobs: s.jobs.filter((_, idx) => idx !== i) }));
    const updateJob = (i, field, val) => {
        const jobs = [...staged.jobs];
        jobs[i] = { ...jobs[i], [field]: val };
        setStaged(s => ({ ...s, jobs }));
    };

    if (loading) return <Loader label="Careers" />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <EditorHeader
                kicker="Careers Section"
                title="Careers & Job Offers"
                description={`${staged.jobs.length} open position${staged.jobs.length !== 1 ? 's' : ''} · recruitment heading & details`}
                hasChanges={hasChanges}
                saving={saving}
                onReset={() => setStaged(JSON.parse(JSON.stringify(content)))}
                onSave={handleSave}
                saveLabel="Save Careers"
            />

            {/* Status Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Heading</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{charCount(staged.heading)}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--admin-muted)', marginLeft: '4px' }}>chars</span>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Open Positions</span>
                    <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{staged.jobs.length}</strong>
                </div>
                <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Status</span>
                    <strong style={{ fontSize: '1rem', fontWeight: '700', color: hasChanges ? 'var(--admin-accent)' : '#22c55e' }}>{hasChanges ? 'Unsaved' : 'Saved'}</strong>
                </div>
            </div>

            {/* Heading */}
            <FieldCard label="Recruitment Heading" hint="Text shown above the position listings">
                <RichTextEditor
                    value={staged.heading}
                    onChange={(val) => setStaged(s => ({ ...s, heading: val }))}
                    placeholder="We are always looking for curious minds..."
                    minHeight="120px"
                />
            </FieldCard>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)' }}>
                <div>
                    <span className="admin-kicker" style={{ marginBottom: 0 }}>Position Registry</span>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)' }}>{staged.jobs.length} position{staged.jobs.length !== 1 ? 's' : ''}</p>
                </div>
                <button type="button" onClick={addJob} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '999px', border: 'none', background: 'var(--admin-text)', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    Add Position
                </button>
            </div>

            {staged.jobs.length === 0 && (
                <div style={{ padding: '48px', background: '#fff', borderRadius: '16px', border: '1px dashed var(--admin-border)', textAlign: 'center', color: 'var(--admin-muted)', fontSize: '13px' }}>
                    No job positions yet. Click &quot;Add Position&quot; to create one.
                </div>
            )}

            {staged.jobs.map((job, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '18px', border: '1px solid var(--admin-border)', boxShadow: '0 8px 28px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    {/* Card header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid var(--admin-border)', background: 'rgba(250,249,246,0.6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--admin-accent)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '11px', fontWeight: '800' }}>
                                {i + 1}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--admin-text)' }}>{job.title || 'Untitled Position'}</span>
                        </div>
                        <button type="button" onClick={() => removeJob(i)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.04)', color: '#c0392b', cursor: 'pointer', fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" /></svg>
                            Remove
                        </button>
                    </div>

                    {/* Card body */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '7px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Position Title</label>
                            <input type="text" value={job.title} onChange={e => updateJob(i, 'title', e.target.value)} style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid var(--admin-border)', borderRadius: '12px', background: '#fafaf8', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)' }} placeholder="Graduate Architect" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '7px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Employment Type</label>
                            <input type="text" value={job.type} onChange={e => updateJob(i, 'type', e.target.value)} style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid var(--admin-border)', borderRadius: '12px', background: '#fafaf8', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)' }} placeholder="Full-time" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '7px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Location</label>
                            <input type="text" value={job.location} onChange={e => updateJob(i, 'location', e.target.value)} style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid var(--admin-border)', borderRadius: '12px', background: '#fafaf8', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)' }} placeholder="Bengaluru" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
