'use client';

import React, { useRef, useState } from 'react';

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
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal'
            }}
        >
            {char}
        </span>
    );
};

export default function Testimonials({ testimonials: dynamicTestimonials, content }) {
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

    return (
        <section
            data-nav-theme="light"
            style={{
                backgroundColor: '#ffffff',
                color: '#737373',
                padding: '120px 4%',
                position: 'relative',
                zIndex: 5
            }}
        >
            <div style={{ maxWidth: '1920px', margin: '0 auto' }}>
                <div style={{ marginBottom: '80px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '30px' }}>
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

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px'
                }}>
                    {testimonials.map((item, idx) => (
                        <div key={item._id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <p style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
                                lineHeight: '1.2',
                                fontWeight: '300',
                                flex: '1 0 auto',
                                margin: 0
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
        </section>
    );
}
