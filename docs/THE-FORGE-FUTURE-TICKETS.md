# THE FORGE — Future Features Ticket Specifications

> 25 tickets across 3 tiers. Each ticket follows The Forge engineering standards.
> Add these to the AI Build Guide ticket tracker under **PHASE FUTURE**.
> All tickets depend on FORGE-027 (Vercel Deployment) being complete.

---

## PHASE FUTURE-1: Game Changers

---

### F-001: AI Forge Assistant (Portfolio Guide)

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Critical |
| **Branch** | `feat/F-001-ai-forge-assistant` |
| **Depends On** | FORGE-020 (Detail Panel), FORGE-019 (Interaction System), UX-013 (Contact Modal) |
| **Effort** | 3–4 sessions |
| **New Files** | `src/objects/ForgeSpirit.tsx`, `src/hud/ChatPanel.tsx`, `src/hud/ChatBubble.tsx`, `app/api/chat/route.ts`, `src/data/ai-context.ts`, `src/store/useChatStore.ts` |
| **Modified Files** | `src/zones/HearthZone.tsx`, `src/hud/HudCompositor.tsx`, `src/types/index.ts` |

**Summary:** An AI-powered forge spirit (glowing ember character) that floats near the Hearth. Visitors can ask it questions about Robert's skills, projects, experience, and availability. Powered by Claude API with RAG context from portfolio data files.

**Acceptance Criteria:**

Data & API Layer:
- [ ] `src/data/ai-context.ts` aggregates all portfolio data (skills, projects, timeline, bio) into a structured prompt context
- [ ] `app/api/chat/route.ts` implements POST endpoint calling Anthropic Claude API
- [ ] System prompt includes forge personality: speaks with forge metaphors, stays on-topic about Robert
- [ ] API route is rate-limited (10 requests per minute per IP)
- [ ] API key stored as environment variable, never exposed client-side
- [ ] Responses stream via ReadableStream for real-time feel
- [ ] Context window includes: full skill inventory, project descriptions, timeline, bio, availability status

3D Spirit Object:
- [ ] `ForgeSpirit.tsx` renders a glowing ember orb (radius ~0.4) with animated particle trail
- [ ] Spirit hovers near the Hearth zone center at position (1, 1.5, 1)
- [ ] Idle animation: gentle float up/down (0.3 unit amplitude, 3s cycle)
- [ ] Interaction prompt appears on proximity: "Talk to the Forge Spirit"
- [ ] Spirit glows brighter when chat is active
- [ ] Spirit "looks at" the player (billboard rotation)

Chat Panel (HUD):
- [ ] `ChatPanel.tsx` opens as a slide-in panel (right side, 400px wide)
- [ ] Styled as forge parchment: dark background `#1a1511`, `#c4813a` accents, Rajdhani font
- [ ] Chat bubbles: visitor messages right-aligned (dark), spirit messages left-aligned (amber glow)
- [ ] Input field at bottom with send button and Enter key support
- [ ] Typing indicator: three pulsing ember dots
- [ ] Streaming response renders token-by-token
- [ ] Max 50 messages in history (oldest pruned)
- [ ] Close button returns to 3D exploration
- [ ] Panel has subtle ember particle border effect

Intelligence Features:
- [ ] Spirit can deep-link to zones: "Let me show you..." → triggers navigation to relevant zone
- [ ] Spirit surfaces specific skills when asked about technologies
- [ ] Spirit can generate a quick summary of Robert's fit for a described role
- [ ] Spirit deflects off-topic questions gracefully: "I only know about the smith who built this forge..."
- [ ] Spirit suggests contacting Robert for detailed discussions (links to contact modal)

Accessibility:
- [ ] Chat panel is fully keyboard navigable
- [ ] Screen reader announces new messages
- [ ] Focus trapped inside panel when open
- [ ] Escape closes panel

Performance:
- [ ] Spirit object: 1 mesh + 1 particle system, < 5 draw calls
- [ ] Chat API calls are debounced (300ms after typing stops)
- [ ] No client-side API key exposure

**Testing:**
- `ai-context.test.ts` — context aggregation produces valid prompt
- `ChatPanel.test.tsx` — renders, sends messages, displays responses
- `ForgeSpirit.test.tsx` — renders at correct position, responds to interaction
- `api/chat/route.test.ts` — rate limiting, error handling, streaming

---

### F-002: Live Code Playground

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | High |
| **Branch** | `feat/F-002-live-code-playground` |
| **Depends On** | FORGE-020 (Detail Panel), FORGE-012 (Project Vault Zone) |
| **Effort** | 2–3 sessions |
| **New Files** | `src/hud/CodePlayground.tsx`, `src/data/code-snippets.ts`, `src/types/code.ts` |
| **Modified Files** | `src/hud/DetailPanel.tsx`, `src/zones/ProjectVaultZone.tsx` |

**Summary:** An embedded code editor (Sandpack or Monaco) in the detail panel that lets visitors view and run curated code snippets from Robert's projects. Each snippet is tied to a Vault project.

**Acceptance Criteria:**

Code Editor:
- [ ] Sandpack (CodeSandbox embed) integrated as a React component
- [ ] Editor supports TypeScript, JavaScript, CSS, and HTML
- [ ] Live preview pane shows output in real-time
- [ ] Editor theme matches forge aesthetic (dark background, amber syntax highlights)
- [ ] Snippets are read-only by default with a "Try editing" toggle
- [ ] Editor is sandboxed — no access to parent page or network

Content:
- [ ] `src/data/code-snippets.ts` contains 8–12 curated snippets
- [ ] Each snippet has: `id`, `title`, `description`, `language`, `code`, `projectId`, `category`
- [ ] Categories: "3D Graphics", "React Patterns", "State Management", "API Design", "Database"
- [ ] Each snippet includes a 1–2 sentence annotation explaining the pattern
- [ ] Snippets are real, representative code (not toy examples)

Integration:
- [ ] Vault project detail panel shows "Code Samples" tab when snippets exist for that project
- [ ] Clicking a snippet opens the playground in expanded detail panel view
- [ ] Breadcrumb: Project Name → Code Sample Name
- [ ] "View on GitHub" link for each snippet (where applicable)

Accessibility:
- [ ] Editor is keyboard navigable (Sandpack handles this natively)
- [ ] Code is available as copyable plain text for screen readers
- [ ] Syntax highlighting respects `prefers-contrast`

Performance:
- [ ] Sandpack loaded lazily (dynamic import) — not in initial bundle
- [ ] Editor only mounts when tab is active
- [ ] Bundle size increase < 150KB gzipped

**Testing:**
- `code-snippets.test.ts` — all snippets have required fields, valid project references
- `CodePlayground.test.tsx` — renders editor, toggles edit mode, displays output

---

### F-003: Multiplayer Forge (Visitor Co-Presence)

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Medium |
| **Branch** | `feat/F-003-multiplayer-copresence` |
| **Depends On** | FORGE-007 (Player Movement), FORGE-027 (Deployment) |
| **Effort** | 4–5 sessions |
| **New Files** | `src/multiplayer/PresenceProvider.tsx`, `src/multiplayer/GhostPlayer.tsx`, `src/multiplayer/usePresence.ts`, `app/api/presence/route.ts` (or PartyKit server) |
| **Modified Files** | `src/canvas/ForgeCanvas.tsx`, `src/hud/HudCompositor.tsx`, `src/store/useForgeStore.ts` |

**Summary:** Other visitors appear as faint ember silhouettes in the world. Real-time position sync via WebSockets (PartyKit or Vercel Edge). Optional forge marks — glowing symbols that persist for 24 hours.

**Acceptance Criteria:**

Real-Time Sync:
- [ ] WebSocket connection established on scene load (PartyKit or Liveblocks)
- [ ] Player position + rotation broadcast at 10Hz (every 100ms)
- [ ] Position data: `{ x, y, z, rotY, zone, timestamp }`
- [ ] Graceful degradation: if WebSocket fails, portfolio works normally without multiplayer
- [ ] Auto-reconnect with exponential backoff
- [ ] Max 20 concurrent connections displayed (drop oldest if exceeded)

Ghost Players:
- [ ] `GhostPlayer.tsx` renders as a glowing orb (radius 0.3) with ember trail
- [ ] Orb color: warm amber `#e8a54b` at 40% opacity
- [ ] Position interpolation (lerp) for smooth movement between updates
- [ ] Fade in/out when players join/leave (0.5s transition)
- [ ] No names, no chat — pure anonymous presence
- [ ] Ghost players don't trigger zone detection or interaction prompts

Presence Indicator (HUD):
- [ ] Bottom-left HUD element: "🔥 3 explorers in The Forge"
- [ ] Count updates in real-time
- [ ] Subtle pulse animation when count changes
- [ ] Tooltip on hover: "Other visitors exploring right now"

Forge Marks (Optional v2):
- [ ] Interacting with the ground creates a small glowing symbol
- [ ] Symbol selection: 5 options (flame, star, hammer, heart, lightning)
- [ ] One-word message (max 20 chars, profanity filtered)
- [ ] Marks persist for 24 hours in database (Vercel KV or Supabase)
- [ ] Max 50 marks visible at once (newest replace oldest)
- [ ] Marks fade over time (opacity decreases linearly over 24h)

Security:
- [ ] No PII transmitted (no names, IPs hashed server-side)
- [ ] Rate limiting on WebSocket messages (max 15/second per client)
- [ ] Forge marks content-filtered before storage
- [ ] WebSocket connections authenticated with short-lived tokens

Performance:
- [ ] Ghost players use instanced meshes (single draw call for all ghosts)
- [ ] Position updates throttled to 10Hz
- [ ] Total additional bandwidth: < 1KB/second per player
- [ ] Forge marks loaded in single batch query on scene load

**Testing:**
- `usePresence.test.ts` — connection, disconnection, reconnect, throttling
- `GhostPlayer.test.tsx` — renders, interpolates position, fades in/out
- Stress test: simulate 20 concurrent connections locally

---

### F-004: Project Forge Replay (Git Visualization)

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Medium |
| **Branch** | `feat/F-004-forge-replay` |
| **Depends On** | FORGE-012 (Project Vault Zone), FORGE-020 (Detail Panel) |
| **Effort** | 4–5 sessions |
| **New Files** | `src/hud/ForgeReplay.tsx`, `src/objects/CodeCity.tsx`, `src/data/git-history/`, `scripts/parse-git-history.ts` |
| **Modified Files** | `src/hud/DetailPanel.tsx` |

**Summary:** Time-lapse visualization of git commit history rendered as a 3D "code city" — files are buildings, directories are blocks, commits are construction events. Playback with timeline scrubber.

**Acceptance Criteria:**

Data Pipeline:
- [ ] `scripts/parse-git-history.ts` extracts commit data from git repos (run at build time, not runtime)
- [ ] Output JSON: array of commits with `{ hash, date, message, filesChanged: [{ path, action, linesAdded, linesRemoved }] }`
- [ ] Pre-processed data stored in `src/data/git-history/[project-id].json`
- [ ] Initial projects: Derksen Configurator refactor, The Forge itself
- [ ] Data files < 500KB each (sampled if repo is too large)

3D Code City:
- [ ] `CodeCity.tsx` renders files as extruded blocks (height = line count, color = language)
- [ ] Directory structure mapped to spatial grouping (files in same dir are adjacent)
- [ ] Language colors: TypeScript `#3178c6`, JavaScript `#f7df1e`, CSS `#264de4`, Vue `#42b883`, HTML `#e34c26`
- [ ] New files animate in (scale up from 0)
- [ ] Deleted files animate out (scale down + fade)
- [ ] Modified files pulse briefly on the commit that changed them
- [ ] Annotated commits show floating label: "Refactored 7,000-line monolith"

Playback Controls:
- [ ] Timeline scrubber with play/pause
- [ ] Playback speed: 1x, 2x, 5x, 10x
- [ ] Current commit hash + message displayed
- [ ] Date displayed prominently
- [ ] Total commits / current position indicator
- [ ] Click anywhere on timeline to jump

Integration:
- [ ] Accessed via "Watch the Build" button in Vault project detail panel
- [ ] Opens as a full-screen overlay (not inline in detail panel)
- [ ] Close button returns to Vault
- [ ] Only available for projects with git history data

Performance:
- [ ] Max 500 file objects at any time (merge small files if needed)
- [ ] Use instanced meshes for file blocks
- [ ] Geometry updates batched per commit (not per file)
- [ ] Pre-computed layout (not calculated at runtime)

**Testing:**
- `parse-git-history.test.ts` — correctly parses sample git log
- `CodeCity.test.tsx` — renders correct number of blocks, animates additions/deletions
- `ForgeReplay.test.tsx` — playback controls, timeline scrubbing, speed adjustment

---

### F-005: Testimonials Forge Wall

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | High |
| **Branch** | `feat/F-005-testimonials-wall` |
| **Depends On** | FORGE-010 (Hearth Zone), FORGE-020 (Detail Panel) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/objects/TestimonialPlaque.tsx`, `src/data/testimonials.ts`, `src/types/testimonial.ts` |
| **Modified Files** | `src/zones/HearthZone.tsx`, `src/hud/DetailPanel.tsx` |

**Summary:** A wall of glowing plaques in the Hearth zone, each containing a testimonial from a colleague, client, or collaborator.

**Acceptance Criteria:**

Data:
- [ ] `src/data/testimonials.ts` contains 5–10 testimonials
- [ ] Each testimonial: `{ id, quote, author, role, company, relationship, linkedinUrl?, projectId? }`
- [ ] Relationship field: "colleague", "client", "mentor", "collaborator"
- [ ] At least one testimonial per relationship type

3D Objects:
- [ ] `TestimonialPlaque.tsx` renders as a metal plaque (0.8 x 0.5 units) on a wall surface
- [ ] Plaque has subtle ember glow at edges (category color based on relationship type)
- [ ] Glow intensifies on proximity/hover
- [ ] Author name engraved on plaque (3D text or texture)
- [ ] Plaques arranged in a semicircle on the Hearth zone's back wall
- [ ] Interactable via existing interaction system

Detail Panel:
- [ ] Full testimonial text displayed with quotation styling
- [ ] Author name, role, company prominently shown
- [ ] Relationship badge ("Colleague at Banyan Labs")
- [ ] Optional LinkedIn link
- [ ] If `projectId` exists, "Related Project" link → navigates to Vault

Accessibility:
- [ ] All testimonial text available to screen readers
- [ ] Keyboard navigable between plaques
- [ ] 2D fallback renders testimonials as a card carousel

**Testing:**
- `testimonials.test.ts` — data integrity, all required fields present
- `TestimonialPlaque.test.tsx` — renders, responds to interaction
- `DetailPanel.test.tsx` — testimonial variant renders correctly

---

## PHASE FUTURE-2: Strong Differentiators

---

### F-006: Weather System

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-006-weather-system` |
| **Depends On** | FORGE-024 (Post-Processing) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/objects/WeatherSystem.tsx`, `src/shaders/rain.glsl`, `src/shaders/lightning.glsl` |
| **Modified Files** | `src/canvas/ForgeCanvas.tsx`, `src/store/useForgeStore.ts` |

**Summary:** Dynamic weather that responds to real conditions at Counce, TN. Rain particles, lightning flashes, clear sky stars, or overcast mood lighting.

**Acceptance Criteria:**
- [ ] Fetch weather data from OpenWeatherMap API (free tier) via Next.js API route
- [ ] Cache weather data for 30 minutes (ISR or in-memory)
- [ ] Weather states: clear, cloudy, rain, storm, snow
- [ ] Clear: stars visible (point sprites), bright ambient
- [ ] Cloudy: muted lighting, no stars, slightly darker
- [ ] Rain: particle system with falling droplets, splash VFX on ground, subdued lighting
- [ ] Storm: rain + periodic lightning flash (screen-space post-process), distant thunder sound (if audio enabled)
- [ ] Snow: slow falling particles, cool blue ambient tint
- [ ] Transitions between states are smooth (5-second crossfade)
- [ ] Fallback: default to "clear" if API fails
- [ ] Weather doesn't block or obscure important 3D content
- [ ] Performance: weather particles reuse existing particle system, < 500 additional particles

**Testing:**
- `WeatherSystem.test.tsx` — renders correct state for each weather type, handles API failure

---

### F-007: Achievement System with Shareable Badges

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | High |
| **Branch** | `feat/F-007-achievement-badges` |
| **Depends On** | UX-021 (Forge Codex, from engagement doc) |
| **Effort** | 2–3 sessions |
| **New Files** | `src/hud/AchievementToast.tsx`, `src/hud/AchievementGallery.tsx`, `src/data/achievements.ts`, `src/store/useAchievementStore.ts`, `public/badges/` (SVG files) |
| **Modified Files** | `src/hud/HudCompositor.tsx`, `src/store/useForgeStore.ts` |

**Summary:** Visitors earn beautifully designed achievements for exploration milestones. Badges are shareable SVG images with URL watermark. Progress stored in localStorage.

**Acceptance Criteria:**

Achievement Definitions:
- [ ] `src/data/achievements.ts` defines 10–15 achievements
- [ ] Each achievement: `{ id, title, description, icon, rarity, condition, badgeSvg }`
- [ ] Rarity tiers: Common, Rare, Epic, Legendary (using existing tier colors)
- [ ] Achievements include:
  - "First Spark" — visited the Hearth (Common)
  - "Skill Scout" — explored all 5 skill categories (Rare)
  - "Vault Raider" — viewed all projects (Rare)
  - "Time Traveler" — explored full timeline (Rare)
  - "War Strategist" — viewed all War Room items (Rare)
  - "Forgemaster" — 100% Codex completion (Legendary)
  - "Secret Keeper" — found the hidden zone (Epic)
  - "Conversationalist" — asked the AI spirit 5 questions (Rare)
  - "Code Smith" — ran code in the playground (Rare)
  - "Night Owl" — visited between 10pm–4am local time (Epic)

State Management:
- [ ] `useAchievementStore.ts` (Zustand) tracks unlocked achievements + timestamps
- [ ] Persisted to localStorage (key: `forge-achievements`)
- [ ] Achievement conditions evaluated reactively from forge store state
- [ ] No duplicate unlocks

Toast Notification:
- [ ] `AchievementToast.tsx` slides in from top-right when achievement unlocked
- [ ] Shows badge icon, title, rarity, and brief description
- [ ] Forge-themed: dark parchment background, ember glow border
- [ ] Sound cue if audio enabled (metallic chime)
- [ ] Auto-dismisses after 5 seconds, click to dismiss early
- [ ] Stacks if multiple unlock simultaneously (rare edge case)

Achievement Gallery:
- [ ] Accessible via Codex or dedicated HUD button
- [ ] Grid of all achievements: unlocked shown in full color, locked shown as silhouettes with "???"
- [ ] Click unlocked badge to view full-size SVG
- [ ] "Share" button generates a PNG of the badge with rblaylock.dev watermark
- [ ] Progress bar: "7/15 achievements unlocked"

Badge Design:
- [ ] Each badge is a hand-crafted SVG in `public/badges/`
- [ ] Forge aesthetic: metallic frames, ember effects, Cinzel text
- [ ] Rarity affects visual treatment: Common (bronze), Rare (silver), Epic (purple glow), Legendary (gold with fire)
- [ ] All badges include small "rblaylock.dev" text

Accessibility:
- [ ] Toast announces to screen reader
- [ ] Gallery is keyboard navigable
- [ ] Alt text on all badge images

**Testing:**
- `achievements.test.ts` — all achievements have valid conditions, no duplicate IDs
- `useAchievementStore.test.ts` — unlock, persistence, no duplicates
- `AchievementToast.test.tsx` — renders, auto-dismisses, stacks

---

### F-008: Blog Forge (Content Zone)

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Medium |
| **Branch** | `feat/F-008-blog-forge` |
| **Depends On** | FORGE-010 (Hearth Zone), FORGE-020 (Detail Panel) |
| **Effort** | 2–3 sessions |
| **New Files** | `src/objects/BookShelf.tsx`, `src/objects/Tome.tsx`, `src/hud/ReadingPanel.tsx`, `src/data/blog-posts.ts` |
| **Modified Files** | `src/zones/HearthZone.tsx`, `src/hud/HudCompositor.tsx` |

**Summary:** A bookshelf in the Hearth zone displaying blog posts as glowing tomes. Interacting opens a reading panel with forge-themed typography.

**Acceptance Criteria:**
- [ ] `src/data/blog-posts.ts` contains metadata for 3–5 initial posts
- [ ] Each post: `{ id, title, date, category, excerpt, content (MDX string or import), readTime }`
- [ ] Categories: "Technical Deep Dive", "Project Retrospective", "Career Reflection"
- [ ] `BookShelf.tsx` renders 3D shelf object with `Tome.tsx` children
- [ ] Each tome has a glowing spine color based on category
- [ ] Latest post tome glows brightest with animated pulse
- [ ] Interacting opens `ReadingPanel.tsx` — full-screen overlay with article content
- [ ] Reading panel styled: Cinzel headers, Rajdhani body, dark parchment background
- [ ] Reading progress indicator (scroll percentage bar)
- [ ] "Back to Forge" button returns to 3D
- [ ] Blog content supports MDX (code blocks, images, headers, links)
- [ ] Future-proofed: data structure supports PayloadCMS or external CMS integration
- [ ] 2D fallback: standard blog list page

**Testing:**
- `blog-posts.test.ts` — data integrity
- `ReadingPanel.test.tsx` — renders MDX content, scroll progress works
- `Tome.test.tsx` — renders, interaction triggers panel

---

### F-009: Seasonal Forge Themes

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-009-seasonal-themes` |
| **Depends On** | FORGE-024 (Post-Processing) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/shaders/seasonal.glsl`, `src/objects/SeasonalEffects.tsx`, `src/utils/season.ts` |
| **Modified Files** | `src/canvas/ForgeCanvas.tsx`, `src/objects/EmberParticles.tsx` |

**Summary:** The forge subtly changes with real-world seasons — lighting, particle colors, ambient mood, and optional seasonal particles (leaves, snow, blossoms).

**Acceptance Criteria:**
- [ ] `src/utils/season.ts` determines current season from date + hemisphere
- [ ] Spring: greenish ambient tint `#4a6`, flower petal particles (10%), warmer key light
- [ ] Summer: golden hour lighting, heat shimmer distortion shader, bright ember particles
- [ ] Fall: deep orange ambient `#c64`, falling leaf particles mixed with embers, warm shadows
- [ ] Winter: cool blue tint `#68a`, frost shader on metal surfaces, snow particles mixed with embers
- [ ] Season transitions are instant (no animation between seasons)
- [ ] Seasonal particles are additive — mixed into existing ember system, not replacing
- [ ] Max 50 additional seasonal particles
- [ ] Override available: `?season=winter` URL param for testing
- [ ] `prefers-reduced-motion` disables seasonal particles (keeps lighting only)

**Testing:**
- `season.test.ts` — correct season for each month, hemisphere logic
- `SeasonalEffects.test.tsx` — renders correct effect for each season

---

### F-010: Interactive Resume Builder

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | High |
| **Branch** | `feat/F-010-interactive-resume` |
| **Depends On** | UX-019 (Expanded Skill Tree), FORGE-012 (Vault), UX-013 (Contact Modal) |
| **Effort** | 3–4 sessions |
| **New Files** | `src/hud/ResumeBuilder.tsx`, `src/hud/ResumePreview.tsx`, `app/api/resume/route.ts`, `src/utils/resume-pdf.ts`, `src/data/resume-base.ts` |
| **Modified Files** | `src/hud/HudCompositor.tsx`, `src/zones/HearthZone.tsx` |

**Summary:** Visitors select relevant skill categories and projects, then generate a tailored PDF resume highlighting just what matters to them. Branded with The Forge aesthetic.

**Acceptance Criteria:**

Selection UI:
- [ ] `ResumeBuilder.tsx` opens as a full-screen overlay
- [ ] Step 1: "What are you looking for?" — multi-select categories (Frontend, Backend, 3D, Full Stack, Leadership)
- [ ] Step 2: Select specific skills from filtered Skill Tree data
- [ ] Step 3: Select relevant projects from Vault data
- [ ] Step 4: Preview and generate
- [ ] Each step has a forge-themed progress bar
- [ ] "Select All" and "Clear" options

PDF Generation:
- [ ] `app/api/resume/route.ts` generates PDF server-side (using @react-pdf/renderer or pdfkit)
- [ ] PDF branded with The Forge colors: `#0a0806` header, `#c4813a` accents, Cinzel headings
- [ ] Sections: Header (name, title, contact), Selected Skills (with proficiency), Selected Projects (with descriptions), Timeline highlights, Education
- [ ] Footer: "Generated from The Forge — rblaylock.dev"
- [ ] PDF optimized: < 200KB, single page when possible (two max)
- [ ] Download triggers automatically

Preview:
- [ ] `ResumePreview.tsx` shows a rendered preview before download
- [ ] Preview matches PDF output exactly
- [ ] "Edit Selections" button returns to builder
- [ ] "Download PDF" button prominent

Analytics:
- [ ] Track which categories are most selected (anonymous)
- [ ] Track resume generation count

Accessibility:
- [ ] All steps keyboard navigable
- [ ] Screen reader announces step progression
- [ ] PDF text is selectable/searchable (not rasterized)

**Testing:**
- `ResumeBuilder.test.tsx` — step navigation, selection state, generates request
- `resume-pdf.test.ts` — PDF generation produces valid file with selected content
- `api/resume/route.test.ts` — handles valid/invalid requests, returns PDF buffer

---

### F-011: Forge Radio (Curated Soundtrack)

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-011-forge-radio` |
| **Depends On** | UX-024 (Ambient Soundscape, from engagement doc) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/audio/ForgeRadio.tsx`, `src/audio/useAudio.ts`, `src/data/soundtrack.ts`, `public/audio/` |
| **Modified Files** | `src/hud/HudCompositor.tsx`, `src/store/useForgeStore.ts` |

**Summary:** Zone-specific ambient music tracks that crossfade as the visitor moves between zones. Volume control in HUD.

**Acceptance Criteria:**
- [ ] 5 royalty-free ambient tracks (one per zone), sourced from Pixabay or similar
- [ ] Hearth: warm crackling with soft melodic undertone
- [ ] Skill Tree: contemplative ambient pads
- [ ] Vault: deeper bass, industrial undertones
- [ ] Timeline: cinematic strings/piano
- [ ] War Room: energetic, subtle electronic pulse
- [ ] Crossfade between tracks (2-second transition) on zone change
- [ ] Master volume control in HUD (slider)
- [ ] Mute toggle (🔊/🔇)
- [ ] "Now Playing" minimal indicator in HUD (zone name + track icon)
- [ ] Audio defaults to OFF — must be opt-in
- [ ] Audio suspended when tab is hidden (Page Visibility API)
- [ ] Total audio file size: < 5MB (compressed OGG or MP3)
- [ ] Uses Howler.js for cross-browser audio management

**Testing:**
- `useAudio.test.ts` — play, pause, crossfade, volume, mute
- `ForgeRadio.test.tsx` — zone-change triggers crossfade

---

### F-012: Visitor Heatmap (Admin Dashboard)

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Medium |
| **Branch** | `feat/F-012-visitor-heatmap` |
| **Depends On** | FORGE-027 (Deployment) |
| **Effort** | 2–3 sessions |
| **New Files** | `app/admin/page.tsx`, `app/admin/layout.tsx`, `src/analytics/EventTracker.tsx`, `src/analytics/events.ts`, `app/api/analytics/route.ts` |
| **Modified Files** | `src/store/useForgeStore.ts`, `src/canvas/ForgeCanvas.tsx` |

**Summary:** Anonymous analytics tracking visitor behavior, visualized in a private admin dashboard with a 2D heatmap of the forge world.

**Acceptance Criteria:**
- [ ] `EventTracker.tsx` component silently logs zone entries, interactions, time spent
- [ ] Events: `zone_enter`, `zone_exit`, `project_view`, `skill_view`, `contact_open`, `resume_download`, `achievement_unlock`
- [ ] Events sent to Vercel Analytics custom events or Plausible
- [ ] No PII collected — all anonymous
- [ ] Admin dashboard at `/admin` (password-protected via middleware)
- [ ] Dashboard shows: daily visitors, avg. time on site, zone popularity, project view counts, conversion funnel (visit → contact)
- [ ] 2D map overlay showing zone heatmap (color intensity = time spent)
- [ ] Date range filter (7d, 30d, 90d, all time)
- [ ] Mobile-responsive admin UI

**Testing:**
- `events.test.ts` — correct event shape, no PII leakage
- `EventTracker.test.tsx` — fires events on zone change, interaction
- Admin page: manual verification

---

## PHASE FUTURE-3: Creative Experiments

---

### F-013: AR Mode

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-013-ar-mode` |
| **Depends On** | FORGE-027 (Deployment), FORGE-026 (Performance) |
| **Effort** | 4–5 sessions |
| **New Files** | `src/ar/ARScene.tsx`, `src/ar/ARButton.tsx`, `src/ar/useWebXR.ts` |
| **Modified Files** | `src/canvas/ForgeCanvas.tsx`, `src/hud/HudCompositor.tsx` |

**Summary:** Mobile visitors can place a miniature version of The Forge on their desk/table using WebXR.

**Acceptance Criteria:**
- [ ] WebXR AR session supported (Chrome Android, Safari iOS where available)
- [ ] "View in AR" button shown only on supported devices
- [ ] Miniature forge (~30cm scale) placed on detected surface
- [ ] Hearth, zone pedestals, and ember particles visible in AR
- [ ] Tap on zone to see project/skill info overlay
- [ ] AR session has exit button
- [ ] Fallback: show message explaining AR requirements on unsupported devices
- [ ] Performance: simplified geometry for AR (LOD reduction)

**Testing:**
- `useWebXR.test.ts` — feature detection, session lifecycle
- Manual testing on Android Chrome + iOS Safari

---

### F-014: Voice Navigation

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-014-voice-navigation` |
| **Depends On** | FORGE-007 (Player Movement), UX-003 (Nav Bar) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/voice/VoiceNav.tsx`, `src/voice/useVoiceCommands.ts` |
| **Modified Files** | `src/hud/HudCompositor.tsx`, `src/store/useForgeStore.ts` |

**Summary:** Voice commands for hands-free navigation: "Go to Skill Tree", "Show projects", "Open contact."

**Acceptance Criteria:**
- [ ] Web Speech API for voice recognition
- [ ] Opt-in activation via HUD microphone button
- [ ] Supported commands: "Go to [zone name]", "Show [projects/skills/timeline]", "Open contact", "Take screenshot"
- [ ] Visual feedback: waveform indicator when listening
- [ ] Command confirmation: brief text flash showing recognized command
- [ ] Graceful handling of unrecognized commands: "I didn't catch that"
- [ ] Auto-stop listening after 10 seconds of silence
- [ ] Privacy: no audio sent to external servers (browser-native speech recognition)

**Testing:**
- `useVoiceCommands.test.ts` — command parsing, zone name matching
- Manual testing: voice input in Chrome/Edge

---

### F-015: Forge Guestbook

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Medium |
| **Branch** | `feat/F-015-forge-guestbook` |
| **Depends On** | FORGE-010 (Hearth Zone), FORGE-020 (Detail Panel) |
| **Effort** | 2–3 sessions |
| **New Files** | `src/objects/Guestbook.tsx`, `src/hud/GuestbookPanel.tsx`, `app/api/guestbook/route.ts` |
| **Modified Files** | `src/zones/HearthZone.tsx` |

**Summary:** A physical book in the Hearth zone. Visitors can leave short messages (moderated). Future visitors flip through past entries.

**Acceptance Criteria:**
- [ ] 3D book object on a pedestal in Hearth zone
- [ ] Book has a subtle glow + "Leave a message" interaction prompt
- [ ] `GuestbookPanel.tsx` opens as detail panel variant
- [ ] Write mode: name (optional, max 30 chars), message (required, max 200 chars)
- [ ] Read mode: paginated entries, 5 per page, newest first
- [ ] Page flip animation between pages
- [ ] API route stores entries in Supabase or Vercel KV
- [ ] Rate limiting: 1 entry per IP per 24 hours
- [ ] Profanity filter (basic word list + regex patterns)
- [ ] Admin moderation: entries require approval before display (or auto-approve with filter)
- [ ] Entry display: message, optional name (or "Anonymous Visitor"), timestamp
- [ ] Entries styled as handwritten text on parchment
- [ ] Max 500 entries stored (oldest pruned)

**Testing:**
- `api/guestbook/route.test.ts` — create, read, rate limit, profanity filter
- `GuestbookPanel.test.tsx` — write mode, read mode, pagination

---

### F-016: Mini-Game: Forge the Code

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-016-forge-the-code` |
| **Depends On** | FORGE-014 (War Room Zone), F-007 (Achievement System) |
| **Effort** | 2–3 sessions |
| **New Files** | `src/hud/CodeForgeGame.tsx`, `src/data/puzzles.ts`, `src/hud/PuzzleBlock.tsx` |
| **Modified Files** | `src/zones/WarRoomZone.tsx`, `src/hud/HudCompositor.tsx` |

**Summary:** A small coding puzzle game in the War Room — drag code blocks into correct order to complete a function. Solving unlocks an achievement.

**Acceptance Criteria:**
- [ ] 5 puzzles of increasing difficulty
- [ ] Each puzzle: scattered code blocks that must be reordered
- [ ] Drag-and-drop interface (using @dnd-kit from your existing skill set)
- [ ] Visual feedback: correct position = green glow, wrong = red shake
- [ ] "Check Solution" button validates order
- [ ] Timer (optional, shown but no penalty)
- [ ] Solving any puzzle unlocks "Code Smith" achievement
- [ ] Solving all 5 unlocks "Master Smith" achievement (Legendary)
- [ ] Puzzles represent real patterns: React hook usage, API route structure, Three.js scene setup
- [ ] Reset button to shuffle blocks
- [ ] Hint button reveals one block's correct position
- [ ] Forge-themed UI: blocks styled as metal ingots, correct placement triggers spark VFX

**Testing:**
- `puzzles.test.ts` — all puzzles have valid solutions
- `CodeForgeGame.test.tsx` — drag/drop, validation, achievement trigger

---

### F-017: Custom Cursor Forge Tools

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Medium |
| **Branch** | `feat/F-017-custom-cursors` |
| **Depends On** | FORGE-017 (Zone Detection) |
| **Effort** | 0.5 session |
| **New Files** | `src/hud/ForgeCursor.tsx`, `public/cursors/` (SVG/PNG files) |
| **Modified Files** | `src/hud/HudCompositor.tsx` |

**Summary:** Cursor changes based on current zone — hammer for Hearth, magnifying glass for Vault, compass for Timeline, target for War Room, branch for Skill Tree.

**Acceptance Criteria:**
- [ ] 6 custom cursor designs (5 zones + default)
- [ ] Default: small ember/flame cursor
- [ ] Hearth: hammer silhouette
- [ ] Skill Tree: branch/node icon
- [ ] Vault: magnifying glass
- [ ] Timeline: compass
- [ ] War Room: crosshair/target
- [ ] Cursor changes via CSS `cursor: url(...)` — zero JS overhead
- [ ] Hover states: interactive objects get pointer cursor
- [ ] Cursors are 32x32 PNG with transparency
- [ ] Fallback to system cursor if custom fails
- [ ] `prefers-reduced-motion`: use static cursors (no animation)

**Testing:**
- Manual verification: correct cursor in each zone

---

### F-018: Project Comparison Mode

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-018-project-comparison` |
| **Depends On** | FORGE-012 (Project Vault), UX-019 (Expanded Skill Tree) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/hud/ProjectComparison.tsx`, `src/hud/RadarChart.tsx` |
| **Modified Files** | `src/hud/DetailPanel.tsx`, `src/zones/ProjectVaultZone.tsx` |

**Summary:** Select two projects and see a side-by-side comparison: tech stack overlap, skills used, timeline, complexity radar chart.

**Acceptance Criteria:**
- [ ] "Compare" toggle button in Vault zone HUD
- [ ] When active, clicking two projects opens comparison panel
- [ ] Side-by-side layout: project name, description, tech stack list
- [ ] Shared skills highlighted in amber
- [ ] Radar chart (`RadarChart.tsx` via recharts or custom SVG) comparing dimensions:
  - Frontend complexity, Backend complexity, 3D Graphics, Database, Team size, Duration
- [ ] Timeline bar showing when each project was active
- [ ] "Clear Comparison" to start over
- [ ] Works in 2D fallback mode

**Testing:**
- `ProjectComparison.test.tsx` — renders two projects, highlights shared skills
- `RadarChart.test.tsx` — renders correct dimensions

---

### F-019: Collaborative Whiteboard (War Room)

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-019-war-room-whiteboard` |
| **Depends On** | FORGE-014 (War Room Zone), FORGE-020 (Detail Panel) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/objects/Whiteboard.tsx`, `src/hud/WhiteboardPanel.tsx`, `src/data/war-room-status.ts` |
| **Modified Files** | `src/zones/WarRoomZone.tsx` |

**Summary:** A whiteboard in the War Room showing current project statuses, goals, and open collaboration opportunities. Updated by Robert via data file.

**Acceptance Criteria:**
- [ ] `src/data/war-room-status.ts` contains current status data
- [ ] Each status: `{ projectId, status ("active"|"planning"|"shipped"|"seeking-collab"), lastUpdate, notes }`
- [ ] 3D whiteboard object in War Room with glowing text
- [ ] Interacting opens `WhiteboardPanel.tsx` with formatted status cards
- [ ] Cards show: project name, status badge (color-coded), last update date, notes
- [ ] "Seeking Collaboration" projects have a prominent CTA → contact modal
- [ ] Status data is purely static (data file) — no backend needed
- [ ] Future-proofed: data structure supports CMS or API source

**Testing:**
- `war-room-status.test.ts` — data integrity
- `WhiteboardPanel.test.tsx` — renders all statuses, CTA links work

---

### F-020: Accessibility Mode: Audio Tour

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | High |
| **Branch** | `feat/F-020-audio-tour` |
| **Depends On** | FORGE-017 (Zone Detection), UX-024 (Ambient Soundscape) |
| **Effort** | 2–3 sessions (including recording) |
| **New Files** | `src/audio/AudioTour.tsx`, `src/audio/useTourNarration.ts`, `src/data/tour-narration.ts`, `public/audio/narration/` |
| **Modified Files** | `src/hud/HudCompositor.tsx`, `src/store/useForgeStore.ts` |

**Summary:** Robert's voice guides visitors through each zone. Narration auto-plays on zone entry. Transcript available. Full accessibility win.

**Acceptance Criteria:**
- [ ] 5 narration clips (one per zone), 30–60 seconds each, recorded by Robert
- [ ] Audio format: MP3, < 500KB each
- [ ] `src/data/tour-narration.ts` contains transcripts + audio file paths per zone
- [ ] "🎧 Audio Tour" toggle in HUD (defaults to off)
- [ ] When enabled, entering a zone auto-plays that zone's narration
- [ ] Narration plays once per zone per session (doesn't repeat on re-entry)
- [ ] Playback controls: pause/resume, skip, replay current zone
- [ ] Transcript panel: shows current narration text, synced with audio playback
- [ ] Subtitle-style display option: text appears line-by-line in HUD
- [ ] Audio tour and Forge Radio are mutually exclusive (tour takes priority)
- [ ] Works in 2D fallback mode (play all narrations sequentially)

**Testing:**
- `useTourNarration.test.ts` — plays correct clip per zone, doesn't repeat
- `AudioTour.test.tsx` — controls render, transcript displays

---

### F-021: The Forge API

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-021-forge-api` |
| **Depends On** | FORGE-003 (Content Data Files), FORGE-027 (Deployment) |
| **Effort** | 1 session |
| **New Files** | `app/api/v1/skills/route.ts`, `app/api/v1/projects/route.ts`, `app/api/v1/timeline/route.ts`, `app/api/v1/meta/route.ts`, `app/api-docs/page.tsx` |

**Summary:** Public REST API exposing portfolio data at `rblaylock.dev/api/v1`. Documented with an interactive API docs page.

**Acceptance Criteria:**
- [ ] `GET /api/v1/skills` — returns full skill inventory (filterable by `?category=frontend`)
- [ ] `GET /api/v1/projects` — returns all projects (filterable by `?tier=legendary`)
- [ ] `GET /api/v1/timeline` — returns timeline entries
- [ ] `GET /api/v1/meta` — returns portfolio metadata (total skills, total projects, last updated)
- [ ] All endpoints return JSON with consistent shape: `{ data, meta: { count, generatedAt } }`
- [ ] Rate limited: 60 requests per minute per IP
- [ ] CORS enabled for all origins
- [ ] `/api-docs` page with interactive documentation (try-it-out buttons)
- [ ] OpenAPI 3.0 spec available at `/api/v1/openapi.json`
- [ ] Response includes `X-Powered-By: The Forge` header (fun touch)

**Testing:**
- `api/v1/skills/route.test.ts` — returns data, filters work, rate limit enforced
- `api/v1/projects/route.test.ts` — returns data, tier filter works

---

### F-022: GitHub Activity Heatmap Terrain

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-022-github-heatmap` |
| **Depends On** | FORGE-014 (War Room Zone) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/objects/GitHeatmap.tsx`, `app/api/github/route.ts`, `src/shaders/heatmap-terrain.glsl` |
| **Modified Files** | `src/zones/WarRoomZone.tsx` |

**Summary:** GitHub contribution data rendered as a 3D terrain in the War Room — peaks where commits are heavy, valleys during breaks.

**Acceptance Criteria:**
- [ ] `app/api/github/route.ts` fetches contribution data from GitHub GraphQL API
- [ ] Data cached via ISR (revalidate every 24 hours)
- [ ] `GitHeatmap.tsx` renders a 52×7 grid (52 weeks × 7 days) as a displacement map
- [ ] Height = contribution count, color = intensity (green gradient matching GitHub)
- [ ] Forge color override option: amber/fire palette instead of green
- [ ] Hovering over a peak shows tooltip: "Week of Jan 15 — 42 contributions"
- [ ] Terrain is ~3 units wide, positioned on a table/pedestal in War Room
- [ ] Smooth height transitions between adjacent cells
- [ ] Current week highlighted with ember glow
- [ ] Fallback: flat plane if API fails

**Testing:**
- `api/github/route.test.ts` — returns formatted contribution data, handles API failure
- `GitHeatmap.test.tsx` — renders correct grid dimensions, responds to hover

---

### F-023: Forge Changelog

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Medium |
| **Branch** | `feat/F-023-forge-changelog` |
| **Depends On** | FORGE-010 (Hearth Zone) |
| **Effort** | 0.5 session |
| **New Files** | `src/data/changelog.ts`, `src/hud/ChangelogPanel.tsx`, `src/objects/ChangelogScroll.tsx` |
| **Modified Files** | `src/zones/HearthZone.tsx` |

**Summary:** A "What's New" scroll in the Hearth showing recent updates to The Forge itself.

**Acceptance Criteria:**
- [ ] `src/data/changelog.ts` contains entries: `{ date, version, title, changes: string[] }`
- [ ] 3D scroll object in Hearth zone with subtle glow
- [ ] Interacting opens `ChangelogPanel.tsx` in detail panel
- [ ] Entries shown newest-first with date, version tag, and bullet points
- [ ] Latest entry has a "NEW" badge
- [ ] Max 20 entries displayed (pagination if more)
- [ ] Forge-themed timeline layout

**Testing:**
- `changelog.test.ts` — data sorted by date, no duplicates

---

### F-024: Spotify / Now Playing Integration

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Low |
| **Branch** | `feat/F-024-spotify-integration` |
| **Depends On** | FORGE-010 (Hearth Zone) |
| **Effort** | 1 session |
| **New Files** | `src/objects/SpotifyRadio.tsx`, `app/api/spotify/route.ts` |
| **Modified Files** | `src/zones/HearthZone.tsx` |

**Summary:** A small speaker/radio object in the Hearth showing what Robert is currently listening to on Spotify.

**Acceptance Criteria:**
- [ ] Spotify API integration with refresh token flow (server-side only)
- [ ] `app/api/spotify/route.ts` returns `{ isPlaying, track, artist, album, albumArt, spotifyUrl }`
- [ ] Cached for 30 seconds to avoid rate limits
- [ ] 3D radio/speaker object on a shelf in Hearth zone
- [ ] When playing: animated equalizer bars on the radio, glowing green indicator
- [ ] When not playing: "Currently offline" / last played track
- [ ] Interacting shows detail panel with track info + "Listen on Spotify" link
- [ ] Album art displayed as a texture on the radio's "screen"
- [ ] Graceful fallback if Spotify API unavailable

**Testing:**
- `api/spotify/route.test.ts` — handles playing, not playing, API failure
- `SpotifyRadio.test.tsx` — renders correct state for playing/not playing

---

### F-025: Forge Lore Pages

| Field | Value |
|-------|-------|
| **Type** | feat |
| **Priority** | Medium |
| **Branch** | `feat/F-025-forge-lore` |
| **Depends On** | F-007 (Achievement System), FORGE-019 (Interaction System) |
| **Effort** | 1–2 sessions |
| **New Files** | `src/objects/LorePage.tsx`, `src/data/lore.ts`, `src/hud/LorePanel.tsx` |
| **Modified Files** | `src/zones/*.tsx` (all zones get 1–2 hidden lore pages), `src/store/useForgeStore.ts` |

**Summary:** Hidden narrative text fragments scattered throughout the world. Poetic/metaphorical entries telling the story of The Forge and Robert's journey. Collecting all entries unlocks a Codex achievement.

**Acceptance Criteria:**

Content:
- [ ] `src/data/lore.ts` contains 10–15 lore entries
- [ ] Each entry: `{ id, title, text, zone, position, discoveryOrder }`
- [ ] Entries tell a metaphorical story: the forge being built, the first spark, the early failures, the refinement, the purpose found
- [ ] Writing is poetic/reflective, not technical — faith journey woven in through metaphor
- [ ] Example: "Before the first spark, there was only darkness and doubt. But the smith learned that fire doesn't come from certainty — it comes from striking anyway."
- [ ] Entries are self-contained but form a larger narrative when read in order

3D Objects:
- [ ] `LorePage.tsx` renders as a small glowing scroll/page (radius 0.15) tucked in hidden spots
- [ ] Faint amber glow + particle wisp to hint at location (visible within 3 units)
- [ ] Not immediately obvious — requires exploration to find
- [ ] Each zone has 2–3 lore pages placed in non-obvious locations
- [ ] Interaction reveals the text in `LorePanel.tsx` detail panel

Discovery System:
- [ ] Found lore pages tracked in Zustand store + localStorage
- [ ] Codex shows: "Lore Pages: 7/12 discovered"
- [ ] Undiscovered pages shown as "???" in Codex with zone hint
- [ ] Finding all pages unlocks "Lorekeeper" achievement (Legendary)
- [ ] Finding your first page unlocks "Curious Mind" achievement (Common)

Lore Panel:
- [ ] Full-screen overlay with parchment texture background
- [ ] Cinzel font for title, italic Rajdhani for body
- [ ] Discovery number: "Lore Fragment #7 of 12"
- [ ] "Next" / "Previous" navigation through discovered entries (in narrative order)
- [ ] Subtle ember particle border

**Testing:**
- `lore.test.ts` — all entries have required fields, positions within zone bounds, no duplicate IDs
- `LorePage.test.tsx` — renders, discoverable, tracks in store
- `LorePanel.test.tsx` — displays text, navigation works

---

## Updated Ticket Tracker

Add this section to the AI Build Guide:

```
### PHASE FUTURE-1: Game Changers
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| F-001 | AI Forge Assistant | TODO | `feat/F-001-ai-forge-assistant` |
| F-002 | Live Code Playground | TODO | `feat/F-002-live-code-playground` |
| F-003 | Multiplayer Co-Presence | TODO | `feat/F-003-multiplayer-copresence` |
| F-004 | Project Forge Replay | TODO | `feat/F-004-forge-replay` |
| F-005 | Testimonials Forge Wall | TODO | `feat/F-005-testimonials-wall` |

### PHASE FUTURE-2: Strong Differentiators
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| F-006 | Weather System | TODO | `feat/F-006-weather-system` |
| F-007 | Achievement Badges | TODO | `feat/F-007-achievement-badges` |
| F-008 | Blog Forge | TODO | `feat/F-008-blog-forge` |
| F-009 | Seasonal Themes | TODO | `feat/F-009-seasonal-themes` |
| F-010 | Interactive Resume Builder | TODO | `feat/F-010-interactive-resume` |
| F-011 | Forge Radio | TODO | `feat/F-011-forge-radio` |
| F-012 | Visitor Heatmap Dashboard | TODO | `feat/F-012-visitor-heatmap` |

### PHASE FUTURE-3: Creative Experiments
| ID | Ticket | Status | Branch |
|----|--------|--------|--------|
| F-013 | AR Mode | TODO | `feat/F-013-ar-mode` |
| F-014 | Voice Navigation | TODO | `feat/F-014-voice-navigation` |
| F-015 | Forge Guestbook | TODO | `feat/F-015-forge-guestbook` |
| F-016 | Forge the Code Game | TODO | `feat/F-016-forge-the-code` |
| F-017 | Custom Cursors | TODO | `feat/F-017-custom-cursors` |
| F-018 | Project Comparison | TODO | `feat/F-018-project-comparison` |
| F-019 | War Room Whiteboard | TODO | `feat/F-019-war-room-whiteboard` |
| F-020 | Audio Tour | TODO | `feat/F-020-audio-tour` |
| F-021 | Forge API | TODO | `feat/F-021-forge-api` |
| F-022 | GitHub Heatmap Terrain | TODO | `feat/F-022-github-heatmap` |
| F-023 | Forge Changelog | TODO | `feat/F-023-forge-changelog` |
| F-024 | Spotify Integration | TODO | `feat/F-024-spotify-integration` |
| F-025 | Forge Lore Pages | TODO | `feat/F-025-forge-lore` |
```

---

## Effort Summary

| Effort | Tickets | Total Sessions |
|--------|---------|---------------|
| 0.5 session | F-017, F-023 | 1 |
| 1 session | F-021, F-024 | 2 |
| 1–2 sessions | F-006, F-009, F-011, F-014, F-018, F-019, F-022, F-025 | 12 |
| 2–3 sessions | F-002, F-005, F-007, F-008, F-012, F-015, F-016, F-020 | 20 |
| 3–4 sessions | F-001, F-010 | 7 |
| 4–5 sessions | F-003, F-004, F-013 | 13 |
| **TOTAL** | **25 tickets** | **~55 sessions** |

---

## Dependency Graph (Simplified)

```
FORGE-027 (Deployment) ─── required for all F-* tickets
    │
    ├── F-001 (AI Assistant) ← FORGE-019, FORGE-020
    ├── F-002 (Code Playground) ← FORGE-020, FORGE-012
    ├── F-003 (Multiplayer) ← FORGE-007
    ├── F-004 (Forge Replay) ← FORGE-012, FORGE-020
    ├── F-005 (Testimonials) ← FORGE-010, FORGE-020
    │
    ├── F-007 (Achievements) ← UX-021 (Codex)
    │     └── F-016 (Code Game) ← F-007
    │     └── F-025 (Lore) ← F-007
    │
    ├── F-010 (Resume Builder) ← UX-019, FORGE-012
    ├── F-011 (Radio) ← UX-024 (Sound)
    ├── F-020 (Audio Tour) ← UX-024 (Sound)
    │
    └── F-017 (Cursors) ← FORGE-017 (no other deps — quick win)
        F-023 (Changelog) ← FORGE-010 (no other deps — quick win)
```
