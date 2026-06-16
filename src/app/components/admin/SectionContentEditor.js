'use client';

import { useState, useEffect, useCallback } from 'react';
import RichTextEditor from '@/app/components/admin/RichTextEditor';
import { useUnsavedChanges } from '@/app/components/admin/useUnsavedChanges';
import { useKeyboardShortcut } from '@/app/components/admin/useKeyboardShortcut';
import { EditorHeader, FieldCard, Loader, inputStyle, focusIn, focusOut } from '@/app/components/admin/EditorShared';

export default function SectionContentEditor({
  page = 'home',
  section,
  title = "Section Configuration",
  description = "Manage the narrative and visual cues for this segment.",
  fields = [
    { key: 'heading', label: 'Primary Heading', type: 'text' },
    { key: 'subtext', label: 'Secondary Description', type: 'textarea' }
  ]
}) {
  const [content, setContent] = useState({});
  const [stagedContent, setStagedContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSectionContent();
  }, [page, section]);

  const fetchSectionContent = async () => {
    setLoading(true);
    const initialData = {};
    fields.forEach(field => {
      initialData[field.key] = "";
    });
    setContent(initialData);
    setStagedContent(initialData);
    setLoading(false);
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(stagedContent);

  useUnsavedChanges(hasChanges, `draft_${page}_${section}`);
  useKeyboardShortcut('s', true, () => { if (hasChanges) handleSaveAll(); });
  useKeyboardShortcut('Escape', false, () => { if (hasChanges) handleReset(); });

  const handleSaveAll = useCallback(async () => {
    setSaving(true);
    try {
      const keys = Object.keys(stagedContent);
      for (const key of keys) {
        if (stagedContent[key] !== content[key]) {
          await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page, section, key, value: stagedContent[key] }),
          });
        }
      }
      setContent(stagedContent);
      try { localStorage.removeItem(`draft_${page}_${section}`); } catch {}
    } catch (err) {
      console.error(err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  }, [stagedContent, content, page, section]);

  const handleReset = () => {
    setStagedContent(content);
  };

  if (loading) return <Loader label="Section Content" />;

  function countChars(str) {
    return (str || '').replace(/<[^>]*>/g, '').length;
  }

  function countWords(str) {
    const text = (str || '').replace(/<[^>]*>/g, '');
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <EditorHeader
        kicker="Text Editor"
        title={title}
        description={description}
        hasChanges={hasChanges}
        saving={saving}
        onReset={handleReset}
        onSave={handleSaveAll}
        saveLabel={saving ? 'Saving…' : 'Save Changes'}
      />

      <div style={{
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}>
        {fields.map((field) => (
          <FieldCard key={field.key} label={field.label}>
            {field.type === 'textarea' ? (
              <RichTextEditor
                value={stagedContent[field.key] || ""}
                onChange={(val) => setStagedContent({ ...stagedContent, [field.key]: val })}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                minHeight="140px"
              />
            ) : (
              <input
                type="text"
                value={stagedContent[field.key] || ""}
                onChange={(e) => setStagedContent({ ...stagedContent, [field.key]: e.target.value })}
                onFocus={focusIn}
                onBlur={focusOut}
                style={{ ...inputStyle, fontWeight: '500' }}
              />
            )}
            {field.type === 'text' && (
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--admin-muted)', textAlign: 'right' }}>
                {countChars(stagedContent[field.key])} chars · {countWords(stagedContent[field.key])} words
              </div>
            )}
          </FieldCard>
        ))}

        <div style={{
          padding: '16px 20px',
          background: 'var(--admin-surface-2)',
          border: '1px solid var(--admin-border)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: hasChanges ? '#f59e0b' : '#22c55e',
                transition: 'background-color 0.3s',
                boxShadow: hasChanges
                  ? '0 0 0 3px rgba(245,158,11,0.15)'
                  : '0 0 0 3px rgba(34,197,94,0.15)',
              }} />
              <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--admin-text)' }}>
                {hasChanges ? 'Unsaved changes' : 'All saved'}
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--admin-muted)', opacity: 0.6 }}>
              {section?.toUpperCase()}_TXT
            </span>
          </div>
          <div style={{
            display: 'flex', gap: '16px', flexWrap: 'wrap',
            paddingTop: '10px', borderTop: '1px solid var(--admin-border)',
          }}>
            <span style={{ fontSize: '10px', color: 'var(--admin-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', height: '18px', padding: '0 5px', background: '#fff', border: '1px solid var(--admin-border)', borderRadius: '4px', fontSize: '9px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--admin-text)', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>⌘S</kbd> Save
            </span>
            <span style={{ fontSize: '10px', color: 'var(--admin-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '22px', height: '18px', padding: '0 5px', background: '#fff', border: '1px solid var(--admin-border)', borderRadius: '4px', fontSize: '9px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--admin-text)', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>Esc</kbd> Reset
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
