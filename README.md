# The Forge

An interactive, gamified 3D portfolio built with **Next.js 14**, **React Three Fiber**, and **TypeScript**. Visitors explore a first-person walkable world with a dark forge/fire & metal aesthetic — five interconnected zones in a single continuous 3D scene, no page transitions.

> The portfolio itself IS the proof — every second a visitor spends on the site, they're experiencing Three.js, WebGL, and React expertise firsthand.

**Live:** [rblaylock.dev](https://www.rblaylock.dev)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| 3D Engine | React Three Fiber + Drei |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Animation | R3F useFrame + Framer Motion |
| Shaders | Custom GLSL |
| Hosting | Vercel |

## The World

```
                War Room (North) — cyan
                     |
Skill Tree (West) — HEARTH (Center) — Project Vault (East)
     teal              |    amber/fire        bronze
                       |
                  Timeline (South) — purple
```

- **The Hearth** — Central forge with anvil, fire pit, ember particles, and torch pillars
- **The Skill Tree** — Branching crystal structure with glowing nodes for Frontend, Backend, and DevOps skills
- **The Project Vault** — 12 projects on pedestals with tier-colored glow rings and floating artifacts
- **The Timeline** — Career journey from Restaurant GM (2011) to Senior Engineer (2025+)
- **The War Room** — Holographic command table with wireframe projections of active projects

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrows | Move |
| Mouse | Look around |
| E | Inspect object |
| ESC | Release cursor |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## Project Structure

```
src/
├── app/           # Next.js App Router
├── canvas/        # R3F canvas + scene orchestration
├── player/        # First-person controller
├── zones/         # One component per zone
├── objects/       # Reusable 3D primitives
├── hud/           # 2D overlay UI
├── shaders/       # Custom GLSL
├── store/         # Zustand state
├── data/          # Content config files
└── types/         # TypeScript types
```

## Author

**Robert Blaylock** — Senior Full Stack Developer & 3D Software Engineer

- GitHub: [@RBlaylock-Dev](https://github.com/RBlaylock-Dev)
- Portfolio: [rblaylock.dev](https://www.rblaylock.dev)
