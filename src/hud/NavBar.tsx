'use client';

import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';
import type { ZoneId } from '@/types';

// ── Zone navigation config ───────────────────────────────────
interface NavItem {
  id: ZoneId;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const ICON_SIZE = 18;
const STROKE = 'currentColor';
const STROKE_W = 1.5;

const NAV_ITEMS: NavItem[] = [
  {
    id: 'hearth',
    label: 'Home',
    color: '#c4813a',
    icon: (
      <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 18 18" fill="none" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7.5L9 2.5l6 5v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" />
        <path d="M7 15.5v-5h4v5" />
      </svg>
    ),
  },
  {
    id: 'skill-tree',
    label: 'Skills',
    color: '#44aa88',
    icon: (
      <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 18 18" fill="none" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2v14" />
        <path d="M9 5L5 8" />
        <path d="M9 5l4 3" />
        <path d="M9 9L5.5 12" />
        <path d="M9 9l3.5 3" />
      </svg>
    ),
  },
  {
    id: 'vault',
    label: 'Projects',
    color: '#aa6622',
    icon: (
      <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 18 18" fill="none" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="14" height="11" rx="1" />
        <path d="M6 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4" />
        <path d="M2 8h14" />
        <circle cx="9" cy="11" r="1.5" />
      </svg>
    ),
  },
  {
    id: 'timeline',
    label: 'Career',
    color: '#6644aa',
    icon: (
      <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 18 18" fill="none" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="7" />
        <path d="M9 5v4l2.5 2.5" />
      </svg>
    ),
  },
  {
    id: 'war-room',
    label: 'Now Building',
    color: '#22aacc',
    icon: (
      <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 18 18" fill="none" stroke={STROKE} strokeWidth={STROKE_W} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2L4 10h4l-1 6 7-8h-4.5L10 2z" />
      </svg>
    ),
  },
];

/**
 * Calculates a yaw angle that faces toward the Hearth (world center)
 * from the given position.
 */
function yawFacingCenter(x: number, z: number): number {
  if (x === 0 && z === 0) return 0;
  return Math.atan2(-x, -z);
}

/**
 * NavBar — persistent bottom navigation bar with labeled zone buttons.
 * Replaces the old QuickNav dots. Clicking triggers a smooth fly animation.
 */
export function NavBar() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const currentZone = useForgeStore((s) => s.currentZone);
  const flyToZone = useForgeStore((s) => s.flyToZone);
  const closeDetailPanel = useForgeStore((s) => s.closeDetailPanel);
  const showDetail = useForgeStore((s) => s.showDetail);

  if (!isStarted || isTourActive) return null;

  const handleNav = (zoneId: ZoneId) => {
    if (currentZone === zoneId) return;

    if (showDetail) closeDetailPanel();

    const zone = ZONE_DEFS[zoneId];
    const offsetZ = zone.center.z + 3;
    const yaw = yawFacingCenter(zone.center.x, offsetZ);

    flyToZone(zone.center.x, offsetZ, yaw);
  };

  return (
    <nav
      aria-label="Zone navigation"
      className="font-rajdhani"
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        gap: 2,
        padding: '6px 8px',
        background: 'rgba(10, 8, 6, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(196, 129, 58, 0.2)',
        borderRadius: 12,
        pointerEvents: 'auto',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isCurrent = currentZone === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            aria-label={`Navigate to ${item.label}`}
            aria-current={isCurrent ? 'true' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 14px',
              border: 'none',
              borderRadius: 8,
              cursor: isCurrent ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              background: isCurrent
                ? 'rgba(232, 165, 75, 0.15)'
                : 'transparent',
              color: isCurrent ? '#e8a54b' : 'rgba(245, 222, 179, 0.5)',
              boxShadow: isCurrent
                ? '0 0 12px rgba(232, 165, 75, 0.2), inset 0 0 8px rgba(232, 165, 75, 0.05)'
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isCurrent) {
                e.currentTarget.style.background = 'rgba(196, 129, 58, 0.08)';
                e.currentTarget.style.color = '#f5deb3';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCurrent) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(245, 222, 179, 0.5)';
              }
            }}
          >
            {/* Icon */}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </span>

            {/* Label — hidden on small screens via CSS */}
            <span
              className="nav-label"
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              {item.label}
            </span>

            {/* Active indicator dot */}
            {isCurrent && (
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#e8a54b',
                  boxShadow: '0 0 6px rgba(232, 165, 75, 0.6)',
                  marginTop: 1,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
