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
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
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
            alert('Please provide a visual asset (Main Image) for this project.');
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
        <div className="space-y-12">
            <div className="flex justify-between items-center pb-8 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></div>
                    <h2 className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">Projects</h2>
                </div>
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
                    className={`px-8 py-4 text-[9px] font-bold uppercase tracking-[0.4em] rounded-xl transition-all duration-500 shadow-lg ${showForm
                        ? 'bg-white text-red-500 border border-red-100 shadow-red-500/5'
                        : 'bg-black text-white hover:bg-[#A67C52] shadow-black/10'
                        }`}
                >
                    {showForm ? 'Cancel' : 'Add New Project'}
                </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-50/50 p-12 rounded-[2.5rem] border border-gray-100 space-y-12 animate-in fade-in zoom-in-95 duration-700"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-10">
                            <FormInput
                                label="Project Name"
                                value={formData.title}
                                onChange={(val) => setFormData({ ...formData, title: val })}
                                required
                            />
                            <div className="grid grid-cols-2 gap-8">
                                <FormInput
                                    label="Category"
                                    value={formData.category}
                                    onChange={(val) => setFormData({ ...formData, category: val })}
                                    required
                                />
                                <FormInput
                                    label="Year"
                                    placeholder="2024"
                                    value={formData.year}
                                    onChange={(val) => setFormData({ ...formData, year: val })}
                                />
                            </div>
                            <FormInput
                                label="Location"
                                value={formData.location}
                                onChange={(val) => setFormData({ ...formData, location: val })}
                            />
                        </div>

                        <div className="space-y-12">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">
                                        Visual Asset
                                    </label>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[7px] text-gray-300 uppercase tracking-widest">Recommended Size</span>
                                        <span className="text-[9px] text-[#A67C52] font-bold uppercase tracking-tighter">2000 x 1200 PX</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <CloudinaryUpload onUploadSuccess={(url) => setFormData({ ...formData, mainImage: url })} />
                                    {formData.mainImage && (
                                        <div className="relative group w-full aspect-video rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner">
                                            <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, mainImage: '' })}
                                                    className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all"
                                                >
                                                    Remove Asset
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-gray-200/50">
                        <button
                            type="submit"
                            className="px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-xl hover:bg-[#A67C52] transition-all duration-500 shadow-xl shadow-black/10"
                        >
                            {editingId ? 'Save Changes' : 'Save Project'}
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div className="flex items-center space-x-4 py-12 opacity-30">
                    <div className="w-1.5 h-1.5 bg-black animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((p) => (
                        <div key={p._id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-xl hover:border-[#A67C52]/20 transition-all duration-700">
                            <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                                {p.mainImage ? (
                                    <img src={p.mainImage} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200 text-[10px] uppercase font-bold tracking-widest">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center space-x-4">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="bg-white text-black px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#A67C52] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-red-600 hover:border-red-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-[11px] font-bold tracking-widest uppercase group-hover:text-[#A67C52] transition-colors">{p.title}</h3>
                                    <span className="text-[8px] text-gray-300 tracking-widest font-bold uppercase">{p.year}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-4 h-[1px] bg-gray-100"></div>
                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{p.category}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function FormInput({ label, value, onChange, required = false, type = "text", placeholder = "" }) {
    return (
        <div className="flex flex-col space-y-4 group">
            <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 group-focus-within:text-[#A67C52] transition-colors">
                    {label}
                </label>
                <span className="w-1 h-1 bg-gray-100 rounded-full"></span>
            </div>
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:border-[#A67C52]/40 focus:bg-white focus:ring-8 focus:ring-[#A67C52]/5 transition-all duration-500 text-sm font-medium tracking-tight text-gray-900 placeholder:text-gray-200"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
