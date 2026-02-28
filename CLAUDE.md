# THE FORGE — AI Build Guide

## Project Overview

**The Forge** is an interactive, gamified 3D portfolio for Robert Blaylock (rblaylock.dev). Visitors explore a first-person walkable 3D world with a dark forge/fire & metal aesthetic. Single continuous 3D scene with five interconnected zones — no page transitions.

## Documentation

Always reference these docs before building any ticket:

- `docs/THE-FORGE-HANDOFF.md` — Complete project spec (tech stack, zones, aesthetics, architecture, content data, engineering rules)
- `docs/THE-FORGE-TICKETS.md` — 24 detailed tickets across 6 phases with acceptance criteria
- `docs/the-forge-ux-tickets.md` — 18 UX overhaul tickets across 5 phases (navigation, labeling, onboarding, content, polish)
- `docs/the-forge-v2.html` — Fully functional HTML prototype (open in browser for visual/behavioral reference)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| 3D Engine | React Three Fiber (R3F) + Drei |
| Language | TypeScript |
| Styling | Tailwind CSS (2D HUD overlays) |
| State | Zustand |
| Shaders | Custom GLSL |
| Animation | R3F useFrame + Framer Motion (HUD) |
| Content | JSON/TS config files |
| Hosting | Vercel |

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
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| FORGE-001 | Project Scaffolding & Dependencies | DONE | `feat/FORGE-001-project-scaffolding` |
| FORGE-002 | TypeScript Types & Interfaces | DONE | `feat/FORGE-002-types-interfaces` |
| FORGE-003 | Content Data Files | DONE | `feat/FORGE-003-content-data` |
| FORGE-004 | Zustand Store | DONE | `feat/FORGE-004-zustand-store` |
| FORGE-005 | Docker + Makefile + Docker Compose | DONE | `chore/FORGE-005-docker-makefile` |

### PHASE 2: Core 3D Engine
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| FORGE-006 | R3F Canvas & Scene Shell | DONE | `feat/FORGE-006-canvas-scene-shell` |
| FORGE-007 | Player Controller — Movement | DONE | `feat/FORGE-007-player-movement` |
| FORGE-008 | Ember Particle Systems | DONE | `feat/FORGE-008-ember-particles` |
| FORGE-009 | Path Strips Between Zones | DONE | `feat/FORGE-008-ember-particles` |

### PHASE 3: Zones
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| FORGE-010 | Hearth Zone (Center) | DONE | `feat/FORGE-010-hearth-zone` |
| FORGE-011 | Skill Tree Zone | DONE | `feat/FORGE-011-skill-tree-zone` |
| FORGE-012 | Project Vault Zone | DONE | `feat/FORGE-012-project-vault-zone` |
| FORGE-013 | Timeline Zone | DONE | `feat/FORGE-013-timeline-zone` |
| FORGE-014 | War Room Zone | DONE | `feat/FORGE-014-war-room-zone` |

### PHASE 4: HUD & Interaction
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| FORGE-015 | Start Overlay | DONE | `feat/FORGE-015-start-overlay` |
| FORGE-016 | Top Bar & Zone Indicator | DONE | `feat/FORGE-016-top-bar` |
| FORGE-017 | Zone Detection System | DONE | `feat/FORGE-017-zone-detection` |
| FORGE-018 | Zone Flash & XP Bar | DONE | `feat/FORGE-018-zone-flash-xp` |
| FORGE-019 | Interaction System (Raycaster + Prompt) | DONE | `feat/FORGE-019-interaction-system` |
| FORGE-020 | Detail Panel | DONE | `feat/FORGE-020-detail-panel` |
| FORGE-021 | Minimap | DONE | `feat/FORGE-021-minimap` |
| FORGE-022 | Controls HUD & Quick Nav | DONE | `feat/FORGE-022-controls-quicknav` |
| FORGE-023 | HUD Compositor | DONE | `feat/FORGE-023-hud-compositor` |

### PHASE 5: Polish & Performance
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| FORGE-024 | Post-Processing & Shader Polish | DONE | `feat/FORGE-024-post-processing` |
| FORGE-025 | Accessibility & 2D Fallback | DONE | `feat/FORGE-025-accessibility-fallback` |
| FORGE-026 | Performance Optimization | DONE | `chore/FORGE-026-performance` |

### PHASE 6: Deployment
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| FORGE-027 | Vercel Deployment & Domain | TODO | `chore/FORGE-027-deployment` |

### PHASE UX-1: Navigation Overhaul
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| UX-001 | Arrow Keys + Click-to-Walk | DONE | `feat/UX-001-navigation-overhaul` |
| UX-002 | Orbit-Style Camera (Remove Pointer Lock) | DONE | `feat/UX-002-orbit-camera` |
| UX-003 | Persistent Navigation Bar | DONE | `feat/UX-003-nav-bar` |

### PHASE UX-2: Zone Clarity & Labeling
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| UX-004 | Floating Zone Title Signs | DONE | `feat/UX-004-zone-labels` |
| UX-005 | Project Labels & Tier Badges | DONE | `feat/UX-005-project-labels` |
| UX-006 | Skill Node Labels & Category Headers | TODO | `feat/UX-006-skill-labels` |
| UX-007 | Timeline Era Labels & Narrative Cards | TODO | `feat/UX-007-timeline-labels` |
| UX-008 | War Room Project Status Cards | TODO | `feat/UX-008-warroom-labels` |

### PHASE UX-3: Onboarding & Guided Experience
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| UX-009 | Guided Intro Tour (First Visit) | TODO | `feat/UX-009-intro-tour` |
| UX-010 | Contextual Tooltips & Hover States | TODO | `feat/UX-010-hover-tooltips` |
| UX-011 | Click-to-Interact (Replace E Key) | TODO | `feat/UX-011-click-interact` |

### PHASE UX-4: Information Architecture & Contact
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| UX-012 | Welcome Zone (Hearth) — Bio & Resume | TODO | `feat/UX-012-hearth-bio` |
| UX-013 | Contact Section / Modal | TODO | `feat/UX-013-contact-modal` |
| UX-014 | Project Detail Panel — Enhanced | TODO | `feat/UX-014-enhanced-detail` |

### PHASE UX-5: Accessibility, Performance & Polish
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| UX-015 | Loading Screen with Progress | TODO | `feat/UX-015-loading-screen` |
| UX-016 | Responsive Design & Mobile Experience | TODO | `feat/UX-016-responsive-mobile` |
| UX-017 | Keyboard Accessibility & Screen Reader | TODO | `feat/UX-017-accessibility` |
| UX-018 | Social Preview & Meta Tags | TODO | `feat/UX-018-social-meta` |

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
