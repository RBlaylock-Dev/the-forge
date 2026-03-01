'use client';

import { useForgeStore } from '@/store/useForgeStore';

/**
 * ResumeButton — Persistent floating button in the HUD.
 * Opens the resume preview overlay from any zone.
 */
export function ResumeButton() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const openResume = useForgeStore((s) => s.openResume);

  if (!isStarted || isTourActive) return null;

  return (
    <button
      onClick={openResume}
      aria-label="View resume"
      className="font-rajdhani"
      style={{
        position: 'fixed',
        bottom: 168,
        right: 16,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        background: 'rgba(10, 8, 6, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(196, 129, 58, 0.25)',
        borderRadius: 8,
        color: 'rgba(245, 222, 179, 0.6)',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        pointerEvents: 'auto',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#e8a54b';
        e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.5)';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(196, 129, 58, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(245, 222, 179, 0.6)';
        e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.25)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="1" width="9" height="12" rx="1" />
        <path d="M5 4h4" />
        <path d="M5 6.5h4" />
        <path d="M5 9h2.5" />
      </svg>
      Resume
    </button>
  );
}
