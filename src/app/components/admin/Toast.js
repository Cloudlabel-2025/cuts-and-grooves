'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: 'fixed', bottom: '24px', right: '24px',
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px',
        maxWidth: '380px', width: '100%', pointerEvents: 'none'
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            background: toast.type === 'error' ? '#d32f2f' : toast.type === 'warning' ? '#f57c00' : '#2e7d32',
            color: '#fff', padding: '14px 18px', borderRadius: '12px',
            fontSize: '13px', fontWeight: '600', lineHeight: '1.4',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            display: 'flex', alignItems: 'center', gap: '12px',
            pointerEvents: 'auto', cursor: 'pointer',
            animation: 'toastSlideIn 0.3s ease',
            fontFamily: 'Inter, sans-serif',
          }}
            onClick={() => removeToast(toast.id)}
          >
            <span style={{ fontSize: '16px', flexShrink: 0 }}>
              {toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : '✓'}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
