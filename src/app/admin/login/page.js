'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const formBoxRef = useRef(null);
    const contentRef = useRef(null);

    // Initial entrance animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Reset states for left-aligned entrance
            gsap.set(formBoxRef.current, { x: -50, opacity: 0 });
            gsap.set('.login-reveal', { y: 20, opacity: 0 });

            // Entrance sequence
            tl.to(formBoxRef.current, { x: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.2)
                .to('.login-reveal', { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power2.out' }, 0.5);
        }, contentRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError('Invalid credentials. Access denied.');
            setLoading(false);
            gsap.fromTo(formBoxRef.current,
                { x: -8 },
                { x: 0, duration: 0.08, repeat: 7, yoyo: true, ease: 'power1.inOut' }
            );
        } else {
            // Smooth exit
            const tl = gsap.timeline();
            tl.to('.login-reveal', { y: -10, opacity: 0, duration: 0.3, stagger: 0.02, ease: 'power2.in' })
                .to(formBoxRef.current, {
                    opacity: 0,
                    x: -30,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    onComplete: () => router.push('/admin/dashboard')
                }, '-=0.1');
        }
    };

    return (
        <div ref={contentRef} className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden font-sans">

            {/* ─── Full Bleed Architectural Background ─── */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear hover:scale-105"
                style={{
                    backgroundImage: "url('/images/All-works-01.jpg')",
                    // Fallback to a clean architectural image if the local one fails
                    backgroundColor: '#e2e8f0',
                    backgroundBlendMode: 'luminosity'
                }}
            >
                {/* Subtle overlay to ensure the white box pops */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* ─── Responsive Form Container ─── */}
            <div className="w-full max-w-[460px] px-4 sm:px-6 relative z-10 perspective-1000">

                {/* Reference White Soft Box - Sophisticated Layered Shadow */}
                <div
                    ref={formBoxRef}
                    className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12),0_20px_40px_-10px_rgba(0,0,0,0.08)] relative w-full overflow-hidden"
                    style={{ padding: '3.5rem 3rem 4rem 3rem' }}
                >

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="login-reveal text-3xl font-bold text-[#001738] tracking-[-0.03em] mb-2"
                            style={{ fontFamily: 'var(--font-heading)' }}>
                            CUTS & GROOVES
                        </h2>
                        <p className="login-reveal text-[0.85rem] text-gray-400 font-medium tracking-wide uppercase" style={{ letterSpacing: '0.15em' }}>
                            Studio portal
                        </p>
                    </div>

                    {error && (
                        <div className="login-reveal mb-8 py-3.5 px-4 text-[0.8rem] text-red-700 bg-red-50/50 border border-red-100/50 text-center rounded-2xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Input */}
                        <div className="login-reveal space-y-2.5">
                            <label className="block text-[0.75rem] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-7 py-4 bg-gray-50/30 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#A67C52]/40 focus:ring-4 focus:ring-[#A67C52]/5 focus:outline-none transition-all duration-300 text-[#001738] placeholder:text-gray-300 text-sm"
                                placeholder="name@candg.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="login-reveal space-y-2.5 relative">
                            <label className="block text-[0.75rem] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-7 pr-14 py-4 bg-gray-50/30 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#A67C52]/40 focus:ring-4 focus:ring-[#A67C52]/5 focus:outline-none transition-all duration-300 text-[#001738] placeholder:text-gray-300 text-sm tracking-widest"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#A67C52] transition-colors p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password text with brand color accent */}
                        <div className="login-reveal flex justify-end">
                            <a href="#" className="text-[0.75rem] font-bold text-gray-400 hover:text-[#A67C52] transition-colors uppercase tracking-widest">
                                Forgot password?
                            </a>
                        </div>

                        <div className="login-reveal pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-[#A67C52] to-[#cba37b] text-white font-bold uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-[#A67C52]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-[0.8rem] rounded-2xl"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Authorizing...</span>
                                    </span>
                                ) : (
                                    <span>Sign in</span>
                                )}
                            </button>
                        </div>
                    </form>

                </div>

                {/* Footer text with refined styling */}
                <div className="login-reveal mt-8 text-center text-[0.75rem] font-bold text-[#001738]/60 uppercase tracking-[0.15em]">
                    First time here? <a href="/" className="text-[#A67C52] border-b border-[#A67C52]/30 hover:border-[#A67C52] transition-all pb-0.5 ml-1">Return to Website</a>
                </div>
            </div>
        </div>
    );
}
