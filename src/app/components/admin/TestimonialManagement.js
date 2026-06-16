'use client';

import { useState, useEffect, useMemo } from 'react';
import CloudinaryUpload from '@/app/components/admin/CloudinaryUpload';
import RichTextEditor from '@/app/components/admin/RichTextEditor';
import ConfirmModal from '@/app/components/admin/ConfirmModal';
import SearchBar from '@/app/components/admin/SearchBar';
import { useToast } from '@/app/components/admin/Toast';
import { useKeyboardShortcut } from '@/app/components/admin/useKeyboardShortcut';

const EMPTY_FORM = { quote: '', author: '', role: '', image: '', order: 0 };

export default function TestimonialManagement() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState('');
    const toast = useToast();

    useKeyboardShortcut('Escape', false, () => {
        if (showForm) { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); }
    });

    useEffect(() => { fetchTestimonials(); }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/testimonials');
            if (res.ok) setTestimonials(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.quote.trim() || !formData.author.trim()) {
            toast('Please provide a quote and an author.', 'warning');
            return;
        }
        setSaving(true);
        const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
        const method = editingId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setSaving(false);
        if (res.ok) {
            setShowForm(false);
            setEditingId(null);
            setFormData(EMPTY_FORM);
            fetchTestimonials();
            toast(editingId ? 'Testimonial updated' : 'Testimonial created');
        } else {
            toast('Failed to save testimonial', 'error');
        }
    };

    const handleEdit = (testimonial) => {
        setFormData({
            quote: testimonial.quote || '', author: testimonial.author || '',
            role: testimonial.role || '', image: testimonial.image || '', order: testimonial.order || 0,
        });
        setEditingId(testimonial._id);
        setShowForm(true);
    };

    const confirmDelete = (testimonial) => {
        setDeleteTarget(testimonial);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        const res = await fetch(`/api/testimonials/${deleteTarget._id}`, { method: 'DELETE' });
        setDeleting(false);
        if (res.ok) {
            fetchTestimonials();
            setDeleteTarget(null);
            toast('Testimonial deleted');
        } else {
            toast('Failed to delete testimonial', 'error');
        }
    };

    const filtered = useMemo(() => {
        if (!search) return testimonials;
        const q = search.toLowerCase();
        return testimonials.filter(t =>
            t.author?.toLowerCase().includes(q) ||
            t.quote?.toLowerCase().includes(q) ||
            t.role?.toLowerCase().includes(q)
        );
    }, [testimonials, search]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <ConfirmModal
                open={!!deleteTarget}
                title="Delete Testimonial"
                message={`Remove testimonial by "${deleteTarget?.author}"? This cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => { setDeleteTarget(null); }}
                loading={deleting}
            />

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <StatCard label="Total" value={testimonials.length} />
                <StatCard label="Filtered" value={filtered.length} />
                <StatCard label="With Photos" value={testimonials.filter(t => t.image).length} accent />
            </div>

            {/* Toolbar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 24px', background: '#fff', borderRadius: '18px',
                border: '1px solid var(--admin-border)', flexWrap: 'wrap', gap: '12px',
            }}>
                <SearchBar value={search} onChange={setSearch} placeholder="Search testimonials..." total={filtered.length} />
                <button
                    onClick={() => {
                        if (showForm) { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); }
                        else setShowForm(true);
                    }}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '11px 22px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                        fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase',
                        background: showForm ? 'transparent' : '#000',
                        color: showForm ? '#000' : '#fff',
                        outline: showForm ? '1px solid var(--admin-border)' : 'none',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {showForm ? '✕ Close' : '+ Add Testimonial'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} style={{
                    background: '#fff', borderRadius: '22px',
                    border: '1px solid var(--admin-border)',
                    boxShadow: '0 16px 52px rgba(0,0,0,0.07)', overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '24px 28px', borderBottom: '1px solid var(--admin-border)',
                        background: 'linear-gradient(135deg,rgba(255,255,255,0.98),rgba(250,249,246,0.88))',
                    }}>
                        <span className="admin-kicker">{editingId ? 'Editing' : 'New'}</span>
                        <h3 style={{ margin: '6px 0 0', fontSize: '18px', fontWeight: '700' }}>
                            {editingId ? 'Update Testimonial' : 'Add Testimonial'}
                        </h3>
                    </div>

                    <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '8px' }}>Quote *</span>
                                <RichTextEditor
                                    value={formData.quote}
                                    onChange={(val) => setFormData({ ...formData, quote: val })}
                                    placeholder="Enter the testimonial quote..."
                                    minHeight="140px"
                                />
                            </div>
                            <FormInput label="Client Name *" value={formData.author} onChange={(val) => setFormData({ ...formData, author: val })} required />
                            <FormInput label="Role / Title" value={formData.role} onChange={(val) => setFormData({ ...formData, role: val })} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '8px' }}>Client Photo</span>
                                <CloudinaryUpload folder="testimonials" onUploadSuccess={(url) => setFormData({ ...formData, image: url })} />
                                {formData.image && (
                                    <div style={{ position: 'relative', marginTop: '10px', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                                        <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            style={{
                                                position: 'absolute', top: '4px', right: '4px',
                                                width: '24px', height: '24px', borderRadius: '50%',
                                                background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                                                cursor: 'pointer', fontSize: '11px',
                                            }}
                                        >✕</button>
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
                        <button
                            type="button"
                            onClick={() => { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); }}
                            style={{
                                padding: '11px 22px', borderRadius: '999px', border: '1px solid var(--admin-border)',
                                background: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                            }}
                        >Cancel</button>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '11px 22px', borderRadius: '999px', border: 'none',
                                background: '#000', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer',
                                fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase',
                                opacity: saving ? 0.6 : 1,
                            }}
                        >{saving ? 'Saving…' : 'Save Testimonial'}</button>
                    </div>
                </form>
            )}

            {/* List */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '48px', color: 'var(--admin-muted)' }}>
                    <div style={{ width: '28px', height: '28px', border: '2px solid var(--admin-border)', borderTop: '2px solid var(--admin-text)', borderRadius: '50%', animation: 'tSpin 0.8s linear infinite' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Loading testimonials…</span>
                    <style>{`@keyframes tSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '60px 24px', background: '#fff', borderRadius: '18px', border: '1px solid var(--admin-border)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    <p style={{ margin: 0, fontWeight: '600' }}>{search ? 'No matching testimonials' : 'No testimonials yet'}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--admin-muted)' }}>{search ? 'Try a different search term.' : 'Click "Add Testimonial" to create one.'}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {filtered.map((t) => (
                        <div key={t._id} style={{
                            background: '#fff', borderRadius: '18px', border: '1px solid var(--admin-border)',
                            boxShadow: '0 8px 28px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
                        >
                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {t.image && (
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--admin-border)', flexShrink: 0 }}>
                                        <img src={t.image} alt={t.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'rgba(0,0,0,0.7)', fontStyle: 'italic' }}>
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '12px', fontWeight: '700', letterSpacing: '0.02em' }}>{t.author}</h4>
                                        {t.role && <span style={{ fontSize: '11px', color: 'var(--admin-muted)' }}>{t.role}</span>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(t)} style={{
                                            padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)',
                                            background: 'transparent', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#000',
                                        }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button onClick={() => confirmDelete(t)} style={{
                                            padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(192,57,43,0.25)',
                                            background: 'rgba(192,57,43,0.04)', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#c0392b',
                                        }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, accent = false }) {
    return (
        <div style={{
            padding: '20px 22px', background: '#fff', borderRadius: '16px',
            border: `1px solid ${accent ? 'rgba(155,116,72,0.22)' : 'var(--admin-border)'}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: accent ? 'var(--admin-accent)' : 'var(--admin-muted)', display: 'block', marginBottom: '8px' }}>{label}</span>
            <strong style={{ fontSize: '2rem', lineHeight: 1, fontWeight: '700', color: accent ? 'var(--admin-accent)' : 'var(--admin-text)' }}>{value}</strong>
        </div>
    );
}

function FormInput({ label, value, onChange, required = false }) {
    return (
        <div>
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--admin-muted)', display: 'block', marginBottom: '8px' }}>
                {label}{required && <span style={{ color: 'var(--admin-accent)', marginLeft: '3px' }}>*</span>}
            </span>
            <input
                required={required}
                value={value}
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
        </div>
    );
}
