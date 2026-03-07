'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import ArchitecturalBackground from '../../components/ArchitecturalBackground';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    const contentRef = useRef(null);

    // Initial entrance and 3D interactions
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance Animation
            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

            gsap.set(cardRef.current, {
                y: 60,
                opacity: 0,
                rotateX: -10,
                scale: 0.95
            });

            gsap.set('.login-reveal', {
                y: 30,
                opacity: 0
            });

            tl.to(cardRef.current, {
                y: 0,
                opacity: 1,
                rotateX: 0,
                scale: 1,
                duration: 1.8,
                clearProps: "transform"
            })
                .to('.login-reveal', {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.08
                }, "-=1.2");

            // Mouse Interaction for 3D Tilt
            const handleMouseMove = (e) => {
                if (!cardRef.current) return;

                const { clientX, clientY } = e;
                const { left, top, width, height } = cardRef.current.getBoundingClientRect();

                const x = (clientX - left) / width - 0.5;
                const y = (clientY - top) / height - 0.5;

                gsap.to(cardRef.current, {
                    rotateY: x * 10,
                    rotateX: -y * 10,
                    duration: 0.6,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });

                // Move subtle glow following cursor inside the card
                if (glowRef.current) {
                    gsap.to(glowRef.current, {
                        x: (clientX - left) - 150,
                        y: (clientY - top) - 150,
                        duration: 1,
                        ease: 'power2.out'
                    });
                }
            };

            const handleMouseLeave = () => {
                gsap.to(cardRef.current, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)'
                });
            };

            window.addEventListener('mousemove', handleMouseMove);
            cardRef.current?.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                cardRef.current?.removeEventListener('mouseleave', handleMouseLeave);
            };
        }, containerRef);

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
            setError('ACCESS DENIED. INVALID CREDENTIALS.');
            setLoading(false);

            // Shake effect on error
            gsap.to(cardRef.current, {
                x: 10,
                duration: 0.05,
                repeat: 5,
                yoyo: true,
                onComplete: () => gsap.set(cardRef.current, { x: 0 })
            });
        } else {
            const tl = gsap.timeline();
            tl.to('.login-reveal', {
                y: -20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.03,
                ease: 'expo.in'
            })
                .to(cardRef.current, {
                    scale: 1.05,
                    opacity: 0,
                    backdropFilter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'expo.inOut',
                    onComplete: () => router.push('/admin/dashboard')
                }, "-=0.2");
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-[#f7f7f7] relative overflow-hidden font-sans selection:bg-[#A67C52]/20">

            {/* ─── WebGL Geometrical Background ─── */}
            <ArchitecturalBackground />

            {/* ─── Interactive Glass Portal (Enhanced Transparency) ─── */}
            <div className="w-full max-w-[500px] px-6 relative z-10">
                <div
                    ref={cardRef}
                    className="relative group bg-white/[0.03] backdrop-blur-[4px] border border-black/[0.03] rounded-[2.5rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.06),0_10px_40px_-15px_rgba(0,0,0,0.04)] overflow-hidden transition-shadow duration-500 hover:shadow-[#A67C52]/10"
                    style={{ padding: '4.5rem 3.5rem' }}
                >
                    {/* Inner Glow following cursor (Subtle on light) */}
                    <div
                        ref={glowRef}
                        className="pointer-events-none absolute w-[300px] h-[300px] bg-[#A67C52]/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{ transform: 'translate(-50%, -50%)' }}
                    />

                    {/* Architectural decor lines */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/[0.03] to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A67C52]/20 to-transparent" />

                    {/* Branding Header */}
                    <div className="text-center mb-14">
                        <h2 className="login-reveal text-4xl font-light text-[#001738] tracking-[0.2em] mb-4 leading-none"
                            style={{ fontFamily: 'Cinzel, serif' }}>
                            CUTS <span className="text-[#A67C52]">&</span> GROOVES
                        </h2>
                        <div className="login-reveal h-[0.5px] w-12 bg-[#A67C52]/40 mx-auto mb-4" />
                        <p className="login-reveal text-[0.7rem] text-[#001738]/40 font-bold tracking-[0.4em] uppercase">
                            Exclusive Entry
                        </p>
                    </div>

                    {error && (
                        <div className="login-reveal mb-8 py-3.5 px-4 text-[0.65rem] text-[#cc3333] border border-[#cc3333]/10 bg-[#cc3333]/5 text-center tracking-widest font-black uppercase">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* User ID Field */}
                        <div className="login-reveal space-y-3">
                            <label className="block text-[0.6rem] font-black text-[#001738]/60 uppercase tracking-[0.3em] ml-1">
                                User ID
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="email"
                                    required
                                    className="w-full px-0 py-3 bg-transparent border-b border-black/[0.3] focus:border-[#A67C52] transition-all duration-500 text-[#001738] placeholder:text-gray-305 text-sm outline-none"
                                    placeholder="E-mail ID"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#A67C52] group-focus-within/input:w-full transition-all duration-700 ease-out" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="login-reveal space-y-3">
                            <label className="block text-[0.6rem] font-black text-[#001738]/60 uppercase tracking-[0.3em] ml-1">
                                Password
                            </label>
                            <div className="relative group/input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full px-0 py-3 bg-transparent border-b border-black/[0.3] focus:border-[#A67C52] transition-all duration-500 text-[#001738] placeholder:text-gray-305 text-sm outline-none tracking-[0.4em]"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#A67C52] group-focus-within/input:w-full transition-all duration-700 ease-out" />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-black/10 hover:text-[#A67C52] transition-colors"
                                >
                                    {showPassword ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="login-reveal mt-20 mb-8 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-1/2 py-4 group/btn overflow-hidden rounded-full transition-all duration-500 active:scale-[0.98] shadow-sm hover:shadow-md"
                            >
                                <div className="absolute inset-0 bg-[#001738] text-white font-black uppercase tracking-[0.3em] text-[0.7rem] flex items-center justify-center group-hover/btn:bg-[#A67C52] transition-colors duration-500 rounded-full">
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            <span>Verifying</span>
                                        </div>
                                    ) : (
                                        <span>Sign In</span>
                                    )}
                                </div>
                            </button>
                        </div>

                        {/* Internal Navigation Links */}
                        <div className="login-reveal mt-12 pt-8 border-t border-black/[0.03] text-center space-y-3">
                            <p className="text-[0.6rem] font-medium text-[#001738]/30 uppercase tracking-[0.2em]">
                                Lost access? <a href="#" className="text-[#001738]/60 hover:text-[#A67C52] transition-all ml-2 font-black !no-underline">Recovery Portal</a>
                            </p>
                            <p className="text-[0.6rem] font-medium text-[#001738]/30 uppercase tracking-[0.2em]">
                                Public Domain? <a href="/" className="text-[#001738]/60 hover:text-[#A67C52] transition-all ml-2 font-black !no-underline">Return Home</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
                
                body {
                    background-color: #f7f7f7;
                    color: #001738;
                }
                
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </div>
    );
}
