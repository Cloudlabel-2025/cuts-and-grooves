'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';
import RichTextEditor from '@/app/components/admin/RichTextEditor';
import { EditorHeader, FieldCard, Loader } from '@/app/components/admin/EditorShared';

const DEFAULT_SCATTER_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', x: '5%', y: '10%', w: '18vw', h: '30vh', speed: 0.15, z: 1 },
  { src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80', x: '80%', y: '15%', w: '15vw', h: '25vh', speed: 0.2, z: 1 },
  { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', x: '15%', y: '60%', w: '20vw', h: '28vh', speed: 0.4, z: 5 },
  { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80', x: '70%', y: '50%', w: '16vw', h: '32vh', speed: 0.5, z: 5 },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', x: '-5%', y: '40%', w: '22vw', h: '35vh', speed: 1.0, z: 15 },
  { src: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80', x: '85%', y: '70%', w: '25vw', h: '40vh', speed: 0.9, z: 15 },
  { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=400&q=80', x: '25%', y: '90%', w: '10vw', h: '14vh', speed: 0.8, z: 12 },
  { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80', x: '10%', y: '-10%', w: '14vw', h: '20vh', speed: 0.6, z: 3 },
  { src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80', x: '60%', y: '-5%', w: '13vw', h: '19vh', speed: 0.7, z: 4 },
  { src: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=600&q=80', x: '90%', y: '40%', w: '14vw', h: '22vh', speed: 0.5, z: 2 },
  { src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', x: '35%', y: '110%', w: '16vw', h: '24vh', speed: 1.1, z: 14 },
  { src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80', x: '5%', y: '80%', w: '12vw', h: '16vh', speed: 0.4, z: 6 },
  { src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', x: '50%', y: '70%', w: '9vw', h: '12vh', speed: 0.25, z: 2 },
  { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80', x: '75%', y: '95%', w: '14vw', h: '18vh', speed: 0.85, z: 13 },
];

const DEFAULT_MOBILE_SCATTER_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', x: '5%', y: '10%', w: '40vw', h: '20vh', speed: 0.15, z: 1 },
  { src: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80', x: '55%', y: '15%', w: '35vw', h: '15vh', speed: 0.2, z: 1 },
  { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', x: '10%', y: '45%', w: '45vw', h: '20vh', speed: 0.4, z: 5 },
  { src: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80', x: '50%', y: '65%', w: '35vw', h: '25vh', speed: 0.5, z: 5 },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', x: '-10%', y: '30%', w: '50vw', h: '25vh', speed: 1.0, z: 15 },
  { src: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80', x: '60%', y: '75%', w: '45vw', h: '30vh', speed: 0.9, z: 15 },
];

const DEFAULT_VISION_ITEMS = [
  { title: 'Design integrity', desc: 'At the core of every structure lies intention.We integrate advanced research and evolving technology with a distinctly human sensibility — because innovation without intuition is incomplete.Our process challenges convention, tests boundaries, and explores possibilities beyond the expected. Each solution is thoughtfully engineered, creatively envisioned, and uncompromising in execution.' },
  { title: 'Innovation', desc: 'We combine rigorous research, advanced technology, and refined craftsmanship to redefine what’s possible. Yet we believe true innovation is not purely technical — it is human.Every breakthrough we pursue is guided by insight, experience, and an uncompromising pursuit of better solutions. We challenge limits, rethink conventions, and transform complexity into clarity.Because progress is not about change for the sake of it — it is about building smarter, stronger, and ahead of time.' },
  { title: 'Enhanced Living', desc: 'Well-being is not an afterthought — it is the foundation. We design spaces that elevate everyday life, where light, proportion, material, and flow work in harmony. Every environment is thoughtfully crafted to encourage connection, comfort, and clarity. Our approach goes beyond structure. We create living experiences — spaces that nurture balance, inspire interaction, and enhance the rhythm of modern life.' }
];

export default function AllWorksMediaEditor({ page = 'home', section = 'all-works' }) {
  const [transitionImage, setTransitionImage] = useState('');
  const [stagedTransitionImage, setStagedTransitionImage] = useState('');
  const [scatterImages, setScatterImages] = useState([]);
  const [stagedScatterImages, setStagedScatterImages] = useState([]);
  const [mobileScatterImages, setMobileScatterImages] = useState([]);
  const [stagedMobileScatterImages, setStagedMobileScatterImages] = useState([]);
  const [heading, setHeading] = useState('All Work');
  const [stagedHeading, setStagedHeading] = useState('All Work');
  const [visionItems, setVisionItems] = useState(DEFAULT_VISION_ITEMS);
  const [stagedVisionItems, setStagedVisionItems] = useState(DEFAULT_VISION_ITEMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('transition');
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content?page=${page}&section=${section}`);
      const data = await res.json();
      const contentMap = {};
      data.forEach(item => {
        contentMap[item.key] = item.value;
      });

      const loadedTransition = contentMap.transitionImage || '/images/All-works-01.jpg';
      setTransitionImage(loadedTransition);
      setStagedTransitionImage(loadedTransition);

      const loadedScatter = contentMap.scatterImages
        ? (typeof contentMap.scatterImages === 'string' ? JSON.parse(contentMap.scatterImages) : contentMap.scatterImages)
        : DEFAULT_SCATTER_IMAGES;
      setScatterImages(loadedScatter);
      setStagedScatterImages(JSON.parse(JSON.stringify(loadedScatter)));

      const loadedMobileScatter = contentMap.mobileScatterImages
        ? (typeof contentMap.mobileScatterImages === 'string' ? JSON.parse(contentMap.mobileScatterImages) : contentMap.mobileScatterImages)
        : DEFAULT_MOBILE_SCATTER_IMAGES;
      setMobileScatterImages(loadedMobileScatter);
      setStagedMobileScatterImages(JSON.parse(JSON.stringify(loadedMobileScatter)));

      const loadedHeading = contentMap.heading || 'All Work';
      setHeading(loadedHeading);
      setStagedHeading(loadedHeading);

      const loadedVision = contentMap.visionItems
        ? (typeof contentMap.visionItems === 'string' ? JSON.parse(contentMap.visionItems) : contentMap.visionItems)
        : DEFAULT_VISION_ITEMS;
      setVisionItems(loadedVision);
      setStagedVisionItems(JSON.parse(JSON.stringify(loadedVision)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    stagedTransitionImage !== transitionImage ||
    stagedHeading !== heading ||
    JSON.stringify(stagedVisionItems) !== JSON.stringify(visionItems) ||
    JSON.stringify(stagedScatterImages) !== JSON.stringify(scatterImages) ||
    JSON.stringify(stagedMobileScatterImages) !== JSON.stringify(mobileScatterImages);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [];
      if (stagedTransitionImage !== transitionImage) {
        updates.push(fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page, section, key: 'transitionImage', value: stagedTransitionImage }),
        }));
      }
      if (JSON.stringify(stagedScatterImages) !== JSON.stringify(scatterImages)) {
        updates.push(fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page, section, key: 'scatterImages', value: stagedScatterImages }),
        }));
      }
      if (JSON.stringify(stagedMobileScatterImages) !== JSON.stringify(mobileScatterImages)) {
        updates.push(fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page, section, key: 'mobileScatterImages', value: stagedMobileScatterImages }),
        }));
      }
      if (stagedHeading !== heading) {
        updates.push(fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page, section, key: 'heading', value: stagedHeading }),
        }));
      }
      if (JSON.stringify(stagedVisionItems) !== JSON.stringify(visionItems)) {
        updates.push(fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page, section, key: 'visionItems', value: stagedVisionItems }),
        }));
      }
      await Promise.all(updates);
      setTransitionImage(stagedTransitionImage);
      setHeading(stagedHeading);
      setVisionItems(JSON.parse(JSON.stringify(stagedVisionItems)));
      setScatterImages(JSON.parse(JSON.stringify(stagedScatterImages)));
      setMobileScatterImages(JSON.parse(JSON.stringify(stagedMobileScatterImages)));
    } catch (err) {
      console.error(err);
      alert('Failed to save media changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setStagedTransitionImage(transitionImage);
    setStagedHeading(heading);
    setStagedVisionItems(JSON.parse(JSON.stringify(visionItems)));
    setStagedScatterImages(JSON.parse(JSON.stringify(scatterImages)));
    setStagedMobileScatterImages(JSON.parse(JSON.stringify(mobileScatterImages)));
  };

  const updateScatterImage = (index, field, value, isMobile = false) => {
    if (isMobile) {
      const updated = [...stagedMobileScatterImages];
      updated[index] = { ...updated[index], [field]: value };
      setStagedMobileScatterImages(updated);
    } else {
      const updated = [...stagedScatterImages];
      updated[index] = { ...updated[index], [field]: value };
      setStagedScatterImages(updated);
    }
  };

  const removeScatterImage = (index, isMobile = false) => {
    if (isMobile) {
      setStagedMobileScatterImages(stagedMobileScatterImages.filter((_, i) => i !== index));
    } else {
      setStagedScatterImages(stagedScatterImages.filter((_, i) => i !== index));
    }
  };

  const addScatterImage = (isMobile = false) => {
    const newImage = isMobile
      ? { src: '', x: '10%', y: '10%', w: '40vw', h: '20vh', speed: 0.5, z: 5 }
      : { src: '', x: '10%', y: '10%', w: '16vw', h: '24vh', speed: 0.5, z: 5 };
    if (isMobile) {
      setStagedMobileScatterImages([...stagedMobileScatterImages, newImage]);
    } else {
      setStagedScatterImages([...stagedScatterImages, newImage]);
    }
  };

  if (loading) return <Loader label="Visual Assets" />;

  const renderImageList = (images, isMobile) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {images.map((img, index) => (
        <div key={index} style={{
          background: '#fff',
          border: '1px solid var(--admin-border)',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}>
          <div
            onClick={() => setExpandedIndex(expandedIndex === `${isMobile ? 'm' : 'd'}-${index}` ? null : `${isMobile ? 'm' : 'd'}-${index}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--admin-surface-2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid var(--admin-border)',
                background: '#f4f3ef',
                flexShrink: 0,
              }}>
                {img.src ? (
                  <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--admin-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>—
                  </div>
                )}
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--admin-text)' }}>
                  Image {index + 1}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--admin-muted)', display: 'block', marginTop: '2px' }}>
                  z:{img.z} · speed:{img.speed} · {img.x},{img.y}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeScatterImage(index, isMobile); }}
                style={{
                  width: '30px',
                  height: '30px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  opacity: 0.5,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.5'; }}
              >
                ×
              </button>
              <span style={{
                color: 'var(--admin-muted)',
                transition: 'transform 0.3s ease',
                display: 'inline-block',
                transform: expandedIndex === `${isMobile ? 'm' : 'd'}-${index}` ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
                ▾
              </span>
            </div>
          </div>

          {expandedIndex === `${isMobile ? 'm' : 'd'}-${index}` && (
            <div style={{
              padding: '20px',
              borderTop: '1px solid var(--admin-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '8px' }}>
                  Image Source
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <CloudinaryUpload
                    folder="all-works"
                    onUploadSuccess={(url) => updateScatterImage(index, 'src', url, isMobile)}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--admin-muted)' }}>or paste URL</span>
                </div>
                <input
                  type="text"
                  value={img.src}
                  onChange={(e) => updateScatterImage(index, 'src', e.target.value, isMobile)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 14px',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '10px',
                    background: '#fafaf8',
                    fontSize: '13px',
                    outline: 'none',
                    color: 'var(--admin-text)',
                    fontFamily: 'monospace',
                  }}
                  placeholder="https://..."
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}>
                {[
                  { key: 'x', label: 'X Position' },
                  { key: 'y', label: 'Y Position' },
                  { key: 'w', label: 'Width' },
                  { key: 'h', label: 'Height' },
                  { key: 'speed', label: 'Speed' },
                  { key: 'z', label: 'Z-Index' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <span style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '4px' }}>
                      {label}
                    </span>
                    <input
                      type={key === 'speed' || key === 'z' ? 'number' : 'text'}
                      step={key === 'speed' ? '0.05' : key === 'z' ? '1' : undefined}
                      value={img[key]}
                      onChange={(e) => updateScatterImage(index, key, key === 'speed' ? parseFloat(e.target.value) || 0 : key === 'z' ? parseInt(e.target.value) || 0 : e.target.value, isMobile)}
                      style={{
                        width: '100%',
                        height: '36px',
                        padding: '0 10px',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '8px',
                        background: '#fff',
                        fontSize: '12px',
                        outline: 'none',
                        color: 'var(--admin-text)',
                        textAlign: 'center',
                      }}
                    />
                  </div>
                ))}
              </div>

              {img.src && (
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid var(--admin-border)',
                  background: '#f4f3ef',
                }}>
                  <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => addScatterImage(isMobile)}
        style={{
          width: '100%',
          padding: '18px',
          border: '2px dashed var(--admin-border)',
          borderRadius: '16px',
          background: 'transparent',
          color: 'var(--admin-muted)',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--admin-accent)'; e.currentTarget.style.color = 'var(--admin-accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--admin-border)'; e.currentTarget.style.color = 'var(--admin-muted)'; }}
      >
        <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
        Add Image Node
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <EditorHeader
        kicker="Visual Assets"
        title="Gallery & Media Configuration"
        description="Manage scatter images, transition media, and vision narrative content."
        hasChanges={hasChanges}
        saving={saving}
        onReset={handleReset}
        onSave={handleSave}
        saveLabel={saving ? 'Syncing...' : 'Finalize Media'}
      />

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '5px',
        background: 'var(--admin-surface-2)',
        borderRadius: '14px',
        border: '1px solid var(--admin-border)',
      }}>
        {[
          { id: 'transition', label: 'Transition Image' },
          { id: 'desktop', label: `Desktop (${stagedScatterImages.length})` },
          { id: 'mobile', label: `Mobile (${stagedMobileScatterImages.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === tab.id ? '#fff' : 'transparent',
              color: activeTab === tab.id ? 'var(--admin-text)' : 'var(--admin-muted)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'all 0.25s ease',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        background: '#fff',
        padding: 'clamp(24px, 3vw, 36px)',
        border: '1px solid var(--admin-border)',
        borderRadius: '20px',
        boxShadow: '0 8px 28px rgba(0,0,0,0.04)',
      }}>
        {activeTab === 'transition' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <FieldCard label="Portal Transition Image" hint="1920×1080 or larger recommended">
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid var(--admin-border)',
                background: '#f4f3ef',
              }}
                onMouseEnter={(e) => { e.currentTarget.querySelector('.overlay').style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.querySelector('.overlay').style.opacity = '0'; }}
              >
                {stagedTransitionImage && (
                  <img src={stagedTransitionImage} alt="Transition preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div className="overlay" style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  backdropFilter: 'blur(4px)',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                    Replace Image
                  </span>
                  <CloudinaryUpload
                    folder="all-works"
                    onUploadSuccess={(url) => setStagedTransitionImage(url)}
                  />
                  {stagedTransitionImage !== '/images/All-works-01.jpg' && (
                    <button
                      onClick={() => setStagedTransitionImage('/images/All-works-01.jpg')}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '999px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      Restore Default
                    </button>
                  )}
                </div>
              </div>
            </FieldCard>

            <div style={{ height: '1px', background: 'var(--admin-border)' }} />

            <FieldCard label="Section Heading">
              <input
                type="text"
                value={stagedHeading}
                onChange={(e) => setStagedHeading(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '0 14px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '10px',
                  background: '#fafaf8',
                  fontSize: '14px',
                  outline: 'none',
                  color: 'var(--admin-text)',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                }}
              />
            </FieldCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>
                Vision Narrative
              </span>
              {stagedVisionItems.map((item, idx) => (
                <div key={idx} style={{
                  padding: '22px 24px',
                  background: 'var(--admin-surface-2)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--admin-accent)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '800',
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-accent)' }}>
                      Vision Step {idx + 1}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '6px' }}>
                      Title
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...stagedVisionItems];
                        newItems[idx].title = e.target.value;
                        setStagedVisionItems(newItems);
                      }}
                      style={{
                        width: '100%',
                        height: '42px',
                        padding: '0 14px',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '10px',
                        background: '#fff',
                        fontSize: '14px',
                        fontWeight: '700',
                        outline: 'none',
                        color: 'var(--admin-text)',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '6px' }}>
                      Description
                    </span>
                    <RichTextEditor
                      value={item.desc}
                      onChange={(val) => {
                        const newItems = [...stagedVisionItems];
                        newItems[idx].desc = val;
                        setStagedVisionItems(newItems);
                      }}
                      placeholder="Write the vision narrative..."
                      minHeight="120px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'desktop' && renderImageList(stagedScatterImages, false)}
        {activeTab === 'mobile' && renderImageList(stagedMobileScatterImages, true)}
      </div>
    </div>
  );
}
