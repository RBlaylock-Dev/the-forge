'use client';

import { useEffect, useRef, useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

// ── Tour step definitions ────────────────────────────────────

interface TourStep {
  x: number;
  z: number;
  yaw: number;
  text: string;
  color: string;
}

function yawFacingCenter(x: number, z: number): number {
  if (x === 0 && z === 0) return 0;
  return Math.atan2(-x, -z);
}

const TOUR_STEPS: TourStep[] = [
  {
    x: 0, z: 3,
    yaw: 0,
    text: "Welcome to The Forge — Robert Blaylock's interactive portfolio",
    color: '#c4813a',
  },
  {
    x: -22, z: 3,
    yaw: yawFacingCenter(-22, 3),
    text: 'Explore skills and expertise',
    color: '#44aa88',
  },
  {
    x: 22, z: 3,
    yaw: yawFacingCenter(22, 3),
    text: 'Browse 12 shipped projects',
    color: '#aa6622',
  },
  {
    x: 0, z: -21,
    yaw: yawFacingCenter(0, -21),
    text: 'Follow the career journey',
    color: '#6644aa',
  },
  {
    x: 0, z: 27,
    yaw: yawFacingCenter(0, 27),
    text: "See what's being built right now",
    color: '#22aacc',
  },
  {
    x: 0, z: 3,
    yaw: 0,
    text: 'Click any section to explore — or use the navigation bar below',
    color: '#e8a54b',
  },
];

const FLY_DURATION = 1500; // ms — matches useClickToWalk FLY_DURATION
const DWELL_DURATION = 2000; // ms — time to read the text
const TOUR_DONE_KEY = 'forge-tour-done';

// ── Component ────────────────────────────────────────────────

export function IntroTour() {
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const tourStep = useForgeStore((s) => s.tourStep);
  const flyToZone = useForgeStore((s) => s.flyToZone);
  const advanceTour = useForgeStore((s) => s.advanceTour);
  const endTour = useForgeStore((s) => s.endTour);

  const [showText, setShowText] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all timers on unmount or tour end
  const clearTimers = () => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  };

  // Fire fly + schedule text show + advance
  useEffect(() => {
    if (!isTourActive) return;
    if (tourStep >= TOUR_STEPS.length) {
      // Tour complete
      localStorage.setItem(TOUR_DONE_KEY, '1');
      endTour();
      return;
    }

    clearTimers();
    setShowText(false);

    const step = TOUR_STEPS[tourStep];
    flyToZone(step.x, step.z, step.yaw);

    // Show text after fly completes
    const showTimer = setTimeout(() => setShowText(true), FLY_DURATION);
    timers.current.push(showTimer);

    // Advance to next step after dwell
    const advanceTimer = setTimeout(() => {
      setShowText(false);
      // Small gap before next fly
      const nextTimer = setTimeout(() => advanceTour(), 300);
      timers.current.push(nextTimer);
    }, FLY_DURATION + DWELL_DURATION);
    timers.current.push(advanceTimer);

    return clearTimers;
  }, [isTourActive, tourStep, flyToZone, advanceTour, endTour]);

  const handleSkip = () => {
    clearTimers();
    localStorage.setItem(TOUR_DONE_KEY, '1');
    // Fly back to hearth before ending
    flyToZone(0, 3, 0);
    setTimeout(() => endTour(), FLY_DURATION);
  };

  if (!isTourActive) return null;

  const step = TOUR_STEPS[Math.min(tourStep, TOUR_STEPS.length - 1)];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '6rem',
      }}
    >
      {/* Tour text */}
      <div
        className="tour-text"
        style={{
          opacity: showText ? 1 : 0,
          transform: showText ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <div
          className="tour-dot"
          style={{ backgroundColor: step.color, boxShadow: `0 0 8px ${step.color}` }}
        />
        <div className="tour-message">{step.text}</div>
        <div className="tour-progress">
          {tourStep + 1} / {TOUR_STEPS.length}
        </div>
      </div>

      {/* Skip button */}
      <button
        className="tour-skip-btn"
        onClick={handleSkip}
        style={{ pointerEvents: 'auto' }}
      >
        Skip Tour &rarr;
      </button>
    </div>
  );
}
