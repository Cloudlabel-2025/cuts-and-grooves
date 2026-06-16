'use client';

import { useEffect, useState, useMemo } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';
import ConfirmModal from '@/app/components/admin/ConfirmModal';
import SearchBar from '@/app/components/admin/SearchBar';
import RichTextEditor from '@/app/components/admin/RichTextEditor';
import { useToast } from '@/app/components/admin/Toast';
import { useKeyboardShortcut } from '@/app/components/admin/useKeyboardShortcut';

const EMPTY_PROJECT = {
    title: '', category: '', year: '', location: '', description: '', mainImage: '', gallery: [], isFeatured: false,
};

export default function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_PROJECT);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState('');
    const [filterFeatured, setFilterFeatured] = useState('all');
    const toast = useToast();

    useKeyboardShortcut('Escape', false, () => {
        if (showForm) { closeForm(); }
    });

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects', { cache: 'no-store' });
            if (res.ok) setProjects(await res.json());
        } catch (e) {
            if (e.name !== 'AbortError') console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const openCreateForm = () => {
        setEditingId(null);
        setFormData(EMPTY_PROJECT);
        setShowForm(true);
        setTimeout(() => document.getElementById('pm-form-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    };

    const closeForm = () => { setShowForm(false); setEditingId(null); setFormData(EMPTY_PROJECT); };

    const handleEdit = (project) => {
        const normalizeGallery = (gallery) => {
            if (!gallery) return [];
            return gallery.map(item =>
                typeof item === 'string' ? { url: item, description: '' } : item
            );
        };
        setFormData({
            title: project.title || '', category: project.category || '', year: project.year || '',
            location: project.location || '', description: project.description || '',
            mainImage: project.mainImage || '', gallery: normalizeGallery(project.gallery), isFeatured: project.isFeatured || false,
        });
        setEditingId(project._id);
        setShowForm(true);
        setTimeout(() => document.getElementById('pm-form-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    };

    const updateField = (key, value) => setFormData((c) => ({ ...c, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.mainImage) { toast('Please upload a main image.', 'warning'); return; }
        setSaving(true);
        const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
        const method = editingId ? 'PUT' : 'POST';
        const body = {
            ...formData,
            slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        };
        const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        setSaving(false);
        if (res.ok) {
            closeForm(); fetchProjects();
            toast(editingId ? 'Project updated successfully' : 'Project created successfully');
        } else {
            toast('Failed to save project', 'error');
        }
    };

    const confirmDelete = (project) => {
        setDeleteTarget(project);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(deleteTarget._id);
        const res = await fetch(`/api/projects/${deleteTarget._id}`, { method: 'DELETE' });
        setDeleting(null);
        setDeleteTarget(null);
        if (res.ok) {
            fetchProjects();
            toast('Project deleted successfully');
        } else {
            toast('Failed to delete project', 'error');
        }
    };

    const filtered = useMemo(() => {
        return projects.filter(p => {
            const matchesSearch = !search ||
                p.title?.toLowerCase().includes(search.toLowerCase()) ||
                p.category?.toLowerCase().includes(search.toLowerCase()) ||
                p.location?.toLowerCase().includes(search.toLowerCase());
            const matchesFeatured = filterFeatured === 'all' ||
                (filterFeatured === 'featured' && p.isFeatured) ||
                (filterFeatured === 'standard' && !p.isFeatured);
            return matchesSearch && matchesFeatured;
        });
    }, [projects, search, filterFeatured]);

    const featured = projects.filter((p) => p.isFeatured);
    const regular = projects.filter((p) => !p.isFeatured);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <ConfirmModal
                open={!!deleteTarget}
                title="Delete Project"
                message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => { setDeleteTarget(null); }}
                loading={deleting === deleteTarget?._id}
            />

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <StatCard label="Total Projects" value={projects.length} />
                <StatCard label="Featured" value={featured.length} accent />
                <StatCard label="Standard" value={regular.length} />
                <StatCard label="Filtered" value={filtered.length} />
            </div>

            {/* Toolbar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 24px', background: '#fff', borderRadius: '18px',
                border: '1px solid var(--admin-border)', boxShadow: '0 8px 28px rgba(0,0,0,0.04)',
                flexWrap: 'wrap', gap: '12px'
            }}>
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by title, category, location…"
                    total={filtered.length}
                />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                        value={filterFeatured}
                        onChange={e => setFilterFeatured(e.target.value)}
                        style={{
                            padding: '10px 14px', borderRadius: '999px', border: '1px solid var(--admin-border)',
                            background: '#fafaf8', fontSize: '12px', fontWeight: '600',
                            color: '#000', outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        }}
                    >
                        <option value="all">All Projects</option>
                        <option value="featured">Featured</option>
                        <option value="standard">Standard</option>
                    </select>
                    <button
                        type="button"
                        onClick={showForm ? closeForm : openCreateForm}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '11px 22px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                            fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase',
                            background: showForm ? 'transparent' : 'var(--admin-text)',
                            color: showForm ? 'var(--admin-text)' : '#fff',
                            outline: showForm ? '1px solid var(--admin-border)' : 'none',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {showForm ? (
                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg> Close</>
                        ) : (
                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg> Add Project</>
                        )}
                    </button>
                </div>
            </div>

            {/* Form Panel */}
            <div id="pm-form-anchor" />
            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    background: '#fff', borderRadius: '22px',
                    border: '1px solid var(--admin-border)', boxShadow: '0 16px 52px rgba(0,0,0,0.07)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '24px 28px', borderBottom: '1px solid var(--admin-border)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        background: 'linear-gradient(135deg,rgba(255,255,255,0.98),rgba(250,249,246,0.88))',
                        flexWrap: 'wrap', gap: '14px'
                    }}>
                        <div>
                            <span className="admin-kicker">{editingId ? 'Editing Record' : 'New Record'}</span>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                                {editingId ? 'Update Project' : 'Register Project'}
                            </h3>
                        </div>
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 18px', borderRadius: '12px',
                            border: `1px solid ${formData.isFeatured ? 'rgba(155,116,72,0.4)' : 'var(--admin-border)'}`,
                            background: formData.isFeatured ? 'rgba(155,116,72,0.06)' : 'transparent',
                            cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                            color: formData.isFeatured ? 'var(--admin-accent)' : 'var(--admin-muted)',
                            transition: 'all 0.2s ease', userSelect: 'none',
                        }}>
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => updateField('isFeatured', e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: 'var(--admin-accent)', cursor: 'pointer' }}
                            />
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={formData.isFeatured ? 'var(--admin-accent)' : 'none'} stroke={formData.isFeatured ? 'var(--admin-accent)' : 'currentColor'} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            Featured Project
                        </label>
                    </div>

                    <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <Field label="Project Title" required value={formData.title} onChange={(v) => updateField('title', v)} placeholder="The Glass Pavilion" />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <Field label="Category" required value={formData.category} onChange={(v) => updateField('category', v)} placeholder="Residential" />
                                <Field label="Year" value={formData.year} onChange={(v) => updateField('year', v)} placeholder="2026" />
                            </div>
                            <Field label="Location" value={formData.location} onChange={(v) => updateField('location', v)} placeholder="New Delhi, India" />
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>
                                    Narrative / Description
                                </span>
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(val) => updateField('description', val)}
                                    placeholder="Describe the design intent, materials, and client outcome..."
                                    minHeight="130px"
                                />
                            </label>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                            <AssetBlock
                                label="Main Image"
                                sub="Required hero image"
                                url={formData.mainImage}
                                onUpload={(url) => updateField('mainImage', url)}
                                onRemove={() => updateField('mainImage', '')}
                            />
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>Gallery</span>
                                    <span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{formData.gallery.length} image{formData.gallery.length !== 1 ? 's' : ''}</span>
                                </div>
                                <CloudinaryUpload onUploadSuccess={(url) => setFormData((c) => ({ ...c, gallery: [...c.gallery, { url, description: '' }] }))} />
                                {formData.gallery.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                                        {formData.gallery.map((item, i) => {
                                            const imgUrl = typeof item === 'string' ? item : item.url;
                                            const desc = typeof item === 'string' ? '' : (item.description || '');
                                            return (
                                                <div key={`${imgUrl}-${i}`} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px', borderRadius: '12px', background: '#fafaf8', border: '1px solid var(--admin-border)' }}>
                                                    <div style={{ position: 'relative', width: '80px', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', background: '#f0efeb', flexShrink: 0 }}>
                                                        <img src={imgUrl} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        <input
                                                            type="text"
                                                            value={desc}
                                                            onChange={(e) => setFormData((c) => {
                                                                const updated = [...c.gallery];
                                                                const clean = typeof updated[i] === 'string' ? { url: updated[i], description: '' } : { ...updated[i] };
                                                                clean.description = e.target.value;
                                                                updated[i] = clean;
                                                                return { ...c, gallery: updated };
                                                            })}
                                                            placeholder="Image description..."
                                                            style={{
                                                                width: '100%', height: '32px', padding: '0 10px',
                                                                border: '1px solid var(--admin-border)', borderRadius: '8px',
                                                                background: '#fff', fontSize: '12px', outline: 'none',
                                                                fontFamily: 'inherit', color: 'var(--admin-text)',
                                                            }}
                                                        />
                                                        <span style={{ fontSize: '10px', color: 'var(--admin-muted)' }}>{imgUrl.split('/').pop()?.slice(-20)}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData((c) => ({ ...c, gallery: c.gallery.filter((_, idx) => idx !== i) }))}
                                                        style={{
                                                            width: '24px', height: '24px', borderRadius: '50%',
                                                            background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                                                            cursor: 'pointer', fontSize: '11px', display: 'grid', placeItems: 'center',
                                                            flexShrink: 0, marginTop: '2px',
                                                        }}
                                                    >✕</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        padding: '20px 28px', borderTop: '1px solid var(--admin-border)',
                        display: 'flex', justifyContent: 'flex-end', gap: '12px',
                        background: 'rgba(250,249,246,0.6)',
                    }}>
                        <button type="button" onClick={closeForm} style={secondaryBtn}>Cancel</button>
                        <button type="submit" disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }}>
                            {saving ? 'Saving…' : editingId ? 'Update Project' : 'Save Project'}
                        </button>
                    </div>
                </form>
            )}

            {/* Project List */}
            <div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div>
                        <span className="admin-kicker">Published Records</span>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                            {search || filterFeatured !== 'all' ? `${filtered.length} of ${projects.length}` : `${projects.length}`} Project{projects.length !== 1 ? 's' : ''}
                        </h3>
                    </div>
                </div>

                {loading ? (
                    <div style={emptyState}>
                        <div style={{ width: '32px', height: '32px', border: '2px solid var(--admin-border)', borderTop: '2px solid var(--admin-text)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ fontSize: '13px', color: 'var(--admin-muted)' }}>Loading projects…</span>
                        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ ...emptyState, flexDirection: 'column', padding: '60px 24px' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" /></svg>
                        <p style={{ margin: '12px 0 4px', fontWeight: '600', color: 'var(--admin-text)' }}>
                            {search || filterFeatured !== 'all' ? 'No matching projects' : 'No projects yet'}
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-muted)' }}>
                            {search || filterFeatured !== 'all' ? 'Try adjusting your search or filter.' : 'Click "Add Project" to register your first entry.'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {filtered.map((project) => (
                            <ProjectCard key={project._id} project={project} onEdit={handleEdit} onDelete={confirmDelete} deleting={deleting === project._id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Sub-components ── */

function StatCard({ label, value, accent = false }) {
    return (
        <div style={{
            padding: '20px 22px', background: '#fff', borderRadius: '16px',
            border: `1px solid ${accent ? 'rgba(155,116,72,0.22)' : 'var(--admin-border)'}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: accent ? 'var(--admin-accent)' : 'var(--admin-muted)', display: 'block', marginBottom: '8px' }}>
                {label}
            </span>
            <strong style={{ fontSize: '2rem', lineHeight: 1, fontWeight: '700', color: accent ? 'var(--admin-accent)' : 'var(--admin-text)' }}>{value}</strong>
        </div>
    );
}

function Field({ label, value, onChange, required = false, placeholder = '' }) {
    return (
        <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>
                {label}{required && <span style={{ color: 'var(--admin-accent)', marginLeft: '3px' }}>*</span>}
            </span>
            <input
                required={required}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: '100%', height: '44px', padding: '0 14px',
                    border: '1px solid var(--admin-border)', borderRadius: '12px',
                    background: '#fafaf8', fontSize: '14px', outline: 'none',
                    fontFamily: 'inherit', color: 'var(--admin-text)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(155,116,72,0.55)'; e.target.style.boxShadow = '0 0 0 4px rgba(155,116,72,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--admin-border)'; e.target.style.boxShadow = 'none'; }}
            />
        </label>
    );
}

function AssetBlock({ label, sub, url, onUpload, onRemove }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>{label}</span>
                <span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>{sub}</span>
            </div>
            <CloudinaryUpload onUploadSuccess={onUpload} />
            {url ? (
                <div style={{ position: 'relative', marginTop: '10px', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', background: '#f0efeb' }}>
                    <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                        type="button"
                        onClick={onRemove}
                        style={{
                            position: 'absolute', top: '8px', right: '8px',
                            padding: '5px 12px', borderRadius: '999px',
                            background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                            cursor: 'pointer', fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em',
                        }}
                    >Remove</button>
                </div>
            ) : (
                <div style={{
                    marginTop: '10px', borderRadius: '12px', aspectRatio: '16/9',
                    background: '#f4f3ef', border: '1px dashed var(--admin-border)',
                    display: 'grid', placeItems: 'center',
                    fontSize: '12px', color: 'var(--admin-muted)',
                }}>No image selected</div>
            )}
        </div>
    );
}

function ProjectCard({ project, onEdit, onDelete, deleting }) {
    return (
        <article style={{
            background: '#fff', borderRadius: '18px',
            border: '1px solid var(--admin-border)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.05)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
        >
            <div style={{ position: 'relative', aspectRatio: '16/9', background: '#f4f3ef', overflow: 'hidden' }}>
                {project.mainImage
                    ? <img src={project.mainImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
                    </div>
                }
                {project.isFeatured && (
                    <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '4px 10px', borderRadius: '999px',
                        background: 'rgba(155,116,72,0.9)', backdropFilter: 'blur(8px)',
                        fontSize: '10px', fontWeight: '800', letterSpacing: '0.08em',
                        textTransform: 'uppercase', color: '#fff',
                    }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        Featured
                    </div>
                )}
                {project.gallery?.length > 0 && (
                    <div style={{
                        position: 'absolute', bottom: '10px', right: '10px',
                        padding: '3px 9px', borderRadius: '999px',
                        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
                        fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em',
                    }}>+{project.gallery.length} photos</div>
                )}
            </div>

            <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                    <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-accent)', display: 'block', marginBottom: '4px' }}>
                        {project.category || 'Uncategorized'}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                        {project.title}
                    </h3>
                    {(project.location || project.year) && (
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                            {[project.location, project.year].filter(Boolean).join(' · ')}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--admin-border)' }}>
                    <button
                        type="button"
                        onClick={() => onEdit(project)}
                        style={{ ...secondaryBtn, flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(project)}
                        disabled={deleting}
                        style={{
                            ...secondaryBtn, flexShrink: 0,
                            color: deleting ? 'var(--admin-muted)' : '#c0392b',
                            borderColor: deleting ? 'var(--admin-border)' : 'rgba(192,57,43,0.25)',
                            background: deleting ? 'transparent' : 'rgba(192,57,43,0.04)',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        {deleting
                            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" /></svg>
                        }
                        {deleting ? '' : 'Delete'}
                    </button>
                </div>
            </div>
        </article>
    );
}

const primaryBtn = {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '11px 22px', borderRadius: '999px', border: 'none',
    background: 'var(--admin-text)', color: '#fff', cursor: 'pointer',
    fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase',
    transition: 'all 0.2s ease',
};

const secondaryBtn = {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '9px 18px', borderRadius: '10px',
    border: '1px solid var(--admin-border)', background: 'transparent',
    color: 'var(--admin-text)', cursor: 'pointer',
    fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
    transition: 'all 0.2s ease',
};

const emptyState = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
    padding: '48px', background: '#fff', borderRadius: '18px',
    border: '1px solid var(--admin-border)', color: 'var(--admin-muted)',
    textAlign: 'center',
};
