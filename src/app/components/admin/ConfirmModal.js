'use client';

import { useEffect, useRef } from 'react';

export default function ConfirmModal({ open, title, message, confirmLabel = 'Delete', cancelLabel = 'Cancel', onConfirm, onCancel, danger = true, loading = false }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open) {
      const handler = (e) => {
        if (e.key === 'Escape') onCancel?.();
      };
      document.addEventListener('keydown', handler);
      confirmRef.current?.focus();
      return () => document.removeEventListener('keydown', handler);
    }
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', animation: 'confirmFadeIn 0.2s ease',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onCancel}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: '20px',
            padding: '32px', maxWidth: '420px', width: '100%',
            boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
            animation: 'confirmScaleIn 0.25s ease',
          }}
        >
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: danger ? 'rgba(211,47,47,0.1)' : 'rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px',
          }}>
            {danger ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2">
                <path d="M12 9v4M12 17h.01M3.07 12A9.97 9.97 0 0112 3a9.97 9.97 0 019.93 9 9.97 9.97 0 01-9.93 9A9.97 9.97 0 013.07 12z"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
            )}
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>{title}</h3>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'rgba(0,0,0,0.6)', lineHeight: '1.5' }}>{message}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.12)',
                background: '#fff', color: '#000', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
                transition: 'all 0.2s ease', opacity: loading ? 0.5 : 1,
              }}
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              onClick={onConfirm}
              disabled={loading}
              style={{
                padding: '10px 20px', borderRadius: '10px', border: 'none',
                background: danger ? '#d32f2f' : '#000', color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
                transition: 'all 0.2s ease', opacity: loading ? 0.6 : 1,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              {loading && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'confirmSpin 0.8s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              )}
              {loading ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes confirmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes confirmScaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes confirmSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
