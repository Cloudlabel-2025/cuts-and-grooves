'use client';

import { useState } from 'react';

export default function MediaLibrary() {
    const [uploading, setUploading] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingBottom: '24px',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>
                <div>
                    <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.02em', color: '#000000', margin: 0, marginBottom: '16px' }}>
                        Media Library
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '32px', height: '1px', backgroundColor: '#000000' }}></div>
                        <p style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                            Asset Repository
                        </p>
                    </div>
                </div>
                <button
                    style={{
                        paddingLeft: '32px',
                        paddingRight: '32px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#000000';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    Upload Media
                </button>
            </div>

            {/* Upload Zone */}
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                padding: '64px 48px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
            }}
            >
                <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 10 }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        fontSize: '40px'
                    }}>
                        ☁
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontSize: '12px', letterSpacing: '0.1em', fontWeight: '700', color: '#000000', textTransform: 'uppercase', margin: 0 }}>
                            Cloud Storage Active
                        </h3>
                        <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', lineHeight: '1.6', margin: 0 }}>
                            Drag and drop your media files here or click to browse. Supports images, videos, and documents.
                        </p>
                    </div>
                    <button style={{
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        margin: '0 auto'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#000000';
                    }}
                    >
                        Browse Files
                    </button>
                </div>
            </div>

            {/* Media Grid */}
            <div>
                <h2 style={{ fontSize: '13px', letterSpacing: '0.1em', fontWeight: '700', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: '0 0 24px 0' }}>
                    Recent Assets
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '16px'
                }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                        <MediaCard key={i} index={i} />
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

function MediaCard({ index }) {
    const [showActions, setShowActions] = useState(false);

    return (
        <div
            style={{
                aspectRatio: '1',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
            }}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Thumbnail */}
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'rgba(0,0,0,0.3)',
                fontWeight: '600',
                position: 'relative'
            }}>
                Asset {index}
                
                {/* Overlay */}
                {showActions && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px',
                        animation: 'fadeIn 0.2s ease'
                    }}>
                        <button style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: '#ffffff',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
                            e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.color = '#000000';
                        }}
                        >
                            View
                        </button>
                        <button style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ff4444';
                            e.currentTarget.style.borderColor = '#ff4444';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
