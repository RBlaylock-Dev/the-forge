'use client';

import { useEffect, useState, useRef } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

/**
 * CursorTooltip — Floating tooltip that follows the mouse cursor
 * when hovering an interactable 3D object. Shows "Click to view: {name}".
 *
 * Hidden during tour, when detail panel is open, or on touch devices.
 * pointer-events: none so it never blocks interaction.
 */
export function CursorTooltip() {
  const interactTarget = useForgeStore((s) => s.interactTarget);
  const showDetail = useForgeStore((s) => s.showDetail);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const isStarted = useForgeStore((s) => s.isStarted);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const visible = useRef(false);

  // Detect touch-only devices
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)');
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Track mouse position
  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [isTouch]);

  // Don't render on touch devices
  if (isTouch) return null;

  const shouldShow =
    isStarted &&
    !isTourActive &&
    !showDetail &&
    interactTarget !== null;

  // Track visibility for fade animation
  visible.current = shouldShow;

  const name = interactTarget?.name ?? '';

  return (
    <div
      className={`cursor-tooltip ${shouldShow ? 'cursor-tooltip-visible' : ''}`}
      style={{
        position: 'fixed',
        left: mouse.x + 16,
        top: mouse.y + 16,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      Click to view: {name}
    </div>
  );
}
