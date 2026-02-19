'use client';

import React, { useRef } from 'react';

const testimonials = [
    {
        id: 1,
        quote: "Architecture that speaks volumes. Every corner of our home now tells a story, blending functionality with pure art.",
        author: "Sarah Jenkins",
        role: "Private Client"
    },
    {
        id: 2,
        quote: "An absolute masterclass in design. The team understood our vision better than we did ourselves.",
        author: "David Chen",
        role: "CEO, TechFlow"
    },
    {
        id: 3,
        quote: "Impeccable attention to detail. From the initial concept to the final reveal, the process was seamless and inspiring.",
        author: "Elena Rodriguez",
        role: "Art Director"
    }
];

const HoverChar = ({ char }) => {
    const defaultFont = 'var(--font-heading)';
    const fonts = [
        'var(--font-heading)',
        'var(--font-body)',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Impact',
        'Arial Black'
    ];
    const [font, setFont] = React.useState(defaultFont);
    const [isHovered, setIsHovered] = React.useState(false);
    const intervalRef = useRef(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
            setFont(randomFont);
        }, 200);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        clearInterval(intervalRef.current);
        setFont(defaultFont);
    };

    return (
        <span
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                fontFamily: font,
                transition: 'font-family 0.1s, transform 0.2s ease, opacity 0.2s ease',
                display: 'inline-block',
                cursor: 'default',
                whiteSpace: 'pre', // Preserve whitespace
                transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                color: isHovered ? '#ffffff' : '#e0e0e0', // Subtle color lift
            }}
        >
            {char}
        </span>
    );
};

export default function Testimonials() {
    return (
        <section
            data-nav-theme="dark"
            style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '120px 4%',
                position: 'relative',
                zIndex: 5
            }}
        >
            <div style={{ maxWidth: '1920px', margin: '0 auto' }}>
                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    fontWeight: '300',
                    marginBottom: '80px',
                    letterSpacing: '-0.02em',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: '20px'
                }}>
                    CLIENT PERSPECTIVES
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '40px'
                }}>
                    {testimonials.map((item) => (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

                            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                                <h4 style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    margin: 0,
                                    letterSpacing: '0.05em'
                                }}>
                                    {item.author}
                                </h4>
                                <span style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.85rem',
                                    fontWeight: '400',
                                    color: '#888888',
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
