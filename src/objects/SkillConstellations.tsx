'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useForgeStore } from '@/store/useForgeStore';
import { SKILL_CATEGORIES } from '@/data/skills';

// ── Deterministic hash for ambient star positions ──────────────
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ── Constellation star positions (hand-placed for shape) ───────
// These override the random hash positions so lines trace real shapes.
const CONSTELLATION_POSITIONS: Record<string, [number, number, number]> = {
  // ── The Renderer — Diamond ◆ (front-left quadrant) ──
  'threejs':      [-5,   14,  2],    // top
  'webgl':        [-3,   12,  2],    // right
  '3d-config':    [-5,   10,  2],    // bottom
  '3d-refactor':  [-7,   12,  2],    // left
  'asset-viewer': [-5,   12,  2],    // center

  // ── The Full Stack — Sword ⚔ (front-right quadrant) ──
  'react':       [4,   9.5, 3],     // pommel (bottom)
  'nextjs':      [3,   11,  3],     // crossguard left
  'typescript':  [5,   11,  3],     // crossguard right
  'nodejs':      [4,   13,  3],     // blade middle
  'postgresql':  [4,   15,  3],     // blade tip (top)

  // ── The Architect — Arch ∩ (back-center) ──
  'scalable-arch':    [-1.5, 10,   -4],  // left foot
  'modular-refactor': [-1.5, 13.5, -4],  // left shoulder
  'saas-structure':   [1.5,  13.5, -4],  // right shoulder
  'security-dev':     [1.5,  10,   -4],  // right foot

  // ── The Builder — Hammer 🔨 (back-left quadrant) ──
  'docker':           [-6,   9.5,  -1],  // handle bottom
  'git':              [-6,   12,   -1],  // handle top (junction)
  'prod-builds':      [-7.5, 13.5, -1],  // head left
  'feature-branches': [-6,   14.5, -1],  // head top
  'perf-refactor':    [-4.5, 13.5, -1],  // head right

  // ── The Leader — Crown ♛ (back-right quadrant) ──
  'mentoring':       [3,   12,    -3],   // left base
  'code-review':     [4,   14.5,  -3],   // left peak
  'sprint-planning': [5,   12.5,  -3],   // center valley
  'user-stories':    [6,   14.5,  -3],   // right peak
  'tech-docs':       [7,   12,    -3],   // right base
};

// ── Star position generation ──────────────────────────────────
const DOME_RADIUS = 8;
const DOME_Y_MIN = 9;
const DOME_Y_MAX = 15;

function starPosition(id: string): [number, number, number] {
  // Constellation stars get hand-placed positions for shape fidelity
  if (CONSTELLATION_POSITIONS[id]) return CONSTELLATION_POSITIONS[id];

  // All other stars scatter randomly across the dome
  const h = hashId(id);
  const angle = ((h % 1000) / 1000) * Math.PI * 2;
  const radiusFrac = ((h % 777) / 777) * 0.9 + 0.1;
  const r = DOME_RADIUS * Math.sqrt(radiusFrac);
  const y = DOME_Y_MIN + ((h % 499) / 499) * (DOME_Y_MAX - DOME_Y_MIN);
  return [Math.cos(angle) * r, y, Math.sin(angle) * r];
}

// ── Build skill → star lookup ─────────────────────────────────
interface StarInfo {
  id: string;
  name: string;
  subcategoryId: string;
  proficiency: string;
  pos: [number, number, number];
}

const ALL_STARS: StarInfo[] = SKILL_CATEGORIES.flatMap((cat) =>
  cat.subcategories.flatMap((sub) =>
    sub.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      subcategoryId: sub.id,
      proficiency: skill.proficiency,
      pos: starPosition(skill.id),
    })),
  ),
);

const STAR_MAP = new Map(ALL_STARS.map((s) => [s.id, s]));

// ── Constellation definitions ──────────────────────────────────
// Each constellation has named stars and multiple line segments
// that trace a recognizable shape (not one zigzag polyline).
interface ConstellationDef {
  name: string;
  stars: string[];          // skill IDs
  segments: number[][];     // each segment = indices into stars[] forming a polyline
  threshold: number;        // subcategories discovered to reveal
}

const CONSTELLATIONS: ConstellationDef[] = [
  {
    name: 'The Renderer',
    // Diamond ◆ — closed outline: top → right → bottom → left → top
    stars: ['threejs', 'webgl', '3d-config', '3d-refactor', 'asset-viewer'],
    segments: [[0, 1, 2, 3, 0]],
    threshold: 2,
  },
  {
    name: 'The Full Stack',
    // Sword ⚔ — blade line + crossguard line
    // Blade: pommel(react) → mid(nodejs) → tip(postgresql)
    // Guard: left(nextjs) → right(typescript)
    stars: ['react', 'nodejs', 'postgresql', 'nextjs', 'typescript'],
    segments: [[0, 1, 2], [3, 4]],
    threshold: 5,
  },
  {
    name: 'The Architect',
    // Arch ∩ — left foot → left shoulder → right shoulder → right foot
    stars: ['scalable-arch', 'modular-refactor', 'saas-structure', 'security-dev'],
    segments: [[0, 1, 2, 3]],
    threshold: 8,
  },
  {
    name: 'The Builder',
    // Hammer 🔨 — handle: bottom → top, head: left → top → right
    stars: ['docker', 'git', 'prod-builds', 'feature-branches', 'perf-refactor'],
    segments: [[0, 1], [2, 3, 4]],
    threshold: 12,
  },
  {
    name: 'The Leader',
    // Crown ♛ — zigzag: left-base → left-peak → valley → right-peak → right-base
    stars: ['mentoring', 'code-review', 'sprint-planning', 'user-stories', 'tech-docs'],
    segments: [[0, 1, 2, 3, 4]],
    threshold: 16,
  },
];

// ── Proficiency → star size & brightness ──────────────────────
const PROF_SIZE: Record<string, number> = {
  expert: 0.12,
  advanced: 0.09,
  intermediate: 0.07,
  exploring: 0.05,
};

const PROF_COLOR: Record<string, THREE.Color> = {
  expert: new THREE.Color('#ff6600'),
  advanced: new THREE.Color('#e8a54b'),
  intermediate: new THREE.Color('#44aa88'),
  exploring: new THREE.Color('#6644aa'),
};

/**
 * SkillConstellations — a starfield dome above the Skill Tree zone.
 *
 * Each skill is a twinkling star. Constellation lines connect specific
 * skills into recognizable shapes (sword, hammer, crown, diamond, arch)
 * that unlock as subcategories are discovered via the Codex.
 */
export function SkillConstellations() {
  const discoveredSubs = useForgeStore((s) => s.discoveredSubcategories);
  const discoveredCount = discoveredSubs.size;
  const pointsRef = useRef<THREE.Points>(null);

  // Stars visible when their subcategory has been discovered
  const visibleStars = useMemo(
    () => ALL_STARS.filter((s) => discoveredSubs.has(s.subcategoryId)),
    [discoveredSubs],
  );

  // Build positions + colors + sizes for the point cloud
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(visibleStars.length * 3);
    const col = new Float32Array(visibleStars.length * 3);
    const sz = new Float32Array(visibleStars.length);

    visibleStars.forEach((star, i) => {
      pos[i * 3] = star.pos[0];
      pos[i * 3 + 1] = star.pos[1];
      pos[i * 3 + 2] = star.pos[2];

      const c = PROF_COLOR[star.proficiency] ?? PROF_COLOR.intermediate;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = PROF_SIZE[star.proficiency] ?? 0.07;
    });

    return { positions: pos, colors: col, sizes: sz };
  }, [visibleStars]);

  // Active constellations (enough subcategories discovered)
  const activeConstellations = useMemo(
    () => CONSTELLATIONS.filter((c) => discoveredCount >= c.threshold),
    [discoveredCount],
  );

  // Twinkle animation
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const sizeAttr = pointsRef.current.geometry.getAttribute('size') as THREE.BufferAttribute;
    if (!sizeAttr) return;

    for (let i = 0; i < visibleStars.length; i++) {
      const base = PROF_SIZE[visibleStars[i].proficiency] ?? 0.07;
      const twinkle = 1 + Math.sin(t * 3 + hashId(visibleStars[i].id) * 0.01) * 0.3;
      sizeAttr.setX(i, base * twinkle);
    }
    sizeAttr.needsUpdate = true;
  });

  if (visibleStars.length === 0 && activeConstellations.length === 0) return null;

  return (
    <group>
      {/* Star points */}
      {visibleStars.length > 0 && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={positions} count={visibleStars.length} itemSize={3} />
            <bufferAttribute attach="attributes-color" array={colors} count={visibleStars.length} itemSize={3} />
            <bufferAttribute attach="attributes-size" array={sizes} count={visibleStars.length} itemSize={1} />
          </bufferGeometry>
          <pointsMaterial
            vertexColors
            size={0.1}
            sizeAttenuation
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* Constellation line segments */}
      {activeConstellations.map((c) => (
        <ConstellationShape key={c.name} constellation={c} />
      ))}
    </group>
  );
}

// ── Individual constellation renderer ──────────────────────────
function ConstellationShape({ constellation }: { constellation: ConstellationDef }) {
  // Resolve star positions
  const starPositions = useMemo(() => {
    return constellation.stars.map((id) => {
      const star = STAR_MAP.get(id);
      return star ? star.pos : null;
    });
  }, [constellation.stars]);

  // Build polyline points for each segment
  const segmentLines = useMemo(() => {
    return constellation.segments
      .map((seg) => {
        const pts: [number, number, number][] = [];
        for (const idx of seg) {
          const pos = starPositions[idx];
          if (pos) pts.push(pos);
        }
        return pts;
      })
      .filter((pts) => pts.length >= 2);
  }, [constellation.segments, starPositions]);

  // Label position at centroid of all constellation stars
  const centroid = useMemo((): [number, number, number] => {
    const valid = starPositions.filter((p): p is [number, number, number] => p !== null);
    if (valid.length === 0) return [0, 8, 0];
    const avg: [number, number, number] = [0, 0, 0];
    for (const p of valid) {
      avg[0] += p[0];
      avg[1] += p[1];
      avg[2] += p[2];
    }
    return [avg[0] / valid.length, avg[1] / valid.length + 0.6, avg[2] / valid.length];
  }, [starPositions]);

  if (segmentLines.length === 0) return null;

  return (
    <group>
      {/* Line segments forming the constellation shape */}
      {segmentLines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#e8a54b"
          lineWidth={1}
          transparent
          opacity={0.2}
        />
      ))}

      {/* Constellation name label */}
      <Html center position={centroid} style={{ pointerEvents: 'none' }}>
        <div
          className="font-cinzel"
          style={{
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: 'rgba(232,165,75,0.4)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: '0 0 10px rgba(232,165,75,0.2)',
          }}
        >
          {constellation.name}
        </div>
      </Html>
    </group>
  );
}
