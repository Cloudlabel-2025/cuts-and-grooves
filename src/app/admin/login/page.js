'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError('Invalid email or password. Please check the details and try again.');
            setLoading(false);
            return;
        }

        router.push('/admin/dashboard');
    };

    return (
        <main className="admin-login-page">
            <section className="admin-login-visual" aria-label="Cuts and Grooves architecture preview">
                <Image
                    src="/images/All-works-01.jpg"
                    alt="Architectural building facade"
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className="admin-login-visual-img"
                />
                <div className="admin-login-visual-overlay">
                    <div>
                        <span className="admin-login-eyebrow">Admin Studio</span>
                        <h1>Cuts & Grooves</h1>
                    </div>
                    <p>Manage portfolio, studio content, media, and enquiries from one calm workspace.</p>
                </div>
            </section>

            <section className="admin-login-panel" aria-label="Admin sign in">
                <div className="admin-login-card">
                    <div className="admin-login-brand">
                        <Image src="/images/logo.png" alt="Cuts & Grooves" width={78} height={78} priority />
                        <div>
                            <span className="admin-login-eyebrow">Secure Access</span>
                            <h2>Sign in to Admin</h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        {error && <div className="admin-login-error">{error}</div>}

                        <label>
                            <span>Email Address</span>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="admin@cutsandgrooves.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                disabled={loading}
                            />
                        </label>

                        <label>
                            <span>Password</span>
                            <div className="admin-password-field">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    disabled={loading}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </label>

                        <button type="submit" className="admin-login-submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <Link href="/">Return to Website</Link>
                        <span>Authorized users only</span>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .admin-login-page {
                    min-height: 100vh;
                    min-height: 100svh;
                    display: grid;
                    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1fr);
                    background: #f6f4ef;
                    color: #111;
                    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    overflow-x: hidden;
                }

                .admin-login-visual {
                    position: relative;
                    min-height: 100vh;
                    overflow: hidden;
                    background: #e9e6df;
                }

                .admin-login-visual-img {
                    object-fit: cover;
                    filter: grayscale(1) contrast(1.05);
                }

                .admin-login-visual-overlay {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: clamp(32px, 5vw, 72px);
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.58));
                    color: #fff;
                }

                .admin-login-eyebrow {
                    display: block;
                    margin-bottom: 12px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: rgba(0, 0, 0, 0.52);
                }

                .admin-login-visual .admin-login-eyebrow {
                    color: rgba(255, 255, 255, 0.74);
                }

                .admin-login-visual h1 {
                    margin: 0;
                    font-family: var(--font-heading);
                    font-size: clamp(3rem, 7vw, 7rem);
                    font-weight: 400;
                    line-height: 0.92;
                    text-transform: uppercase;
                    letter-spacing: 0.01em;
                }

                .admin-login-visual p {
                    max-width: 520px;
                    margin: 0;
                    font-size: clamp(1rem, 1.4vw, 1.25rem);
                    line-height: 1.65;
                    color: rgba(255, 255, 255, 0.82);
                }

                .admin-login-panel {
                    display: grid;
                    place-items: center;
                    min-width: 0;
                    padding: clamp(20px, 5vw, 72px);
                }

                .admin-login-card {
                    width: min(100%, 520px);
                    min-width: 0;
                    background: rgba(255, 255, 255, 0.82);
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.08);
                    padding: clamp(28px, 4vw, 48px);
                    border-radius: 18px;
                }

                .admin-login-brand {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 40px;
                    min-width: 0;
                }

                .admin-login-brand h2 {
                    margin: 0;
                    font-size: clamp(2rem, 3vw, 2.8rem);
                    line-height: 1;
                    font-family: var(--font-heading);
                    font-weight: 400;
                    letter-spacing: 0;
                    overflow-wrap: anywhere;
                }

                .admin-login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 22px;
                }

                .admin-login-form label {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .admin-login-form label > span {
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: rgba(0, 0, 0, 0.58);
                }

                .admin-login-form input {
                    width: 100%;
                    height: 54px;
                    border: 1px solid rgba(0, 0, 0, 0.14);
                    border-radius: 10px;
                    background: #fff;
                    padding: 0 16px;
                    font-size: 16px;
                    color: #111;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .admin-login-form input:focus {
                    border-color: #111;
                    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.06);
                }

                .admin-password-field {
                    position: relative;
                }

                .admin-password-field input {
                    padding-right: 82px;
                }

                .admin-password-field button {
                    position: absolute;
                    right: 8px;
                    top: 8px;
                    height: 38px;
                    border: none;
                    border-radius: 8px;
                    background: #f2f2f2;
                    padding: 0 14px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #111;
                    cursor: pointer;
                }

                .admin-login-submit {
                    height: 56px;
                    margin-top: 8px;
                    border: none;
                    border-radius: 10px;
                    background: #111;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: transform 0.2s ease, background 0.2s ease;
                }

                .admin-login-submit:hover {
                    background: #2a2a2a;
                    transform: translateY(-1px);
                }

                .admin-login-submit:disabled,
                .admin-login-form input:disabled,
                .admin-password-field button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .admin-login-error {
                    border: 1px solid rgba(170, 36, 36, 0.18);
                    background: rgba(170, 36, 36, 0.06);
                    color: #8f1f1f;
                    border-radius: 10px;
                    padding: 14px 16px;
                    font-size: 14px;
                    line-height: 1.45;
                }

                .admin-login-footer {
                    display: flex;
                    justify-content: space-between;
                    gap: 18px;
                    margin-top: 30px;
                    padding-top: 22px;
                    border-top: 1px solid rgba(0, 0, 0, 0.08);
                    font-size: 13px;
                    color: rgba(0, 0, 0, 0.55);
                }

                .admin-login-footer a {
                    color: #111;
                    font-weight: 700;
                    text-decoration: none;
                }

                @media (max-width: 900px) {
                    .admin-login-page {
                        grid-template-columns: 1fr;
                        min-height: auto;
                    }

                    .admin-login-visual {
                        min-height: 240px;
                        height: 34svh;
                    }

                    .admin-login-visual-overlay {
                        padding: 28px;
                    }

                    .admin-login-visual p {
                        display: none;
                    }

                    .admin-login-panel {
                        align-items: start;
                        padding: 28px;
                    }
                }

                @media (max-width: 520px) {
                    .admin-login-page {
                        background: #fff;
                    }

                    .admin-login-visual {
                        min-height: 168px;
                        height: 28svh;
                    }

                    .admin-login-visual-overlay {
                        padding: 20px;
                    }

                    .admin-login-visual h1 {
                        font-size: clamp(2rem, 13vw, 3.4rem);
                    }

                    .admin-login-panel {
                        padding: 0;
                    }

                    .admin-login-brand {
                        align-items: flex-start;
                        flex-direction: column;
                        gap: 14px;
                        margin-bottom: 28px;
                    }

                    .admin-login-brand img {
                        width: 62px;
                        height: 62px;
                    }

                    .admin-login-card {
                        width: 100%;
                        min-height: auto;
                        border-radius: 0;
                        border-left: none;
                        border-right: none;
                        border-bottom: none;
                        box-shadow: none;
                        padding: 24px 20px 28px;
                    }

                    .admin-login-form {
                        gap: 18px;
                    }

                    .admin-login-form input,
                    .admin-login-submit {
                        height: 52px;
                    }

                    .admin-login-footer {
                        flex-direction: column;
                        gap: 10px;
                    }
                }

                @media (max-width: 360px) {
                    .admin-login-card {
                        padding-left: 16px;
                        padding-right: 16px;
                    }

                    .admin-password-field input {
                        padding-right: 72px;
                    }

                    .admin-password-field button {
                        padding: 0 10px;
                    }
                }
            `}</style>
        </main>
    );
}
