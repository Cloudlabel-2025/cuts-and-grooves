'use client';

import { useState } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search…', total, className }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '4px 4px 4px 16px',
      background: '#fafaf8', border: `1px solid ${focused ? 'rgba(0,0,0,0.3)' : 'var(--admin-border)'}`,
      borderRadius: '999px', transition: 'all 0.2s ease',
      flex: '1 1 280px', maxWidth: '400px',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, border: 'none', background: 'transparent',
          outline: 'none', fontSize: '13px', fontWeight: '500',
          color: '#000', fontFamily: 'inherit',
          padding: '10px 0',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%',
            width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(0,0,0,0.5)', flexShrink: 0,
          }}
        >✕</button>
      )}
      {total !== undefined && (
        <span style={{
          fontSize: '11px', fontWeight: '700', color: 'rgba(0,0,0,0.3)',
          letterSpacing: '0.05em', paddingRight: '12px', whiteSpace: 'nowrap',
        }}>
          {total}
        </span>
      )}
    </div>
  );
}
