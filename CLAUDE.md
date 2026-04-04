# THE FORGE — AI Build Guide

## Project Overview

**The Forge** is an interactive, gamified 3D portfolio for Robert Blaylock (rblaylock.dev). Visitors explore a first-person walkable 3D world with a dark forge/fire & metal aesthetic. Single continuous 3D scene with five interconnected zones — no page transitions.

## Documentation

Always reference these docs before building any ticket:

- `docs/THE-FORGE-HANDOFF.md` — Complete project spec (tech stack, zones, aesthetics, architecture, content data, engineering rules)
- `docs/THE-FORGE-TICKETS.md` — 24 detailed tickets across 6 phases with acceptance criteria
- `docs/THE-FORGE-UX-TICKETS.md` — 18 UX overhaul tickets across 5 phases (navigation, labeling, onboarding, content, polish)
- `docs/FORGE-CONTACT-RESUME-TICKETS.md` — FORGE-028 (Contact Form) + FORGE-029 (Resume Download) — critical v1 conversion features
- `docs/UX-019-SKILL-TREE-EXPANDED.md` — Expanded Skill Tree with 70+ skills, tiered reveal pattern, full data structure
- `docs/robert-blaylock-skills.md` — Master skills inventory (5 categories, 20+ subcategories, 70+ skills)
- `docs/THE-FORGE-ENGAGEMENT-STRATEGY.md` — Engagement hooks roadmap (Phases A-E: first impression, pull forward, depth, easter eggs, conversion)
- `docs/THE-FORGE-FUTURE-FEATURES.md` — 25 future feature ideas across 3 tiers (F-001 to F-025)
- `docs/THE-FORGE-FUTURE-TICKETS.md` — Full ticket specs for all future features
- `docs/the-forge-v2.html` — Fully functional HTML prototype (open in browser for visual/behavioral reference)

## Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Framework | Next.js 14 (App Router)            |
| 3D Engine | React Three Fiber (R3F) + Drei     |
| Language  | TypeScript                         |
| Styling   | Tailwind CSS (2D HUD overlays)     |
| State     | Zustand                            |
| Shaders   | Custom GLSL                        |
| Animation | R3F useFrame + Framer Motion (HUD) |
| Content   | JSON/TS config files               |
| Hosting   | Vercel                             |

## Architecture

```
src/
├── app/           # Next.js App Router (layout.tsx, page.tsx)
├── canvas/        # R3F canvas + scene (ForgeCanvas, SceneManager)
├── player/        # First-person controller (movement, interaction, zone detection)
├── zones/         # One component per zone (<500 lines each)
├── objects/       # Reusable 3D primitives (embers, paths, pedestals)
├── hud/           # 2D overlay UI (HTML, not 3D)
├── shaders/       # Custom GLSL
├── store/         # Zustand state (useForgeStore)
├── data/          # Content config files (projects, skills, timeline, etc.)
└── types/         # Shared TypeScript types
```

## Ticket Tracker

### PHASE 1: Foundation

| ID        | Ticket                             | Status | Branch                               |
| --------- | ---------------------------------- | ------ | ------------------------------------ |
| FORGE-001 | Project Scaffolding & Dependencies | DONE   | `feat/FORGE-001-project-scaffolding` |
| FORGE-002 | TypeScript Types & Interfaces      | DONE   | `feat/FORGE-002-types-interfaces`    |
| FORGE-003 | Content Data Files                 | DONE   | `feat/FORGE-003-content-data`        |
| FORGE-004 | Zustand Store                      | DONE   | `feat/FORGE-004-zustand-store`       |
| FORGE-005 | Docker + Makefile + Docker Compose | DONE   | `chore/FORGE-005-docker-makefile`    |

### PHASE 2: Core 3D Engine

| ID        | Ticket                       | Status | Branch                              |
| --------- | ---------------------------- | ------ | ----------------------------------- |
| FORGE-006 | R3F Canvas & Scene Shell     | DONE   | `feat/FORGE-006-canvas-scene-shell` |
| FORGE-007 | Player Controller — Movement | DONE   | `feat/FORGE-007-player-movement`    |
| FORGE-008 | Ember Particle Systems       | DONE   | `feat/FORGE-008-ember-particles`    |
| FORGE-009 | Path Strips Between Zones    | DONE   | `feat/FORGE-008-ember-particles`    |

### PHASE 3: Zones

| ID        | Ticket               | Status | Branch                              |
| --------- | -------------------- | ------ | ----------------------------------- |
| FORGE-010 | Hearth Zone (Center) | DONE   | `feat/FORGE-010-hearth-zone`        |
| FORGE-011 | Skill Tree Zone      | DONE   | `feat/FORGE-011-skill-tree-zone`    |
| FORGE-012 | Project Vault Zone   | DONE   | `feat/FORGE-012-project-vault-zone` |
| FORGE-013 | Timeline Zone        | DONE   | `feat/FORGE-013-timeline-zone`      |
| FORGE-014 | War Room Zone        | DONE   | `feat/FORGE-014-war-room-zone`      |

### PHASE 4: HUD & Interaction

| ID        | Ticket                                  | Status | Branch                              |
| --------- | --------------------------------------- | ------ | ----------------------------------- |
| FORGE-015 | Start Overlay                           | DONE   | `feat/FORGE-015-start-overlay`      |
| FORGE-016 | Top Bar & Zone Indicator                | DONE   | `feat/FORGE-016-top-bar`            |
| FORGE-017 | Zone Detection System                   | DONE   | `feat/FORGE-017-zone-detection`     |
| FORGE-018 | Zone Flash & XP Bar                     | DONE   | `feat/FORGE-018-zone-flash-xp`      |
| FORGE-019 | Interaction System (Raycaster + Prompt) | DONE   | `feat/FORGE-019-interaction-system` |
| FORGE-020 | Detail Panel                            | DONE   | `feat/FORGE-020-detail-panel`       |
| FORGE-021 | Minimap                                 | DONE   | `feat/FORGE-021-minimap`            |
| FORGE-022 | Controls HUD & Quick Nav                | DONE   | `feat/FORGE-022-controls-quicknav`  |
| FORGE-023 | HUD Compositor                          | DONE   | `feat/FORGE-023-hud-compositor`     |

### PHASE 5: Polish & Performance

| ID        | Ticket                          | Status | Branch                                  |
| --------- | ------------------------------- | ------ | --------------------------------------- |
| FORGE-024 | Post-Processing & Shader Polish | DONE   | `feat/FORGE-024-post-processing`        |
| FORGE-025 | Accessibility & 2D Fallback     | DONE   | `feat/FORGE-025-accessibility-fallback` |
| FORGE-026 | Performance Optimization        | DONE   | `chore/FORGE-026-performance`           |

### PHASE 6: Deployment

| ID        | Ticket                     | Status | Branch                       |
| --------- | -------------------------- | ------ | ---------------------------- |
| FORGE-027 | Vercel Deployment & Domain | DONE   | `chore/FORGE-027-deployment` |

### PHASE UX-1: Navigation Overhaul

| ID     | Ticket                                   | Status | Branch                            |
| ------ | ---------------------------------------- | ------ | --------------------------------- |
| UX-001 | Arrow Keys + Click-to-Walk               | DONE   | `feat/UX-001-navigation-overhaul` |
| UX-002 | Orbit-Style Camera (Remove Pointer Lock) | DONE   | `feat/UX-002-orbit-camera`        |
| UX-003 | Persistent Navigation Bar                | DONE   | `feat/UX-003-nav-bar`             |

### PHASE UX-2: Zone Clarity & Labeling

| ID     | Ticket                                | Status | Branch                        |
| ------ | ------------------------------------- | ------ | ----------------------------- |
| UX-004 | Floating Zone Title Signs             | DONE   | `feat/UX-004-zone-labels`     |
| UX-005 | Project Labels & Tier Badges          | DONE   | `feat/UX-005-project-labels`  |
| UX-006 | Skill Node Labels & Category Headers  | DONE   | `feat/UX-006-skill-labels`    |
| UX-007 | Timeline Era Labels & Narrative Cards | DONE   | `feat/UX-007-timeline-labels` |
| UX-008 | War Room Project Status Cards         | DONE   | `feat/UX-008-warroom-labels`  |

### PHASE UX-3: Onboarding & Guided Experience

| ID     | Ticket                             | Status | Branch                       |
| ------ | ---------------------------------- | ------ | ---------------------------- |
| UX-009 | Guided Intro Tour (First Visit)    | DONE   | `feat/UX-009-intro-tour`     |
| UX-010 | Contextual Tooltips & Hover States | DONE   | `feat/UX-010-hover-tooltips` |
| UX-011 | Click-to-Interact (Replace E Key)  | DONE   | `feat/UX-011-click-interact` |

### PHASE UX-4: Information Architecture & Contact

| ID     | Ticket                               | Status | Branch                        |
| ------ | ------------------------------------ | ------ | ----------------------------- |
| UX-012 | Welcome Zone (Hearth) — Bio & Resume | DONE   | `feat/UX-012-hearth-bio`      |
| UX-013 | Contact Section / Modal              | DONE   | `feat/FORGE-028-contact-form` |
| UX-014 | Project Detail Panel — Enhanced      | DONE   | `feat/UX-014-enhanced-detail` |

### PHASE UX-5: Accessibility, Performance & Polish

| ID     | Ticket                                 | Status | Branch                          |
| ------ | -------------------------------------- | ------ | ------------------------------- |
| UX-015 | Loading Screen with Progress           | DONE   | `feat/UX-015-loading-screen`    |
| UX-016 | Responsive Design & Mobile Experience  | DONE   | `feat/UX-016-responsive-mobile` |
| UX-017 | Keyboard Accessibility & Screen Reader | DONE   | `feat/UX-017-accessibility`     |
| UX-018 | Social Preview & Meta Tags             | DONE   | `feat/UX-018-social-meta`       |

### PHASE CORE: Conversion Essentials (Must Ship v1)

| ID        | Ticket                        | Status | Branch                           |
| --------- | ----------------------------- | ------ | -------------------------------- |
| FORGE-028 | Contact Form & Email Delivery | DONE   | `feat/FORGE-028-contact-form`    |
| FORGE-029 | Resume Download               | DONE   | `feat/FORGE-029-resume-download` |

### PHASE UX-EXT: Expanded Features

| ID     | Ticket                                       | Status | Branch                            |
| ------ | -------------------------------------------- | ------ | --------------------------------- |
| UX-019 | Skill Tree — Expanded Inventory (70+ skills) | DONE   | `feat/UX-019-skill-tree-expanded` |

### PHASE ENGAGEMENT: Hooks & Polish (from Engagement Strategy)

| ID     | Ticket                           | Status | Branch                              |
| ------ | -------------------------------- | ------ | ----------------------------------- |
| UX-020 | Cinematic Cold Open              | DONE   | `feat/UX-020-cinematic-cold-open`   |
| UX-021 | Forge Codex (Discovery Tracker)  | DONE   | `feat/UX-021-forge-codex`           |
| UX-022 | Contextual CTAs                  | DONE   | `feat/UX-022-contextual-ctas`       |
| UX-023 | Breadcrumb Particles             | DONE   | `feat/UX-023-breadcrumb-particles`  |
| UX-024 | Ambient Soundscape               | DONE   | `feat/UX-024-ambient-sound`         |
| UX-025 | Zone Unlock Cinematics           | DONE   | `feat/UX-025-zone-unlock`           |
| UX-026 | Screenshot Mode                  | DONE   | `feat/UX-026-screenshot-mode`       |
| UX-027 | Resume as Forge Artifact         | DONE   | `feat/UX-027-resume-artifact`       |
| UX-028 | Project Live Previews            | DONE   | `feat/UX-028-project-previews`      |
| UX-029 | Dynamic Time-of-Day Lighting     | DONE   | `feat/UX-029-time-of-day`           |
| UX-030 | Skill Constellations             | DONE   | `feat/UX-030-skill-constellations`  |
| UX-031 | Hidden Forge (Secret Zone)       | DONE   | `feat/UX-031-hidden-forge`          |
| UX-032 | Forge Events (Ambient Surprises) | DONE   | `feat/UX-032-forge-events`          |
| UX-033 | Konami Code Easter Egg           | DONE   | `feat/UX-033-konami-code`           |
| UX-034 | Visitor Counter / Social Proof   | DONE   | `feat/UX-034-visitor-counter`       |
| UX-035 | Zone Entry Transition Effect     | DONE   | `feat/UX-035-zone-entry-transition` |

### PHASE FUTURE: Future Features (Post-Launch)

| ID    | Ticket                               | Status | Branch                          |
| ----- | ------------------------------------ | ------ | ------------------------------- |
| F-001 | AI Forge Assistant (Portfolio Guide) | TODO   | `feat/F-001-ai-forge-assistant` |
| F-002 | Live Code Playground                 | TODO   | `feat/F-002-code-playground`    |
| F-003 | Multiplayer Forge (Co-Presence)      | TODO   | `feat/F-003-multiplayer`        |
| F-004 | Project Forge Replay                 | TODO   | `feat/F-004-forge-replay`       |
| F-005 | Testimonials Forge Wall              | DONE   | `feat/F-005-testimonials`       |
| F-006 | Weather System                       | TODO   | `feat/F-006-weather`            |
| F-007 | Achievement System & Badges          | TODO   | `feat/F-007-achievements`       |
| F-008 | Blog Forge (Content Zone)            | TODO   | `feat/F-008-blog-forge`         |
| F-009 | Seasonal Forge Themes                | TODO   | `feat/F-009-seasonal-themes`    |
| F-010 | Interactive Resume Builder           | TODO   | `feat/F-010-resume-builder`     |
| F-011 | Forge Radio (Soundtrack)             | TODO   | `feat/F-011-forge-radio`        |
| F-012 | Visitor Heatmap (Admin Dashboard)    | TODO   | `feat/F-012-visitor-heatmap`    |
| F-013 | AR Mode                              | TODO   | `feat/F-013-ar-mode`            |
| F-014 | Voice Navigation                     | TODO   | `feat/F-014-voice-nav`          |
| F-015 | Forge Guestbook                      | TODO   | `feat/F-015-guestbook`          |
| F-016 | Mini-Game: Forge the Code            | TODO   | `feat/F-016-forge-game`         |
| F-017 | Custom Cursor Forge Tool             | TODO   | `feat/F-017-custom-cursors`     |
| F-018 | Project Comparison Mode              | TODO   | `feat/F-018-project-comparison` |
| F-019 | Collaborative Whiteboard             | TODO   | `feat/F-019-whiteboard`         |
| F-020 | Accessibility Audio Tour             | TODO   | `feat/F-020-audio-tour`         |
| F-021 | The Forge API                        | TODO   | `feat/F-021-forge-api`          |
| F-022 | GitHub Activity Heatmap              | TODO   | `feat/F-022-github-heatmap`     |
| F-023 | Forge Changelog                      | TODO   | `feat/F-023-changelog`          |
| F-024 | Spotify Integration                  | TODO   | `feat/F-024-spotify`            |
| F-025 | Forge Lore Pages                     | TODO   | `feat/F-025-lore-pages`         |

## Optimized Build Order

Build solo in this sequence to minimize context-switching:

1. **FORGE-001 → 002 → 003 → 004 → 005** — Foundation (one session)
2. **FORGE-006 → 007** — Canvas + walking (verify movement)
3. **FORGE-010** — Hearth (first thing you see)
4. **FORGE-008 → 009** — Particles + paths (world feels alive)
5. **FORGE-011 → 012 → 013 → 014** — Remaining zones (one per session)
6. **FORGE-015 → 016 → 017 → 018** — HUD shell + zone detection + gamification
7. **FORGE-019 → 020** — Interaction system + detail panel (portfolio becomes functional)
8. **FORGE-021 → 022 → 023** — Minimap + controls + compositor
9. **FORGE-024 → 025 → 026** — Polish pass
10. **FORGE-027** — Ship it

## UX Overhaul Build Order

Build the UX tickets in sessions to minimize context-switching:

1. **UX-001 → UX-002 → UX-003** — Navigation revolution (do all three together — they replace the movement system)
2. **UX-004 → UX-005 → UX-006 → UX-007 → UX-008** — Label everything (can be parallelized)
3. **UX-010 → UX-011** — Interaction polish (hover states + click-to-interact)
4. **UX-015 → UX-009** — First impressions (loading screen + guided tour)
5. **UX-012 → UX-013 → UX-014** — Content completeness (bio, contact, enhanced details)
6. **UX-016 → UX-017 → UX-018** — Ship quality (mobile, accessibility, social meta)

## Future Features Build Order

Optimized for impact, dependency order, and context-switching. Each wave groups related features.

### Wave 1: Quick Wins (~1 session)

> Ship fast, show momentum. Zero dependencies, pure polish.

- **F-017** (Custom Cursors) — 0.5 session. Zone-specific cursors: hammer, branch, magnifying glass, compass, target.
- **F-023** (Forge Changelog) — 0.5 session. Scroll object in Hearth, data-driven entries, "NEW" badge.

### Wave 2: Social Proof & Gamification (~4 sessions)

> Build trust and engagement loops. F-007 unlocks F-025 and F-016 later.

- **F-005** (Testimonials Wall) — 1–2 sessions. Glowing plaques in Hearth with colleague quotes.
- **F-007** (Achievement Badges) — 2–3 sessions. 9+ achievements, rarity tiers, SVG badges, localStorage persistence. **Foundation for F-025, F-016.**

### Wave 3: Immersion & Narrative (~4 sessions)

> Deepen the world. All build on existing systems (sound, post-processing, achievements).

- **F-025** (Forge Lore Pages) — 1–2 sessions. Hidden poetic fragments across zones, discovery tracking, "Lorekeeper" achievement. _Depends on F-007._
- **F-011** (Forge Radio) — 1–2 sessions. Zone-specific ambient music with crossfades. _Builds on UX-024._
- **F-024** (Spotify Integration) — 1 session. Now-playing widget, speaker object in Hearth.

### Wave 4: Conversion Powerhouses (~6 sessions)

> The features that close deals. High effort but highest ROI.

- **F-001** (AI Forge Assistant) — 3–4 sessions. Claude API-powered forge spirit chatbot with RAG context. Deep-links to zones. **Game changer for recruiter engagement.**
- **F-010** (Interactive Resume Builder) — 3–4 sessions. Multi-step UI, dynamic PDF generation. _Depends on UX-019, FORGE-012._

### Wave 5: Proof of Ability (~4 sessions)

> Show don't tell. Code, commits, and API design.

- **F-002** (Live Code Playground) — 2–3 sessions. Sandpack/Monaco editor, 8–12 runnable snippets.
- **F-021** (Forge API) — 1 session. REST API for portfolio data, OpenAPI spec, rate limiting.
- **F-022** (GitHub Heatmap Terrain) — 1–2 sessions. 3D commit activity grid via GitHub GraphQL.

### Wave 6: World-Building & Polish (~5 sessions)

> Make the world feel alive and dynamic. Encourage return visits.

- **F-006** (Weather System) — 1–2 sessions. Real weather from Counce, TN via OpenWeatherMap.
- **F-009** (Seasonal Themes) — 1–2 sessions. Spring/summer/fall/winter shader variations.
- **F-020** (Audio Tour) — 2–3 sessions. Robert's voice narrating each zone. Accessibility win.

### Wave 7: Community & Content (~6 sessions)

> User-generated content and thought leadership.

- **F-015** (Guestbook) — 2–3 sessions. Parchment-styled visitor messages, profanity filter.
- **F-008** (Blog Forge) — 2–3 sessions. MDX blog posts as glowing tomes on a bookshelf.
- **F-012** (Visitor Heatmap) — 2–3 sessions. Admin dashboard with engagement analytics.

### Wave 8: Interactive & Fun (~5 sessions)

> Engagement depth features. Build after core differentiators are solid.

- **F-016** (Forge the Code Game) — 2–3 sessions. 5 drag-and-drop coding puzzles. _Depends on F-007._
- **F-018** (Project Comparison) — 1–2 sessions. Side-by-side project analysis, radar charts.
- **F-014** (Voice Navigation) — 1–2 sessions. Web Speech API zone commands.
- **F-019** (Collaborative Whiteboard) — 1–2 sessions. War Room project status board.

### Wave 9: Moonshots (~13 sessions)

> Build when everything else is polished. Maximum technical ambition.

- **F-004** (Project Forge Replay) — 4–5 sessions. Git history as 3D code city time-lapse.
- **F-003** (Multiplayer Co-Presence) — 4–5 sessions. WebSocket visitor ghosts via PartyKit.
- **F-013** (AR Mode) — 4–5 sessions. WebXR miniature forge on desk.

### Summary: ~48 sessions across 9 waves

| Wave | Theme                       | Sessions | Key Unlocks                      |
| ---- | --------------------------- | -------- | -------------------------------- |
| 1    | Quick Wins                  | ~1       | Ship momentum                    |
| 2    | Social Proof & Gamification | ~4       | Achievement system (foundation)  |
| 3    | Immersion & Narrative       | ~4       | Lore, music, personality         |
| 4    | Conversion Powerhouses      | ~6       | AI assistant, resume builder     |
| 5    | Proof of Ability            | ~4       | Live code, API, GitHub activity  |
| 6    | World-Building & Polish     | ~5       | Weather, seasons, audio tour     |
| 7    | Community & Content         | ~6       | Guestbook, blog, analytics       |
| 8    | Interactive & Fun           | ~5       | Code game, voice nav, comparison |
| 9    | Moonshots                   | ~13      | Multiplayer, AR, git replay      |

## Engineering Rules

1. Files < 500 lines. Split early.
2. Single responsibility. One function = one purpose.
3. Explicit over implicit. Clear names, types, schemas, boundaries.
4. Test-driven. Tests first for core, edge, and security paths.
5. Iterate safely. MVP first, never at the cost of correctness or security.
6. Docker + Makefile first. Everything runs via Docker.
7. Multi-stage Docker builds, minimal images, non-root user, env vars only (12-factor).
8. Accessible by default (semantic HTML, keyboard support for HUD).
9. Act like a senior mentoring juniors — explain "why", prefer readable code.

## Key Visual Constants

- **Colors:** Primary `#c4813a`, Accent `#e8a54b`, Text `#f5deb3`, Background `#0a0806`
- **Zone colors:** Skill Tree `#44aa88`, Vault `#aa6622`, Timeline `#6644aa`, War Room `#22aacc`
- **Tier colors:** LEGENDARY `#ff6600`, EPIC `#cc44ff`, RARE `#4488ff`, COMMON `#44aa66`
- **Fonts:** Cinzel (display) + Rajdhani (UI)

## World Layout

```
                War Room (0, 0, 24) — cyan
                     |
Skill Tree (-22, 0, 0) — HEARTH (0, 0, 0) — Vault (22, 0, 0)
     teal              |    amber/fire        bronze
                       |
                  Timeline (0, 0, -24) — purple
```

## Workflow

- **Before each ticket:** Read the ticket's acceptance criteria in `docs/THE-FORGE-TICKETS.md` or `docs/the-forge-ux-tickets.md`
- **During:** Reference `docs/THE-FORGE-HANDOFF.md` for specs and `docs/the-forge-v2.html` for visual behavior
- **After:** Verify all acceptance criteria checkboxes pass, then update the ticket status in this file from TODO → DONE
- **Branching:** Create a branch per ticket using the branch name listed above
- **Commits:** Conventional commits (feat:, chore:, fix:, etc.)
