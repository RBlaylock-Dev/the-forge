'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useForgeStore } from '@/store/useForgeStore';

interface BioCardProps {
  position: [number, number, number];
  worldPosition?: [number, number, number];
}

const FADE_FAR = 30;
const FADE_NEAR = 15;

const LINKEDIN_URL = 'https://www.linkedin.com/in/robertblaylock-dev/';
const GITHUB_URL = 'https://github.com/RBlaylock-Dev';

/**
 * BioCard — Floating bio/welcome card anchored to 3D space above
 * the Hearth. Shows name, title, stats, and action buttons.
 * Uses distance-based fade like ZoneLabel.
 */
export function BioCard({ position, worldPosition }: BioCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const wp = worldPosition ?? position;

  useFrame(() => {
    const el = containerRef.current;
    if (!el) return;

    const { playerPosition } = useForgeStore.getState();
    const dx = playerPosition.x - wp[0];
    const dz = playerPosition.z - wp[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    const opacity = dist >= FADE_FAR ? 0 : dist <= FADE_NEAR ? 1 : 1 - (dist - FADE_NEAR) / (FADE_FAR - FADE_NEAR);
    const scale = dist <= 20 ? 1 : Math.max(0.6, 1 - (dist - 20) * 0.04);

    el.style.opacity = String(opacity);
    el.style.transform = `scale(${scale})`;
  });

  if (!isStarted || isTourActive) return null;

  const handleResume = () => useForgeStore.getState().openResume();
  const handleContact = () => useForgeStore.getState().openContact();

  return (
    <Html center position={position} style={{ pointerEvents: 'none' }}>
      <div ref={containerRef} className="bio-card" style={{ opacity: 0 }}>
        <div className="bio-card-name">Robert Blaylock</div>
        <div className="bio-card-title">
          Senior Full Stack Software Engineer | 3D Software Engineer
        </div>
        <div className="bio-card-location">Counce, TN</div>
        <div className="bio-card-tagline">
          Building production 3D experiences, full-stack platforms, and everything in between.
        </div>
        <div className="bio-card-stats">
          12+ Projects · 5 Years Engineering · 3D &amp; WebGL Specialist
        </div>
        <div className="bio-card-actions">
          <button className="bio-card-btn bio-card-btn-primary" onClick={handleResume}>
            View Resume
          </button>
          <button className="bio-card-btn bio-card-btn-primary" onClick={handleContact}>
            Contact Me
          </button>
          <a
            className="bio-card-btn bio-card-btn-link"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
          <a
            className="bio-card-btn bio-card-btn-link"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </Html>
  );
}
