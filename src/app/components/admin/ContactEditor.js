'use client';

import { useState, useEffect, useCallback } from 'react';
import RichTextEditor from '@/app/components/admin/RichTextEditor';
import { useUnsavedChanges } from '@/app/components/admin/useUnsavedChanges';
import { useKeyboardShortcut } from '@/app/components/admin/useKeyboardShortcut';
import { EditorHeader, FieldCard, Loader, inputStyle, focusIn, focusOut } from '@/app/components/admin/EditorShared';

export default function ContactEditor({ page = 'contact' }) {
    const [content, setContent] = useState({
        heroText: '',
        locations: [],
        instagram: '',
        linkedin: '',
        email: '',
        phone: '',
        studio: '',
        mapIframe: ''
    });
    const [stagedContent, setStagedContent] = useState({
        heroText: '',
        locations: [],
        instagram: '',
        linkedin: '',
        email: '',
        phone: '',
        studio: '',
        mapIframe: ''
    });
    const [newLocation, setNewLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch(`/api/content?page=${page}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            const contentMap = {};
            data.forEach(item => {
                contentMap[item.key] = item.value;
            });

            // Map socials array to flat keys for easier editing if it exists
            const instagram = (contentMap.socials || []).find(s => s.platform === 'Instagram')?.url || '';
            const linkedin = (contentMap.socials || []).find(s => s.platform === 'LinkedIn')?.url || '';

            const loadedContent = {
                heroText: contentMap.heroText || '',
                locations: contentMap.locations || [],
                instagram,
                linkedin,
                email: contentMap.email || '',
                phone: contentMap.phone || '',
                studio: contentMap.studio || '',
                mapIframe: contentMap.mapIframe || ''
            };
            setContent(loadedContent);
            setStagedContent(loadedContent);
        } catch (err) {
            console.error('Failed to fetch contact content:', err);
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = JSON.stringify(content) !== JSON.stringify(stagedContent);

    useUnsavedChanges(hasChanges, 'draft_contact');
    useKeyboardShortcut('s', true, () => { if (hasChanges) handleSave(); });
    useKeyboardShortcut('Escape', false, () => { if (hasChanges) handleReset(); });

    const handleSave = async () => {
        setSaving(true);
        try {
            // Re-map flat social keys back to array
            const socials = [
                { platform: 'Instagram', url: stagedContent.instagram },
                { platform: 'LinkedIn', url: stagedContent.linkedin }
            ];

            const updates = [
                { section: 'hero', key: 'heroText', value: stagedContent.heroText },
                { section: 'hero', key: 'locations', value: stagedContent.locations },
                { section: 'details', key: 'socials', value: socials },
                { section: 'details', key: 'email', value: stagedContent.email },
                { section: 'details', key: 'phone', value: stagedContent.phone },
                { section: 'details', key: 'studio', value: stagedContent.studio },
                { section: 'details', key: 'mapIframe', value: stagedContent.mapIframe }
            ];

            for (const item of updates) {
                await fetch('/api/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        page,
                        ...item
                    }),
                });
            }
            setContent({ ...stagedContent });
            try { localStorage.removeItem('draft_contact'); } catch {}
        } catch (err) {
            console.error(err);
            alert('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setStagedContent({ ...content });
    };

    const addLocation = () => {
        if (!newLocation.trim()) return;
        setStagedContent({
            ...stagedContent,
            locations: [...stagedContent.locations, newLocation.trim()]
        });
        setNewLocation('');
    };

    const removeLocation = (index) => {
        setStagedContent({
            ...stagedContent,
            locations: stagedContent.locations.filter((_, i) => i !== index)
        });
    };

    if (loading) return <Loader label="Contact Details" />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <EditorHeader
                kicker="Contact Page"
                title="Contact Details & Locations"
                description="Manage studio address, contact info, locations, and interactive map."
                hasChanges={hasChanges}
                saving={saving}
                onReset={handleReset}
                onSave={handleSave}
                saveLabel="Save Contact Details"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <FieldCard label="Hero Narrative" hint="Main statement shown on the contact page">
                    <RichTextEditor
                        value={stagedContent.heroText}
                        onChange={(val) => setStagedContent(s => ({ ...s, heroText: val }))}
                        placeholder="Enter main statement..."
                        minHeight="120px"
                    />
                </FieldCard>

                <FieldCard label="Operational Locations" hint="Add cities where the studio operates">
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <input
                                type="text"
                                style={inputStyle}
                                placeholder="Add a new location (e.g. London)"
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            />
                        </div>
                        <button 
                            onClick={addLocation} 
                            disabled={!newLocation.trim()}
                            style={{
                                padding: '0 20px', borderRadius: '12px', border: 'none',
                                background: newLocation.trim() ? 'var(--admin-text)' : 'var(--admin-border)', 
                                color: newLocation.trim() ? '#fff' : 'var(--admin-muted)', 
                                cursor: newLocation.trim() ? 'pointer' : 'not-allowed',
                                fontSize: '12px', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Add
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {stagedContent.locations.map((loc, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '6px 14px', borderRadius: '999px',
                                background: '#fafaf8', border: '1px solid var(--admin-border)',
                                fontSize: '12px', color: 'var(--admin-text)',
                            }}>
                                <span>{loc}</span>
                                <button
                                    onClick={() => removeLocation(i)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '18px', height: '18px', borderRadius: '50%',
                                        background: 'rgba(0,0,0,0.05)', border: 'none',
                                        color: 'var(--admin-muted)', cursor: 'pointer',
                                        fontSize: '14px', lineHeight: 1, padding: 0,
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--admin-muted)'; }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {stagedContent.locations.length === 0 && (
                            <span style={{ fontSize: '13px', color: 'var(--admin-muted)', fontStyle: 'italic' }}>No locations added yet.</span>
                        )}
                    </div>
                </FieldCard>

                <FieldCard label="Contact Information" hint="Public email and phone number">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Public Email</label>
                            <input
                                type="email"
                                style={inputStyle}
                                value={stagedContent.email}
                                onChange={(e) => setStagedContent(s => ({ ...s, email: e.target.value }))}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Phone Number</label>
                            <input
                                type="tel"
                                style={inputStyle}
                                value={stagedContent.phone}
                                onChange={(e) => setStagedContent(s => ({ ...s, phone: e.target.value }))}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            />
                        </div>
                    </div>
                </FieldCard>

                <FieldCard label="Social Links" hint="Links to social media profiles">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Instagram URL</label>
                            <input
                                type="url"
                                style={inputStyle}
                                value={stagedContent.instagram}
                                onChange={(e) => setStagedContent(s => ({ ...s, instagram: e.target.value }))}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>LinkedIn URL</label>
                            <input
                                type="url"
                                style={inputStyle}
                                value={stagedContent.linkedin}
                                onChange={(e) => setStagedContent(s => ({ ...s, linkedin: e.target.value }))}
                                onFocus={focusIn}
                                onBlur={focusOut}
                            />
                        </div>
                    </div>
                </FieldCard>

                <FieldCard label="Studio Address" hint="Full address details">
                    <RichTextEditor
                        value={stagedContent.studio}
                        onChange={(val) => setStagedContent(s => ({ ...s, studio: val }))}
                        placeholder="Enter studio address..."
                        minHeight="100px"
                    />
                </FieldCard>

                <FieldCard label="Location Map Embed URL" hint="Google Maps embed link">
                    <div style={{ marginBottom: '12px', padding: '12px 16px', background: '#fafaf8', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)', lineHeight: 1.5 }}>
                            To get this link: Go to Google Maps → Click 'Share' → Click 'Embed a map' → Copy the link inside the <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '4px' }}>src="..."</code> attribute.
                            <br /><span style={{ color: '#ef4444', fontWeight: '600' }}>Do not use regular "Share Link" (maps.app.goo.gl).</span>
                        </p>
                    </div>
                    <input
                        type="url"
                        style={inputStyle}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        value={stagedContent.mapIframe}
                        onChange={(e) => setStagedContent(s => ({ ...s, mapIframe: e.target.value }))}
                        onFocus={focusIn}
                        onBlur={focusOut}
                    />
                </FieldCard>
            </div>
        </div>
    );
}
