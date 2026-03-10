'use client';

import Link from 'next/link';

const PAGES = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/projects' },
    { name: 'Process', path: '/process' },
    { name: 'Studio', path: '/studio' },
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
                    <Link href={prev.path} className="page-nav-btn">
                        <span className="page-nav-chevron">‹</span>
                        <span>Back to {prev.name}</span>
                    </Link>
                )}

                {next && (
                    <Link href={next.path} className="page-nav-btn page-nav-next">
                        <span>Go to {next.name}</span>
                        <span className="page-nav-chevron">›</span>
                    </Link>
                )}
            </div>

            <style jsx>{`
                .page-nav-wrapper {
                    padding: 60px 4%;
                }
                .page-nav-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .page-nav-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 16px 32px;
                    background-color: #000;
                    color: #fff;
                    border-radius: 12px;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 0.01em;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .page-nav-btn:hover {
                    background-color: #222;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                }
                .page-nav-next {
                    margin-left: auto;
                }
                .page-nav-chevron {
                    font-size: 18px;
                    font-weight: 300;
                    line-height: 1;
                }
                @media (max-width: 768px) {
                    .page-nav-wrapper {
                        padding: 40px 4%;
                    }
                    .page-nav-container {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .page-nav-btn {
                        justify-content: center;
                        padding: 14px 24px;
                        font-size: 13px;
                    }
                    .page-nav-next {
                        margin-left: 0;
                    }
                }
            `}</style>
        </div>
    );
}
