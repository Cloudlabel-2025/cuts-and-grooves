'use client';

export function Loader({ label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '48px', color: 'var(--admin-muted)' }}>
            <div style={{ width: '28px', height: '28px', border: '2px solid var(--admin-border)', borderTop: '2px solid var(--admin-text)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading {label}…</span>
            <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}

export function EditorHeader({ kicker, title, description, hasChanges, saving, onReset, onSave, saveLabel }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '24px 28px',
            background: 'linear-gradient(135deg,rgba(255,255,255,0.98),rgba(250,249,246,0.88))',
            border: '1px solid var(--admin-border)', borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)', flexWrap: 'wrap', gap: '16px',
        }}>
            <div>
                <span className="admin-kicker">{kicker}</span>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>{title}</h2>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--admin-muted)' }}>{description}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                    onClick={onReset}
                    disabled={!hasChanges}
                    style={{ ...secondaryBtn, opacity: hasChanges ? 1 : 0.4, cursor: hasChanges ? 'pointer' : 'not-allowed' }}
                >
                    Reset
                </button>
                <button
                    onClick={onSave}
                    disabled={!hasChanges || saving}
                    style={{ ...primaryBtn, opacity: (!hasChanges || saving) ? 0.5 : 1, cursor: (!hasChanges || saving) ? 'not-allowed' : 'pointer' }}
                >
                    {saving ? 'Saving…' : saveLabel}
                </button>
            </div>
        </div>
    );
}

export function FieldCard({ label, hint, children }) {
    return (
        <div style={{ background: '#fff', border: '1px solid var(--admin-border)', borderRadius: '16px', padding: '22px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-muted)' }}>{label}</span>
                {hint && <span style={{ marginLeft: '10px', fontSize: '11px', color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>{hint}</span>}
            </div>
            {children}
        </div>
    );
}

export const textareaStyle = {
    width: '100%', padding: '12px 14px', border: '1px solid var(--admin-border)',
    borderRadius: '12px', background: '#fafaf8', fontSize: '14px', lineHeight: '1.65',
    outline: 'none', fontFamily: 'inherit', color: 'var(--admin-text)', resize: 'vertical',
    transition: 'border-color 0.2s, box-shadow 0.2s',
};

export const inputStyle = {
    width: '100%', height: '44px', padding: '0 14px',
    border: '1px solid var(--admin-border)', borderRadius: '12px',
    background: '#fafaf8', fontSize: '14px', outline: 'none',
    fontFamily: 'inherit', color: 'var(--admin-text)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
};

export const focusIn = e => {
    e.target.style.borderColor = 'rgba(155,116,72,0.55)';
    e.target.style.boxShadow = '0 0 0 4px rgba(155,116,72,0.1)';
};

export const focusOut = e => {
    e.target.style.borderColor = 'var(--admin-border)';
    e.target.style.boxShadow = 'none';
};

export const primaryBtn = {
    display: 'inline-flex', alignItems: 'center', gap: '7px',
    padding: '11px 22px', borderRadius: '999px', border: 'none',
    background: 'var(--admin-text)', color: '#fff', cursor: 'pointer',
    fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase',
    transition: 'all 0.2s ease',
};

export const secondaryBtn = {
    display: 'inline-flex', alignItems: 'center', padding: '10px 18px',
    borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'transparent',
    color: 'var(--admin-text)', cursor: 'pointer', fontSize: '12px',
    fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
    transition: 'all 0.2s ease',
};
