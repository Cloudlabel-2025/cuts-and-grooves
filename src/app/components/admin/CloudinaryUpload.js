'use client';

import { useState, useEffect } from 'react';

export default function CloudinaryUpload({ onUploadSuccess, folder = 'projects' }) {
    const [uploading, setUploading] = useState(false);
    const [widgetLoaded, setWidgetLoaded] = useState(false);

    useEffect(() => {
        // Load Cloudinary Media Library Widget script
        if (!document.getElementById('cloudinary-ml-widget')) {
            const script = document.createElement('script');
            script.id = 'cloudinary-ml-widget';
            script.src = 'https://media-library.cloudinary.com/global/all.js';
            script.async = true;
            script.onload = () => setWidgetLoaded(true);
            document.body.appendChild(script);
        } else {
            setWidgetLoaded(true);
        }
    }, []);

    const openMediaLibrary = () => {
        if (!widgetLoaded || !window.cloudinary) return;

        window.cloudinary.openMediaLibrary(
            {
                cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                username: process.env.ADMIN_EMAIL, // Optional, but can help identify user
                button_class: 'hidden',
                insert_caption: 'Insert',
                multiple: false,
                signature_endpoint: '/api/cloudinary/sign',
            },
            {
                insertHandler: (data) => {
                    if (data.assets && data.assets.length > 0) {
                        onUploadSuccess(data.assets[0].secure_url);
                    }
                }
            }
        );
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
        formData.append('folder', folder);

        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();
            if (data.secure_url) {
                onUploadSuccess(data.secure_url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Check Cloudinary configuration.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '12px' }}>
            {/* Local Upload */}
            <label style={{
                cursor: uploading ? 'not-allowed' : 'pointer',
                padding: '12px 20px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                opacity: uploading ? 0.6 : 1
            }}
                onMouseEnter={(e) => {
                    if (!uploading) {
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!uploading) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                    }
                }}
            >
                <span style={{ fontSize: '14px' }}>{uploading ? '◌' : '↑'}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {uploading ? 'Uploading...' : 'From PC'}
                </span>
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*,video/*" />
            </label>

            {/* Gallery Browse */}
            <button
                onClick={openMediaLibrary}
                disabled={!widgetLoaded || uploading}
                style={{
                    cursor: (!widgetLoaded || uploading) ? 'not-allowed' : 'pointer',
                    padding: '12px 20px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    opacity: (!widgetLoaded || uploading) ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                    if (widgetLoaded && !uploading) {
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (widgetLoaded && !uploading) {
                        e.currentTarget.style.backgroundColor = '#000000';
                    }
                }}
            >
                <span style={{ fontSize: '14px' }}>📁</span>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Gallery
                </span>
            </button>
        </div>
    );
}
