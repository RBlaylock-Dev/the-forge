'use client';

import { useForgeStore } from '@/store/useForgeStore';

// ── Key badge styles ───────────────────────────────────────────
const keyBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 22,
  height: 22,
  padding: '0 5px',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.5px',
  color: '#e8a54b',
  background: 'rgba(196, 129, 58, 0.08)',
  border: '1px solid rgba(196, 129, 58, 0.25)',
  borderRadius: 3,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(196, 185, 154, 0.6)',
  marginLeft: 6,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 6,
};

/**
 * ControlsHUD — bottom-left panel showing keyboard control hints.
 * Displays WASD, Mouse, E, and ESC keybinds in compact badge style.
 * Only visible after the game has started.
 */
export function ControlsHUD() {
  const isStarted = useForgeStore((s) => s.isStarted);

  if (!isStarted) return null;

  return (
    <nav
      aria-label="Controls"
      className="font-rajdhani"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        zIndex: 10,
        background: 'rgba(10, 8, 6, 0.75)',
        border: '1px solid rgba(196, 129, 58, 0.15)',
        borderRadius: 4,
        padding: '10px 14px',
        pointerEvents: 'none',
      }}
    >
      {/* WASD */}
      <div style={rowStyle}>
        <span style={keyBadgeStyle}>W</span>
        <span style={keyBadgeStyle}>A</span>
        <span style={keyBadgeStyle}>S</span>
        <span style={keyBadgeStyle}>D</span>
        <span style={labelStyle}>Move</span>
      </div>

      {/* Mouse */}
      <div style={rowStyle}>
        <span style={keyBadgeStyle}>Mouse</span>
        <span style={labelStyle}>Look</span>
      </div>

      {/* E key */}
      <div style={rowStyle}>
        <span style={keyBadgeStyle}>E</span>
        <span style={labelStyle}>Inspect</span>
      </div>

      {/* ESC */}
      <div style={{ ...rowStyle, marginBottom: 0 }}>
        <span style={keyBadgeStyle}>ESC</span>
        <span style={labelStyle}>Release cursor</span>
      </div>
    </nav>
  );
}
