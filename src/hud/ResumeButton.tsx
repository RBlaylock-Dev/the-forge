'use client';

import { useEffect, useRef, useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

const MENU_ITEM_STYLE: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  border: 'none',
  borderRadius: 6,
  background: 'transparent',
  color: '#f5deb3',
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
};

/**
 * ResumeButton — action dock button with a small menu to either view the
 * standard resume or open the interactive Resume Builder.
 */
export function ResumeButton() {
  const openResume = useForgeStore((s) => s.openResume);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      {open && (
        <div
          role="menu"
          aria-label="Resume options"
          className="font-rajdhani"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: 6,
            padding: 4,
            background: 'rgba(15, 12, 9, 0.95)',
            border: '1px solid rgba(196, 129, 58, 0.35)',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'auto',
          }}
        >
          {[
            { label: 'View resume', action: openResume },
            {
              label: 'Build a custom resume',
              action: () => window.dispatchEvent(new Event('open-resume-builder')),
            },
          ].map((item) => (
            <button
              key={item.label}
              role="menuitem"
              style={MENU_ITEM_STYLE}
              onClick={() => choose(item.action)}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(196, 129, 58, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Resume options"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Resume"
        className="hud-dock-btn font-rajdhani"
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2.5" y="1" width="9" height="12" rx="1" />
          <path d="M5 4h4" />
          <path d="M5 6.5h4" />
          <path d="M5 9h2.5" />
        </svg>
        <span className="hud-dock-label">Resume</span>
        <svg
          className="hud-dock-label"
          width={8}
          height={8}
          viewBox="0 0 8 8"
          fill="currentColor"
          aria-hidden="true"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        >
          <path d="M0 2.5h8L4 6.5z" />
        </svg>
      </button>
    </div>
  );
}
