'use client';

import { useEffect } from 'react';

export function useKeyboardShortcut(key, ctrlKey, handler) {
  useEffect(() => {
    const listener = (e) => {
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      if (ctrlKey && !ctrlOrMeta) return;
      if (!ctrlKey && ctrlOrMeta) return;
      if (e.key.toLowerCase() === key.toLowerCase() && !e.repeat) {
        // Don't fire if user is typing in an input/textarea
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        handler(e);
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [key, ctrlKey, handler]);
}
