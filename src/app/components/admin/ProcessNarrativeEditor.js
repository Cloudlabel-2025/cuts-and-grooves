'use client';

import { useState, useEffect, useCallback } from 'react';
import RichTextEditor from './RichTextEditor';
import { Loader, EditorHeader, FieldCard } from './EditorShared';

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
};

const charCount = (html) => stripHtml(html).length;
const wordCount = (html) => {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
};

export default function ProcessNarrativeEditor({ page = 'process', section = 'narrative' }) {
  const [content, setContent] = useState({ heading: '', subtext: '' });
  const [staged, setStaged] = useState({ heading: '', subtext: '' });
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
      const loaded = { heading: map.heading || '', subtext: map.subtext || '' };
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

  if (loading) return <Loader label="Narrative" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <EditorHeader
        kicker="Narrative Section"
        title="Intro Text"
        description="Main heading and supporting subtext shown at the top of the process page."
        hasChanges={hasChanges}
        saving={saving}
        onReset={() => setStaged({ ...content })}
        onSave={handleSave}
        saveLabel="Save Narrative"
      />

      {/* Status Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Heading</span>
          <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{charCount(staged.heading)}</strong>
          <span style={{ fontSize: '12px', color: 'var(--admin-muted)', marginLeft: '4px' }}>chars</span>
        </div>
        <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Subtext</span>
          <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{charCount(staged.subtext)}</strong>
          <span style={{ fontSize: '12px', color: 'var(--admin-muted)', marginLeft: '4px' }}>chars</span>
        </div>
        <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '14px', border: '1px solid var(--admin-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '6px' }}>Total Words</span>
          <strong style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--admin-text)' }}>{wordCount(staged.heading) + wordCount(staged.subtext)}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FieldCard label="Main Heading" hint="Large pull-quote shown at page top">
          <RichTextEditor
            value={staged.heading}
            onChange={(val) => setStaged(s => ({ ...s, heading: val }))}
            placeholder={'"Each element informs the other..."'}
            minHeight="120px"
          />
        </FieldCard>
        <FieldCard label="Supporting Subtext" hint="Paragraph below the heading">
          <RichTextEditor
            value={staged.subtext}
            onChange={(val) => setStaged(s => ({ ...s, subtext: val }))}
            placeholder="We believe architecture has the power to..."
            minHeight="200px"
          />
        </FieldCard>
      </div>
    </div>
  );
}
