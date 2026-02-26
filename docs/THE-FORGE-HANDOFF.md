# THE FORGE — Project Handoff Document

## Owner
**Robert Blaylock** — Senior Full Stack Developer & 3D Software Engineer
- Runs **Banyan Labs, LLC** and **RB Digital** from Counce, TN
- Core expertise: React, Next.js, Three.js, Unity, TypeScript, Vue.js, Node.js, WebGL, PostgreSQL, Supabase
- Portfolio: https://www.rblaylock.dev
- GitHub: https://github.com/RBlaylock-Dev

---

## Project Summary

**The Forge** is an interactive, gamified 3D portfolio that replaces Robert's current traditional portfolio site (rblaylock.dev). Visitors spawn into a first-person walkable 3D world built around a dark forge/fire & metal aesthetic. The entire portfolio is one continuous 3D scene — no page transitions, no route changes — with five interconnected zones the visitor can walk between freely.

The portfolio itself IS the proof of Robert's Three.js/WebGL/React skills — every second a recruiter or client spends on the site, they're experiencing his abilities firsthand.

---

## Confirmed Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 14** (App Router) |
| 3D Engine | **React Three Fiber (R3F)** + **Drei** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** (for 2D HUD overlays) |
| State Management | **Zustand** |
| Shaders | Custom **GLSL** (embers, glow, metal) |
| Animation | R3F useFrame + Framer Motion (HUD transitions) |
| Content Management | **JSON/TS config files** (simplest — no CMS) |
| Hosting | **Vercel** |
| Audio | Howler.js or Tone.js (future — ambient + SFX) |

---

## Aesthetic Direction

- **Dark forge / fire & metal** — think blacksmith's workshop, glowing coals, ember particles, warm orange/amber lighting with cool accent contrast
- Fonts: **Cinzel** (serif, display/headings) + **Rajdhani** (sans, UI/body)
- Color palette:
  - Primary: `#c4813a` (warm amber)
  - Accent: `#e8a54b` (bright gold)
  - Text: `#f5deb3` (wheat)
  - Muted: `#6a5a4a`, `#5a4a3a`, `#4a3a2a` (browns)
  - Background: `#0a0806` (near-black warm)
  - Zone colors: Skill Tree `#44aa88` (teal), Vault `#aa6622` (bronze), Timeline `#6644aa` (purple), War Room `#22aacc` (cyan)
- Visual effects: Vignette overlay, subtle scanlines, ACES filmic tone mapping, FogExp2, additive blending ember particles
- Tier colors for projects: LEGENDARY `#ff6600`, EPIC `#cc44ff`, RARE `#4488ff`, COMMON `#44aa66`

---

## World Layout

All zones exist in one continuous 3D scene. Player spawns at center (Hearth) and walks freely between zones. Glowing path strips on the ground connect the Hearth to each zone.

```
                    War Room (0, 0, 24) — cyan
                         |
                         |
Skill Tree (-22, 0, 0) — HEARTH (0, 0, 0) — Vault (22, 0, 0)
     teal                |    amber/fire        bronze
                         |
                    Timeline (0, 0, -24) — purple
```

World bounds: -45 to +45 on X and Z axes. Ground plane: 120x120 units with subtle vertex displacement for organic feel.

---

## Zone Specifications

### 1. The Hearth (Center — Landing Zone)
- Central anvil with horn + fire pit with glowing coals
- 6 decorative pillars in a circle with torch lights on top
- Fire light flickers (intensity oscillation using sin waves at different frequencies)
- Dense ember particle system around the fire pit
- This is where the player spawns facing the anvil

### 2. The Skill Tree (West — x:-22, z:0)
- Circular platform base
- Central trunk (cylinder) with three main branches
- Three skill categories: Frontend (teal), Backend (blue), DevOps (orange)
- Category nodes are large IcosahedronGeometry — interactable
- Sub-nodes for individual skills, sized by proficiency level
- Connectors between nodes (thin cylinders)
- Inspecting a category node shows the full skill list with ⚒ mastery levels

### 3. The Project Vault (East — x:22, z:0)
- Large circular platform
- Projects placed in spiral layout on pedestals (CylinderGeometry)
- Each pedestal has a tier-colored glow ring (TorusGeometry)
- Floating artifact above each pedestal — shape varies by project
- Artifacts rotate and bob. Glow brighter on proximity
- Press E to inspect → detail panel with description, tags, tier, live demo link
- 12 projects currently (see data below)

### 4. The Timeline (South — x:0, z:-24)
- Winding path with 5 era markers (OctahedronGeometry)
- Each era has: ground circle, vertical connector, floating marker
- Markers are interactable — press E to see era details
- 5 career eras from Restaurant GM (2011) to Senior Engineer (2025+)

### 5. The War Room (North — x:0, z:24)
- Holographic command table (large cylinder on pedestal)
- Glowing ring on table surface
- 4 wireframe holographic projections floating above table
- Each represents an active project (HALO, BibleWalk, Savannah Connect, RB Digital)
- Wireframe material, transparent, spinning

---

## Player Controller Specs

- **First-person camera** at y:1.7 (eye height)
- **WASD / Arrow Keys** for movement
- **Mouse look** via Pointer Lock API
- **E key** to interact with nearby objects
- **ESC** to release cursor
- Movement speed: 8 units/sec with 0.85 friction multiplier
- Pitch clamped to ±1.2 radians
- Raycaster for interaction detection: range 6 units, fires from camera center
- World bounds clamping: -45 to +45 on X and Z
- Objects glow brighter when player is within 5 units (emissiveIntensity scales with proximity)

---

## HUD Elements (2D HTML Overlay, not 3D)

1. **Top Bar** — brand logo left ("THE FORGE — RB"), zone indicator right
2. **XP Bar** — top-right, tracks zones discovered out of 5
3. **Crosshair** — center screen, appears when pointer is locked
4. **Interact Prompt** — bottom-center, shows "[E] Inspect {name}" when looking at interactable
5. **Zone Flash** — center screen, cinematic text animation when discovering a new zone
6. **Detail Panel** — right side, slides in when inspecting an object. Shows title, type, description, tags, items/links. Has close button.
7. **Minimap** — bottom-right 140x140 canvas. Shows zone dots, player position + direction, discovered state
8. **Controls HUD** — bottom-left, shows WASD/Mouse/E/ESC keybindings
9. **Quick Nav** — left side vertical dots, one per zone, click to teleport
10. **Start Overlay** — full-screen on load, "Click to Enter the Forge"

---

## Gamification (Current Scope)

- **Zone Discovery** — tracked in Zustand store, XP bar fills as zones are found (0-5)
- **Zone Flash** — cinematic text animation on first entry to a zone
- **Proximity Glow** — objects brighten as player approaches
- **Future expansions** (not built yet): achievement badges, Easter eggs, Konami code, visitor stats dashboard, RPG-style character sheet

---

## Content Data (TS Config Files)

### Projects

```typescript
export interface Project {
  name: string;
  desc: string;
  tags: string[];
  tier: 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON';
  color: number; // hex
  liveUrl?: string;
  codeUrl?: string;
  shape: 'box' | 'ico' | 'octa' | 'torus' | 'cone' | 'sphere';
}

export const PROJECTS: Project[] = [
  {
    name: 'Derksen 3D Configurator',
    desc: 'Production 3D building configurator. Customers customize and visualize portable buildings in real-time with a full Three.js/Vue.js application.',
    tags: ['Three.js', 'Vue.js', 'PHP', 'GitLab', '3D', 'Production'],
    tier: 'LEGENDARY',
    color: 0xff6600,
    liveUrl: 'https://3d.derksenbuildings.com/neworder',
    shape: 'box'
  },
  {
    name: 'ShareXR Platform',
    desc: 'Immersive 3D platform providing companies virtual training environments for employee onboarding and skill development.',
    tags: ['Three.js', 'Strapi', 'Firebase', '3D', 'Interactive'],
    tier: 'EPIC',
    color: 0xcc4400,
    liveUrl: 'https://sharexr.app',
    shape: 'ico'
  },
  {
    name: 'UpCurve',
    desc: 'Donation platform enabling users to contribute to non-profits with integrated Stripe payment processing and Supabase backend.',
    tags: ['Next.js', 'Stripe', 'Supabase', 'SendGrid'],
    tier: 'EPIC',
    color: 0xee8833,
    liveUrl: 'https://upcurve.life',
    shape: 'octa'
  },
  {
    name: 'Redeemly',
    desc: 'Social platform for ministries to connect with their members featuring real-time chat and community tools.',
    tags: ['Next.js', 'Realtime Chat', 'Social', 'Ministry'],
    tier: 'EPIC',
    color: 0xbb6644,
    liveUrl: 'https://redeemly-startup.vercel.app',
    shape: 'torus'
  },
  {
    name: 'Stor-It',
    desc: 'Cloud storage platform with file uploads, OTP authentication, and clean UI for managing personal documents.',
    tags: ['Next.js', 'Appwrite', 'File-Uploads', 'OTP'],
    tier: 'RARE',
    color: 0xddaa44,
    liveUrl: 'https://stor-it-alpha.vercel.app',
    shape: 'cone'
  },
  {
    name: 'Portal Scene',
    desc: 'Mystical 3D portal with custom GLSL shaders, glowing effects, geometric structures, and a starfield background.',
    tags: ['R3F', 'Three.js', 'GLSL', 'Shaders'],
    tier: 'RARE',
    color: 0xaa44ff,
    liveUrl: 'https://portal-scene-r3-f.vercel.app',
    shape: 'ico'
  },
  {
    name: 'Earth Shaders',
    desc: 'Stunning 3D Earth with realistic continents, atmospheric glow, and day/night cycle — all custom GLSL.',
    tags: ['Three.js', 'GLSL', 'Shaders', 'WebGL'],
    tier: 'RARE',
    color: 0x4488cc,
    liveUrl: 'https://earth-shaders-kappa.vercel.app',
    shape: 'sphere'
  },
  {
    name: 'Marble Race Game',
    desc: 'Interactive 3D marble racing game with realistic physics, timer, and a colorful obstacle course.',
    tags: ['Three.js', 'Physics', 'Game Dev', 'WebGL'],
    tier: 'RARE',
    color: 0xff5522,
    liveUrl: 'https://marble-game-delta.vercel.app',
    shape: 'sphere'
  },
  {
    name: 'Galaxy Generator',
    desc: 'Procedural spiral galaxy with customizable parameters and beautiful particle effects.',
    tags: ['Three.js', 'Procedural', 'Particles', 'WebGL'],
    tier: 'RARE',
    color: 0x9944dd,
    liveUrl: 'https://galaxy-generator-iota-liard.vercel.app',
    shape: 'octa'
  },
  {
    name: 'Rooftop Ministries',
    desc: 'Professional ministry website with custom branding, domain setup, DNS config, and email setup.',
    tags: ['Next.js', 'TailwindCSS', 'DNS', 'Email'],
    tier: 'COMMON',
    color: 0x88aa44,
    liveUrl: 'https://www.rooftopministries.org',
    shape: 'box'
  },
  {
    name: 'Fireworks Display',
    desc: 'Interactive particle fireworks system with customizable parameters and explosive effects.',
    tags: ['Three.js', 'Particles', 'Animation', 'Interactive'],
    tier: 'COMMON',
    color: 0xff4466,
    liveUrl: 'https://fireworks-delta-fawn.vercel.app',
    shape: 'cone'
  },
  {
    name: 'Haunted House',
    desc: 'Spooky 3D haunted house scene with atmospheric fog, eerie lighting, and interactive camera controls.',
    tags: ['Three.js', '3D', 'Lighting', 'Atmosphere'],
    tier: 'COMMON',
    color: 0x668844,
    liveUrl: 'https://haunted-house-3-js-tau.vercel.app',
    shape: 'box'
  }
];
```

### Skills

```typescript
export interface Skill {
  name: string;
  level: number; // 1-5
}

export interface SkillCategory {
  name: string;
  color: number;
  skills: Skill[];
}

export const SKILL_DATA: SkillCategory[] = [
  {
    name: 'Frontend',
    color: 0x44dd88,
    skills: [
      { name: 'React / Next.js', level: 5 },
      { name: 'TypeScript', level: 4 },
      { name: 'Three.js / R3F', level: 5 },
      { name: 'GLSL Shaders', level: 4 },
      { name: 'Vue.js', level: 4 },
      { name: 'Tailwind CSS', level: 5 },
      { name: 'HTML / CSS', level: 5 }
    ]
  },
  {
    name: 'Backend',
    color: 0x4488dd,
    skills: [
      { name: 'Node.js / Express', level: 4 },
      { name: 'PostgreSQL', level: 4 },
      { name: 'MongoDB', level: 3 },
      { name: 'Supabase', level: 4 },
      { name: 'REST APIs', level: 5 },
      { name: 'PHP', level: 3 }
    ]
  },
  {
    name: 'DevOps',
    color: 0xdd8844,
    skills: [
      { name: 'Docker', level: 4 },
      { name: 'Git / GitFlow', level: 5 },
      { name: 'CI/CD', level: 3 },
      { name: 'AWS', level: 3 },
      { name: 'Vercel', level: 4 },
      { name: 'Apache', level: 3 }
    ]
  }
];
```

### Timeline

```typescript
export interface TimelineEra {
  era: string;
  org: string;
  years: string;
  skill: string;
  color: number;
}

export const TIMELINE_DATA: TimelineEra[] = [
  { era: 'Restaurant GM', org: 'Taco Bell', years: '2011-2017', skill: 'Leadership & Operations', color: 0x993366 },
  { era: 'Team Lead', org: 'National Retail Solutions', years: '2017-2022', skill: 'Project Management', color: 0x886644 },
  { era: 'Self-Taught + Cert', org: 'Persevere', years: '2019-2022', skill: 'The Transformation', color: 0x7744aa },
  { era: 'Full Stack Dev', org: 'Banyan Labs', years: '2022-2025', skill: 'Professional Engineering', color: 0x5566cc },
  { era: 'Senior Engineer', org: 'Banyan Labs / RB Digital', years: '2025+', skill: 'Mastery', color: 0x44aa88 }
];
```

### Active Projects

```typescript
export interface ActiveProject {
  name: string;
  desc: string;
  color: number;
  status: string;
}

export const ACTIVE_PROJECTS: ActiveProject[] = [
  { name: 'HALO', desc: 'Decentralized endorsement platform on Ethereum smart contracts', color: 0x22aacc, status: 'In Development' },
  { name: 'BibleWalk', desc: 'Unity-based mobile Scripture journey app with Adult & Kid modes', color: 0x44dd88, status: 'In Development' },
  { name: 'Savannah Connect', desc: 'Community event platform for Savannah, TN', color: 0xcc8844, status: 'In Development' },
  { name: 'RB Digital', desc: 'Full-service web development agency', color: 0xdd6644, status: 'Active' }
];
```

---

## Production Architecture (Confirmed)

```
the-forge/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout + fonts + metadata
│   │   └── page.tsx            # Single page — mounts the 3D world
│   ├── canvas/                 # R3F canvas + scene orchestration
│   │   ├── ForgeCanvas.tsx     # <Canvas> wrapper, camera rig, post-processing
│   │   └── SceneManager.tsx    # Loads/manages all zones
│   ├── player/                 # First-person controller
│   │   ├── PlayerController.tsx
│   │   ├── useMovement.ts      # WASD + pointer lock hook
│   │   └── useInteraction.ts   # Raycaster + E-key interaction hook
│   ├── zones/                  # One component per zone (<500 lines each)
│   │   ├── Hearth.tsx
│   │   ├── SkillTree.tsx
│   │   ├── ProjectVault.tsx
│   │   ├── Timeline.tsx
│   │   └── WarRoom.tsx
│   ├── objects/                # Reusable 3D primitives
│   │   ├── ZoneMarker.tsx
│   │   ├── Pedestal.tsx
│   │   ├── PathStrip.tsx
│   │   ├── EmberParticles.tsx
│   │   └── ForgeEmbers.tsx
│   ├── hud/                    # 2D overlay UI (HTML, not 3D)
│   │   ├── HUD.tsx
│   │   ├── Minimap.tsx
│   │   ├── DetailPanel.tsx
│   │   ├── ZoneFlash.tsx
│   │   ├── InteractPrompt.tsx
│   │   └── StartOverlay.tsx
│   ├── shaders/                # Custom GLSL
│   │   ├── ember.vert / .frag
│   │   └── glow.vert / .frag
│   ├── store/                  # Zustand state
│   │   └── useForgeStore.ts    # Player, zones, discovery, interactions
│   ├── data/                   # Content config files
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── timeline.ts
│   │   └── activeProjects.ts
│   └── types/                  # Shared TypeScript types
│       └── index.ts
├── public/                     # Static assets (textures, models, sounds later)
├── Dockerfile
├── Makefile
├── docker-compose.yml
└── tests/
```

---

## Engineering Rules (Robert's Preferences)

1. Files < 500 lines. Split early.
2. Single responsibility. One function = one purpose.
3. Explicit over implicit. Clear names, types, schemas, boundaries.
4. Test-driven. Tests first for core, edge, and security paths.
5. Iterate safely. MVP first, never at the cost of correctness or security.
6. Docker + Makefile first. Everything runs via Docker. Makefile is the primary interface.
7. Multi-stage Docker builds, minimal images, non-root user, env vars only (12-factor).
8. Accessible by default (semantic HTML, keyboard support for HUD).
9. Act like a senior mentoring juniors — explain "why", prefer readable code.

---

## Current Status

### ✅ Completed
- Concept finalized: "The Forge" — dark forge/fire & metal aesthetic
- All 5 zones designed and specified
- Full interactive HTML prototype built and approved (walkable, WASD, mouse look, all zones, interaction system, minimap, HUD)
- Tech stack confirmed: Next.js 14 + R3F + TypeScript + Tailwind + Zustand + Vercel
- Content management: JSON/TS config files
- Architecture designed and confirmed
- All content data defined (12 projects, 3 skill categories, 5 timeline eras, 4 active projects)
- ClickUp: skipped for now

### 🔨 Next Steps — Build the Production App
1. Scaffold Next.js 14 project (was in progress — `npx create-next-app@14 the-forge` with TS, Tailwind, App Router, src dir)
2. Install dependencies: `@react-three/fiber @react-three/drei three zustand framer-motion`
3. Install dev deps: `@types/three`
4. Create the file tree per architecture above
5. Build in this order:
   - Types + data files first
   - Zustand store
   - ForgeCanvas + basic scene
   - PlayerController (movement + pointer lock)
   - Hearth zone (central forge)
   - Path strips connecting zones
   - EmberParticles + ForgeEmbers
   - HUD shell (top bar, controls, start overlay)
   - Remaining zones one at a time (SkillTree → Vault → Timeline → WarRoom)
   - Interaction system (raycaster + DetailPanel)
   - Minimap
   - Zone detection + ZoneFlash + XP tracking
   - Dockerfile + Makefile + docker-compose
   - Polish: post-processing, shader refinement, performance optimization

---

## Working Prototype Reference

The approved walkable prototype is a single HTML file using vanilla Three.js (r128). It contains all the 3D geometry, lighting, particle systems, player controller, zone detection, interaction system, HUD, and minimap. The production build should replicate all of this behavior in R3F components.

Key behaviors to preserve from prototype:
- Smooth WASD movement with friction (0.85 multiplier, speed 8)
- Pointer lock mouse look with pitch clamp ±1.2 rad
- Fire light flicker: `3.5 + sin(t*8)*0.6 + sin(t*13)*0.35`
- Ember particles float upward and reset, with horizontal drift via sin
- All interactable objects bob (sin wave on Y) and rotate
- Proximity glow: emissiveIntensity scales when player within 5 units
- Zone detection by distance to zone center vs zone radius
- Minimap draws on 2D canvas with player dot + direction line
- Detail panel slides in from right with close button

---

## Prompt for Next Chat

Paste this at the start of your next chat:

> I'm building "The Forge" — an interactive, walkable 3D portfolio website. I have a complete handoff document with all decisions, architecture, data, and specs. Please read the attached handoff document and continue building the production Next.js + React Three Fiber application from where we left off. The Next.js project scaffolding was just started — pick up from there and build out the full file tree, starting with types, data files, Zustand store, then the R3F canvas and player controller, then zones one by one.
