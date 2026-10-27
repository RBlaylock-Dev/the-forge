'use client';

import { useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

/**
 * SoundToggle — tool rail button to toggle the ambient soundscape,
 * with a volume slider that pops out to the left on hover/focus.
 */
export function SoundToggle() {
  const audioEnabled = useForgeStore((s) => s.audioEnabled);
  const audioVolume = useForgeStore((s) => s.audioVolume);
  const toggleAudio = useForgeStore((s) => s.toggleAudio);
  const setAudioVolume = useForgeStore((s) => s.setAudioVolume);
  const [showSlider, setShowSlider] = useState(false);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
      onFocus={() => setShowSlider(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setShowSlider(false);
      }}
    >
      {/* Volume slider (pops out to the left) */}
      {showSlider && audioEnabled && (
        <div
          style={{
            position: 'absolute',
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: 10,
            padding: '6px 10px',
            background: 'rgba(10,8,6,0.85)',
            border: '1px solid rgba(196,129,58,0.3)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'auto',
          }}
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={audioVolume}
            onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
            aria-label="Sound volume"
            style={{ width: 90, accentColor: '#c4813a', cursor: 'pointer' }}
          />
        </div>
      )}

      <button
        onClick={toggleAudio}
        aria-label={audioEnabled ? 'Mute sound' : 'Enable sound'}
        aria-pressed={audioEnabled}
        title={audioEnabled ? 'Mute sound' : 'Enable sound'}
        className="hud-tool"
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          {audioEnabled ? (
            <>
              <path d="M15.5 8.5a5 5 0 010 7" />
              <path d="M18.5 5.5a9 9 0 010 13" />
            </>
          ) : (
            <path d="M22 9l-6 6M16 9l6 6" />
          )}
        </svg>
      </button>
    </div>
  );
}
