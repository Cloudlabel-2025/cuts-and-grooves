'use client';

import { useState, useEffect } from 'react';

export default function TestimonialManagement() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        quote: '',
        author: '',
        role: '',
        order: 0
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setTestimonials([]);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.quote.trim() || !formData.author.trim()) {
            alert('Please provide a quote and an author.');
            return;
        }

        const res = await fetch('/api/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setShowForm(false);
            setFormData({ quote: '', author: '', role: '', order: 0 });
            fetchTestimonials();
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this testimonial?')) {
            const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
            if (res.ok) fetchTestimonials();
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center pb-8 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></div>
                    <h2 className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">Testimonials</h2>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) setFormData({ quote: '', author: '', role: '', order: 0 });
                    }}
                    className={`px-8 py-4 text-[9px] font-bold uppercase tracking-[0.4em] rounded-xl transition-all duration-500 shadow-lg ${showForm
                        ? 'bg-white text-red-500 border border-red-100 shadow-red-500/5'
                        : 'bg-black text-white hover:bg-[#A67C52] shadow-black/10'
                        }`}
                >
                    {showForm ? 'Cancel' : 'Add Testimonial'}
                </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-50/50 p-12 rounded-[2.5rem] border border-gray-100 space-y-12 animate-in fade-in zoom-in-95 duration-700"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-10">
                            <div className="flex flex-col space-y-4 group">
                                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 group-focus-within:text-[#A67C52] transition-colors px-2">
                                    Quote
                                </label>
                                <textarea
                                    className="w-full bg-white border border-gray-100 rounded-[2rem] p-8 text-base font-medium tracking-tight text-gray-900 focus:outline-none focus:border-[#A67C52]/40 focus:bg-white focus:ring-8 focus:ring-[#A67C52]/5 transition-all duration-500 min-h-[160px] resize-none"
                                    value={formData.quote}
                                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-10">
                            <FormInput
                                label="Client Name"
                                value={formData.author}
                                onChange={(val) => setFormData({ ...formData, author: val })}
                                required
                            />
                            <FormInput
                                label="Role / Title"
                                value={formData.role}
                                onChange={(val) => setFormData({ ...formData, role: val })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-gray-200/50">
                        <button
                            type="submit"
                            className="px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-xl hover:bg-[#A67C52] transition-all duration-500 shadow-xl shadow-black/10"
                        >
                            Save Testimonial
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
                    {testimonials.map((t) => (
                        <div key={t._id} className="bg-white border border-gray-100 rounded-[2rem] p-8 flex flex-col justify-between group shadow-sm hover:shadow-xl hover:border-[#A67C52]/20 transition-all duration-700">
                            <div>
                                <p className="text-gray-600 font-light italic leading-relaxed mb-8 text-sm group-hover:text-black transition-colors">
                                    "{t.quote}"
                                </p>
                            </div>
                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <div>
                                    <h4 className="text-[11px] font-bold tracking-widest uppercase text-black mb-1">{t.author}</h4>
                                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{t.role}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(t._id)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-red-300 hover:text-white hover:bg-red-500 transition-all duration-300"
                                    title="Delete"
                                >
                                    ✕
                                </button>
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
