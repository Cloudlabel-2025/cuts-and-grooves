'use client';

import { useState } from 'react';

export default function CloudinaryUpload({ onUploadSuccess, folder = 'projects' }) {
    const [uploading, setUploading] = useState(false);

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
        <div className="relative group">
            <label className={`
                cursor-pointer px-10 py-5 rounded-2xl flex items-center justify-center space-x-4 
                transition-all duration-500 border-2 border-dashed
                ${uploading
                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-100 text-black shadow-sm group-hover:border-[#A67C52] group-hover:text-[#A67C52] group-hover:shadow-lg'
                }
            `}>
                <span className={`text-xl transition-transform duration-500 ${uploading ? 'animate-spin' : 'group-hover:scale-125'}`}>
                    {uploading ? '◌' : '↑'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
                    {uploading ? 'Uploading...' : 'Upload File'}
                </span>
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*,video/*" />
            </label>
            {!uploading && (
                <div className="absolute top-1/2 left-full ml-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
                    <div className="bg-black text-[8px] text-white px-3 py-1.5 rounded-full uppercase tracking-widest font-bold shadow-2xl">
                        Max size: 50MB
                    </div>
                </div>
            )}
        </div>
    );
}
