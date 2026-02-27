'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';
import type { ZoneId } from '@/types';

// ── Constants ──────────────────────────────────────────────────
const SIZE = 140;
const HALF = SIZE / 2;
const SCALE = 2.2; // World-to-minimap scale factor
const PLAYER_RADIUS = 3;
const ZONE_DOT_RADIUS = 5;
const DIRECTION_LENGTH = 10;

// ── Colors ─────────────────────────────────────────────────────
const COLOR_GOLD = '#e8a54b';
const COLOR_AMBER = '#c4813a';
const COLOR_WHEAT = '#f5deb3';
const COLOR_DIM = 'rgba(196, 129, 58, 0.15)';
const COLOR_DISCOVERED = 'rgba(196, 129, 58, 0.5)';
const COLOR_PATH = 'rgba(196, 129, 58, 0.12)';
const COLOR_BG = 'rgba(10, 8, 6, 0.85)';
const COLOR_BORDER = 'rgba(196, 129, 58, 0.3)';

// ── Zone metadata for minimap rendering ────────────────────────
const ZONE_IDS: ZoneId[] = ['hearth', 'skill-tree', 'vault', 'timeline', 'war-room'];

/**
 * Converts world coordinates to minimap canvas coordinates.
 * World center (0,0) maps to canvas center (HALF, HALF).
 * X maps to canvas X, Z maps to canvas Y (top-down view).
 */
function worldToMinimap(worldX: number, worldZ: number): [number, number] {
  return [
    HALF + worldX * SCALE,
    HALF + worldZ * SCALE,
  ];
}

/**
 * Minimap — bottom-right 140×140 canvas showing zone positions,
 * player location, and facing direction. Renders on a 2D canvas
 * via requestAnimationFrame for smooth real-time updates.
 */
export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Read current state from store (non-reactive, polled per frame)
    const state = useForgeStore.getState();
    const { playerPosition, playerYaw, currentZone, discoveredZones, isStarted } = state;

    // Don't render before game starts
    if (!isStarted) {
      animFrameRef.current = requestAnimationFrame(draw);
      return;
    }

    // ── Clear canvas ─────────────────────────────────────────
    ctx.clearRect(0, 0, SIZE, SIZE);

    // ── Path lines from center to each zone ──────────────────
    const [cx, cy] = worldToMinimap(0, 0);
    ctx.strokeStyle = COLOR_PATH;
    ctx.lineWidth = 1;
    for (const zoneId of ZONE_IDS) {
      if (zoneId === 'hearth') continue; // No line to center
      const zone = ZONE_DEFS[zoneId];
      const [zx, zy] = worldToMinimap(zone.center.x, zone.center.z);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(zx, zy);
      ctx.stroke();
    }

    // ── Zone dots ────────────────────────────────────────────
    for (const zoneId of ZONE_IDS) {
      const zone = ZONE_DEFS[zoneId];
      const [zx, zy] = worldToMinimap(zone.center.x, zone.center.z);
      const isCurrent = currentZone === zoneId;
      const isDiscovered = discoveredZones.has(zoneId);

      // Outer ring for current zone
      if (isCurrent) {
        ctx.beginPath();
        ctx.arc(zx, zy, ZONE_DOT_RADIUS + 3, 0, Math.PI * 2);
        ctx.strokeStyle = COLOR_GOLD;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Zone dot fill
      ctx.beginPath();
      ctx.arc(zx, zy, ZONE_DOT_RADIUS, 0, Math.PI * 2);

      if (isCurrent) {
        ctx.fillStyle = COLOR_GOLD;
      } else if (isDiscovered) {
        ctx.fillStyle = COLOR_DISCOVERED;
      } else {
        ctx.fillStyle = COLOR_DIM;
      }

      ctx.fill();
    }

    // ── Player dot ───────────────────────────────────────────
    const [px, py] = worldToMinimap(playerPosition.x, playerPosition.z);
    ctx.beginPath();
    ctx.arc(px, py, PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = COLOR_WHEAT;
    ctx.fill();

    // ── Direction indicator ──────────────────────────────────
    // Yaw = 0 means facing -Z in Three.js, which is "up" on minimap
    const dirX = px + Math.sin(-playerYaw) * DIRECTION_LENGTH;
    const dirY = py + Math.cos(-playerYaw) * DIRECTION_LENGTH;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(dirX, dirY);
    ctx.strokeStyle = COLOR_WHEAT;
    ctx.lineWidth = 2;
    ctx.stroke();

    // ── Schedule next frame ──────────────────────────────────
    animFrameRef.current = requestAnimationFrame(draw);
  }, []);

  // Start/stop the render loop
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  return (
    <div
      aria-label="Minimap"
      role="img"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: SIZE,
        height: SIZE,
        zIndex: 10,
        background: COLOR_BG,
        border: `1px solid ${COLOR_BORDER}`,
        borderRadius: 4,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* "Map" label */}
      <span
        className="font-rajdhani"
        style={{
          position: 'absolute',
          top: 4,
          left: 6,
          fontSize: 10,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: COLOR_AMBER,
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      >
        Map
      </span>

      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{ display: 'block', width: SIZE, height: SIZE }}
      />
    </div>
  );
}
