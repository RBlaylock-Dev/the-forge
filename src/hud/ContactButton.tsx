'use client';

import { useForgeStore } from '@/store/useForgeStore';

/**
 * ContactButton — action dock button that opens the contact modal.
 */
export function ContactButton() {
  const openContact = useForgeStore((s) => s.openContact);

  return (
    <button
      onClick={openContact}
      aria-label="Contact Robert"
      title="Contact Robert"
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
        <rect x="1.5" y="3" width="11" height="8" rx="1" />
        <path d="M1.5 4l5.5 4 5.5-4" />
      </svg>
      <span className="hud-dock-label">Contact</span>
    </button>
  );
}
