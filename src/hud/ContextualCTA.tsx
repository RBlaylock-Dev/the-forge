'use client';

import { useForgeStore } from '@/store/useForgeStore';

const ZONE_CTAS: Record<string, { message: string; action: string; subject: string }> = {
  'skill-tree': {
    message: 'Need this stack on your team?',
    action: "Let's talk",
    subject: 'Hiring Inquiry',
  },
  vault: {
    message: 'Want something like this built?',
    action: 'Start a conversation',
    subject: 'Freelance Project',
  },
  timeline: {
    message: 'This journey continues with your project',
    action: 'Reach out',
    subject: 'Hiring Inquiry',
  },
  'war-room': {
    message: 'These projects need collaborators',
    action: 'Join the mission',
    subject: 'Collaboration',
  },
};

export function ContextualCTA() {
  const currentZone = useForgeStore((s) => s.currentZone);
  const isStarted = useForgeStore((s) => s.isStarted);
  const isTourActive = useForgeStore((s) => s.isTourActive);
  const isCinematicActive = useForgeStore((s) => s.isCinematicActive);
  const showDetail = useForgeStore((s) => s.showDetail);
  const showCodex = useForgeStore((s) => s.showCodex);
  const showContact = useForgeStore((s) => s.showContact);
  const showResume = useForgeStore((s) => s.showResume);

  if (!isStarted || isTourActive || isCinematicActive) return null;
  if (showDetail || showCodex || showContact || showResume) return null;
  if (!currentZone || !ZONE_CTAS[currentZone]) return null;

  const cta = ZONE_CTAS[currentZone];

  const handleClick = () => {
    useForgeStore.setState({ contactSubject: cta.subject, showContact: true });
  };

  return (
    <button
      onClick={handleClick}
      className="font-rajdhani contextual-cta-glow"
      key={currentZone}
      style={{
        position: 'fixed',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        pointerEvents: 'auto',
        animation: 'contextual-cta-in 0.6s ease both',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '12px 28px',
        background: 'linear-gradient(135deg, rgba(196,129,58,0.15), rgba(232,165,75,0.08))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(232,165,75,0.4)',
        borderRadius: 10,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        whiteSpace: 'nowrap',
        boxShadow: '0 0 20px rgba(196,129,58,0.2), 0 0 40px rgba(196,129,58,0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(232,165,75,0.7)';
        e.currentTarget.style.boxShadow = '0 0 24px rgba(232,165,75,0.35), 0 0 48px rgba(196,129,58,0.15)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(196,129,58,0.25), rgba(232,165,75,0.12))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(232,165,75,0.4)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(196,129,58,0.2), 0 0 40px rgba(196,129,58,0.08)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(196,129,58,0.15), rgba(232,165,75,0.08))';
      }}
    >
      <span style={{ fontSize: 14, color: '#f5deb3', fontWeight: 500 }}>
        {cta.message}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: '#e8a54b',
          letterSpacing: '0.5px',
          textShadow: '0 0 8px rgba(232,165,75,0.4)',
        }}
      >
        → {cta.action}
      </span>
    </button>
  );
}
