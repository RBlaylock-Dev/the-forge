# THE FORGE — UX Overhaul Tickets

## Problem Statement

The Forge is visually impressive but requires too much prior knowledge to navigate. Visitors (recruiters, clients, hiring managers) are not gamers — they shouldn't need to learn controls, guess what zones are, or figure out how to interact with objects. A senior engineer's portfolio should feel effortless: every visitor should understand exactly what they're looking at and how to explore within 3 seconds of entering.

## UX Principles for This Overhaul

1. **Zero learning curve.** If someone has used a website before, they can use this.
2. **Click everything.** Mouse click is the universal interaction — not keyboard shortcuts.
3. **Label everything.** If it's not labeled, it doesn't exist to the visitor.
4. **Guide, don't assume.** Show people where to go and what to do.
5. **Escape hatch always available.** Visitors who don't want 3D can still get the info.
6. **Mobile-aware.** Touch users exist. Plan for them even if full mobile comes later.

---

## PHASE UX-1: Navigation Overhaul

_Remove the gamer-style controls. Make navigation feel like a polished product, not a video game._

---

### UX-001: Replace WASD with Arrow Keys + Click-to-Walk

**User Story:**
As a visitor with no gaming background, I need to move through the world using arrow keys and clicking on the ground so that navigation feels natural without memorizing game controls.

**Acceptance Criteria:**
- [ ] Arrow keys (↑↓←→) replace WASD as the primary movement input
- [ ] WASD still works as a secondary/hidden option for people who try it, but is NOT shown in the UI
- [ ] Click-to-walk: clicking on the ground or near a zone marker smoothly moves the player toward that point (lerp/tween, not teleport)
- [ ] Click-to-walk uses a visible destination indicator — a subtle glowing ring or pulse on the ground where the player clicked, so they know their click registered
- [ ] Movement is slightly slower than current (reduce from 8 to 6 units/sec) for a more controlled, less "FPS game" feel
- [ ] Camera auto-rotates to face the direction of movement when using click-to-walk
- [ ] Double-click on a zone marker or its label = fast-travel to that zone (smooth camera fly, 1.5s duration)

**Why:** WASD is second nature to gamers but completely foreign to most professionals. Arrow keys are universally understood. Click-to-walk is how every modern 3D product experience works (Google Earth, virtual tours, museum walkthroughs).

**Files Changed:**
- `src/player/useMovement.ts`
- `src/player/PlayerController.tsx`
- New: `src/player/useClickToWalk.ts`

**Branch:** `feat/UX-001-navigation-overhaul`

---

### UX-002: Replace Pointer Lock with Orbit-Style Camera

**User Story:**
As a visitor, I need to look around by clicking and dragging (or scrolling to zoom) instead of having my cursor locked and hidden so that the experience feels like a website, not a first-person shooter.

**Acceptance Criteria:**
- [ ] Remove pointer lock entirely — cursor is always visible
- [ ] Camera control: click + drag to rotate view (orbit-style, not FPS-style)
- [ ] Scroll wheel to zoom in/out (clamped to reasonable range — don't let them zoom through the floor or into space)
- [ ] Right-click + drag for panning (optional, lower priority)
- [ ] Camera has a slight downward angle by default (~15-20°) so visitors can see the ground paths and zone layouts — more of an "adventure game" perspective than strict first-person
- [ ] Camera follows player position but rotation is independent (player walks forward relative to camera facing direction)
- [ ] On mobile/touch: single finger drag to rotate, pinch to zoom, tap to walk
- [ ] Cursor changes to `grab` when hovering empty space, `pointer` when hovering interactables
- [ ] Remove the crosshair entirely — it's an FPS element that doesn't belong

**Why:** Pointer lock is disorienting for non-gamers. It hides their cursor, traps their mouse, and feels aggressive. Orbit camera is what every 3D product configurator, virtual tour, and Google Maps uses. It's what people expect.

**Files Changed:**
- `src/player/useMovement.ts`
- `src/player/PlayerController.tsx`
- Remove: `src/hud/Crosshair.tsx`
- Updated `src/hud/HUD.tsx`

**Branch:** `feat/UX-002-orbit-camera`

---

### UX-003: Persistent Navigation Bar

**User Story:**
As a visitor, I need a clear, always-visible navigation bar with labeled zone names so that I can jump to any section instantly, just like a normal website.

**Acceptance Criteria:**
- [ ] Fixed navigation bar at the bottom of the screen (replaces the old quick-nav dots)
- [ ] 5 clearly labeled buttons: **Home** | **Skills** | **Projects** | **Career** | **Now Building**
  - (These are human-friendly names, not "Hearth", "Skill Tree", "Vault", "Timeline", "War Room" — save the thematic names for the zone headers)
- [ ] Each button has a small icon or visual indicator (subtle, not emoji)
- [ ] Active zone button is highlighted (gold fill + glow)
- [ ] Clicking a nav button: smooth camera fly to that zone (1.5-2s animated transition with easing)
- [ ] During the camera fly, player input is temporarily disabled (prevents disorienting movement mid-transition)
- [ ] Nav bar has frosted glass / backdrop-blur styling consistent with the forge aesthetic
- [ ] Nav bar is responsive: on smaller screens, icons only with labels on hover/tap
- [ ] Keyboard accessible: Tab to focus, Enter to navigate
- [ ] Current section updates in the nav as the player walks between zones manually

**Why:** The quick-nav dots were cryptic — unlabeled circles that require hovering to understand. A real nav bar is what every website has. Visitors shouldn't have to "discover" how to get to your projects.

**Files Changed:**
- Replace `src/hud/QuickNav.tsx` → `src/hud/NavBar.tsx`
- Updated `src/hud/HUD.tsx`
- Updated `src/store/useForgeStore.ts` (add navigation transition state)

**Branch:** `feat/UX-003-nav-bar`

---

## PHASE UX-2: Zone Clarity & Labeling

_Make every zone immediately identifiable. No visitor should ever wonder "what is this area?"_

---

### UX-004: Floating Zone Title Signs

**User Story:**
As a visitor walking through the world, I need to see large, clear zone titles floating above each area so that I always know what I'm looking at before I even arrive.

**Acceptance Criteria:**
- [ ] Each zone has a floating 3D text label or HTML overlay label anchored to its world position
- [ ] Labels are visible from a distance (start appearing when player is within ~20 units)
- [ ] Label text uses human-friendly names:
  - Hearth → **"Welcome"** or **"Robert Blaylock"**
  - Skill Tree → **"Skills & Expertise"**
  - Vault → **"Projects"**
  - Timeline → **"Career Journey"**
  - War Room → **"Currently Building"**
- [ ] Labels use Cinzel font, gold color, with subtle text shadow/glow
- [ ] Labels billboard toward the camera (always face the player) using Drei's `<Html>` or `<Billboard>` component
- [ ] Labels scale down slightly with distance so they don't overwhelm when you're far away
- [ ] Labels include a subtle subtitle line:
  - Skills: "Technologies I work with"
  - Projects: "12 shipped projects"
  - Career: "From leadership to engineering"
  - Currently Building: "4 active projects"
- [ ] Labels fade in as the player approaches and are fully opaque when within the zone radius

**Why:** In the current build, you have to physically walk into a zone and read the HUD to know where you are. That's backwards — labels should tell you what a section is BEFORE you get there, just like section headers on a normal portfolio.

**Files Created:**
- `src/objects/ZoneLabel.tsx`
- Updated each zone component to include `<ZoneLabel />`

**Branch:** `feat/UX-004-zone-labels`

---

### UX-005: Project Labels & Tier Badges on Pedestals

**User Story:**
As a visitor in the Project Vault, I need to see each project's name and tier floating above its pedestal without clicking anything so that I can browse projects at a glance.

**Acceptance Criteria:**
- [ ] Every project pedestal has a floating label with the project name
- [ ] Label appears when the player is within ~8 units of the project artifact
- [ ] Tier badge displayed below the name: colored pill/tag showing LEGENDARY, EPIC, RARE, or COMMON in the tier color
- [ ] Labels billboard toward the camera
- [ ] Labels are readable (minimum 12px equivalent, good contrast against the dark environment)
- [ ] When the player looks at a project artifact, the label brightens / scales up slightly to indicate it's clickable
- [ ] Labels don't overlap each other — stagger vertical positions if projects are close together
- [ ] Optional: show 1-2 primary tech tags below the tier badge (e.g., "Three.js · Vue.js")

**Why:** The current vault requires you to walk up to each artifact and press E to find out what it is. That's a treasure hunt, not a portfolio. Recruiters need to scan quickly.

**Files Changed:**
- `src/zones/ProjectVault.tsx`
- New: `src/objects/ProjectLabel.tsx`

**Branch:** `feat/UX-005-project-labels`

---

### UX-006: Skill Node Labels & Category Headers

**User Story:**
As a visitor in the Skill Tree zone, I need to see skill names and proficiency levels displayed on or near each node so that I can understand Robert's expertise without clicking every node.

**Acceptance Criteria:**
- [ ] Each skill category (Frontend, Backend, DevOps) has a clear header label floating near its main node
- [ ] Individual skill sub-nodes show their name on hover/proximity (within 4 units)
- [ ] Proficiency is visually obvious: node size + a small level indicator (⚒ symbols or a "Level 5" label)
- [ ] Category headers are always visible when player is in the Skill Tree zone
- [ ] Color-coded consistently: Frontend = teal, Backend = blue, DevOps = orange
- [ ] A legend or key is visible somewhere explaining what the levels mean (e.g., "⚒⚒⚒⚒⚒ = Expert")
- [ ] Clicking a category node still opens the detail panel with the full skill list

**Why:** Cryptic glowing orbs don't communicate "I know React at an expert level." The 3D is the wow factor; the labels are the information.

**Files Changed:**
- `src/zones/SkillTree.tsx`
- New: `src/objects/SkillLabel.tsx`

**Branch:** `feat/UX-006-skill-labels`

---

### UX-007: Timeline Era Labels & Narrative Cards

**User Story:**
As a visitor in the Timeline zone, I need to see era names, date ranges, and a one-sentence narrative at each stop along the path so that I can follow the career journey without clicking each marker.

**Acceptance Criteria:**
- [ ] Each timeline marker has a floating card/label with:
  - Era title (e.g., "Restaurant GM")
  - Organization (e.g., "Taco Bell")
  - Date range (e.g., "2011–2017")
  - One-line skill gained (e.g., "Leadership & Operations")
- [ ] Cards are visible when player is within the Timeline zone
- [ ] Cards are staggered alternating left/right of the path to avoid overlap
- [ ] Active/closest era card is highlighted (slightly larger, brighter border)
- [ ] A subtle connecting line or arrow between eras shows progression direction
- [ ] The path itself could have year markers or milestone dots
- [ ] Clicking a marker still opens the full detail panel for deeper context

**Why:** A timeline that requires clicking each node to understand defeats the purpose. The story should be readable just by walking along the path.

**Files Changed:**
- `src/zones/Timeline.tsx`
- New: `src/objects/TimelineCard.tsx`

**Branch:** `feat/UX-007-timeline-labels`

---

### UX-008: War Room Project Status Cards

**User Story:**
As a visitor in the War Room, I need to see project names and status labels on each holographic projection so that I immediately know what Robert is currently building.

**Acceptance Criteria:**
- [ ] Each holographic projection has a floating label: project name + status badge ("In Development" / "Active")
- [ ] Labels are styled to match the holographic/sci-fi aesthetic (cyan tint, slight transparency)
- [ ] Brief one-line description visible without clicking
- [ ] Labels billboard toward camera
- [ ] Clicking still opens detail panel for full description

**Why:** Wireframe shapes spinning above a table look cool but communicate nothing. Labels turn decoration into information.

**Files Changed:**
- `src/zones/WarRoom.tsx`
- New: `src/objects/HoloLabel.tsx`

**Branch:** `feat/UX-008-warroom-labels`

---

## PHASE UX-3: Onboarding & Guided Experience

_Don't drop visitors into a 3D world and hope they figure it out. Guide them._

---

### UX-009: Guided Intro Tour (First Visit)

**User Story:**
As a first-time visitor, I need a brief guided tour that shows me the layout and how to navigate so that I can confidently explore the portfolio without confusion.

**Acceptance Criteria:**
- [ ] After clicking "Enter the Forge," a brief intro sequence plays (optional skip button)
- [ ] Sequence: camera smoothly flies through each zone (3-4 seconds per zone) with a text overlay:
  1. Start at Hearth: "Welcome to The Forge — Robert Blaylock's interactive portfolio"
  2. Fly to Skills zone: "Explore skills and expertise"
  3. Fly to Projects zone: "Browse 12 shipped projects"
  4. Fly to Timeline: "Follow the career journey"
  5. Fly to War Room: "See what's being built right now"
  6. Return to Hearth: "Click any section to explore — or use the navigation bar below"
- [ ] Each step shows a small tooltip pointing at the relevant nav bar button, connecting the 3D zone to the nav
- [ ] Total duration: 15-20 seconds max
- [ ] Skip button visible at all times: "Skip Tour →"
- [ ] After tour completes (or is skipped), player gains full control at the Hearth
- [ ] Tour only plays on first visit (store a flag in localStorage)
- [ ] Returning visitors go straight to the world

**Why:** Virtual tours, museum apps, and 3D product experiences ALL have onboarding. Dropping someone into a 3D world with no context is the #1 reason they'll bounce in 3 seconds.

**Files Created:**
- `src/hud/IntroTour.tsx`
- `src/canvas/useCameraFlythrough.ts`
- Updated `src/store/useForgeStore.ts` (tour state)

**Branch:** `feat/UX-009-intro-tour`

---

### UX-010: Contextual Tooltips & Hover States

**User Story:**
As a visitor, I need clear visual feedback when I hover over interactive objects (cursor change, glow, tooltip) so that I know what's clickable without guessing.

**Acceptance Criteria:**
- [ ] Cursor changes to `pointer` when hovering any interactable object (project artifact, skill node, timeline marker, war room hologram)
- [ ] Cursor is `grab` when hovering empty space (indicating drag-to-rotate)
- [ ] Cursor is `grabbing` while actively dragging to rotate
- [ ] Interactable objects: glow brightens + subtle scale-up (1.05x) on hover
- [ ] A small tooltip appears near the cursor showing the object name: "Click to view: Derksen 3D Configurator"
- [ ] Tooltip follows cursor position (offset slightly so it doesn't cover the object)
- [ ] Tooltip fades in quickly (200ms) and fades out when hover ends
- [ ] Tooltip styled consistently with forge aesthetic (dark bg, amber text, subtle border)
- [ ] On touch devices: first tap highlights + shows tooltip, second tap opens detail panel
- [ ] Nav bar buttons show hover labels on desktop

**Why:** Hover states are the universal language of "this is clickable." Without them, interactive objects look identical to decorative objects.

**Files Created:**
- `src/hud/CursorTooltip.tsx`
- `src/player/useHoverDetection.ts`
- Updated `src/player/useInteraction.ts`

**Branch:** `feat/UX-010-hover-tooltips`

---

### UX-011: Click-to-Interact (Replace E Key)

**User Story:**
As a visitor, I need to click on objects to open their detail panels instead of pressing the E key so that interaction works like every other website.

**Acceptance Criteria:**
- [ ] Single click on any interactable object opens its detail panel
- [ ] E key interaction completely removed from UI hints (but can remain as hidden shortcut)
- [ ] Click detection uses R3F's `onPointerDown` or raycaster on click event
- [ ] Clicking on non-interactable areas: does NOT open panels (only triggers click-to-walk or camera rotation)
- [ ] Interaction priority: clicking an interactable object takes priority over click-to-walk
- [ ] Detail panel opens with the same slide-in animation
- [ ] Detail panel has a clear "✕ Close" button AND clicking outside the panel closes it
- [ ] Pressing ESC also closes the panel
- [ ] Remove "[E] Inspect" prompt — replace with cursor/tooltip feedback (UX-010)
- [ ] Remove the Controls HUD panel (bottom-left keybind hints) — navigation should be self-evident

**Why:** Nobody presses "E" on a website. Click is universal. The entire controls HUD was a signal that the UX wasn't intuitive enough — if you need instructions, the design needs work.

**Files Changed:**
- `src/player/useInteraction.ts`
- Remove: `src/hud/InteractPrompt.tsx`
- Remove: `src/hud/ControlsHUD.tsx`
- Updated `src/hud/HUD.tsx`
- Updated zone components (add onClick handlers to interactable meshes)

**Branch:** `feat/UX-011-click-interact`

---

## PHASE UX-4: Information Architecture & Contact

_Make sure the portfolio actually communicates what a recruiter needs. Add what's missing._

---

### UX-012: Welcome Zone (Hearth) — Bio & Resume

**User Story:**
As a recruiter visiting the portfolio, I need to immediately see who Robert is, what he does, and have access to his resume so that I can decide in 10 seconds if I want to explore further.

**Acceptance Criteria:**
- [ ] The Hearth zone has a prominent floating info card / billboard with:
  - Name: Robert Blaylock
  - Title: Senior Full Stack Developer & 3D Software Engineer
  - Location: Counce, TN
  - One-liner: "Building production 3D experiences, full-stack platforms, and everything in between."
  - Quick stats: "12+ Projects · 5 Years Engineering · 3D & WebGL Specialist"
- [ ] Action buttons on the card:
  - "View Resume" (opens PDF or downloads)
  - "Contact Me" (scrolls to or opens contact section/modal)
  - "LinkedIn ↗" (external link)
  - "GitHub ↗" (external link)
- [ ] Card is visible immediately when the player enters / spawns
- [ ] Card is styled as a floating element in 3D space (using Drei `<Html>`) or as a HUD overlay at the Hearth
- [ ] Resume is available as a downloadable PDF in `/public/resume.pdf`
- [ ] Professional headshot or logo visible (optional, if Robert wants)

**Why:** Every portfolio needs a clear "who is this person" section front and center. The current Hearth is atmospheric but communicates nothing about Robert. A recruiter who can't find a resume in 5 seconds will leave.

**Files Changed:**
- `src/zones/Hearth.tsx`
- New: `src/objects/BioCard.tsx`
- Add: `public/resume.pdf`

**Branch:** `feat/UX-012-hearth-bio`

---

### UX-013: Contact Section / Modal

**User Story:**
As a potential client or recruiter, I need a clear way to contact Robert (email, phone, or form) accessible from anywhere in the portfolio so that I can reach out without hunting for contact info.

**Acceptance Criteria:**
- [ ] "Contact" button in the nav bar (6th item, or floating action button)
- [ ] Clicking opens a modal overlay (not a 3D zone — contact should be fast)
- [ ] Modal contains:
  - Email: robert@rblaylock.dev (clickable mailto link)
  - Phone: +1 (731) 300-8706 (clickable tel link)
  - LinkedIn profile link
  - GitHub profile link
  - Optional: simple contact form (name, email, message) — can use Formspree or similar
- [ ] Modal styled in forge aesthetic (dark glass, amber accents)
- [ ] Close via ✕ button, clicking outside, or ESC
- [ ] Contact info is also present on the Hearth bio card (UX-012)
- [ ] Accessible: proper form labels, focus management when modal opens

**Files Created:**
- `src/hud/ContactModal.tsx`
- Updated `src/hud/NavBar.tsx`
- Updated `src/hud/HUD.tsx`

**Branch:** `feat/UX-013-contact-modal`

---

### UX-014: Project Detail Panel — Enhanced

**User Story:**
As a recruiter or client viewing a project, I need to see a rich project detail with screenshot, description, my role, key achievements, and links so that I can evaluate the quality of Robert's work.

**Acceptance Criteria:**
- [ ] Detail panel for projects is enhanced to include:
  - Project screenshot/thumbnail (loaded from `/public/images/projects/`)
  - Project name + tier badge
  - One-paragraph description
  - "My Role" section (1-2 sentences on what Robert specifically did)
  - Tech stack tags
  - "Live Demo ↗" button (if available)
  - "View Code ↗" button (if available / public)
- [ ] Screenshot takes up the top third of the panel
- [ ] Panel is wider on desktop (440px) to accommodate the richer content
- [ ] Panel is scrollable if content exceeds viewport height
- [ ] Data model updated: `Project` interface gains optional `screenshot`, `role`, fields
- [ ] At minimum, top 5 projects (Derksen, ShareXR, UpCurve, Redeemly, Stor-It) should have screenshots and role descriptions populated

**Why:** The current detail panel is text-only. A portfolio without screenshots is like a photography portfolio without photos. Recruiters want to SEE the work.

**Files Changed:**
- `src/hud/DetailPanel.tsx`
- `src/types/index.ts` (updated Project interface)
- `src/data/projects.ts` (add screenshot paths and role descriptions)
- Add: `public/images/projects/*.jpg`

**Branch:** `feat/UX-014-enhanced-detail`

---

## PHASE UX-5: Accessibility, Performance & Professional Polish

_The difference between "impressive demo" and "this person is a senior engineer" is in the polish._

---

### UX-015: Loading Screen with Progress

**User Story:**
As a visitor, I need to see a polished loading screen with real progress indication while the 3D assets load so that I know the site is working and don't bounce during the load.

**Acceptance Criteria:**
- [ ] Loading screen appears immediately (SSR or lightweight first paint)
- [ ] Shows: forge brand, "Igniting the Forge..." text, progress bar
- [ ] Progress bar reflects REAL loading progress (use R3F/Drei `useProgress` hook)
- [ ] Loading screen transitions smoothly to the start overlay / intro tour when complete
- [ ] If loading takes > 5 seconds, show a reassuring message: "Loading 3D experience..."
- [ ] If WebGL is not supported, show fallback message immediately with link to 2D version
- [ ] Loading screen is styled consistently with forge aesthetic
- [ ] No flash of unstyled content or empty black screen

**Files Created:**
- `src/hud/LoadingScreen.tsx`
- Updated `src/canvas/ForgeCanvas.tsx`

**Branch:** `feat/UX-015-loading-screen`

---

### UX-016: Responsive Design & Mobile Experience

**User Story:**
As a visitor on a tablet or phone, I need the portfolio to be usable with touch controls and a responsive layout so that the experience doesn't break on smaller screens.

**Acceptance Criteria:**
- [ ] Touch controls: drag to rotate, tap to walk, tap objects to inspect, pinch to zoom
- [ ] Nav bar: responsive — collapses to icons only on small screens, full labels on desktop
- [ ] Detail panel: slides up from bottom on mobile instead of from the right
- [ ] Zone labels and project labels: scale appropriately for mobile viewports
- [ ] Minimap: hidden on mobile (or replaced with a simpler zone indicator)
- [ ] Contact modal: full-screen on mobile
- [ ] Loading screen: responsive text sizing
- [ ] Performance: reduce particle count on mobile (detect via `navigator.hardwareConcurrency` or viewport width)
- [ ] Disable post-processing bloom on mobile for performance
- [ ] Test on: iPhone Safari, Android Chrome, iPad

**Files Changed:**
- Multiple HUD components (responsive Tailwind classes)
- `src/player/useMovement.ts` (touch input)
- `src/canvas/ForgeCanvas.tsx` (mobile perf adjustments)

**Branch:** `feat/UX-016-responsive-mobile`

---

### UX-017: Keyboard Accessibility & Screen Reader Support

**User Story:**
As a visitor using keyboard navigation or a screen reader, I need the portfolio's 2D interface elements to be fully accessible so that the information is available to everyone.

**Acceptance Criteria:**
- [ ] All nav bar buttons are keyboard focusable (Tab) and activatable (Enter)
- [ ] Detail panel: focus trapped when open, close button focusable, ESC to close
- [ ] Contact modal: focus trapped when open, proper aria labels on form fields
- [ ] Skip-to-content link: hidden visually but available for screen readers, jumps to a text-based content summary
- [ ] All images/screenshots have alt text
- [ ] ARIA labels on interactive HUD elements
- [ ] The 2D fallback page (FORGE-025) is fully screen reader compatible
- [ ] Color contrast: all text meets WCAG AA (4.5:1 ratio) — verify amber text on dark backgrounds
- [ ] Focus indicators: visible focus ring on all interactive elements (styled to match forge aesthetic, not default blue)

**Files Changed:**
- Multiple HUD components
- `src/components/Fallback2D.tsx`

**Branch:** `feat/UX-017-accessibility`

---

### UX-018: Social Preview & Meta Tags

**User Story:**
As a visitor sharing the portfolio link on LinkedIn, Twitter, or Slack, I need the link to show a rich preview (title, description, image) so that the share looks professional and enticing.

**Acceptance Criteria:**
- [ ] Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- [ ] Twitter Card tags: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
- [ ] OG image: a designed 1200×630 image showing The Forge branding (create in Figma or generate)
- [ ] Title: "Robert Blaylock — Senior Full Stack & 3D Engineer"
- [ ] Description: "Explore an interactive 3D portfolio showcasing 12+ shipped projects, from production building configurators to WebGL experiences."
- [ ] Favicon: custom forge-themed favicon (anvil, flame, or RB logo)
- [ ] Structured data (JSON-LD): Person schema with name, jobTitle, url, sameAs (LinkedIn, GitHub)
- [ ] Verify preview renders correctly on: LinkedIn, Twitter/X, Slack, iMessage, Discord

**Files Changed:**
- `src/app/layout.tsx`
- Add: `public/og-image.png`
- Add: `public/favicon.ico` (+ `favicon.svg`, `apple-touch-icon.png`)

**Branch:** `feat/UX-018-social-meta`

---

## Ticket Dependency Graph

```
PHASE UX-1 (Navigation) — Do these FIRST, they change core mechanics
  UX-001 (Arrow keys + click-to-walk)
  UX-002 (Orbit camera, remove pointer lock)
  UX-003 (Nav bar)
  ↑ These three must be done together — they replace the movement system

PHASE UX-2 (Labeling) — Can be done in parallel
  UX-004 (Zone labels)
  UX-005 (Project labels)
  UX-006 (Skill labels)
  UX-007 (Timeline labels)
  UX-008 (War Room labels)

PHASE UX-3 (Onboarding & Interaction)
  UX-009 (Intro tour) — depends on UX-003 (nav bar exists to reference)
  UX-010 (Hover/tooltips) — depends on UX-002 (cursor is visible)
  UX-011 (Click-to-interact) — depends on UX-002, UX-010

PHASE UX-4 (Content & Contact)
  UX-012 (Bio card) — independent
  UX-013 (Contact modal) — depends on UX-003 (nav bar)
  UX-014 (Enhanced detail panel) — depends on UX-011

PHASE UX-5 (Polish)
  UX-015 (Loading screen) — independent
  UX-016 (Mobile) — depends on UX-001, UX-002, UX-003
  UX-017 (Accessibility) — depends on all HUD components
  UX-018 (Social meta) — independent
```

---

## Suggested Build Order

```
SESSION 1 — Navigation Revolution (do all three together)
  UX-001 → UX-002 → UX-003
  Test: Can you navigate the entire world with just mouse + nav bar? Good.

SESSION 2 — Label Everything
  UX-004 → UX-005 → UX-006 → UX-007 → UX-008
  Test: Walk through every zone. Can you understand everything WITHOUT clicking? Good.

SESSION 3 — Interaction Polish
  UX-010 → UX-011
  Test: Is it obvious what's clickable? Does clicking work everywhere? Good.

SESSION 4 — First Impressions
  UX-015 → UX-009
  Test: Fresh browser, no cache. Is the loading → tour → explore flow smooth? Good.

SESSION 5 — Content Completeness
  UX-012 → UX-013 → UX-014
  Test: Can a recruiter find: who you are, your projects (with screenshots), your resume, and how to contact you? All within 30 seconds? Good.

SESSION 6 — Ship Quality
  UX-016 → UX-017 → UX-018
  Test: Open on phone. Share the link on LinkedIn. Tab through with keyboard. All work? Ship it.
```

---

## What Gets Removed

These elements from the original build should be REMOVED as part of this overhaul:

| Remove | Why | Replaced By |
|--------|-----|-------------|
| Pointer lock | Traps cursor, FPS-game feel | Orbit camera (UX-002) |
| Crosshair | FPS element | Cursor states (UX-010) |
| `[E] Inspect` prompt | Keyboard shortcut nobody knows | Click + tooltip (UX-010, UX-011) |
| Controls HUD (WASD/E/ESC) | If you need instructions, design failed | Self-evident navigation (UX-001, UX-003) |
| Quick Nav dots | Cryptic, unlabeled | Nav bar with labels (UX-003) |
| WASD as primary | Gamer-only | Arrow keys + click-to-walk (UX-001) |

---

## The "Recruiter Test"

After all UX tickets are complete, the portfolio should pass this test:

> **Give the URL to someone who has never seen it, has no gaming experience, and is browsing on a work laptop. Time them.**
>
> - [ ] Within **3 seconds**: They understand it's a portfolio and see Robert's name/title
> - [ ] Within **10 seconds**: They know how to navigate (nav bar or clicking)
> - [ ] Within **30 seconds**: They've opened at least one project detail
> - [ ] Within **60 seconds**: They've found the resume and contact info
> - [ ] Within **2 minutes**: They've browsed projects, skills, and career — and they remember this portfolio
>
> **If any of these fail, the UX isn't done.**
