'use client';

import { useEffect, useRef, useCallback } from 'react';

export function useUnsavedChanges(hasChanges, draftKey = null) {
  const changedRef = useRef(hasChanges);

  useEffect(() => {
    changedRef.current = hasChanges;
  }, [hasChanges]);

  useEffect(() => {
    const handler = (e) => {
      if (changedRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const clearDraft = useCallback(() => {
    if (draftKey) {
      try { localStorage.removeItem(draftKey); } catch {}
    }
  }, [draftKey]);

  const loadDraft = useCallback((fallback) => {
    if (!draftKey) return fallback;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        try { return JSON.parse(saved); } catch { return saved; }
      }
    } catch {}
    return fallback;
  }, [draftKey]);

  const saveDraft = useCallback((data) => {
    if (!draftKey) return;
    try {
      localStorage.setItem(draftKey, typeof data === 'string' ? data : JSON.stringify(data));
    } catch {}
  }, [draftKey]);

  return { clearDraft, loadDraft, saveDraft };
}
