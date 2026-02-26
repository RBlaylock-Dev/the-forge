# THE FORGE — Ticket Breakdown

## Overview

**Total Tickets:** 24
**Phases:** 6
**Estimated Effort:** ~60-80 hours

Each ticket is scoped to be completable in a single focused session. Tickets within a phase can sometimes be parallelized, but phases should be completed in order. Every ticket follows Robert's engineering rules: files < 500 lines, single responsibility, explicit types, Docker + Makefile paths.

> **Human-In-The-Loop:** After completing each ticket, review the acceptance criteria checklist before moving to the next. Each ticket is a natural stopping point where you can test, adjust, and course-correct.

---

## PHASE 1: Foundation

_Set up the project skeleton, types, data, state management, and dev infrastructure. Nothing renders yet — this is the bedrock._

---

### FORGE-001: Project Scaffolding & Dependencies

**User Story:**
As a developer, I need a properly configured Next.js 14 project with all required dependencies installed so that I have a working dev environment to build the 3D portfolio.

**Acceptance Criteria:**
- [ ] Next.js 14 project created with App Router, TypeScript, Tailwind CSS, ESLint, `src/` directory, `@/*` import alias
- [ ] Production dependencies installed: `@react-three/fiber`, `@react-three/drei`, `three`, `zustand`, `framer-motion`
- [ ] Dev dependencies installed: `@types/three`
- [ ] `npm run dev` starts without errors
- [ ] Tailwind configured with custom color tokens for forge palette (`forge-bg: #0a0806`, `forge-amber: #c4813a`, `forge-gold: #e8a54b`, `forge-wheat: #f5deb3`, etc.)
- [ ] Google Fonts (Cinzel + Rajdhani) configured in `layout.tsx`
- [ ] Root `page.tsx` renders a placeholder confirming setup works
- [ ] `.gitignore`, `.eslintrc`, `tsconfig.json` are properly configured

**Files Created:**
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `tailwind.config.ts` (extended with forge colors)
- `package.json`
- `tsconfig.json`

**Dependencies:** None — this is the first ticket
**Branch:** `feat/FORGE-001-project-scaffolding`

---

### FORGE-002: TypeScript Types & Interfaces

**User Story:**
As a developer, I need shared TypeScript types for all data models (projects, skills, timeline, active projects, zones, player state) so that every component has type safety from day one.

**Acceptance Criteria:**
- [ ] `src/types/index.ts` exports all shared interfaces
- [ ] `Project` interface: name, desc, tags, tier (union type), color, liveUrl?, codeUrl?, shape (union type)
- [ ] `Skill` interface: name, level (1-5)
- [ ] `SkillCategory` interface: name, color, skills array
- [ ] `TimelineEra` interface: era, org, years, skill, color
- [ ] `ActiveProject` interface: name, desc, color, status
- [ ] `ZoneDef` interface: center (x, z), radius, name
- [ ] `ZoneId` union type: 'hearth' | 'skill-tree' | 'vault' | 'timeline' | 'war-room'
- [ ] `ProjectTier` union type: 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON'
- [ ] `ArtifactShape` union type: 'box' | 'ico' | 'octa' | 'torus' | 'cone' | 'sphere'
- [ ] `ForgeState` interface for Zustand store shape (player position, yaw, pitch, currentZone, discovered set, activeDetail, isLocked, isStarted)
- [ ] All types compile with no errors

**Files Created:**
- `src/types/index.ts`

**Dependencies:** FORGE-001
**Branch:** `feat/FORGE-002-types-interfaces`

---

### FORGE-003: Content Data Files

**User Story:**
As a developer, I need all portfolio content (projects, skills, timeline, active projects, zone definitions) defined as typed TS config files so that zone components can import data without hardcoding.

**Acceptance Criteria:**
- [ ] `src/data/projects.ts` — exports `PROJECTS` array with all 12 projects, typed as `Project[]`
- [ ] `src/data/skills.ts` — exports `SKILL_DATA` array with 3 categories, typed as `SkillCategory[]`
- [ ] `src/data/timeline.ts` — exports `TIMELINE_DATA` array with 5 eras, typed as `TimelineEra[]`
- [ ] `src/data/activeProjects.ts` — exports `ACTIVE_PROJECTS` array with 4 projects, typed as `ActiveProject[]`
- [ ] `src/data/zones.ts` — exports `ZONE_DEFS` record keyed by ZoneId, typed as `Record<ZoneId, ZoneDef>`
- [ ] `src/data/theme.ts` — exports `TIER_COLORS` map and any shared visual constants (forge colors as hex numbers for Three.js materials)
- [ ] All data matches the handoff document exactly
- [ ] All imports resolve and compile cleanly

**Files Created:**
- `src/data/projects.ts`
- `src/data/skills.ts`
- `src/data/timeline.ts`
- `src/data/activeProjects.ts`
- `src/data/zones.ts`
- `src/data/theme.ts`

**Dependencies:** FORGE-002
**Branch:** `feat/FORGE-003-content-data`

---

### FORGE-004: Zustand Store

**User Story:**
As a developer, I need a centralized Zustand store that manages player state, zone discovery, interaction state, and HUD visibility so that the 3D world and 2D HUD stay in sync.

**Acceptance Criteria:**
- [ ] `src/store/useForgeStore.ts` exports a typed Zustand store
- [ ] Store shape matches `ForgeState` interface from FORGE-002
- [ ] State includes: `isStarted`, `isLocked`, `currentZone`, `discoveredZones` (Set), `activeDetail` (object or null), `showDetail`, `playerPosition` ({x, y, z}), `playerYaw`, `playerPitch`
- [ ] Actions include: `startGame()`, `setLocked(bool)`, `setCurrentZone(ZoneId)`, `discoverZone(ZoneId)`, `showDetailPanel(data)`, `closeDetailPanel()`, `updatePlayerPosition(x, y, z)`, `updatePlayerRotation(yaw, pitch)`
- [ ] `discoverZone` is idempotent — calling it twice with the same zone doesn't duplicate
- [ ] `discoveryProgress` derived getter returns `discoveredZones.size / 5`
- [ ] Store is importable from any component
- [ ] Unit tests verify: initial state, each action mutates correctly, idempotent discovery

**Files Created:**
- `src/store/useForgeStore.ts`
- `tests/store/useForgeStore.test.ts`

**Dependencies:** FORGE-002
**Branch:** `feat/FORGE-004-zustand-store`

---

### FORGE-005: Docker + Makefile + Docker Compose

**User Story:**
As a developer, I need Docker and Makefile infrastructure so that the dev environment, build, and future production deployment all run through standardized commands.

**Acceptance Criteria:**
- [ ] `Dockerfile` with multi-stage build: deps stage, build stage, runner stage
- [ ] Runner uses minimal `node:20-alpine` image with non-root user
- [ ] `docker-compose.yml` defines `forge-dev` service with volume mounts for hot reload, port 3000 exposed
- [ ] `Makefile` includes targets: `dev`, `stop`, `restart`, `status`, `logs`, `build`, `lint`, `lint-fix`, `test`, `clean`
- [ ] `make dev` starts the development server via Docker Compose
- [ ] `make build` builds the production Docker image
- [ ] `make test` runs the test suite inside the container
- [ ] `make lint` runs ESLint
- [ ] `.dockerignore` excludes node_modules, .next, .git
- [ ] All targets documented with `make help`

**Files Created:**
- `Dockerfile`
- `docker-compose.yml`
- `Makefile`
- `.dockerignore`

**Dependencies:** FORGE-001
**Branch:** `chore/FORGE-005-docker-makefile`

---

## PHASE 2: Core 3D Engine

_Get the R3F canvas rendering, the player walking around, and the basic world (ground, lighting, particles) in place. By the end of this phase you can walk around an empty-but-atmospheric world._

---

### FORGE-006: R3F Canvas & Scene Shell

**User Story:**
As a visitor, I need to see a 3D canvas rendering the forge world so that the immersive experience loads when I visit the site.

**Acceptance Criteria:**
- [ ] `src/canvas/ForgeCanvas.tsx` wraps `<Canvas>` with proper R3F config: `camera` (fov 65, near 0.1, far 250), `gl` (antialias, toneMapping ACES Filmic, toneMappingExposure 0.85), `shadows` enabled
- [ ] Canvas fills the viewport (100vw × 100vh), positioned fixed behind HUD
- [ ] `src/canvas/SceneManager.tsx` renders inside Canvas and composes: lighting, ground, fog, and zone placeholder groups
- [ ] Fog configured: `FogExp2(#0a0806, 0.018)`
- [ ] Ambient light: `#1a0e06` intensity 0.35
- [ ] Fire point light at (0, 2.5, 0): color `#ff6b1a`, intensity 3.5, distance 30, decay 2, castShadow
- [ ] Two fill lights matching prototype positions and colors
- [ ] Ground plane: 120×120, displaced vertices, material `#1a1210` roughness 0.95
- [ ] Ground receives shadows
- [ ] `page.tsx` renders `<ForgeCanvas />` and confirms 3D scene is visible
- [ ] No console errors, renders at 60fps on modern hardware

**Files Created:**
- `src/canvas/ForgeCanvas.tsx`
- `src/canvas/SceneManager.tsx`
- Updated `src/app/page.tsx`

**Dependencies:** FORGE-001, FORGE-003
**Branch:** `feat/FORGE-006-canvas-scene-shell`

---

### FORGE-007: Player Controller — Movement

**User Story:**
As a visitor, I need to walk around the 3D world using WASD keys and look around with my mouse so that I can freely explore The Forge.

**Acceptance Criteria:**
- [ ] `src/player/useMovement.ts` — custom hook managing WASD input, pointer lock, and camera updates
- [ ] `src/player/PlayerController.tsx` — R3F component using useFrame to apply movement each frame
- [ ] WASD / Arrow Keys move the player in camera-relative directions
- [ ] Movement speed: 8 units/sec with 0.85 friction multiplier per frame
- [ ] Mouse look via Pointer Lock API: yaw (horizontal) and pitch (vertical)
- [ ] Pitch clamped to ±1.2 radians (can't flip upside down)
- [ ] Player height fixed at y: 1.7
- [ ] World bounds clamping: -45 to +45 on X and Z
- [ ] Clicking the canvas requests pointer lock
- [ ] ESC releases pointer lock (browser default)
- [ ] Player position and rotation sync to Zustand store every frame
- [ ] Movement feels smooth and responsive — no jitter, no drift when keys released
- [ ] Delta time used to ensure frame-rate independent movement

**Files Created:**
- `src/player/PlayerController.tsx`
- `src/player/useMovement.ts`

**Dependencies:** FORGE-004, FORGE-006
**Branch:** `feat/FORGE-007-player-movement`

---

### FORGE-008: Ember Particle Systems

**User Story:**
As a visitor, I need to see floating ember particles throughout the world and a dense cluster near the central forge so that the environment feels alive and atmospheric.

**Acceptance Criteria:**
- [ ] `src/objects/EmberParticles.tsx` — R3F component for the global ember system
- [ ] 500 particles spread across 60-unit area, floating upward, resetting when exceeding yMax (18)
- [ ] Horizontal drift via sin wave for organic movement
- [ ] Color `#ff6b1a`, additive blending, size 0.07, transparent, no depth write
- [ ] `src/objects/ForgeEmbers.tsx` — R3F component for the dense hearth cluster
- [ ] 150 particles in a 5-unit spread around the fire pit, rising faster, color `#ff4400`
- [ ] Both particle systems animate via `useFrame` — positions update each frame
- [ ] Speed array stored per-particle for variation
- [ ] Particles are visually consistent with the prototype
- [ ] Performance: particles don't cause frame drops (BufferGeometry, not individual meshes)

**Files Created:**
- `src/objects/EmberParticles.tsx`
- `src/objects/ForgeEmbers.tsx`

**Dependencies:** FORGE-006
**Branch:** `feat/FORGE-008-ember-particles`

---

### FORGE-009: Path Strips Between Zones

**User Story:**
As a visitor, I need to see glowing path strips on the ground connecting the central Hearth to each zone so that I know which direction to walk.

**Acceptance Criteria:**
- [ ] `src/objects/PathStrip.tsx` — reusable R3F component accepting `from`, `to`, and `color` props
- [ ] Renders a series of small box segments (0.3 × 0.04 × 0.8) along the path from origin to destination
- [ ] Segments spaced ~1.5 units apart, oriented to face the destination
- [ ] Material uses emissive glow matching the zone color at 0.4 intensity
- [ ] Four paths rendered in SceneManager:
  - Hearth → Skill Tree (teal `#44aa88`)
  - Hearth → Vault (bronze `#aa6622`)
  - Hearth → Timeline (purple `#6644aa`)
  - Hearth → War Room (cyan `#22aacc`)
- [ ] Paths are visible from player eye height and help with wayfinding
- [ ] Path segments don't z-fight with the ground (y: 0.03)

**Files Created:**
- `src/objects/PathStrip.tsx`
- Updated `src/canvas/SceneManager.tsx`

**Dependencies:** FORGE-006, FORGE-003
**Branch:** `feat/FORGE-009-path-strips`

---

## PHASE 3: Zones

_Build each zone one at a time. Each zone is a self-contained R3F component under 500 lines. By the end of this phase the full world is populated._

---

### FORGE-010: Hearth Zone (Center)

**User Story:**
As a visitor, I need to see an impressive central forge with an anvil, fire pit, glowing coals, and torch pillars so that I have a dramatic landing experience when I enter the world.

**Acceptance Criteria:**
- [ ] `src/zones/Hearth.tsx` — R3F group component positioned at (0, 0, 0)
- [ ] Anvil: base box + top box + cone horn, dark metal materials
- [ ] Fire pit: cylinder with 12 glowing coal spheres inside (emissive `#ff4400`, intensity 2.5)
- [ ] 6 decorative pillars in a circle (radius 6) with torch sphere on top of each
- [ ] Each torch has a small PointLight (color `#ff6b1a`, intensity 0.5, distance 8)
- [ ] Fire light flicker animated in useFrame: `3.5 + sin(t*8)*0.6 + sin(t*13)*0.35`
- [ ] All meshes cast/receive shadows appropriately
- [ ] Component < 500 lines
- [ ] Visually matches the prototype's central forge area

**Files Created:**
- `src/zones/Hearth.tsx`
- Updated `src/canvas/SceneManager.tsx`

**Dependencies:** FORGE-006
**Branch:** `feat/FORGE-010-hearth-zone`

---

### FORGE-011: Skill Tree Zone

**User Story:**
As a visitor, I need to walk to the Skill Tree zone and see a branching crystal structure with glowing nodes representing Robert's technical skills so that I can understand his expertise at a glance.

**Acceptance Criteria:**
- [ ] `src/zones/SkillTree.tsx` — R3F group component positioned at (-22, 0, 0)
- [ ] Circular platform base (radius 4, dark teal material)
- [ ] Central trunk cylinder with three main branches
- [ ] Three category nodes (Frontend teal, Backend blue, DevOps orange) — large IcosahedronGeometry
- [ ] Sub-nodes for individual skills, sized proportionally to `skill.level`
- [ ] Thin cylinder connectors from sub-nodes to parent category nodes
- [ ] Category nodes marked as interactable (userData.interactable = true) with skill data attached
- [ ] All nodes bob and rotate via useFrame with unique phase offsets
- [ ] Zone-specific PointLight: teal `#44aa88`, intensity 2, distance 18, positioned at (-22, 5, 0)
- [ ] Data imported from `src/data/skills.ts`
- [ ] Component < 500 lines

**Files Created:**
- `src/zones/SkillTree.tsx`

**Dependencies:** FORGE-006, FORGE-003
**Branch:** `feat/FORGE-011-skill-tree-zone`

---

### FORGE-012: Project Vault Zone

**User Story:**
As a visitor, I need to walk to the Vault and see all of Robert's projects displayed as glowing artifacts on pedestals with tier-colored rings so that I can browse his portfolio in an immersive way.

**Acceptance Criteria:**
- [ ] `src/zones/ProjectVault.tsx` — R3F group component positioned at (22, 0, 0)
- [ ] `src/objects/Pedestal.tsx` — reusable pedestal component (cylinder + tier glow ring)
- [ ] Large circular platform floor (radius 10)
- [ ] All 12 projects placed in a spiral layout
- [ ] Each project has: pedestal, tier-colored TorusGeometry ring, floating artifact
- [ ] Artifact shape varies by project's `shape` property (box, ico, octa, torus, cone, sphere)
- [ ] Artifact material: project color as both color and emissive, intensity 0.7
- [ ] All artifacts rotate and bob via useFrame with unique phase offsets
- [ ] Each artifact mesh has `userData.interactable = true` with full project data attached
- [ ] Data imported from `src/data/projects.ts` and `src/data/theme.ts`
- [ ] Zone-specific PointLight: bronze `#aa6622`
- [ ] Each component < 500 lines

**Files Created:**
- `src/zones/ProjectVault.tsx`
- `src/objects/Pedestal.tsx`

**Dependencies:** FORGE-006, FORGE-003
**Branch:** `feat/FORGE-012-project-vault-zone`

---

### FORGE-013: Timeline Zone

**User Story:**
As a visitor, I need to walk to the Timeline and see a winding path with floating era markers so that I can understand Robert's career journey from restaurant management to senior engineering.

**Acceptance Criteria:**
- [ ] `src/zones/Timeline.tsx` — R3F group component positioned at (0, 0, -24)
- [ ] 5 era markers (OctahedronGeometry) along a winding path
- [ ] Path segments (BoxGeometry) connecting eras with emissive purple material
- [ ] Each era has: ground ring, vertical connector, floating marker
- [ ] Markers bob and rotate via useFrame with unique phase offsets
- [ ] Each marker has `userData.interactable = true` with era data attached
- [ ] Era-specific colors from `TIMELINE_DATA`
- [ ] Zone-specific PointLight: purple `#6644aa`
- [ ] Data imported from `src/data/timeline.ts`
- [ ] Component < 500 lines

**Files Created:**
- `src/zones/Timeline.tsx`

**Dependencies:** FORGE-006, FORGE-003
**Branch:** `feat/FORGE-013-timeline-zone`

---

### FORGE-014: War Room Zone

**User Story:**
As a visitor, I need to walk to the War Room and see a holographic command table with wireframe projections of active projects so that I can see what Robert is currently building.

**Acceptance Criteria:**
- [ ] `src/zones/WarRoom.tsx` — R3F group component positioned at (0, 0, 24)
- [ ] Central table: cylinder on pedestal leg
- [ ] Holographic ring on table surface (TorusGeometry, emissive cyan, transparent 0.4)
- [ ] 4 floating wireframe holographic meshes, one per active project:
  - HALO → BoxGeometry (Ethereum block)
  - BibleWalk → flat BoxGeometry (book)
  - Savannah Connect → SphereGeometry (globe)
  - RB Digital → OctahedronGeometry
- [ ] Wireframe material with project color, emissive intensity 1.2, transparent 0.7
- [ ] All holograms spin and bob via useFrame
- [ ] Each hologram has `userData.interactable = true` with active project data attached
- [ ] Zone-specific PointLight: cyan `#22aacc`
- [ ] Holographic ring rotates slowly
- [ ] Data imported from `src/data/activeProjects.ts`
- [ ] Component < 500 lines

**Files Created:**
- `src/zones/WarRoom.tsx`

**Dependencies:** FORGE-006, FORGE-003
**Branch:** `feat/FORGE-014-war-room-zone`

---

## PHASE 4: HUD & Interaction

_Build the 2D HTML overlay (HUD) and the interaction system that connects the 3D world to the UI panels. By the end of this phase the portfolio is fully functional._

---

### FORGE-015: Start Overlay

**User Story:**
As a visitor, I need to see an atmospheric title screen when I first load the site with a prompt to click and enter so that the experience has a dramatic, intentional beginning.

**Acceptance Criteria:**
- [ ] `src/hud/StartOverlay.tsx` — full-screen overlay with title, subtitle, and "Click to Enter the Forge" prompt
- [ ] Title: "THE FORGE" in Cinzel 900, wheat color with text shadow
- [ ] Subtitle: "Robert Blaylock — Senior Full Stack & 3D Engineer" in Rajdhani
- [ ] Enter prompt pulses with the `pulse-glow` animation (opacity + color oscillation)
- [ ] Clicking the overlay: calls `startGame()` on Zustand store, requests pointer lock, fades out with 1s opacity transition
- [ ] Overlay has z-index above all other HUD elements
- [ ] After fade-out, overlay is removed from DOM or set to pointer-events: none
- [ ] Reads `isStarted` from Zustand store

**Files Created:**
- `src/hud/StartOverlay.tsx`

**Dependencies:** FORGE-004
**Branch:** `feat/FORGE-015-start-overlay`

---

### FORGE-016: Top Bar & Zone Indicator

**User Story:**
As a visitor, I need to see The Forge brand in the top-left and the current zone name in the top-right so that I always know where I am in the world.

**Acceptance Criteria:**
- [ ] `src/hud/TopBar.tsx` — fixed top bar with gradient background fading to transparent
- [ ] Left: forge brand "THE FORGE — RB" in Cinzel with amber glow
- [ ] Right: zone indicator showing current zone name from Zustand store
- [ ] Zone indicator transitions color: inactive `#5a4a3a` → active `#e8a54b` with text shadow
- [ ] Updates reactively when `currentZone` changes in store
- [ ] Displays "The Wilds" when player is outside all zone radii

**Files Created:**
- `src/hud/TopBar.tsx`

**Dependencies:** FORGE-004
**Branch:** `feat/FORGE-016-top-bar`

---

### FORGE-017: Zone Detection System

**User Story:**
As a visitor, I need the app to automatically detect which zone I'm standing in based on my position so that the HUD updates, discovery tracking triggers, and zone-specific behaviors activate.

**Acceptance Criteria:**
- [ ] `src/player/useZoneDetection.ts` — custom hook running in useFrame
- [ ] Every frame: calculates distance from player position to each zone center
- [ ] Determines current zone by finding the closest zone where distance < zone radius
- [ ] If no zone is within radius, currentZone is set to `null` (wilderness)
- [ ] When a NEW zone is entered (different from last frame): calls `setCurrentZone()` and `discoverZone()` on store
- [ ] Only triggers discovery once per zone (store handles idempotency)
- [ ] Hook is used inside PlayerController
- [ ] Zone boundaries match `ZONE_DEFS` from data files

**Files Created:**
- `src/player/useZoneDetection.ts`
- Updated `src/player/PlayerController.tsx`

**Dependencies:** FORGE-004, FORGE-007, FORGE-003
**Branch:** `feat/FORGE-017-zone-detection`

---

### FORGE-018: Zone Flash & XP Bar

**User Story:**
As a visitor, I need to see a cinematic zone name flash when I discover a new zone and an XP bar showing my exploration progress so that exploring feels rewarding.

**Acceptance Criteria:**
- [ ] `src/hud/ZoneFlash.tsx` — center-screen text that animates on new zone discovery
- [ ] Animation: fade in + scale up → hold → fade out (2s total via CSS keyframes)
- [ ] Text: zone name in Cinzel 900, gold color with glow shadow
- [ ] Only triggers on FIRST discovery of each zone, not on re-entry
- [ ] Reads a `lastDiscoveredZone` or similar trigger from Zustand store
- [ ] `src/hud/XPBar.tsx` — top-right progress bar
- [ ] Shows "Explored" label + 120px bar
- [ ] Fill width = `discoveredZones.size / 5 * 100%`
- [ ] Amber gradient fill with glow shadow
- [ ] Smooth CSS transition on width changes (0.8s ease)

**Files Created:**
- `src/hud/ZoneFlash.tsx`
- `src/hud/XPBar.tsx`

**Dependencies:** FORGE-004, FORGE-017
**Branch:** `feat/FORGE-018-zone-flash-xp`

---

### FORGE-019: Interaction System (Raycaster + Prompt)

**User Story:**
As a visitor, I need to see a crosshair and an interact prompt when I look at an inspectable object, and press E to open its detail panel, so that I can learn about Robert's projects and skills.

**Acceptance Criteria:**
- [ ] `src/player/useInteraction.ts` — custom hook using R3F raycaster
- [ ] Raycaster fires from camera center each frame, max distance 6 units
- [ ] Checks intersection against all objects with `userData.interactable === true`
- [ ] When aiming at an interactable: sets `interactTarget` in store with the object's userData
- [ ] When not aiming at anything: clears `interactTarget`
- [ ] E key press (when target exists): calls `showDetailPanel(target.userData)` on store
- [ ] `src/hud/InteractPrompt.tsx` — bottom-center prompt
- [ ] Shows "[E] Inspect {name}" when `interactTarget` is set in store
- [ ] Fades in/out with 0.4s transition
- [ ] `src/hud/Crosshair.tsx` — center-screen crosshair (CSS pseudo-elements)
- [ ] Visible when pointer is locked
- [ ] Proximity glow: interactable objects increase emissiveIntensity when player is within 5 units (handled in useInteraction or per-zone useFrame)

**Files Created:**
- `src/player/useInteraction.ts`
- `src/hud/InteractPrompt.tsx`
- `src/hud/Crosshair.tsx`

**Dependencies:** FORGE-004, FORGE-007, FORGE-010 through FORGE-014 (needs interactable objects)
**Branch:** `feat/FORGE-019-interaction-system`

---

### FORGE-020: Detail Panel

**User Story:**
As a visitor, I need to see a slide-in detail panel when I inspect an object that shows its full information (title, description, tags, links, skill levels) so that I can learn about Robert's work in depth.

**Acceptance Criteria:**
- [ ] `src/hud/DetailPanel.tsx` — fixed right-side panel with close button
- [ ] Slides in from right with cubic-bezier transition (0.5s)
- [ ] Reads `activeDetail` and `showDetail` from Zustand store
- [ ] Renders different layouts based on `detail.type`:
  - `project` → title, tier badge (colored), description, tags, "Live Demo ↗" link
  - `skill-category` → title, "Skill Branch" label, skill list with ⚒ mastery levels
  - `timeline-era` → title, org + years, skill description
  - `active-project` → title, status badge, description
- [ ] Close button (×) calls `closeDetailPanel()` on store
- [ ] ESC key also closes the panel
- [ ] Panel has backdrop blur, dark background, forge-styled borders
- [ ] Links open in new tab with `rel="noopener"`
- [ ] Panel is accessible: focusable close button, semantic HTML

**Files Created:**
- `src/hud/DetailPanel.tsx`

**Dependencies:** FORGE-004, FORGE-019
**Branch:** `feat/FORGE-020-detail-panel`

---

### FORGE-021: Minimap

**User Story:**
As a visitor, I need a minimap in the bottom-right corner showing my position, direction, and discovered zones so that I can orient myself and navigate the world.

**Acceptance Criteria:**
- [ ] `src/hud/Minimap.tsx` — 140×140 canvas element, fixed bottom-right
- [ ] Draws on 2D canvas context each frame (via requestAnimationFrame or synced to R3F)
- [ ] Shows zone dots at correct relative positions (scale factor ~2.2)
- [ ] Zone dots: current zone = gold filled + outer ring, discovered = amber 50%, undiscovered = dim
- [ ] Path lines from center to each zone (dim amber)
- [ ] Player dot: wheat colored, 3px radius
- [ ] Direction indicator: line from player dot in the direction player is facing (based on yaw)
- [ ] "Map" label in top-left corner of minimap
- [ ] Dark semi-transparent background with amber border
- [ ] Reads player position, yaw, currentZone, and discoveredZones from Zustand store

**Files Created:**
- `src/hud/Minimap.tsx`

**Dependencies:** FORGE-004, FORGE-017
**Branch:** `feat/FORGE-021-minimap`

---

### FORGE-022: Controls HUD & Quick Nav

**User Story:**
As a visitor, I need to see control hints (WASD, Mouse, E, ESC) and quick-nav dots for teleporting between zones so that I can learn the controls and jump between areas.

**Acceptance Criteria:**
- [ ] `src/hud/ControlsHUD.tsx` — bottom-left panel showing keybind hints
- [ ] Styled keys (WASD, Mouse, E, ESC) with amber-bordered badge style
- [ ] Semi-transparent dark background, small text
- [ ] `src/hud/QuickNav.tsx` — left-side vertical dots, one per zone
- [ ] Each dot shows zone name on hover (tooltip)
- [ ] Active zone dot is gold with glow
- [ ] Clicking a dot teleports player: sets playerPosition to zone center + offset, sets yaw
- [ ] Teleport closes any open detail panel
- [ ] Both components read from / write to Zustand store

**Files Created:**
- `src/hud/ControlsHUD.tsx`
- `src/hud/QuickNav.tsx`

**Dependencies:** FORGE-004
**Branch:** `feat/FORGE-022-controls-quicknav`

---

### FORGE-023: HUD Compositor

**User Story:**
As a developer, I need a single HUD component that composes all overlay elements together so that `page.tsx` has a clean render tree and HUD layering is managed in one place.

**Acceptance Criteria:**
- [ ] `src/hud/HUD.tsx` — single component rendering all HUD children:
  - StartOverlay (conditionally, when `!isStarted`)
  - TopBar
  - XPBar
  - ZoneFlash
  - Crosshair (conditionally, when `isLocked`)
  - InteractPrompt
  - DetailPanel
  - Minimap
  - ControlsHUD
  - QuickNav
- [ ] Proper z-index layering (StartOverlay > ZoneFlash > DetailPanel > rest)
- [ ] `page.tsx` renders `<ForgeCanvas />` and `<HUD />` as siblings
- [ ] All HUD elements visible and functioning together without overlap issues
- [ ] HUD has `pointer-events: none` on the wrapper, with `pointer-events: auto` on interactive children only

**Files Created:**
- `src/hud/HUD.tsx`
- Updated `src/app/page.tsx`

**Dependencies:** FORGE-015 through FORGE-022
**Branch:** `feat/FORGE-023-hud-compositor`

---

## PHASE 5: Polish & Performance

_Refinement pass — shaders, post-processing, accessibility fallback, and performance optimization._

---

### FORGE-024: Post-Processing & Shader Polish

**User Story:**
As a visitor, I need the world to have cinematic post-processing (bloom on emissive objects, vignette) and refined shader effects so that the experience feels professional and visually striking.

**Acceptance Criteria:**
- [ ] R3F post-processing setup using `@react-three/postprocessing` (add dependency)
- [ ] Bloom effect on emissive materials (subtle, threshold ~0.8, intensity ~0.3)
- [ ] Vignette effect (darkness ~0.5)
- [ ] CSS vignette overlay as fallback layer
- [ ] CSS scanlines overlay (subtle, 2px repeating gradient)
- [ ] Fire light flicker refined — consider adding second fire light for depth
- [ ] Ember particles: verify additive blending looks correct with bloom
- [ ] Performance budget: maintains 60fps on mid-range hardware
- [ ] If postprocessing causes perf issues on low-end devices, detect and disable gracefully
- [ ] Respect `prefers-reduced-motion` — disable particle animation and reduce bloom

**Files Created/Updated:**
- Updated `src/canvas/ForgeCanvas.tsx`
- `src/canvas/PostProcessing.tsx`
- CSS overlays in HUD or layout

**Dependencies:** All Phase 2-4 tickets complete
**Branch:** `feat/FORGE-024-post-processing`

---

### FORGE-025: Accessibility & 2D Fallback

**User Story:**
As a visitor on a low-end device or using assistive technology, I need the portfolio to gracefully fall back to a readable 2D version so that I can still access Robert's information.

**Acceptance Criteria:**
- [ ] Detect WebGL support on mount — if unavailable, show 2D fallback
- [ ] 2D fallback: clean HTML page with all portfolio content (projects, skills, timeline, contact) rendered from the same data files
- [ ] Styled with Tailwind using the forge color palette
- [ ] `<noscript>` tag with basic content
- [ ] All HUD interactive elements are keyboard accessible (tab focus, enter to activate)
- [ ] Detail panel can be closed with ESC
- [ ] Semantic HTML throughout HUD (headings, lists, nav, buttons)
- [ ] Meta tags in `layout.tsx`: title, description, OG image, etc.
- [ ] `robots.txt` and basic SEO

**Files Created:**
- `src/components/Fallback2D.tsx`
- Updated `src/app/layout.tsx` (meta tags)
- `public/robots.txt`

**Dependencies:** FORGE-003, FORGE-023
**Branch:** `feat/FORGE-025-accessibility-fallback`

---

### FORGE-026: Performance Optimization

**User Story:**
As a developer, I need the 3D portfolio to run at 60fps on target hardware with optimized bundle size so that the experience is smooth for all visitors.

**Acceptance Criteria:**
- [ ] Bundle analysis: total JS < 500KB gzipped (target)
- [ ] Three.js tree-shaking verified — no unused modules in bundle
- [ ] All textures (if any added) are compressed and appropriately sized
- [ ] Geometry reuse: shared geometries and materials where possible (useRef, useMemo)
- [ ] Particle systems use BufferGeometry — no individual mesh objects
- [ ] Zone components use React.memo or equivalent to prevent unnecessary re-renders
- [ ] Zustand selectors used to prevent full-store re-renders
- [ ] `useFrame` callbacks are lightweight — no allocations in hot loop
- [ ] Shadow map resolution optimized (512 or 1024 max)
- [ ] Frustum culling working (default in Three.js, verify not disabled)
- [ ] Lighthouse score: Performance > 70, Accessibility > 90
- [ ] Test on: Chrome, Firefox, Safari, mobile Chrome

**Files Updated:**
- Various components for optimization
- `next.config.js` if bundle config needed

**Dependencies:** All previous tickets
**Branch:** `chore/FORGE-026-performance`

---

## PHASE 6: Deployment

---

### FORGE-027: Vercel Deployment & Domain

**User Story:**
As the portfolio owner, I need the site deployed to Vercel and connected to rblaylock.dev so that visitors can access The Forge at my existing domain.

**Acceptance Criteria:**
- [ ] Project pushed to GitHub repository
- [ ] Vercel project created and connected to repo
- [ ] Auto-deploy on push to `main` branch
- [ ] Custom domain `rblaylock.dev` configured (DNS pointed to Vercel)
- [ ] HTTPS enabled (automatic via Vercel)
- [ ] Environment variables configured (if any)
- [ ] Preview deployments working on PRs
- [ ] Production build completes without errors
- [ ] Site loads and all zones are functional at the live URL
- [ ] OG image / social preview renders correctly when URL is shared
- [ ] Old portfolio content preserved or redirected as needed

**Files Created:**
- `vercel.json` (if custom config needed)
- Updated README.md with deployment docs

**Dependencies:** All previous tickets
**Branch:** `chore/FORGE-027-deployment`

---

## Ticket Dependency Graph

```
PHASE 1 (Foundation)
  FORGE-001 ─────┬──── FORGE-002 ──── FORGE-003
                 │          │
                 │     FORGE-004
                 │
            FORGE-005

PHASE 2 (Core 3D)
  FORGE-006 ─────┬──── FORGE-007
                 ├──── FORGE-008
                 └──── FORGE-009

PHASE 3 (Zones) — all depend on FORGE-006 + FORGE-003
  FORGE-010 (Hearth)
  FORGE-011 (Skill Tree)
  FORGE-012 (Vault)
  FORGE-013 (Timeline)
  FORGE-014 (War Room)
  ↑ These 5 can be built in parallel

PHASE 4 (HUD & Interaction)
  FORGE-015 ─── FORGE-016 ─── FORGE-017 ─── FORGE-018
                                    │
  FORGE-019 (needs zones) ──── FORGE-020
  FORGE-021 ─── FORGE-022
                    │
              FORGE-023 (compositor — needs all HUD)

PHASE 5 (Polish)
  FORGE-024 ─── FORGE-025 ─── FORGE-026

PHASE 6 (Deploy)
  FORGE-027
```

---

## Suggested Build Order (Optimized)

If building solo, this sequence minimizes context-switching:

1. FORGE-001 → 002 → 003 → 004 → 005 _(foundation — one session)_
2. FORGE-006 → 007 _(canvas + walking — verify you can move around)_
3. FORGE-010 _(Hearth — first thing you see)_
4. FORGE-008 → 009 _(particles + paths — world feels alive)_
5. FORGE-011 → 012 → 013 → 014 _(remaining zones — one per session)_
6. FORGE-015 → 016 → 017 → 018 _(HUD shell + zone detection + gamification)_
7. FORGE-019 → 020 _(interaction system + detail panel — portfolio becomes functional)_
8. FORGE-021 → 022 → 023 _(minimap + controls + compositor)_
9. FORGE-024 → 025 → 026 _(polish pass)_
10. FORGE-027 _(ship it)_

---

## Notes for AI-Assisted Building

When working with Claude (or any AI) on individual tickets:

1. **Start each session** by sharing the handoff doc + this ticket doc
2. **Reference the specific ticket** by ID (e.g., "Let's build FORGE-012")
3. **Review acceptance criteria** together before coding
4. **Test against the criteria** before marking done
5. **Keep the prototype HTML open** as visual reference for how things should look/behave
