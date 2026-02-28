'use client';

import { useEffect, useCallback } from 'react';
import { useForgeStore } from '@/store/useForgeStore';

const RESUME_PATH = '/resume/robert-blaylock-resume.pdf';

/**
 * ResumePreview — Full-screen overlay with embedded PDF preview
 * and prominent download button. Forge-themed.
 */
export function ResumePreview() {
  const showResume = useForgeStore((s) => s.showResume);
  const closeResume = useForgeStore((s) => s.closeResume);

  const handleClose = useCallback(() => {
    closeResume();
  }, [closeResume]);

  // Escape key to close
  useEffect(() => {
    if (!showResume) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') handleClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showResume, handleClose]);

  if (!showResume) return null;

  // Detect mobile for direct download behavior
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    // On mobile, trigger direct download and close
    if (typeof window !== 'undefined') {
      const link = document.createElement('a');
      link.href = RESUME_PATH;
      link.download = 'robert-blaylock-resume.pdf';
      link.click();
      closeResume();
    }
    return null;
  }

  return (
    <div
      className="font-rajdhani"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 8, 6, 0.85)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal content */}
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: 800,
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#1a1511',
          border: '1px solid rgba(196, 129, 58, 0.3)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(196, 129, 58, 0.15), 0 0 80px rgba(10, 8, 6, 0.8)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(196, 129, 58, 0.2)',
            background: 'rgba(26, 21, 17, 0.95)',
          }}
        >
          <h2
            className="font-cinzel"
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: '#e8a54b',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            The Smith&apos;s Record
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Open in new tab */}
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'rgba(245, 222, 179, 0.5)',
                textDecoration: 'none',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f5deb3'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(245, 222, 179, 0.5)'; }}
            >
              Open in New Tab
            </a>

            {/* Download button */}
            <a
              href={RESUME_PATH}
              download="robert-blaylock-resume.pdf"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 20px',
                background: 'rgba(196, 129, 58, 0.15)',
                border: '1px solid rgba(196, 129, 58, 0.4)',
                borderRadius: 6,
                color: '#e8a54b',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(196, 129, 58, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(232, 165, 75, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(196, 129, 58, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(196, 129, 58, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.4)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 1v9" />
                <path d="M3.5 7L7 10.5 10.5 7" />
                <path d="M2 12.5h10" />
              </svg>
              Download PDF
            </a>

            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close resume preview"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                border: '1px solid rgba(196, 129, 58, 0.2)',
                borderRadius: 6,
                background: 'transparent',
                color: 'rgba(245, 222, 179, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f5deb3';
                e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(245, 222, 179, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(196, 129, 58, 0.2)';
              }}
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                <path d="M2 2l10 10" />
                <path d="M12 2L2 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF embed */}
        <div style={{ flex: 1, background: '#0d0a08' }}>
          <iframe
            src={`${RESUME_PATH}#view=FitH`}
            title="Robert Blaylock Resume"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
