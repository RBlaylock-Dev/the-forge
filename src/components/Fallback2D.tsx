'use client';

import { PROJECTS } from '@/data/projects';
import { SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '@/data/skills';
import { TIMELINE_DATA } from '@/data/timeline';
import { ACTIVE_PROJECTS } from '@/data/activeProjects';
import type { ProjectTier } from '@/types';

// ── Tier color mapping ─────────────────────────────────────────
const TIER_HEX: Record<ProjectTier, string> = {
  LEGENDARY: '#ff6600',
  EPIC: '#cc44ff',
  RARE: '#4488ff',
  COMMON: '#44aa66',
};

/**
 * Fallback2D — a clean, accessible HTML-only portfolio page.
 * Shown when WebGL is unavailable or on low-end devices.
 * Renders all portfolio content from the same data files used
 * by the 3D experience, ensuring content parity.
 */
export function Fallback2D() {
  return (
    <div
      className="font-rajdhani"
      style={{
        minHeight: '100vh',
        background: '#0a0806',
        color: '#f5deb3',
        padding: '0 16px',
        overflowY: 'auto',
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{ textAlign: 'center', padding: '48px 0 32px' }}>
        <h1
          className="font-cinzel"
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700,
            color: '#e8a54b',
            marginBottom: 8,
          }}
        >
          THE FORGE
        </h1>
        <p style={{ fontSize: 14, color: '#c4813a', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Robert Blaylock — Senior Full Stack &amp; 3D Engineer
        </p>
        <p style={{ fontSize: 13, color: '#6a5a4a', marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
          Your browser does not support WebGL. Here is the full portfolio content.
        </p>
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* ── Projects ───────────────────────────────────────── */}
        <section aria-labelledby="projects-heading" style={{ marginBottom: 48 }}>
          <h2
            id="projects-heading"
            className="font-cinzel"
            style={{ fontSize: 24, color: '#e8a54b', marginBottom: 24, borderBottom: '1px solid rgba(196,129,58,0.2)', paddingBottom: 8 }}
          >
            Projects
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 16 }}>
            {PROJECTS.map((project) => (
              <li
                key={project.name}
                style={{
                  background: 'rgba(26,18,8,0.6)',
                  border: '1px solid rgba(196,129,58,0.15)',
                  borderRadius: 6,
                  padding: '16px 20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f5deb3', margin: 0 }}>
                    {project.name}
                  </h3>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      color: TIER_HEX[project.tier],
                      border: `1px solid ${TIER_HEX[project.tier]}`,
                      borderRadius: 3,
                      padding: '2px 6px',
                    }}
                  >
                    {project.tier}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: '#c4b99a', lineHeight: 1.6, marginBottom: 10 }}>
                  {project.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        color: '#c4813a',
                        background: 'rgba(196,129,58,0.08)',
                        border: '1px solid rgba(196,129,58,0.15)',
                        borderRadius: 3,
                        padding: '2px 6px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, color: '#e8a54b', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Live Demo &#8599;
                  </a>
                )}
                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, color: '#e8a54b', textDecoration: 'none', fontWeight: 600, marginLeft: project.liveUrl ? 16 : 0 }}
                  >
                    Source &#8599;
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Skills ─────────────────────────────────────────── */}
        <section aria-labelledby="skills-heading" style={{ marginBottom: 48 }}>
          <h2
            id="skills-heading"
            className="font-cinzel"
            style={{ fontSize: 24, color: '#e8a54b', marginBottom: 24, borderBottom: '1px solid rgba(196,129,58,0.2)', paddingBottom: 8 }}
          >
            Skills
          </h2>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {SKILL_CATEGORIES.map((category) => (
              <div
                key={category.id}
                style={{
                  background: 'rgba(26,18,8,0.6)',
                  border: '1px solid rgba(196,129,58,0.15)',
                  borderRadius: 6,
                  padding: '16px 20px',
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 600, color: category.color, marginBottom: 12 }}>
                  {category.label}
                </h3>
                {category.subcategories.map((sub) => (
                  <div key={sub.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: category.color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                      {sub.label}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {sub.skills.map((skill) => {
                        const prof = PROFICIENCY_LEVELS[skill.proficiency];
                        return (
                          <li
                            key={skill.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '4px 0',
                              fontSize: 13,
                              color: '#c4b99a',
                              borderBottom: '1px solid rgba(196,129,58,0.08)',
                            }}
                          >
                            <span>{skill.name}</span>
                            <span style={{ fontSize: 10, color: prof.color, letterSpacing: '1px' }}>
                              {prof.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── Timeline ───────────────────────────────────────── */}
        <section aria-labelledby="timeline-heading" style={{ marginBottom: 48 }}>
          <h2
            id="timeline-heading"
            className="font-cinzel"
            style={{ fontSize: 24, color: '#e8a54b', marginBottom: 24, borderBottom: '1px solid rgba(196,129,58,0.2)', paddingBottom: 8 }}
          >
            Career Timeline
          </h2>
          <ol style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
            {TIMELINE_DATA.map((era) => {
              const colorHex = `#${era.color.toString(16).padStart(6, '0')}`;
              return (
                <li
                  key={era.era}
                  style={{
                    background: 'rgba(26,18,8,0.6)',
                    border: '1px solid rgba(196,129,58,0.15)',
                    borderRadius: 6,
                    padding: '14px 20px',
                    borderLeft: `3px solid ${colorHex}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f5deb3', margin: 0 }}>
                      {era.era}
                    </h3>
                    <span style={{ fontSize: 12, color: '#6a5a4a' }}>{era.years}</span>
                  </div>
                  <p style={{ fontSize: 13, color: colorHex, marginBottom: 2 }}>{era.org}</p>
                  <p style={{ fontSize: 13, color: '#c4b99a' }}>{era.skill}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ── Active Projects ────────────────────────────────── */}
        <section aria-labelledby="active-heading" style={{ marginBottom: 48 }}>
          <h2
            id="active-heading"
            className="font-cinzel"
            style={{ fontSize: 24, color: '#e8a54b', marginBottom: 24, borderBottom: '1px solid rgba(196,129,58,0.2)', paddingBottom: 8 }}
          >
            Active Projects
          </h2>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {ACTIVE_PROJECTS.map((project) => {
              const colorHex = `#${project.color.toString(16).padStart(6, '0')}`;
              return (
                <div
                  key={project.name}
                  style={{
                    background: 'rgba(26,18,8,0.6)',
                    border: '1px solid rgba(196,129,58,0.15)',
                    borderRadius: 6,
                    padding: '14px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f5deb3', margin: 0 }}>{project.name}</h3>
                    <span style={{ fontSize: 10, color: colorHex, border: `1px solid ${colorHex}`, borderRadius: 3, padding: '1px 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {project.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#c4b99a', lineHeight: 1.5 }}>{project.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Contact ────────────────────────────────────────── */}
        <footer style={{ textAlign: 'center', padding: '32px 0 48px', borderTop: '1px solid rgba(196,129,58,0.15)' }}>
          <p style={{ fontSize: 13, color: '#6a5a4a', letterSpacing: '1px' }}>
            Built with Next.js, React Three Fiber &amp; TypeScript
          </p>
          <p style={{ fontSize: 12, color: '#4a3a2a', marginTop: 8 }}>
            &copy; {new Date().getFullYear()} Robert Blaylock
          </p>
        </footer>
      </div>
    </div>
  );
}
