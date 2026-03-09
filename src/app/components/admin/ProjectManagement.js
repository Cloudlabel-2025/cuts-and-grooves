'use client';

import { useState, useEffect } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';

export default function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        year: '',
        location: '',
        description: '',
        mainImage: '',
        gallery: [],
        isFeatured: false
    });

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects', {
                cache: 'no-store'
            });

            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Fetch project error:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleEdit = (project) => {
        setFormData({
            title: project.title || '',
            category: project.category || '',
            year: project.year || '',
            location: project.location || '',
            description: project.description || '',
            mainImage: project.mainImage || '',
            gallery: project.gallery || [],
            isFeatured: project.isFeatured || false
        });
        setEditingId(project._id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.mainImage) {
            alert('Please provide a main image for this project.');
            return;
        }

        const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
        const method = editingId ? 'PUT' : 'POST';

        const projectData = {
            ...formData,
            slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        };

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });

        if (res.ok) {
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', category: '', year: '', location: '', description: '', mainImage: '', gallery: [], isFeatured: false });
            fetchProjects();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this project?')) {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (res.ok) fetchProjects();
        }
    };

    const addGalleryImage = (url) => {
        setFormData(prev => ({
            ...prev,
            gallery: [...prev.gallery, url]
        }));
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '32px', borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '12px', letterSpacing: '0.4em', color: 'rgba(0,0,0,0.5)', fontWeight: '700', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--font-heading)' }}>
                        Registry
                    </h2>
                    <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '8px' }}>
                        Curate and manage your architectural projects
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) {
                            setShowForm(false);
                            setEditingId(null);
                        } else {
                            setFormData({ title: '', category: '', year: '', location: '', description: '', mainImage: '', gallery: [], isFeatured: false });
                            setShowForm(true);
                        }
                    }}
                    style={{
                        paddingLeft: '32px',
                        paddingRight: '32px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        borderRadius: '4px',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: showForm ? '#ffffff' : '#000000',
                        color: showForm ? '#ff4444' : '#ffffff',
                        boxShadow: showForm ? 'none' : '0 10px 30px rgba(0,0,0,0.1)',
                        fontFamily: 'var(--font-heading)'
                    }}
                >
                    {showForm ? 'Cancel' : 'Register Project'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '64px',
                    padding: '64px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderRadius: '24px',
                    boxShadow: '0 40px 100px -20px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '64px' }}>
                        {/* Left Column: Basic Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            <FormInput label="Title" value={formData.title} onChange={(val) => setFormData({ ...formData, title: val })} required placeholder="E.g. The Glass Pavilion" />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <FormInput label="Category" value={formData.category} onChange={(val) => setFormData({ ...formData, category: val })} required placeholder="Bespoke Residential" />
                                <FormInput label="Year" placeholder="2024" value={formData.year} onChange={(val) => setFormData({ ...formData, year: val })} />
                            </div>
                            <FormInput label="Location" value={formData.location} onChange={(val) => setFormData({ ...formData, location: val })} placeholder="London, United Kingdom" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--font-heading)' }}>
                                    Narrative / Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the architectural intent..."
                                    style={{
                                        width: '100%',
                                        minHeight: '120px',
                                        padding: '16px',
                                        backgroundColor: '#f9f9f9',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        outline: 'none',
                                        resize: 'vertical',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right Column: Assets */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                            {/* Main Image */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--font-heading)' }}>
                                    Primary Asset (Hero)
                                </label>
                                <CloudinaryUpload onUploadSuccess={(url) => setFormData({ ...formData, mainImage: url })} />
                                {formData.mainImage && (
                                    <div style={{ position: 'relative', aspectRatio: '16/10', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                                        <img src={formData.mainImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => setFormData({ ...formData, mainImage: '' })} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '9px', cursor: 'pointer' }}>REMOVE</button>
                                    </div>
                                )}
                            </div>

                            {/* Gallery Images */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <label style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--font-heading)' }}>
                                    Additional Gallery Images
                                </label>
                                <CloudinaryUpload onUploadSuccess={addGalleryImage} />
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                    {formData.gallery.map((url, index) => (
                                        <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                                            <img src={url} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button type="button" onClick={() => removeGalleryImage(index)} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '4px', width: '20px', height: '20px', fontSize: '10px', cursor: 'pointer' }}>×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '40px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <button
                            type="submit"
                            style={{
                                paddingLeft: '48px',
                                paddingRight: '48px',
                                paddingTop: '16px',
                                paddingBottom: '16px',
                                backgroundColor: '#000000',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: '700',
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                fontFamily: 'var(--font-heading)',
                                boxShadow: '0 15px 45px rgba(0,0,0,0.15)'
                            }}
                        >
                            {editingId ? 'Update Record' : 'Commit to Registry'}
                        </button>
                    </div>
                </form>
            )}

            {/* Projects Grid */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '48px', paddingBottom: '48px', opacity: 0.3 }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></div>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '-0.2s' }}></div>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#000000', borderRadius: '50%', animation: 'bounce 1.4s infinite', animationDelay: '-0.4s' }}></div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {projects.map((p) => (
                        <ProjectCard key={p._id} project={p} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            <style jsx>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
}

function ProjectCard({ project, onEdit, onDelete }) {
    return (
        <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 30px 60px -20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
            }}
        >
            <div style={{ aspectRatio: '16/10', overflow: 'hidden', backgroundColor: '#f9f9f9', position: 'relative' }}>
                <img src={project.mainImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '8px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {project.gallery?.length || 0} Gallery
                    </div>
                </div>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#000000', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
                        {project.title}
                    </h3>
                    <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', fontWeight: '600' }}>
                        {project.year}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => onEdit(project)} style={{ flex: 1, padding: '8px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => onDelete(project._id)} style={{ flex: 1, padding: '8px', backgroundColor: '#fff', color: '#ff4444', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '4px', fontSize: '9px', fontWeight: '700', cursor: 'pointer' }}>Delete</button>
                </div>
            </div>
        </div>
    );
}

function FormInput({ label, value, onChange, required = false, type = "text", placeholder = "" }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--font-heading)' }}>
                {label}
            </label>
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                style={{ width: '100%', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', outline: 'none', fontSize: '14px', padding: '12px 0', backgroundColor: 'transparent' }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
