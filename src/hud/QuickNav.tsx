'use client';

import { useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';
import type { ZoneId } from '@/types';

// ── Zone colors matching the forge palette ─────────────────────
const ZONE_COLORS: Record<ZoneId, string> = {
  hearth: '#c4813a',
  'skill-tree': '#44aa88',
  vault: '#aa6622',
  timeline: '#6644aa',
  'war-room': '#22aacc',
};

/**
 * Calculates a yaw angle that faces toward the Hearth (world center)
 * from the given zone position. This ensures players land facing
 * inward toward the center of the world.
 */
function yawFacingCenter(x: number, z: number): number {
  // atan2 gives the angle to face from (x,z) toward (0,0)
  // In Three.js: yaw=0 faces -Z, so we use atan2(-x, -z)
  if (x === 0 && z === 0) return 0; // Hearth — face default
  return Math.atan2(-x, -z);
}

// ── Ordered zone list for display ──────────────────────────────
const ZONE_ORDER: ZoneId[] = ['hearth', 'skill-tree', 'vault', 'timeline', 'war-room'];

/**
 * QuickNav — left-side vertical dots, one per zone.
 * Clicking a dot teleports the player to that zone's center.
 * Active zone dot glows gold. Tooltips show zone names on hover.
 */
export function QuickNav() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const currentZone = useForgeStore((s) => s.currentZone);
  const teleportTo = useForgeStore((s) => s.teleportTo);
  const closeDetailPanel = useForgeStore((s) => s.closeDetailPanel);
  const showDetail = useForgeStore((s) => s.showDetail);

  const [hoveredZone, setHoveredZone] = useState<ZoneId | null>(null);

  if (!isStarted) return null;

  const handleTeleport = (zoneId: ZoneId) => {
    const zone = ZONE_DEFS[zoneId];

    // Close detail panel if open before teleporting
    if (showDetail) {
      closeDetailPanel();
    }

    // Offset slightly from center so player isn't exactly on the zone marker
    const offsetZ = zone.center.z + 3;
    const yaw = yawFacingCenter(zone.center.x, offsetZ);

    teleportTo(zone.center.x, offsetZ, yaw);
  };

  return (
    <nav
      aria-label="Quick navigation"
      className="font-rajdhani"
      style={{
        position: 'fixed',
        left: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'auto',
      }}
    >
      {ZONE_ORDER.map((zoneId) => {
        const isCurrent = currentZone === zoneId;
        const isHovered = hoveredZone === zoneId;
        const color = ZONE_COLORS[zoneId];
        const zone = ZONE_DEFS[zoneId];

        return (
          <div
            key={zoneId}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            {/* Dot button */}
            <button
              onClick={() => handleTeleport(zoneId)}
              onMouseEnter={() => setHoveredZone(zoneId)}
              onMouseLeave={() => setHoveredZone(null)}
              aria-label={`Teleport to ${zone.name}`}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: `2px solid ${isCurrent ? '#e8a54b' : 'rgba(196, 129, 58, 0.3)'}`,
                background: isCurrent ? '#e8a54b' : color,
                cursor: 'pointer',
                padding: 0,
                boxShadow: isCurrent
                  ? '0 0 8px rgba(232, 165, 75, 0.6), 0 0 16px rgba(232, 165, 75, 0.3)'
                  : 'none',
                transition: 'all 0.2s ease',
                opacity: isCurrent ? 1 : 0.6,
                pointerEvents: 'auto',
              }}
            />

            {/* Tooltip on hover */}
            {isHovered && (
              <span
                style={{
                  position: 'absolute',
                  left: 22,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap',
                  fontSize: 11,
                  letterSpacing: '0.5px',
                  color: '#f5deb3',
                  background: 'rgba(10, 8, 6, 0.9)',
                  border: '1px solid rgba(196, 129, 58, 0.25)',
                  borderRadius: 3,
                  padding: '3px 8px',
                  pointerEvents: 'none',
                }}
              >
                {zone.name}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
