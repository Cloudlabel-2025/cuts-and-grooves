'use client';

import { useState, useEffect } from 'react';

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

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            const keys = Object.keys(stagedContent);
            for (const key of keys) {
                if (stagedContent[key] !== content[key]) {
                    await fetch('/api/content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            page,
                            section,
                            key,
                            value: stagedContent[key],
                        }),
                    });
                }
            }
            setContent(stagedContent);
        } catch (err) {
            console.error(err);
            alert('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setStagedContent(content);
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '80px', paddingBottom: '80px', opacity: 0.3 }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></div>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '-0.2s' }}></div>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '-0.4s' }}></div>
            <span style={{ fontSize: '10px', letterSpacing: '0.1em', paddingLeft: '16px', textTransform: 'uppercase', fontWeight: '600' }}>Loading</span>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <div>
                    <h1 style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '16px', margin: 0 }}>
                        {title}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '32px', height: '1px', backgroundColor: '#000000' }}></div>
                        <p style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                            {description}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {hasChanges && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px', color: '#000000', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', animation: 'fadeIn 0.5s ease' }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                            <span>Unsaved Changes</span>
                        </div>
                    )}
                    {saving && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px', color: '#000000', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', animation: 'pulse 1s infinite' }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%' }}></span>
                            <span>Saving...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Form */}
            <div style={{ maxWidth: '800px', backgroundColor: '#ffffff', padding: '48px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {fields.map((field) => (
                    <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '8px', paddingRight: '8px' }}>
                            <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', margin: 0 }}>
                                {field.label}
                            </label>
                            <span style={{ width: '6px', height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '50%' }}></span>
                        </div>
                        {field.type === 'textarea' ? (
                            <textarea
                                style={{
                                    width: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    letterSpacing: '-0.01em',
                                    color: '#000000',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    minHeight: '120px',
                                    resize: 'none',
                                    fontFamily: 'inherit'
                                }}
                                value={stagedContent[field.key] || ""}
                                onChange={(e) => setStagedContent({ ...stagedContent, [field.key]: e.target.value })}
                                onFocus={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                                }}
                            />
                        ) : (
                            <input
                                type="text"
                                style={{
                                    width: '100%',
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    letterSpacing: '-0.01em',
                                    color: '#000000',
                                    fontFamily: 'inherit'
                                }}
                                value={stagedContent[field.key] || ""}
                                onChange={(e) => setStagedContent({ ...stagedContent, [field.key]: e.target.value })}
                                onFocus={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                                }}
                            />
                        )}
                    </div>
                ))}

                {/* Actions */}
                <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={handleSaveAll}
                            disabled={!hasChanges || saving}
                            style={{
                                paddingLeft: '32px',
                                paddingRight: '32px',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '700',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s ease',
                                border: 'none',
                                cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
                                backgroundColor: hasChanges && !saving ? '#000000' : 'rgba(0,0,0,0.1)',
                                color: hasChanges && !saving ? '#ffffff' : 'rgba(0,0,0,0.3)'
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        {hasChanges && !saving && (
                            <button
                                onClick={handleReset}
                                style={{
                                    paddingLeft: '24px',
                                    paddingRight: '24px',
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    color: '#ff4444',
                                    borderRadius: '6px',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                }}
                            >
                                Reset
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: hasChanges ? '#ff9800' : '#4caf50'
                        }}></div>
                        <span style={{ fontSize: '10px', letterSpacing: '0.05em', color: 'rgba(0,0,0,0.5)', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                            {hasChanges ? 'Unsaved' : 'Saved'}
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
