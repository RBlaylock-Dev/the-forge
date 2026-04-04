'use client';

import { useEffect, useState, useRef } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { useIsMobile } from '@/utils/mobile';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { PROFICIENCY_LEVELS } from '@/data/skills';
import type {
  Project,
  SkillSubcategory,
  SkillCategoryConfig,
  TimelineEra,
  ActiveProject,
  ProjectTier,
} from '@/types';

const TIER_HEX: Record<ProjectTier, string> = {
  LEGENDARY: '#ff6600',
  EPIC: '#cc44ff',
  RARE: '#4488ff',
  COMMON: '#44aa66',
};

// ── Sub-renderers ───────────────────────────────────────────

function ProjectDetail({ data }: { data: Project }) {
  const [showPreview, setShowPreview] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Reset preview state when project changes
  useEffect(() => {
    setShowPreview(false);
    setIframeLoaded(false);
  }, [data.name]);

  return (
    <>
      {/* Screenshot / Live Preview area */}
      {(data.screenshot || (data.previewable && data.liveUrl)) && (
        <div
          style={{
            width: '100%',
            height: showPreview ? 300 : 180,
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 12,
            border: '1px solid rgba(196,129,58,0.15)',
            position: 'relative',
            transition: 'height 0.3s ease',
            background: '#0a0806',
          }}
        >
          {showPreview && data.liveUrl ? (
            <>
              {/* Loading indicator */}
              {!iframeLoaded && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    className="font-rajdhani"
                    style={{
                      fontSize: 12,
                      color: '#c4813a',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Loading preview...
                  </div>
                  <div className="loading-bar" style={{ width: 100 }}>
                    <div
                      className="loading-bar-fill"
                      style={{ width: '60%', animation: 'pulse-glow 1.5s ease-in-out infinite' }}
                    />
                  </div>
                </div>
              )}
              <iframe
                src={data.liveUrl}
                title={`${data.name} live preview`}
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={() => setIframeLoaded(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                  opacity: iframeLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              />
            </>
          ) : data.screenshot ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={data.screenshot}
              alt={`${data.name} screenshot`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : null}
        </div>
      )}

      {/* Preview toggle button */}
      {data.previewable && data.liveUrl && (
        <button
          onClick={() => {
            setShowPreview(!showPreview);
            if (showPreview) setIframeLoaded(false);
          }}
          className="font-rajdhani"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: showPreview ? '#c4813a' : '#e8a54b',
            background: showPreview ? 'rgba(196,129,58,0.08)' : 'rgba(196,129,58,0.15)',
            border: `1px solid ${showPreview ? 'rgba(196,129,58,0.2)' : 'rgba(232,165,75,0.3)'}`,
            borderRadius: 4,
            padding: '5px 12px',
            cursor: 'pointer',
            pointerEvents: 'auto',
            marginBottom: 16,
            transition: 'all 0.2s ease',
          }}
        >
          {showPreview ? 'Show Screenshot' : 'Live Preview'}
        </button>
      )}

      {/* Spacer when no preview toggle */}
      {(!data.previewable || !data.liveUrl) && <div style={{ marginBottom: 4 }} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h2
          className="font-cinzel"
          style={{ fontSize: 22, fontWeight: 700, color: '#f5deb3', margin: 0 }}
        >
          {data.name}
        </h2>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: TIER_HEX[data.tier],
            border: `1px solid ${TIER_HEX[data.tier]}`,
            borderRadius: 3,
            padding: '2px 8px',
          }}
        >
          {data.tier}
        </span>
      </div>

      {data.role && (
        <div style={{ marginBottom: 16 }}>
          <div
            className="font-rajdhani"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#c4813a',
              marginBottom: 6,
            }}
          >
            My Role
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: '#c4b99a', margin: 0 }}>{data.role}</p>
        </div>
      )}

      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#c4b99a', marginBottom: 16 }}>
        {data.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {data.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 11,
              color: '#c4813a',
              background: 'rgba(196,129,58,0.1)',
              border: '1px solid rgba(196,129,58,0.2)',
              borderRadius: 3,
              padding: '3px 8px',
              letterSpacing: '0.5px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {data.liveUrl && (
        <a
          href={data.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#e8a54b',
            textDecoration: 'none',
            letterSpacing: '1px',
            pointerEvents: 'auto',
          }}
        >
          Live Demo &#8599;
        </a>
      )}
      {data.codeUrl && (
        <a
          href={data.codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#e8a54b',
            textDecoration: 'none',
            letterSpacing: '1px',
            marginLeft: data.liveUrl ? 16 : 0,
            pointerEvents: 'auto',
          }}
        >
          Source &#8599;
        </a>
      )}
    </>
  );
}

function SkillSubcategoryDetail({
  subcategory,
  category,
}: {
  subcategory: SkillSubcategory;
  category: SkillCategoryConfig;
}) {
  return (
    <>
      <h2
        className="font-cinzel"
        style={{ fontSize: 22, fontWeight: 700, color: '#f5deb3', margin: 0, marginBottom: 4 }}
      >
        {subcategory.label}
      </h2>
      <div
        className="font-rajdhani"
        style={{
          fontSize: 11,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: category.color,
          marginBottom: 20,
        }}
      >
        Part of {category.label}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {subcategory.skills.map((skill) => {
          const prof = PROFICIENCY_LEVELS[skill.proficiency];
          return (
            <li
              key={skill.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid rgba(196,129,58,0.1)',
              }}
            >
              <span style={{ fontSize: 13, color: '#c4b99a' }}>{skill.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3, 4].map((dot) => (
                    <span
                      key={dot}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: dot <= prof.dots ? prof.color : 'rgba(196,129,58,0.15)',
                        display: 'inline-block',
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: 9,
                    color: prof.color,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    minWidth: 60,
                    textAlign: 'right',
                  }}
                >
                  {prof.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div
        className="font-rajdhani"
        style={{
          fontSize: 11,
          letterSpacing: '1.5px',
          color: '#4a3d30',
          textTransform: 'uppercase',
          marginTop: 20,
          paddingTop: 12,
          borderTop: '1px solid rgba(196,129,58,0.1)',
        }}
      >
        {subcategory.skills.length} skills &middot; Part of {category.label}
      </div>
    </>
  );
}

function TimelineEraDetail({ data }: { data: TimelineEra }) {
  const colorHex = `#${data.color.toString(16).padStart(6, '0')}`;
  return (
    <>
      <h2
        className="font-cinzel"
        style={{ fontSize: 22, fontWeight: 700, color: '#f5deb3', margin: 0, marginBottom: 8 }}
      >
        {data.era}
      </h2>
      <div style={{ fontSize: 13, color: colorHex, marginBottom: 4 }}>{data.org}</div>
      <div style={{ fontSize: 12, color: '#6a5a4a', marginBottom: 16 }}>{data.years}</div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#c4b99a' }}>{data.skill}</p>
    </>
  );
}

function ActiveProjectDetail({ data }: { data: ActiveProject }) {
  const colorHex = `#${data.color.toString(16).padStart(6, '0')}`;
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h2
          className="font-cinzel"
          style={{ fontSize: 22, fontWeight: 700, color: '#f5deb3', margin: 0 }}
        >
          {data.name}
        </h2>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: colorHex,
            border: `1px solid ${colorHex}`,
            borderRadius: 3,
            padding: '2px 8px',
          }}
        >
          {data.status}
        </span>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#c4b99a' }}>{data.desc}</p>
    </>
  );
}

// ── Main Component ──────────────────────────────────────────

export function DetailPanel() {
  const activeDetail = useForgeStore((s) => s.activeDetail);
  const showDetail = useForgeStore((s) => s.showDetail);
  const closeDetailPanel = useForgeStore((s) => s.closeDetailPanel);
  const mobile = useIsMobile();
  const focusTrapRef = useFocusTrap(showDetail);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus close button when panel opens
  useEffect(() => {
    if (showDetail) {
      requestAnimationFrame(() => closeRef.current?.focus());
    }
  }, [showDetail]);

  // ESC to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && showDetail) {
        closeDetailPanel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showDetail, closeDetailPanel]);

  return (
    <aside
      ref={focusTrapRef as React.RefObject<HTMLElement>}
      role="dialog"
      aria-modal="true"
      aria-label="Detail panel"
      className="font-rajdhani"
      style={
        mobile
          ? {
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              height: '70vh',
              zIndex: 60,
              background: 'rgba(10,8,6,0.95)',
              backdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(196,129,58,0.2)',
              padding: '24px 20px',
              overflowY: 'auto',
              transform: showDetail ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              pointerEvents: showDetail ? 'auto' : 'none',
              borderRadius: '16px 16px 0 0',
            }
          : {
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 440,
              maxWidth: '90vw',
              zIndex: 60,
              background: 'rgba(10,8,6,0.92)',
              backdropFilter: 'blur(12px)',
              borderLeft: '1px solid rgba(196,129,58,0.2)',
              padding: '32px 28px',
              overflowY: 'auto',
              transform: showDetail ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
              pointerEvents: showDetail ? 'auto' : 'none',
            }
      }
    >
      {/* Close button */}
      <button
        ref={closeRef}
        onClick={closeDetailPanel}
        aria-label="Close detail panel"
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'none',
          border: '1px solid rgba(196,129,58,0.3)',
          borderRadius: 4,
          color: '#c4813a',
          fontSize: 18,
          width: 32,
          height: 32,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        &times;
      </button>

      {/* Content */}
      <div style={{ marginTop: 24 }}>
        {activeDetail?.type === 'project' && <ProjectDetail data={activeDetail.data} />}
        {activeDetail?.type === 'skill-subcategory' && (
          <SkillSubcategoryDetail
            subcategory={activeDetail.data.subcategory}
            category={activeDetail.data.category}
          />
        )}
        {activeDetail?.type === 'timeline-era' && <TimelineEraDetail data={activeDetail.data} />}
        {activeDetail?.type === 'active-project' && (
          <ActiveProjectDetail data={activeDetail.data} />
        )}
      </div>
    </aside>
  );
}
