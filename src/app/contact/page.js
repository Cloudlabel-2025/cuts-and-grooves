'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import Footer from '../components/Footer';
import PageNavigation from '../components/PageNavigation';

const DEFAULT_CONTENT = {
    hero: {
        heroText: 'Based in Tamil Nadu but available for your projects in',
        locations: ["Chennai", "Madurai", "Coimbatore", "Trichy", "Salem", "Erode"]
    },
    details: {
        socials: [
            { platform: 'Instagram', url: 'https://instagram.com' },
            { platform: 'LinkedIn', url: 'https://linkedin.com' }
        ],
        email: 'contact@cutsandgrooves.com',
        phone: '+61 3 8672 5999',
        studio: 'Cumbum,\nTheni, Tamil Nadu.',
        mapIframe: 'https://maps.google.com/maps?q=Cumbum,+Tamil+Nadu&t=k&z=13&ie=UTF8&iwloc=&output=embed'
    }
};

export default function ContactPage() {
    const containerRef = useRef(null);
    const [content, setContent] = useState(DEFAULT_CONTENT);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content?page=contact');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();

                if (data && data.length > 0) {
                    const contentMap = { hero: {}, details: {} };
                    data.forEach(item => {
                        contentMap[item.section][item.key] = item.value;
                    });
                    setContent(contentMap);
                }
            } catch (err) {
                console.error('Error fetching contact content:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Hero Text Reveal (Words)
            const heroWords = document.querySelectorAll('.contact-hero-text span');
            gsap.from(heroWords, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.02,
                ease: 'power3.out',
                delay: 0.5
            });

            // 2. Contact Details Reveal
            gsap.from('.contact-details > div', {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.8
            });

            // 3. Contact Form Reveal
            gsap.from('.contact-form', {
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.out',
                delay: 1.2
            });

            // 4. Contact Map Reveal
            gsap.from('.contact-map', {
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.out',
                delay: 1.4
            });

        }, containerRef);

        return () => ctx.revert();
    }, [loading]);

    const heroText = content?.hero?.heroText || DEFAULT_CONTENT.hero.heroText;
    const locations = content?.hero?.locations || DEFAULT_CONTENT.hero.locations;
    const socials = content?.details?.socials || DEFAULT_CONTENT.details.socials;
    const email = content?.details?.email || DEFAULT_CONTENT.details.email;
    const phone = content?.details?.phone || DEFAULT_CONTENT.details.phone;
    const studioAddress = content?.details?.studio || DEFAULT_CONTENT.details.studio;
    const mapIframe = content?.details?.mapIframe || DEFAULT_CONTENT.details.mapIframe;

    return (
        <main ref={containerRef} className="contact-page bg-white text-black min-h-screen pb-[80px] px-[4%]" data-nav-theme="light" style={{ paddingTop: '240px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '80px' }} className="contact-grid">

                {/* LEFT COLUMN: HERO TEXT */}
                <div>
                    <h1 className="contact-hero-text" style={{
                        fontSize: 'clamp(2rem, 3.5vw, 3.8rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 300,
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em'
                    }}>
                        {heroText.split(' ').map((word, i) => (
                            <span key={i} style={{ display: 'inline-block', marginRight: '0.25em' }}>{word}</span>
                        ))}
                        <br />
                        {locations.map((loc, i) => (
                            <span key={i} style={{ display: 'inline-block', marginRight: '0.25em', opacity: 0.4 }}>{loc}{i < locations.length - 1 ? ',' : ''}</span>
                        ))}
                    </h1>
                </div>

                {/* RIGHT COLUMN: CONTACT DETAILS */}
                <div className="contact-details" style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingTop: '20px' }}>

                    {/* Socials */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px', opacity: 0.4 }}>Social</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {socials.map((social, i) => (
                                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="hover-link" style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                                    {social.platform}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px', opacity: 0.4 }}>Email</h4>
                        <a href={`mailto:${email}`} className="hover-link" style={{ fontSize: '1.1rem', fontWeight: 500 }}>{email}</a>
                    </div>

                    {/* Phone */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px', opacity: 0.4 }}>Phone</h4>
                        <a href={`tel:${phone}`} className="hover-link" style={{ fontSize: '1.1rem', fontWeight: 500 }}>{phone}</a>
                    </div>

                    {/* Address */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px', opacity: 0.4 }}>Studio</h4>
                        <div style={{ fontSize: '1.1rem', lineHeight: 1.5, fontWeight: 500, whiteSpace: 'pre-line' }}>
                            {studioAddress}
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .hover-link {
                    text-decoration: none;
                    color: inherit;
                    transition: opacity 0.3s ease;
                }
                .hover-link:hover {
                    opacity: 0.5;
                }
                @media (max-width: 1024px) {
                    .contact-grid, .contact-bottom-grid {
                        grid-template-columns: 1fr !important;
                        gap: 60px !important;
                    }
                }
                @media (max-width: 768px) {
                    .contact-page {
                        padding-top: 120px !important;
                        padding-bottom: 40px !important;
                    }
                    .contact-grid, .contact-bottom-grid {
                        gap: 40px !important;
                    }
                    .contact-form {
                        margin-top: 40px !important;
                    }
                    .contact-map {
                        min-height: 300px !important;
                    }
                }
                @media (max-width: 480px) {
                    .contact-page {
                        padding-top: 100px !important;
                    }
                }
            `}</style>

            {/* --- CONTACT FORM & MAP --- */}
            <div className="contact-bottom-grid" style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '80px', alignItems: 'end' }}>
                <div className="contact-form" style={{ marginTop: '100px', maxWidth: '800px' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 300, marginBottom: '60px' }}>Send us a message</h2>
                    <ContactForm />
                </div>

                <div className="contact-map" style={{ width: '100%', height: '100%', minHeight: '400px', backgroundColor: '#f0f0f0', display: 'flex' }}>
                    <iframe
                        src={mapIframe}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

            {/* FOOTER */}
            <PageNavigation currentPath="/contact" />
            <Footer />
        </main>
    );
}

function ContactForm() {
    const [focused, setFocused] = useState(null);
    const [values, setValues] = useState({ name: '', phone: '', message: '' });
    const nameRef = useRef(null);
    const phoneRef = useRef(null);

    const handleChange = (field, e) => {
        setValues(prev => ({ ...prev, [field]: e.target.value }));
    };

    // Auto-resize inputs
    useEffect(() => {
        const adjustWidth = (ref, value, placeholder) => {
            if (ref.current) {
                const text = value || placeholder || '';
                // Create a temporary span to measure width
                const span = document.createElement('span');
                span.style.font = window.getComputedStyle(ref.current).font;
                span.style.visibility = 'hidden';
                span.style.position = 'absolute';
                span.textContent = text;
                document.body.appendChild(span);
                const width = span.offsetWidth;
                document.body.removeChild(span);
                ref.current.style.width = `${width + 20}px`; // Add minimal buffer
            }
        };

        adjustWidth(nameRef, values.name, 'your name');
        adjustWidth(phoneRef, values.phone, 'your number');
    }, [values.name, values.phone]);


    return (
        <form className="narrative-form mt-12 w-full max-w-5xl">
            <div className="form-content">
                <span className="text-segment">Hello, my name is</span>

                <div className={`input-wrapper ${focused === 'name' ? 'focused' : ''}`}>
                    <input
                        ref={nameRef}
                        type="text"
                        placeholder="your name"
                        value={values.name}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        onChange={(e) => handleChange('name', e)}
                        suppressHydrationWarning
                    />
                </div>

                <span className="text-segment">and I'd like to talk about a project.</span>
                <span className="text-segment">You can reach me at</span>

                <div className={`input-wrapper ${focused === 'phone' ? 'focused' : ''}`}>
                    <input
                        ref={phoneRef}
                        type="tel"
                        placeholder="your number"
                        value={values.phone}
                        onFocus={() => setFocused('phone')}
                        onBlur={() => setFocused(null)}
                        onChange={(e) => handleChange('phone', e)}
                        suppressHydrationWarning
                    />
                </div>

                <span className="text-segment">to discuss the details:</span>

                <div className={`input-wrapper textarea-wrapper ${focused === 'message' ? 'focused' : ''}`}>
                    <textarea
                        rows="1"
                        placeholder="Tell us about your vision..."
                        value={values.message}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        onChange={(e) => {
                            handleChange('message', e);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    ></textarea>
                </div>
            </div>

            <button type="submit" className="submit-btn group" suppressHydrationWarning>
                <span className="btn-text" suppressHydrationWarning>Send Request</span>
                <span className="btn-line"></span>
                <span className="btn-arrow">&rarr;</span>
            </button>

            <style jsx>{`
                .narrative-form {
                    font-family: var(--font-heading);
                    font-weight: 300;
                }
                .form-content {
                    font-size: clamp(2rem, 4vw, 3.5rem);
                    line-height: 1.6;
                    color: #525252;
                }
                .text-segment {
                    display: inline;
                    margin-right: 0.3em;
                }
                
                /* INPUT WRAPPERS */
                .input-wrapper {
                    display: inline-block;
                    position: relative;
                    vertical-align: baseline;
                    margin: 0 0.2em;
                    border-bottom: 2px solid #e5e5e5;
                    transition: border-color 0.3s ease;
                }
                .input-wrapper.focused {
                    border-bottom-color: #000;
                }
                
                /* INPUTS */
                input {
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: inherit;
                    font-size: inherit;
                    color: #000;
                    padding: 0;
                    min-width: 120px; /* Fallback */
                    max-width: 100%;
                }
                
                /* TEXTAREA */
                .textarea-wrapper {
                    display: block;
                    width: 100%;
                    margin-top: 1em;
                    border-bottom: 2px solid #e5e5e5;
                }
                .textarea-wrapper.focused {
                    border-bottom-color: #000;
                }
                textarea {
                    width: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: inherit;
                    font-size: inherit;
                    color: #000;
                    resize: none;
                    overflow: hidden;
                    padding: 0;
                }

                input::placeholder, textarea::placeholder {
                    color: #d4d4d4;
                    font-weight: 200;
                    opacity: 1;
                }

                /* BUTTON */
                .submit-btn {
                    margin-top: 3rem;
                    font-size: 1.5rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    position: relative;
                    padding-bottom: 5px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: var(--font-body);
                }
                .btn-line {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background: #000;
                    transform-origin: left;
                    transition: transform 0.3s ease;
                }
                .submit-btn:hover .btn-line {
                    transform: scaleX(0.5);
                }
                 .btn-arrow {
                    transition: transform 0.3s ease;
                 }
                 .submit-btn:hover .btn-arrow {
                    transform: translateX(5px);
                 }
                 @media (max-width: 768px) {
                    .form-content {
                        font-size: clamp(1.4rem, 5vw, 2rem) !important;
                    }
                    input {
                        min-width: 80px !important;
                    }
                    .submit-btn {
                        margin-top: 2rem;
                        font-size: 1.2rem;
                    }
                    .textarea-wrapper {
                        margin-top: 0.6em;
                    }
                 }
                 @media (max-width: 480px) {
                    .form-content {
                        font-size: clamp(1.2rem, 5vw, 1.6rem) !important;
                    }
                 }
            `}</style>
        </form>
    );
}

// Add ease-out-expo to global CSS or use inline style for custom bezier if needed.
// For now relying on standard transitions.
