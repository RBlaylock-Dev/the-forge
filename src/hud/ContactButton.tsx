'use client';

import { useForgeStore } from '@/store/useForgeStore';

/**
 * ContactButton — Persistent floating button in the HUD.
 * Opens the contact modal from any zone.
 */
export function ContactButton() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const openContact = useForgeStore((s) => s.openContact);

  if (!isStarted || isTourActive) return null;

  return (
    <button
      onClick={openContact}
      aria-label="Contact Robert"
      className="font-rajdhani"
      style={{
        position: 'fixed',
        bottom: 208,
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
        <rect x="1.5" y="3" width="11" height="8" rx="1" />
        <path d="M1.5 4l5.5 4 5.5-4" />
      </svg>
      Contact
    </button>
  );
}
