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
        isFeatured: false
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const res = await fetch('/api/projects', { signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title || '',
            category: project.category || '',
            year: project.year || '',
            location: project.location || '',
            description: project.description || '',
            mainImage: project.mainImage || '',
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
            setFormData({ title: '', category: '', year: '', location: '', description: '', mainImage: '', isFeatured: false });
            fetchProjects();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this project?')) {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (res.ok) fetchProjects();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', fontWeight: '700', textTransform: 'uppercase', margin: 0 }}>
                    Projects
                </h2>
                <button
                    onClick={() => {
                        if (showForm) {
                            setShowForm(false);
                            setEditingId(null);
                        } else {
                            setFormData({ title: '', category: '', year: '', location: '', description: '', mainImage: '', isFeatured: false });
                            setShowForm(true);
                        }
                    }}
                    style={{
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: showForm ? '#ffffff' : '#000000',
                        color: showForm ? '#ff4444' : '#ffffff'
                    }}
                    onMouseEnter={(e) => {
                        if (!showForm) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)';
                    }}
                    onMouseLeave={(e) => {
                        if (!showForm) e.currentTarget.style.backgroundColor = '#000000';
                    }}
                >
                    {showForm ? 'Cancel' : 'Add Project'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '48px', backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <FormInput label="Project Name" value={formData.title} onChange={(val) => setFormData({ ...formData, title: val })} required />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <FormInput label="Category" value={formData.category} onChange={(val) => setFormData({ ...formData, category: val })} required />
                                <FormInput label="Year" placeholder="2024" value={formData.year} onChange={(val) => setFormData({ ...formData, year: val })} />
                            </div>
                            <FormInput label="Location" value={formData.location} onChange={(val) => setFormData({ ...formData, location: val })} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '8px', paddingRight: '8px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', margin: 0 }}>
                                    Main Image
                                </label>
                            </div>
                            <CloudinaryUpload onUploadSuccess={(url) => setFormData({ ...formData, mainImage: url })} />
                            {formData.mainImage && (
                                <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                                    <img src={formData.mainImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mainImage: '' })}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: '#ffffff',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                        <button
                            type="submit"
                            style={{
                                paddingLeft: '32px',
                                paddingRight: '32px',
                                paddingTop: '12px',
                                paddingBottom: '12px',
                                backgroundColor: '#000000',
                                color: '#ffffff',
                                fontSize: '11px',
                                fontWeight: '700',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                        >
                            {editingId ? 'Save Changes' : 'Save Project'}
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
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
            e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
        >
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.05)', position: 'relative' }}>
                {project.mainImage ? (
                    <img src={project.mainImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.2)', fontSize: '12px', fontWeight: '600' }}>
                        No Image
                    </div>
                )}
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#000000', margin: 0, letterSpacing: '-0.01em' }}>
                        {project.title}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', fontWeight: '600' }}>
                        {project.year}
                    </span>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)', margin: 0 }}>
                    {project.category}
                </p>
                <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
                    <button
                        onClick={() => onEdit(project)}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(project._id)}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            backgroundColor: '#ffffff',
                            color: '#ff4444',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ff4444';
                            e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.color = '#ff4444';
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function FormInput({ label, value, onChange, required = false, type = "text", placeholder = "" }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', margin: 0 }}>
                {label}
            </label>
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '6px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#000000',
                    fontFamily: 'inherit'
                }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                }}
            />
        </div>
    );
}
