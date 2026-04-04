'use client';

import { useEffect, useCallback } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { selectCodexProgress } from '@/store/useForgeStore';
import { ZONE_DEFS } from '@/data/zones';
import { PROJECTS } from '@/data/projects';
import { SKILL_CATEGORIES } from '@/data/skills';
import { TIMELINE_DATA } from '@/data/timeline';
import { ACTIVE_PROJECTS } from '@/data/activeProjects';
import type { ZoneId } from '@/types';

const ZONE_IDS: ZoneId[] = [
  'hearth',
  'skill-tree',
  'vault',
  'timeline',
  'war-room',
  'hidden-forge',
];

const ZONE_COLORS: Record<ZoneId, string> = {
  hearth: '#c4813a',
  'skill-tree': '#44aa88',
  vault: '#aa6622',
  timeline: '#6644aa',
  'war-room': '#22aacc',
  'hidden-forge': '#ff6600',
};

const TIER_COLORS: Record<string, string> = {
  LEGENDARY: '#ff6600',
  EPIC: '#cc44ff',
  RARE: '#4488ff',
  COMMON: '#44aa66',
};

export function CodexOverlay() {
  const showCodex = useForgeStore((s) => s.showCodex);
  const closeCodex = useForgeStore((s) => s.closeCodex);
  const progress = useForgeStore(selectCodexProgress);
  const discoveredZones = useForgeStore((s) => s.discoveredZones);
  const discoveredProjects = useForgeStore((s) => s.discoveredProjects);
  const discoveredSubcategories = useForgeStore((s) => s.discoveredSubcategories);
  const discoveredEras = useForgeStore((s) => s.discoveredEras);
  const discoveredActiveProjects = useForgeStore((s) => s.discoveredActiveProjects);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCodex();
    },
    [closeCodex],
  );

  useEffect(() => {
    if (!showCodex) return;
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showCodex, onKeyDown]);

  if (!showCodex) return null;

  const pct = Math.round(progress * 100);

  // Count discovered items per section
  const zoneCount = discoveredZones.size;
  const projectCount = discoveredProjects.size;
  const subcatCount = discoveredSubcategories.size;
  const eraCount = discoveredEras.size;
  const activeCount = discoveredActiveProjects.size;

  // Flatten all subcategories
  const allSubcategories = SKILL_CATEGORIES.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      ...sub,
      categoryColor: cat.color,
      categoryLabel: cat.label,
    })),
  );

  return (
    <div
      onClick={closeCodex}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 75,
        background: 'rgba(10,8,6,0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        pointerEvents: 'auto',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: 'clamp(16px, 4vw, 40px) clamp(12px, 3vw, 32px)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              className="font-cinzel"
              style={{
                fontSize: 'clamp(20px, 4vw, 28px)',
                fontWeight: 700,
                color: '#f5deb3',
                margin: 0,
                letterSpacing: '3px',
              }}
            >
              THE FORGE CODEX
            </h2>
            <p
              className="font-rajdhani"
              style={{ fontSize: 13, color: '#6a5a4a', margin: '4px 0 0', letterSpacing: '1px' }}
            >
              DISCOVERY TRACKER
            </p>
          </div>
          <button
            onClick={closeCodex}
            aria-label="Close Codex"
            style={{
              background: 'none',
              border: 'none',
              color: '#6a5a4a',
              fontSize: 28,
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span
              className="font-rajdhani"
              style={{
                fontSize: 12,
                color: '#6a5a4a',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Overall Progress
            </span>
            <span
              className="font-rajdhani"
              style={{ fontSize: 14, color: '#e8a54b', fontWeight: 600 }}
            >
              {pct}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: 'rgba(196,129,58,0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(90deg, #c4813a, #e8a54b)',
                boxShadow: '0 0 8px rgba(232,165,75,0.5)',
                transition: 'width 0.8s ease',
              }}
            />
          </div>
        </div>

        {/* ── Zones Section ────────────────────────────────────── */}
        <Section title="Zones" discovered={zoneCount} total={5} color="#c4813a">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 10,
            }}
          >
            {ZONE_IDS.map((id) => {
              const found = discoveredZones.has(id);
              return (
                <Card key={id} discovered={found} accentColor={ZONE_COLORS[id]}>
                  {found ? ZONE_DEFS[id].name : '???'}
                </Card>
              );
            })}
          </div>
        </Section>

        {/* ── Project Vault ────────────────────────────────────── */}
        <Section
          title="The Project Vault"
          discovered={projectCount}
          total={PROJECTS.length}
          color="#aa6622"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 10,
            }}
          >
            {PROJECTS.map((p) => {
              const found = discoveredProjects.has(p.name);
              return (
                <Card
                  key={p.name}
                  discovered={found}
                  accentColor={TIER_COLORS[p.tier] ?? '#6a5a4a'}
                >
                  {found ? (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f5deb3' }}>
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: TIER_COLORS[p.tier],
                          marginTop: 2,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}
                      >
                        {p.tier}
                      </div>
                    </div>
                  ) : (
                    '???'
                  )}
                </Card>
              );
            })}
          </div>
        </Section>

        {/* ── Skill Tree ───────────────────────────────────────── */}
        <Section
          title="The Skill Tree"
          discovered={subcatCount}
          total={allSubcategories.length}
          color="#44aa88"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 10,
            }}
          >
            {allSubcategories.map((sub) => {
              const found = discoveredSubcategories.has(sub.id);
              return (
                <Card key={sub.id} discovered={found} accentColor={sub.categoryColor}>
                  {found ? (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f5deb3' }}>
                        {sub.label}
                      </div>
                      <div style={{ fontSize: 10, color: sub.categoryColor, marginTop: 2 }}>
                        {sub.skills.length} skills &middot; {sub.categoryLabel}
                      </div>
                    </div>
                  ) : (
                    '???'
                  )}
                </Card>
              );
            })}
          </div>
        </Section>

        {/* ── Timeline ─────────────────────────────────────────── */}
        <Section
          title="The Timeline"
          discovered={eraCount}
          total={TIMELINE_DATA.length}
          color="#6644aa"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 10,
            }}
          >
            {TIMELINE_DATA.map((era) => {
              const found = discoveredEras.has(era.era);
              return (
                <Card
                  key={era.era}
                  discovered={found}
                  accentColor={`#${era.color.toString(16).padStart(6, '0')}`}
                >
                  {found ? (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f5deb3' }}>
                        {era.era}
                      </div>
                      <div style={{ fontSize: 10, color: '#8a7a6a', marginTop: 2 }}>
                        {era.org} &middot; {era.years}
                      </div>
                    </div>
                  ) : (
                    '???'
                  )}
                </Card>
              );
            })}
          </div>
        </Section>

        {/* ── War Room ─────────────────────────────────────────── */}
        <Section
          title="The War Room"
          discovered={activeCount}
          total={ACTIVE_PROJECTS.length}
          color="#22aacc"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 10,
            }}
          >
            {ACTIVE_PROJECTS.map((ap) => {
              const found = discoveredActiveProjects.has(ap.name);
              return (
                <Card
                  key={ap.name}
                  discovered={found}
                  accentColor={`#${ap.color.toString(16).padStart(6, '0')}`}
                >
                  {found ? (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f5deb3' }}>
                        {ap.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#8a7a6a', marginTop: 2 }}>
                        {ap.status}
                      </div>
                    </div>
                  ) : (
                    '???'
                  )}
                </Card>
              );
            })}
          </div>
        </Section>

        {/* Footer spacer */}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function Section({
  title,
  discovered,
  total,
  color,
  children,
}: {
  title: string;
  discovered: number;
  total: number;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
        <h3
          className="font-cinzel"
          style={{ fontSize: 16, fontWeight: 600, color, margin: 0, letterSpacing: '1px' }}
        >
          {title}
        </h3>
        <span className="font-rajdhani" style={{ fontSize: 12, color: '#6a5a4a' }}>
          {discovered}/{total}
        </span>
      </div>
      {children}
    </div>
  );
}

function Card({
  discovered,
  accentColor,
  children,
}: {
  discovered: boolean;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="font-rajdhani"
      style={{
        padding: '10px 12px',
        borderRadius: 6,
        background: discovered ? 'rgba(196,129,58,0.08)' : 'rgba(74,61,48,0.15)',
        border: `1px solid ${discovered ? accentColor + '40' : 'rgba(74,61,48,0.2)'}`,
        borderLeft: `3px solid ${discovered ? accentColor : 'rgba(74,61,48,0.3)'}`,
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
        color: discovered ? '#f5deb3' : '#4a3d30',
        fontSize: 14,
        fontWeight: discovered ? 500 : 600,
        letterSpacing: discovered ? 0 : '3px',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </div>
  );
}
