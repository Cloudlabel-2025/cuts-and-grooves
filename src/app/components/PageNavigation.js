'use client';

import Link from 'next/link';

const PAGES = [
    { name: 'Home', path: '/' },
    { name: 'Our Work', path: '/projects' },
    { name: 'Our Approach', path: '/process' },
    { name: 'About Us', path: '/studio' },
    { name: 'Contact', path: '/contact' },
];

export default function PageNavigation({ currentPath }) {
    const currentIndex = PAGES.findIndex(p => p.path === currentPath);
    const prev = currentIndex > 0 ? PAGES[currentIndex - 1] : null;
    const next = currentIndex < PAGES.length - 1 ? PAGES[currentIndex + 1] : null;

    return (
        <div className="page-nav-wrapper">
            <div className="page-nav-container">
                {prev && (
                    <Link href={prev.path} className="page-nav-btn page-nav-prev">
                        <span className="page-nav-arrow">&larr;</span>
                        <span className="page-nav-label">{prev.name}</span>
                    </Link>
                )}

                {next && (
                    <Link href={next.path} className="page-nav-btn page-nav-next">
                        <span className="page-nav-label">{next.name}</span>
                        <span className="page-nav-arrow">&rarr;</span>
                    </Link>
                )}
            </div>

            <style jsx>{`
                .page-nav-wrapper {
                    padding: 80px 4% 60px;
                    border-top: 1px solid rgba(0, 0, 0, 0.08);
                }
                .page-nav-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                }
                .page-nav-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 0;
                    background: none;
                    color: #000;
                    text-decoration: none;
                    font-family: var(--font-heading);
                    font-size: 0.85rem;
                    font-weight: 500;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    transition: opacity 0.3s ease;
                    cursor: pointer;
                    position: relative;
                }
                .page-nav-btn::after {
                    content: '';
                    position: absolute;
                    bottom: 10px;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background: #000;
                    transform: scaleX(0);
                    transform-origin: right;
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .page-nav-btn:hover::after {
                    transform: scaleX(1);
                    transform-origin: left;
                }
                .page-nav-btn:hover {
                    opacity: 0.7;
                }
                .page-nav-next {
                    margin-left: auto;
                }
                .page-nav-arrow {
                    font-size: 1.1rem;
                    font-weight: 300;
                    line-height: 1;
                    transition: transform 0.3s ease;
                }
                .page-nav-prev:hover .page-nav-arrow {
                    transform: translateX(-4px);
                }
                .page-nav-next:hover .page-nav-arrow {
                    transform: translateX(4px);
                }
                .page-nav-label {
                    font-family: var(--font-heading);
                }
                @media (max-width: 768px) {
                    .page-nav-wrapper {
                        padding: 60px 4% 40px;
                    }
                    .page-nav-container {
                        flex-direction: row;
                        justify-content: space-between;
                    }
                    .page-nav-btn {
                        font-size: 0.75rem;
                        gap: 8px;
                    }
                    .page-nav-next {
                        margin-left: auto;
                    }
                }
            `}</style>
        </div>
    );
}
