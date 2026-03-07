'use client';

import { useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

/**
 * SoundToggle — HUD button to toggle ambient soundscape on/off
 * with a volume slider on hover.
 */
export function SoundToggle() {
  const isStarted = useForgeStore((s) => s.isStarted);
  const audioEnabled = useForgeStore((s) => s.audioEnabled);
  const audioVolume = useForgeStore((s) => s.audioVolume);
  const toggleAudio = useForgeStore((s) => s.toggleAudio);
  const setAudioVolume = useForgeStore((s) => s.setAudioVolume);
  const [showSlider, setShowSlider] = useState(false);

  if (!isStarted) return null;

  return (
    <div
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
      style={{
        position: 'fixed',
        bottom: 80,
        right: 16,
        zIndex: 10,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Volume slider (visible on hover) */}
      {showSlider && audioEnabled && (
        <div
          style={{
            width: 32,
            height: 100,
            background: 'rgba(10,8,6,0.85)',
            border: '1px solid rgba(196,129,58,0.3)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 0',
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
            style={{
              writingMode: 'vertical-lr',
              direction: 'rtl',
              width: 20,
              height: 80,
              accentColor: '#c4813a',
              cursor: 'pointer',
            }}
          />
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggleAudio}
        aria-label={audioEnabled ? 'Mute sound' : 'Enable sound'}
        title={audioEnabled ? 'Mute sound' : 'Enable sound'}
        className="font-rajdhani"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(196,129,58,0.4)',
          background: audioEnabled
            ? 'rgba(196,129,58,0.15)'
            : 'rgba(10,8,6,0.7)',
          color: audioEnabled ? '#e8a54b' : '#f5deb380',
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        {audioEnabled ? '\u{1F50A}' : '\u{1F507}'}
      </button>
    </div>
  );
}
