'use client';

import { useState, useEffect, useCallback } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';
import RichTextEditor from '@/app/components/admin/RichTextEditor';
import { useUnsavedChanges } from '@/app/components/admin/useUnsavedChanges';
import { useKeyboardShortcut } from '@/app/components/admin/useKeyboardShortcut';
import { EditorHeader, FieldCard, Loader, inputStyle, focusIn, focusOut } from '@/app/components/admin/EditorShared';

function countWords(str) {
  const text = str.replace(/<[^>]*>/g, '');
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function countChars(str) {
  return str.replace(/<[^>]*>/g, '').length;
}

export default function HeroEditor({ page = 'home', section = 'hero' }) {
  const [content, setContent] = useState({
    title: '',
    subtitle: '',
    videoUrl: ''
  });
  const [stagedContent, setStagedContent] = useState({
    title: '',
    subtitle: '',
    videoUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [overlayOpacity, setOverlayOpacity] = useState(0.4);
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`/api/content?page=${page}&section=${section}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const contentMap = {};
      data.forEach(item => {
        contentMap[item.key] = item.value;
      });
      const loadedContent = {
        title: contentMap.title || "Spaces Made for Living",
        subtitle: contentMap.subtitle || "Architecture & Interior Design Studio",
        videoUrl: contentMap.videoUrl || "/videos/luxury-interior.mp4"
    };
    setContent(loadedContent);
    setStagedContent(loadedContent);
    setVideoUrlInput(loadedContent.videoUrl);
    } catch (err) {
      console.error('Failed to fetch content:', err);
      const defaultContent = {
        title: "Spaces Made for Living",
        subtitle: "Architecture & Interior Design Studio",
        videoUrl: "/videos/luxury-interior.mp4"
      };
      setContent(defaultContent);
      setStagedContent(defaultContent);
      setVideoUrlInput(defaultContent.videoUrl);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(stagedContent);

  useUnsavedChanges(hasChanges, 'draft_hero');
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
      try { localStorage.removeItem('draft_hero'); } catch {}
    } catch (err) {
      console.error(err);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  }, [stagedContent, content, page, section]);

  const handleReset = () => {
    setStagedContent(content);
    setVideoUrlInput(content.videoUrl);
  };

  const handleVideoUrlApply = () => {
    const url = videoUrlInput.trim();
    if (!url) return;
    setStagedContent({ ...stagedContent, videoUrl: url });
    setShowMediaPanel(false);
  };

  const wordCount = countWords(stagedContent.title);
  const charCount = countChars(stagedContent.title);
  const subtitleWords = countWords(stagedContent.subtitle);

  const previewWidth = previewDevice === 'mobile' ? '375px' : '100%';
  const previewRadius = previewDevice === 'mobile' ? '24px' : '12px';

  if (loading) return <Loader label="Hero Content" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <EditorHeader
        kicker="Hero Section"
        title="Hero Configuration"
        description="Manage background video, heading, and subtitle for the home page hero."
        hasChanges={hasChanges}
        saving={saving}
        onReset={handleReset}
        onSave={handleSaveAll}
        saveLabel={saving ? 'Saving…' : 'Save Changes'}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
        gap: '28px',
        alignItems: 'start',
      }}>
        {/* Preview Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Device Toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px', background: 'var(--admin-surface-2)',
            borderRadius: '10px', border: '1px solid var(--admin-border)',
            alignSelf: 'flex-start',
          }}>
            <button onClick={() => setPreviewDevice('desktop')} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', border: 'none', borderRadius: '7px',
              background: previewDevice === 'desktop' ? '#fff' : 'transparent',
              color: previewDevice === 'desktop' ? 'var(--admin-text)' : 'var(--admin-muted)',
              cursor: 'pointer', fontSize: '11px', fontWeight: '700',
              boxShadow: previewDevice === 'desktop' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              Desktop
            </button>
            <button onClick={() => setPreviewDevice('mobile')} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', border: 'none', borderRadius: '7px',
              background: previewDevice === 'mobile' ? '#fff' : 'transparent',
              color: previewDevice === 'mobile' ? 'var(--admin-text)' : 'var(--admin-muted)',
              cursor: 'pointer', fontSize: '11px', fontWeight: '700',
              boxShadow: previewDevice === 'mobile' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <path d="M12 18h.01" />
              </svg>
              Mobile
            </button>
          </div>

          {/* Preview */}
          <FieldCard label="Live Preview" hint="Hover to upload new media">
            <div style={{
              display: 'flex', justifyContent: 'center',
              background: previewDevice === 'mobile' ? 'var(--admin-surface-2)' : 'transparent',
              borderRadius: previewRadius, padding: previewDevice === 'mobile' ? '12px' : '0',
            }}>
              <div style={{
                position: 'relative',
                width: previewWidth,
                aspectRatio: '16/9',
                borderRadius: previewRadius,
                overflow: 'hidden',
                border: '1px solid var(--admin-border)',
                backgroundColor: '#000000',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: previewDevice === 'mobile' ? '0 8px 30px rgba(0,0,0,0.15)' : 'none',
              }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {stagedContent.videoUrl && stagedContent.videoUrl.startsWith('http') ? (
                  <video
                    key={stagedContent.videoUrl}
                    autoPlay muted loop playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                  >
                    <source src={stagedContent.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                    gap: '16px',
                  }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 10h20M8 4v16" />
                    </svg>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0, letterSpacing: '0.08em', fontWeight: '600' }}>
                      Upload video to preview
                    </p>
                  </div>
                )}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity}), transparent)`,
                  pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: previewDevice === 'mobile' ? '24px' : '48px',
                  textAlign: 'center', pointerEvents: 'none',
                }}>
                  <h2 style={{
                    fontSize: previewDevice === 'mobile' ? 'clamp(14px, 4vw, 22px)' : 'clamp(18px, 2vw, 28px)',
                    fontWeight: '300', letterSpacing: '-0.01em', color: '#ffffff',
                    marginBottom: '12px', lineHeight: 1.3,
                    textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    maxWidth: '90%',
                  }} dangerouslySetInnerHTML={{ __html: stagedContent.title }} />
                  {stagedContent.subtitle && (
                    <p style={{
                      fontSize: previewDevice === 'mobile' ? '9px' : '11px',
                      letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)',
                      fontWeight: '600', textTransform: 'uppercase',
                      textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}>
                      {stagedContent.subtitle}
                    </p>
                  )}
                </div>

                {/* Upload Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: isHovered ? 1 : 0,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: isHovered ? 'auto' : 'none',
                  backdropFilter: 'blur(8px)',
                }}>
                  <div style={{
                    transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transitionDelay: '0.1s',
                  }}>
                    <CloudinaryUpload
                      folder="hero"
                      onUploadSuccess={(url) => {
                        setStagedContent({ ...stagedContent, videoUrl: url });
                        setVideoUrlInput(url);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </FieldCard>

          {/* Media URL Panel */}
          <FieldCard label="Media URL" hint="Direct video link">
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  onFocus={focusIn}
                  onBlur={focusOut}
                  placeholder="Paste video URL…"
                  style={{ ...inputStyle, paddingRight: '36px', fontWeight: '500', fontSize: '12px' }}
                />
                {(videoUrlInput !== stagedContent.videoUrl) && (
                  <div style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b',
                  }} />
                )}
              </div>
              <button onClick={handleVideoUrlApply} style={{
                padding: '0 18px', borderRadius: '10px', border: '1px solid var(--admin-border)',
                background: 'var(--admin-text)', color: '#fff', cursor: 'pointer',
                fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em',
                transition: 'all 0.15s',
                opacity: videoUrlInput !== stagedContent.videoUrl ? 1 : 0.4,
              }}
                disabled={videoUrlInput === stagedContent.videoUrl}
              >
                Apply
              </button>
            </div>
            {stagedContent.videoUrl && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--admin-muted)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span style={{ wordBreak: 'break-all', fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.7 }}>
                  {stagedContent.videoUrl.length > 60 ? stagedContent.videoUrl.slice(0, 60) + '…' : stagedContent.videoUrl}
                </span>
              </div>
            )}
          </FieldCard>
        </div>

        {/* Form Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FieldCard label="Main Heading" hint="Rich text supported">
            <RichTextEditor
              value={stagedContent.title}
              onChange={(val) => setStagedContent({ ...stagedContent, title: val })}
              placeholder="Enter your main heading..."
              minHeight="120px"
            />
            {/* Character / Word Count Bar */}
            <div style={{
              marginTop: '8px', display: 'flex', gap: '14px', fontSize: '11px',
              color: 'var(--admin-muted)', alignItems: 'center',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>{charCount} chars</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span>{wordCount} words</span>
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.5 }}>
                ⌘S save · Esc reset
              </span>
            </div>
          </FieldCard>

          <FieldCard label="Subtitle">
            <input
              type="text"
              value={stagedContent.subtitle}
              onChange={(e) => setStagedContent({ ...stagedContent, subtitle: e.target.value })}
              onFocus={focusIn}
              onBlur={focusOut}
              style={{ ...inputStyle, fontWeight: '500' }}
            />
            <div style={{
              marginTop: '6px', display: 'flex', gap: '14px', fontSize: '11px',
              color: 'var(--admin-muted)', justifyContent: 'flex-end',
            }}>
              <span>{countChars(stagedContent.subtitle)} chars</span>
              <span>{subtitleWords} words</span>
            </div>
          </FieldCard>

          {/* Overlay Controls */}
          <FieldCard label="Overlay Opacity" hint="Controls the dark gradient at the bottom">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--admin-text)' }}
              />
              <span style={{
                minWidth: '36px', textAlign: 'center',
                fontFamily: 'var(--font-mono)', fontSize: '12px',
                fontWeight: '700', color: 'var(--admin-text)',
                background: 'var(--admin-surface-2)', padding: '4px 8px',
                borderRadius: '6px',
              }}>
                {Math.round(overlayOpacity * 100)}%
              </span>
            </div>
          </FieldCard>

          {/* Status Bar */}
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
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--admin-muted)', opacity: 0.6 }}>HERO_V1</span>
            </div>
            <div style={{
              display: 'flex', gap: '16px', flexWrap: 'wrap',
              paddingTop: '10px', borderTop: '1px solid var(--admin-border)',
            }}>
              <div style={{ fontSize: '10px', color: 'var(--admin-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <kbd style={kbdStyle}>⌘S</kbd> Save
              </div>
              <div style={{ fontSize: '10px', color: 'var(--admin-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <kbd style={kbdStyle}>Esc</kbd> Reset
              </div>
              <div style={{ fontSize: '10px', color: 'var(--admin-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                Video must be MP4, hosted on Cloudinary or a CDN
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const kbdStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: '22px', height: '18px', padding: '0 5px',
  background: '#fff', border: '1px solid var(--admin-border)',
  borderRadius: '4px', fontSize: '9px', fontWeight: '800',
  fontFamily: 'var(--font-mono)',
  color: 'var(--admin-text)',
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
};
