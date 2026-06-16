'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

const TOOLBAR_ITEMS = [
  [
    { command: 'bold', icon: 'Bold', label: 'Bold', shortcut: 'Ctrl+B', style: 'bold' },
    { command: 'italic', icon: 'Italic', label: 'Italic', shortcut: 'Ctrl+I', style: 'italic' },
    { command: 'underline', icon: 'Underline', label: 'Underline', shortcut: 'Ctrl+U', style: 'underline' },
    { command: 'strikeThrough', icon: 'Strikethrough', label: 'Strikethrough', shortcut: 'Ctrl+Shift+S', style: 'strike' },
    { command: 'foreColor', icon: 'TextColor', label: 'Text Color' },
  ],
  [
    { command: 'formatBlock', value: 'h2', icon: 'H2', label: 'Heading 2' },
    { command: 'formatBlock', value: 'h3', icon: 'H3', label: 'Heading 3' },
    { command: 'formatBlock', value: 'p', icon: 'Paragraph', label: 'Paragraph' },
  ],
  [
    { command: 'insertUnorderedList', icon: 'BulletList', label: 'Bullet List' },
    { command: 'insertOrderedList', icon: 'NumberedList', label: 'Numbered List' },
  ],
  [
    { command: 'createLink', icon: 'Link', label: 'Insert Link' },
    { command: 'removeFormat', icon: 'RemoveFormat', label: 'Clear Formatting' },
  ],
];

function ToolbarIcon({ name }) {
  const icons = {
    Bold: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>,
    Italic: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>,
    Underline: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>,
    Strikethrough: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>,
    H2: <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '-0.03em' }}>H<sub style={{ fontSize: '8px' }}>2</sub></span>,
    H3: <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '-0.03em' }}>H<sub style={{ fontSize: '8px' }}>3</sub></span>,
    Paragraph: <span style={{ fontSize: '12px', fontWeight: '500' }}>¶</span>,
    BulletList: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>,
    NumberedList: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>,
    Link: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    RemoveFormat: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 20H7M10 20l5-12M14 8l-1.5-3.7a.5.5 0 0 0-.94 0L7.5 12M6 12l-2 4.5M18 12l1.5 3.5M3 3l18 18"/></svg>,
    TextColor: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L11 6.5 12.38 12H9.62z"/></svg>,
  };
  return icons[name] || null;
}

export default function RichTextEditor({ value = '', onChange, placeholder = 'Start writing...', minHeight = '180px' }) {
  const editorRef = useRef(null);
  const isInternal = useRef(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeStates, setActiveStates] = useState({});
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const COLORS = ['#1a1a1a','#555555','#999999','#b91c1c','#c2410c','#b45309','#4d7c0f','#15803d','#0f766e','#1d4ed8','#6b21a8','#a21caf','#be185d','#9b7448'];
  const isEmpty = !value || value === '<br>' || value === '<p></p>' || value === '<p><br></p>';

  useEffect(() => {
    if (editorRef.current && !isInternal.current) {
      editorRef.current.innerHTML = value || '';
    }
    isInternal.current = false;
  }, [value]);

  const updateActiveStates = useCallback(() => {
    if (!editorRef.current) return;
    setActiveStates({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    });
  }, []);

  const updateContent = useCallback(() => {
    const html = editorRef.current?.innerHTML || '';
    const empty = !html || html === '<br>' || html === '<p></p>' || html === '<p><br></p>';
    isInternal.current = true;
    if (onChange) {
      onChange(empty ? '' : html);
    }
  }, [onChange]);

  const exec = useCallback((command, value = null) => {
    if (command === 'createLink') {
      setLinkUrl('');
      setShowLinkInput(true);
      setShowColorPicker(false);
      return;
    }
    if (command === 'foreColor') {
      setShowColorPicker((v) => !v);
      setShowLinkInput(false);
      return;
    }
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
    updateActiveStates();
  }, [updateContent, updateActiveStates]);

  const applyColor = useCallback((color) => {
    document.execCommand('foreColor', false, color);
    setShowColorPicker(false);
    editorRef.current?.focus();
    updateContent();
    updateActiveStates();
  }, [updateContent, updateActiveStates]);

  const handleLinkSubmit = useCallback(() => {
    if (linkUrl) {
      document.execCommand('createLink', false, linkUrl);
    }
    setShowLinkInput(false);
    setLinkUrl('');
    editorRef.current?.focus();
    updateContent();
    updateActiveStates();
  }, [linkUrl, updateContent, updateActiveStates]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  }, [updateContent]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&emsp;');
    }
    setTimeout(() => {
      updateContent();
      updateActiveStates();
    }, 0);
  }, [updateContent, updateActiveStates]);

  const handleToolbarMouseDown = useCallback((e) => {
    e.preventDefault();
    editorRef.current?.focus();
  }, []);

  function isActive(btn) {
    if (btn.command === 'formatBlock') {
      const block = document.queryCommandValue('formatBlock')?.toLowerCase();
      return block === btn.value?.toLowerCase();
    }
    return !!activeStates[btn.command];
  }

  return (
    <div style={{
      border: `1px solid ${isFocused ? 'rgba(155,116,72,0.55)' : 'var(--admin-border)'}`,
      borderRadius: '12px',
      overflow: 'hidden',
      background: '#fff',
      boxShadow: isFocused ? '0 0 0 4px rgba(155,116,72,0.1)' : 'none',
      transition: 'all 0.2s ease',
      position: 'relative',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2px',
        padding: '6px 8px',
        background: 'var(--admin-surface-2)',
        borderBottom: '1px solid var(--admin-border)',
        userSelect: 'none',
        alignItems: 'center',
      }}>
        {TOOLBAR_ITEMS.map((group, gi) => (
          <div key={gi} style={{
            display: 'flex',
            gap: '1px',
            paddingRight: gi < TOOLBAR_ITEMS.length - 1 ? '6px' : '0',
            marginRight: gi < TOOLBAR_ITEMS.length - 1 ? '6px' : '0',
            borderRight: gi < TOOLBAR_ITEMS.length - 1 ? '1px solid var(--admin-border)' : 'none',
          }}>
            {group.map((btn) => {
              const active = isActive(btn);
              return (
                <button
                  key={btn.command + (btn.value || '')}
                  type="button"
                  onMouseDown={handleToolbarMouseDown}
                  onClick={() => exec(btn.command, btn.value)}
                  title={btn.shortcut ? `${btn.label} (${btn.shortcut})` : btn.label}
                  style={{
                    width: '32px',
                    height: '30px',
                    border: 'none',
                    borderRadius: '6px',
                    background: active ? 'rgba(155,116,72,0.12)' : 'transparent',
                    color: active ? 'rgb(155,116,72)' : 'var(--admin-text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.12s ease',
                    opacity: active ? 1 : 0.7,
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.opacity = '1'; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.7'; } }}
                >
                  <ToolbarIcon name={btn.icon} />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Link Input Bar */}
      {showLinkInput && (
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '8px 12px',
          background: '#fff',
          borderBottom: '1px solid var(--admin-border)',
          alignItems: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--admin-muted)" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLinkSubmit(); if (e.key === 'Escape') setShowLinkInput(false); }}
            placeholder="Paste or type a URL..."
            autoFocus
            style={{
              flex: 1,
              border: '1px solid var(--admin-border)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleLinkSubmit}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--admin-text)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
          <button
            onClick={() => setShowLinkInput(false)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid var(--admin-border)',
              background: 'transparent',
              color: 'var(--admin-text)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Color Picker */}
      {showColorPicker && (
        <div style={{
          display: 'flex', gap: '6px', padding: '8px 12px',
          background: '#fff', borderBottom: '1px solid var(--admin-border)',
          alignItems: 'center', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--admin-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Color
          </span>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => applyColor(c)}
              title={c}
              style={{
                width: '22px', height: '22px', borderRadius: '50%',
                border: c === '#fff' ? '1px solid var(--admin-border)' : 'none',
                background: c, cursor: 'pointer',
                transition: 'transform 0.1s',
                outline: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.25)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          ))}
          <input
            type="color"
            onChange={(e) => applyColor(e.target.value)}
            title="Custom color"
            style={{
              width: '22px', height: '22px', padding: 0, border: '1px solid var(--admin-border)',
              borderRadius: '50%', cursor: 'pointer', outline: 'none',
              background: 'none',
            }}
          />
          <button
            onClick={() => setShowColorPicker(false)}
            style={{
              marginLeft: 'auto', padding: '3px 8px', borderRadius: '4px',
              border: '1px solid var(--admin-border)', background: 'transparent',
              fontSize: '10px', cursor: 'pointer', color: 'var(--admin-muted)',
            }}
          >
            Done
          </button>
        </div>
      )}

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { updateContent(); updateActiveStates(); }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onMouseUp={updateActiveStates}
        data-placeholder={placeholder}
        style={{
          minHeight,
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.7',
          color: 'var(--admin-text)',
          outline: 'none',
          fontFamily: 'inherit',
          overflowY: 'auto',
          cursor: 'text',
        }}
      />

      {/* Bottom Status */}
      {isEmpty && isFocused && !showLinkInput && (
        <div style={{
          position: 'absolute', bottom: '8px', right: '10px',
          fontSize: '10px', color: 'var(--admin-muted)', opacity: 0.5,
          pointerEvents: 'none',
        }}>
          Type / to format
        </div>
      )}

      <style>{`
        [contenteditable=true]:empty:before {
          content: attr(data-placeholder);
          color: rgba(17, 17, 17, 0.3);
          pointer-events: none;
        }
        [contenteditable=true] h2 {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0.5em 0 0.3em;
          line-height: 1.3;
        }
        [contenteditable=true] h3 {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0.4em 0 0.2em;
          line-height: 1.3;
        }
        [contenteditable=true] ul, [contenteditable=true] ol {
          padding-left: 1.5em;
          margin: 0.3em 0;
        }
        [contenteditable=true] li {
          margin: 0.2em 0;
        }
        [contenteditable=true] a {
          color: #9b7448;
          text-decoration: underline;
        }
        [contenteditable=true] p {
          margin: 0.3em 0;
        }
      `}</style>
    </div>
  );
}
