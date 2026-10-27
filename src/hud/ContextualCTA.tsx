'use client';

import { useEffect, useState } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { getTotalSkillCount } from '@/data/skills';
import { PROJECTS } from '@/data/projects';
import { ACTIVE_PROJECTS } from '@/data/activeProjects';

interface ZoneCTA {
  icon: string;
  eyebrow: string;
  pitch: string;
  action: string;
  subject: string;
}

const IN_PROGRESS_COUNT = ACTIVE_PROJECTS.filter((p) => p.status !== 'Active').length;

const ZONE_CTAS: Record<string, ZoneCTA> = {
  'skill-tree': {
    icon: '⚒',
    eyebrow: 'Hiring?',
    pitch: `${getTotalSkillCount()} skills, tempered in production. Put them on your team.`,
    action: "Let's talk",
    subject: 'Hiring Inquiry',
  },
  vault: {
    icon: '✦',
    eyebrow: 'Have a project?',
    pitch: `${PROJECTS.length} builds in the vault. Yours could be the next one forged.`,
    action: 'Start a project',
    subject: 'Freelance Project',
  },
  timeline: {
    icon: '→',
    eyebrow: 'The next chapter',
    pitch: 'This journey continues with your team.',
    action: 'Reach out',
    subject: 'Hiring Inquiry',
  },
  'war-room': {
    icon: '⚒',
    eyebrow: 'Open to collaboration',
    pitch: `${IN_PROGRESS_COUNT} active builds are looking for contributors.`,
    action: 'Join a build',
    subject: 'Collaboration',
  },
};

const COLLAPSE_AFTER_MS = 8000;
const WIDE_QUERY = '(min-width: 1100px)';

function useIsWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    setWide(mq.matches);
    const handler = (e: MediaQueryListEvent) => setWide(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return wide;
}

/**
 * ContextualCTA — a forged plaque that slides in when the visitor enters a
 * zone, pitching a zone-specific next step. Collapses to a compact chip after
 * a few seconds (and always on narrower screens); dismissible per zone.
 */
export function ContextualCTA() {
  const currentZone = useForgeStore((s) => s.currentZone);
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const isCinematicActive = useForgeStore((s) => s.isCinematicActive);
  const showDetail = useForgeStore((s) => s.showDetail);
  const showCodex = useForgeStore((s) => s.showCodex);
  const showContact = useForgeStore((s) => s.showContact);
  const showResume = useForgeStore((s) => s.showResume);
  const wide = useIsWide();

  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [collapsed, setCollapsed] = useState(false);

  // Re-expand on every zone change, then collapse after a few seconds
  useEffect(() => {
    setCollapsed(false);
    const timer = setTimeout(() => setCollapsed(true), COLLAPSE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [currentZone]);

  if (!isStarted || isTourActive || isCinematicActive) return null;
  if (showDetail || showCodex || showContact || showResume) return null;
  if (!currentZone || !ZONE_CTAS[currentZone] || dismissed.has(currentZone)) return null;

  const cta = ZONE_CTAS[currentZone];
  const zone = currentZone;

  const openContact = () => {
    useForgeStore.setState({ contactSubject: cta.subject, showContact: true });
  };

  const dismiss = () => setDismissed((prev) => new Set(prev).add(zone));

  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 96,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    pointerEvents: 'auto',
    background: 'linear-gradient(180deg, rgba(26, 21, 17, 0.92), rgba(10, 8, 6, 0.92))',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(196, 129, 58, 0.45)',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(232, 165, 75, 0.15)',
  };

  // ── Compact chip ──────────────────────────────────────────
  if (collapsed || !wide) {
    return (
      <button
        key={`${zone}-chip`}
        onClick={openContact}
        className="cta-plaque font-rajdhani"
        style={{
          ...baseStyle,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 999,
          color: '#e8a54b',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.5px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <span aria-hidden="true">{cta.icon}</span>
        {cta.action}
        <span aria-hidden="true">&rarr;</span>
      </button>
    );
  }

  // ── Full plaque ───────────────────────────────────────────
  return (
    <aside
      key={`${zone}-plaque`}
      aria-label={cta.eyebrow}
      className="cta-plaque font-rajdhani"
      style={{
        ...baseStyle,
        width: 360,
        padding: '14px 16px 14px 18px',
        borderRadius: 12,
        borderLeft: '3px solid #e8a54b',
      }}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          position: 'absolute',
          top: 6,
          right: 8,
          border: 'none',
          background: 'transparent',
          color: 'rgba(245, 222, 179, 0.4)',
          fontSize: 16,
          lineHeight: 1,
          cursor: 'pointer',
          padding: 4,
        }}
      >
        &times;
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#e8a54b',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: 14 }}>
          {cta.icon}
        </span>
        {cta.eyebrow}
      </div>

      <p
        style={{
          margin: '6px 24px 12px 0',
          color: '#f5deb3',
          fontSize: 15,
          lineHeight: 1.35,
          fontWeight: 500,
        }}
      >
        {cta.pitch}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={openContact}
          style={{
            padding: '7px 16px',
            border: 'none',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #e8a54b, #c4813a)',
            color: '#1a1511',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.5px',
            cursor: 'pointer',
            boxShadow: '0 0 14px rgba(232, 165, 75, 0.35)',
          }}
        >
          {cta.action} &rarr;
        </button>
      </div>
    </aside>
  );
}
