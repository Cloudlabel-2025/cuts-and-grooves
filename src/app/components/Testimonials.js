'use client';

import React, { useRef, useState, useEffect } from 'react';

const HoverChar = ({ char }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <span
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transition: 'all 0.3s ease',
                color: isHovered ? '#000000' : 'inherit',
                fontWeight: isHovered ? '400' : '300',
                display: 'inline',
                whiteSpace: char === ' ' ? 'pre-wrap' : 'normal'
            }}
        >
            {char}
        </span>
    );
};

export default function Testimonials({ testimonials: dynamicTestimonials, content }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const sliderRef = useRef(null);

    const heading = content?.heading || "CLIENT PERSPECTIVES";
    const testimonials = dynamicTestimonials && dynamicTestimonials.length > 0 ? dynamicTestimonials : [
        {
            id: 1,
            quote: "Every space unfolds with intention. What once was an empty plot is now a home that reflects our values, our lifestyle, and our story — seamlessly blending art with purpose.",
            author: "Kavin Kumar",
            role: "Private Client"
        },
        {
            id: 2,
            quote: "What impressed us most was not just the design excellence, but the strategic thinking behind every decision. The result is not just a building, but a statement of who we are.",
            author: "Balaji BM",
            role: "CEO, TechFlow"
        },
        {
            id: 3,
            quote: "From concept sketches to the final execution, the process was curated, disciplined, and deeply collaborative. The outcome exceeded expectation — refined, timeless, and inspiring.",
            author: "Ahasi",
            role: "Art Director"
        }
    ];

    const showCarousel = testimonials.length > 3;
    const itemsPerView = 3; // On desktop
    const maxIndex = Math.max(0, testimonials.length - itemsPerView);

    const handleNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0); // Loop back
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex(maxIndex); // Loop to end
        }
    };

    useEffect(() => {
        if (sliderRef.current) {
            const gap = 40;
            const cardWidth = (sliderRef.current.offsetWidth - (gap * (itemsPerView - 1))) / itemsPerView;
            const moveX = -(currentIndex * (cardWidth + gap));

            import('gsap').then(gsap => {
                gsap.default.to(sliderRef.current, {
                    x: moveX,
                    duration: 0.8,
                    ease: "expo.out"
                });
            });
        }
    }, [currentIndex, testimonials.length]);

    return (
        <section
            data-nav-theme="light"
            style={{
                backgroundColor: '#ffffff',
                color: '#737373',
                padding: '120px 4%',
                position: 'relative',
                zIndex: 5,
                overflow: 'hidden'
            }}
            ref={containerRef}
        >
            <div style={{ maxWidth: '1920px', margin: '0 auto' }}>
                <div style={{
                    marginBottom: '80px',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    paddingBottom: '30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                }}>
                    <div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(2rem, 5vw, 4rem)',
                            fontWeight: '300',
                            marginBottom: '15px',
                            letterSpacing: '-0.02em',
                            color: '#000000'
                        }}>
                            {heading}
                        </h2>
                        {content?.subtext && (
                            <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 'clamp(0.9rem, 1.1vw, 1.2rem)',
                                fontWeight: '400',
                                color: '#737373',
                                maxWidth: '600px',
                                lineHeight: '1.6',
                                margin: 0
                            }}>
                                {content.subtext}
                            </p>
                        )}
                    </div>

                </div>

                <div style={{
                    position: 'relative',
                    width: '100%'
                }}>
                    <div
                        ref={sliderRef}
                        style={{
                            display: 'flex',
                            gap: '40px',
                            width: '100%'
                        }}
                    >
                        {testimonials.map((item, idx) => (
                            <div
                                key={item._id || idx}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    flex: '0 0 calc(33.33% - 27px)', // 27px = (40px * 2) / 3 approx
                                    minWidth: '300px'
                                }}
                            >
                                {item.image && (
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: '#f9f9f9' }}>
                                        <img src={item.image} alt={item.author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <p style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
                                    lineHeight: '1.4',
                                    fontWeight: '300',
                                    flex: '1 0 auto',
                                    margin: 0,
                                    textAlign: 'justify',
                                    textJustify: 'inter-word'
                                }}>
                                    {item.quote.split('').map((char, index) => (
                                        <HoverChar key={index} char={char} />
                                    ))}
                                </p>

                                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '15px' }}>
                                    <h4 style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        margin: 0,
                                        letterSpacing: '0.05em',
                                        color: '#000000'
                                    }}>
                                        {item.author}
                                    </h4>
                                    <span style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.85rem',
                                        fontWeight: '400',
                                        color: '#737373',
                                        display: 'block',
                                        marginTop: '5px'
                                    }}>
                                        {item.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showCarousel && (
                    <div style={{
                        marginTop: '60px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px'
                    }}>
                        <button
                            onClick={handlePrev}
                            suppressHydrationWarning
                            style={{
                                background: 'none',
                                border: '1px solid rgba(0,0,0,0.1)',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                color: '#000000',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#000000';
                                e.currentTarget.style.backgroundColor = '#000000';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#000000';
                            }}
                        >
                            ←
                        </button>
                        <button
                            onClick={handleNext}
                            suppressHydrationWarning
                            style={{
                                background: 'none',
                                border: '1px solid rgba(0,0,0,0.1)',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                color: '#000000',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#000000';
                                e.currentTarget.style.backgroundColor = '#000000';
                                e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#000000';
                            }}
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
