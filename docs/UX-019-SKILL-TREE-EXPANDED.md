# UX-019: Skill Tree — Expanded Skills Inventory

## Ticket Metadata

| Field | Value |
|-------|-------|
| **ID** | UX-019 |
| **Type** | feat |
| **Phase** | UX-4 (Information Architecture & Contact) |
| **Priority** | High |
| **Branch** | `feat/UX-019-skill-tree-expanded` |
| **Depends On** | FORGE-011 (Skill Tree Zone ✅), UX-006 (Skill Labels ✅), FORGE-019 (Interaction System ✅), FORGE-020 (Detail Panel ✅) |
| **Estimated Effort** | 2–3 sessions |

---

## Summary

Refactor the Skill Tree Zone to display Robert's full 70+ skill inventory using a **Tiered Reveal Pattern** — five category pedestals in the 3D scene, subcategory orbit nodes on interact, and granular skill lists in the existing HUD Detail Panel. Cross-links skills to Project Vault entries for discoverability.

---

## Problem

The current Skill Tree was built for a simpler/flatter skill list. The full inventory now contains **5 categories, 20+ subcategories, and 70+ individual skills**. Rendering all skills as individual 3D nodes would:

- Kill WebGL performance (draw calls, overdraw)
- Overwhelm visitors visually
- Break the "progressive discovery" RPG metaphor

---

## Solution: Tiered Reveal Pattern

### Layer 1 — Category Pedestals (3D, always visible)

Five glowing anvil/forge-station pedestals arranged in the Skill Tree Zone. Each pedestal:

- Floats at staggered positions within the zone (see Layout below)
- Has a **floating category label** (reuse UX-006 pattern) with Cinzel font
- Displays a **skill count badge** (e.g., "28 skills") in Rajdhani
- Emits a subtle **particle bloom** in the category color on proximity/hover
- Has a **pulsing glow ring** at the base using the category color

### Layer 2 — Subcategory Orbit (3D, on interact)

When a visitor interacts with a category pedestal:

- Subcategory nodes **fan out** in an orbital ring around the pedestal
- Each node is a small glowing orb with a floating label
- Nodes use a **staggered entrance animation** (100ms delay between each)
- Max 8 nodes visible at once (largest category = Frontend with 5 subcategories)
- Clicking any other pedestal **collapses** the current orbit and expands the new one
- Walking away from the zone collapses all orbits

### Layer 3 — Skill Detail Panel (HUD, on subcategory interact)

Clicking a subcategory node opens the existing Detail Panel (FORGE-020) with:

- **Subcategory title** as panel header
- **Parent category** shown as a breadcrumb/tag
- **List of individual skills** with:
  - Skill name
  - Proficiency indicator (filled dots or bar: expert/advanced/intermediate/exploring)
  - Optional project link badge (e.g., "Used in: Derksen Configurator") — links to Vault
- **Footer**: Total skills in subcategory + "Part of {Category} · {N} total skills"
- Panel styled in the category's color accent

---

## World Layout — Pedestal Positions

```
Skill Tree Zone center: (-22, 0, 0)

Pedestals arranged in a pentagon/arc within the zone:

  Frontend (-25, 0, -2)     Backend (-24, 0, 2)
         ●                        ●

              DevOps (-22, 0, -4)
                    ●

  Workspace (-20, 0, 2)     Strategic (-19, 0, -2)
         ●                        ●
```

Each pedestal Y-position = 0 (ground level). Pedestals are elevated 0.5 units on a forge-stone base mesh.

---

## Data Structure

### `src/data/skills.ts`

```typescript
// ─── Types ───────────────────────────────────────────────────

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'workspace'
  | 'strategic';

export type SkillProficiency =
  | 'expert'       // Daily driver, production experience
  | 'advanced'     // Strong working knowledge
  | 'intermediate' // Comfortable, used in projects
  | 'exploring';   // Evaluated, learning, compared

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  subcategory: string;
  proficiency: SkillProficiency;
  relatedProjects?: string[];  // IDs from src/data/projects.ts
}

export interface SkillSubcategory {
  id: string;
  label: string;
  skills: Skill[];
}

export interface SkillCategoryConfig {
  id: SkillCategory;
  label: string;
  icon: string;           // Emoji or icon identifier
  color: string;          // Hex color for glow/accent
  position: [number, number, number];  // Pedestal world position
  subcategories: SkillSubcategory[];
}

// ─── Proficiency Config ──────────────────────────────────────

export const PROFICIENCY_LEVELS: Record<SkillProficiency, {
  label: string;
  dots: number;   // 1-4 filled dots
  color: string;
}> = {
  expert:       { label: 'Expert',       dots: 4, color: '#ff6600' },
  advanced:     { label: 'Advanced',     dots: 3, color: '#e8a54b' },
  intermediate: { label: 'Intermediate', dots: 2, color: '#44aa88' },
  exploring:    { label: 'Exploring',    dots: 1, color: '#6644aa' },
};

// ─── Category Configs ────────────────────────────────────────

export const SKILL_CATEGORIES: SkillCategoryConfig[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: '🖥',
    color: '#44aa88',
    position: [-25, 0, -2],
    subcategories: [
      {
        id: 'frontend-core',
        label: 'Core Web',
        skills: [
          { id: 'html5', name: 'HTML5', category: 'frontend', subcategory: 'Core Web', proficiency: 'expert' },
          { id: 'css3', name: 'CSS3', category: 'frontend', subcategory: 'Core Web', proficiency: 'expert' },
          { id: 'responsive', name: 'Responsive / Mobile-First', category: 'frontend', subcategory: 'Core Web', proficiency: 'expert' },
          { id: 'a11y', name: 'Accessibility-Aware UI', category: 'frontend', subcategory: 'Core Web', proficiency: 'advanced' },
          { id: 'ux-refinement', name: 'UI/UX Refinement', category: 'frontend', subcategory: 'Core Web', proficiency: 'advanced' },
          { id: 'dark-mode', name: 'Dark Mode Implementation', category: 'frontend', subcategory: 'Core Web', proficiency: 'advanced' },
        ],
      },
      {
        id: 'frontend-frameworks',
        label: 'Frameworks & Libraries',
        skills: [
          { id: 'react', name: 'React', category: 'frontend', subcategory: 'Frameworks & Libraries', proficiency: 'expert', relatedProjects: ['halo', 'savannah-connect'] },
          { id: 'nextjs', name: 'Next.js (TypeScript)', category: 'frontend', subcategory: 'Frameworks & Libraries', proficiency: 'expert', relatedProjects: ['halo', 'the-forge'] },
          { id: 'vue3', name: 'Vue 3', category: 'frontend', subcategory: 'Frameworks & Libraries', proficiency: 'advanced', relatedProjects: ['derksen'] },
          { id: 'svelte', name: 'Svelte', category: 'frontend', subcategory: 'Frameworks & Libraries', proficiency: 'exploring' },
          { id: 'tailwind', name: 'Tailwind CSS (v4+)', category: 'frontend', subcategory: 'Frameworks & Libraries', proficiency: 'expert' },
          { id: 'shadcn', name: 'ShadCN UI', category: 'frontend', subcategory: 'Frameworks & Libraries', proficiency: 'advanced' },
          { id: 'sonner', name: 'Sonner', category: 'frontend', subcategory: 'Frameworks & Libraries', proficiency: 'intermediate' },
          { id: 'dnd-kit', name: '@dnd-kit', category: 'frontend', subcategory: 'Frameworks & Libraries', proficiency: 'intermediate' },
        ],
      },
      {
        id: 'frontend-3d',
        label: '3D & Interactive',
        skills: [
          { id: 'threejs', name: 'Three.js (v0.172+)', category: 'frontend', subcategory: '3D & Interactive', proficiency: 'expert', relatedProjects: ['derksen', 'the-forge'] },
          { id: 'webgl', name: 'WebGL Rendering', category: 'frontend', subcategory: '3D & Interactive', proficiency: 'advanced', relatedProjects: ['derksen', 'the-forge'] },
          { id: '3d-config', name: '3D Configurator Architecture', category: 'frontend', subcategory: '3D & Interactive', proficiency: 'expert', relatedProjects: ['derksen'] },
          { id: '3d-refactor', name: 'Modular 3D Scene Refactoring', category: 'frontend', subcategory: '3D & Interactive', proficiency: 'expert', relatedProjects: ['derksen'] },
          { id: 'asset-viewer', name: 'Asset Viewer Interfaces', category: 'frontend', subcategory: '3D & Interactive', proficiency: 'advanced' },
          { id: 'dealer-config', name: 'Dealer Configuration UIs', category: 'frontend', subcategory: '3D & Interactive', proficiency: 'advanced', relatedProjects: ['derksen'] },
          { id: 'unity', name: 'Unity (3D / Mobile)', category: 'frontend', subcategory: '3D & Interactive', proficiency: 'intermediate', relatedProjects: ['biblewalk'] },
        ],
      },
      {
        id: 'frontend-state',
        label: 'State & Data Handling',
        skills: [
          { id: 'supabase-client', name: 'Supabase Client', category: 'frontend', subcategory: 'State & Data Handling', proficiency: 'advanced' },
          { id: 'firebase-fe', name: 'Firebase Frontend', category: 'frontend', subcategory: 'State & Data Handling', proficiency: 'advanced' },
          { id: 'forms', name: 'Form Handling Patterns', category: 'frontend', subcategory: 'State & Data Handling', proficiency: 'advanced' },
          { id: 'modals', name: 'Modal Systems', category: 'frontend', subcategory: 'State & Data Handling', proficiency: 'advanced' },
          { id: 'component-arch', name: 'Component-Driven Architecture', category: 'frontend', subcategory: 'State & Data Handling', proficiency: 'expert' },
        ],
      },
      {
        id: 'frontend-design',
        label: 'Design & Brand Systems',
        skills: [
          { id: 'brand-kits', name: 'Implementing Brand Kits', category: 'frontend', subcategory: 'Design & Brand Systems', proficiency: 'advanced' },
          { id: 'style-guides', name: 'Style Guides & Design Tokens', category: 'frontend', subcategory: 'Design & Brand Systems', proficiency: 'advanced' },
          { id: 'css-vars', name: 'CSS Variable Systems', category: 'frontend', subcategory: 'Design & Brand Systems', proficiency: 'expert' },
          { id: 'design-system', name: 'Design System Thinking', category: 'frontend', subcategory: 'Design & Brand Systems', proficiency: 'advanced' },
          { id: 'hero-cta', name: 'Hero Sections & CTA Optimization', category: 'frontend', subcategory: 'Design & Brand Systems', proficiency: 'advanced' },
          { id: 'visual-hierarchy', name: 'Visual Hierarchy & Readability', category: 'frontend', subcategory: 'Design & Brand Systems', proficiency: 'advanced' },
          { id: 'logo-design', name: 'Logo Design & Visual Assets', category: 'frontend', subcategory: 'Design & Brand Systems', proficiency: 'intermediate' },
          { id: 'social-banners', name: 'Social Media Branding', category: 'frontend', subcategory: 'Design & Brand Systems', proficiency: 'intermediate' },
        ],
      },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: '⚙️',
    color: '#aa6644',
    position: [-24, 0, 2],
    subcategories: [
      {
        id: 'backend-languages',
        label: 'Languages',
        skills: [
          { id: 'typescript', name: 'TypeScript', category: 'backend', subcategory: 'Languages', proficiency: 'expert' },
          { id: 'javascript', name: 'JavaScript (Advanced)', category: 'backend', subcategory: 'Languages', proficiency: 'expert' },
          { id: 'php', name: 'PHP', category: 'backend', subcategory: 'Languages', proficiency: 'intermediate' },
          { id: 'python', name: 'Python (3.12)', category: 'backend', subcategory: 'Languages', proficiency: 'intermediate' },
          { id: 'swift', name: 'Swift', category: 'backend', subcategory: 'Languages', proficiency: 'exploring' },
          { id: 'sql', name: 'SQL', category: 'backend', subcategory: 'Languages', proficiency: 'advanced' },
          { id: 'solidity', name: 'Solidity (Ethereum)', category: 'backend', subcategory: 'Languages', proficiency: 'intermediate', relatedProjects: ['halo'] },
        ],
      },
      {
        id: 'backend-frameworks',
        label: 'Frameworks & Services',
        skills: [
          { id: 'nodejs', name: 'Node.js (v20+)', category: 'backend', subcategory: 'Frameworks & Services', proficiency: 'expert' },
          { id: 'express', name: 'Express-Style APIs', category: 'backend', subcategory: 'Frameworks & Services', proficiency: 'advanced' },
          { id: 'supabase', name: 'Supabase', category: 'backend', subcategory: 'Frameworks & Services', proficiency: 'advanced' },
          { id: 'firebase', name: 'Firebase', category: 'backend', subcategory: 'Frameworks & Services', proficiency: 'advanced' },
          { id: 'appwrite', name: 'Appwrite', category: 'backend', subcategory: 'Frameworks & Services', proficiency: 'intermediate' },
          { id: 'clerk', name: 'Clerk (Auth)', category: 'backend', subcategory: 'Frameworks & Services', proficiency: 'advanced' },
          { id: 'rest-api', name: 'REST API Design', category: 'backend', subcategory: 'Frameworks & Services', proficiency: 'expert' },
          { id: 'multi-tenant', name: 'Multi-Tenant Architecture', category: 'backend', subcategory: 'Frameworks & Services', proficiency: 'advanced' },
        ],
      },
      {
        id: 'backend-database',
        label: 'Database & Data',
        skills: [
          { id: 'postgresql', name: 'PostgreSQL', category: 'backend', subcategory: 'Database & Data', proficiency: 'advanced' },
          { id: 'mysql', name: 'MySQL', category: 'backend', subcategory: 'Database & Data', proficiency: 'intermediate' },
          { id: 'schema-design', name: 'Schema Design', category: 'backend', subcategory: 'Database & Data', proficiency: 'advanced' },
          { id: 'join-tables', name: 'Join Tables', category: 'backend', subcategory: 'Database & Data', proficiency: 'advanced' },
          { id: 'rbac', name: 'Role-Based Access Logic', category: 'backend', subcategory: 'Database & Data', proficiency: 'advanced' },
          { id: 'profile-systems', name: 'Profile & Directory Systems', category: 'backend', subcategory: 'Database & Data', proficiency: 'advanced' },
          { id: 'query-opt', name: 'Query Optimization', category: 'backend', subcategory: 'Database & Data', proficiency: 'intermediate' },
          { id: 'pgadmin', name: 'pgAdmin', category: 'backend', subcategory: 'Database & Data', proficiency: 'intermediate' },
          { id: 'migrations', name: 'DB Migrations & Versioning', category: 'backend', subcategory: 'Database & Data', proficiency: 'advanced' },
        ],
      },
      {
        id: 'backend-architecture',
        label: 'Architecture & Systems',
        skills: [
          { id: 'saas-structure', name: 'SaaS Platform Structuring', category: 'backend', subcategory: 'Architecture & Systems', proficiency: 'advanced' },
          { id: 'admin-panel', name: 'Admin Panel Design', category: 'backend', subcategory: 'Architecture & Systems', proficiency: 'advanced' },
          { id: 'modular-refactor', name: 'Modular Refactoring', category: 'backend', subcategory: 'Architecture & Systems', proficiency: 'expert', relatedProjects: ['derksen'] },
          { id: 'scalable-arch', name: 'Scalable Architecture Planning', category: 'backend', subcategory: 'Architecture & Systems', proficiency: 'advanced' },
          { id: 'security-dev', name: 'Security-Minded Development', category: 'backend', subcategory: 'Architecture & Systems', proficiency: 'advanced' },
          { id: 'grant-tech', name: 'Grant-Aligned Structuring', category: 'backend', subcategory: 'Architecture & Systems', proficiency: 'intermediate' },
          { id: 'curriculum-platform', name: 'Curriculum Platform Integration', category: 'backend', subcategory: 'Architecture & Systems', proficiency: 'intermediate' },
        ],
      },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    icon: '🚀',
    color: '#22aacc',
    position: [-22, 0, -4],
    subcategories: [
      {
        id: 'devops-vcs',
        label: 'Version Control',
        skills: [
          { id: 'git', name: 'Git (Branching, Cleanup)', category: 'devops', subcategory: 'Version Control', proficiency: 'expert' },
          { id: 'github-hygiene', name: 'GitHub Repo Hygiene', category: 'devops', subcategory: 'Version Control', proficiency: 'advanced' },
          { id: 'feature-branches', name: 'Feature Branch Conventions', category: 'devops', subcategory: 'Version Control', proficiency: 'expert' },
          { id: 'refactor-workflows', name: 'Refactor Workflows', category: 'devops', subcategory: 'Version Control', proficiency: 'advanced' },
        ],
      },
      {
        id: 'devops-env',
        label: 'Environment & Tooling',
        skills: [
          { id: 'docker', name: 'Docker-First Mindset', category: 'devops', subcategory: 'Environment & Tooling', proficiency: 'advanced' },
          { id: 'makefile', name: 'Makefile-Driven Workflows', category: 'devops', subcategory: 'Environment & Tooling', proficiency: 'advanced' },
          { id: 'node-version', name: 'Node Version Management', category: 'devops', subcategory: 'Environment & Tooling', proficiency: 'advanced' },
          { id: 'cross-platform', name: 'Cross-Platform Troubleshooting', category: 'devops', subcategory: 'Environment & Tooling', proficiency: 'advanced' },
          { id: 'apple-silicon', name: 'Apple Silicon Adaptation', category: 'devops', subcategory: 'Environment & Tooling', proficiency: 'intermediate' },
          { id: 'cli-workflows', name: 'CLI-Driven Workflows', category: 'devops', subcategory: 'Environment & Tooling', proficiency: 'advanced' },
        ],
      },
      {
        id: 'devops-deploy',
        label: 'Deployment & Hosting',
        skills: [
          { id: 'firebase-hosting', name: 'Firebase Hosting', category: 'devops', subcategory: 'Deployment & Hosting', proficiency: 'advanced' },
          { id: 'prod-builds', name: 'Production Build Optimization', category: 'devops', subcategory: 'Deployment & Hosting', proficiency: 'advanced' },
          { id: 'saas-hosting', name: 'SaaS Hosting Considerations', category: 'devops', subcategory: 'Deployment & Hosting', proficiency: 'intermediate' },
          { id: 'dev-prod-align', name: 'Dev/Prod Environment Alignment', category: 'devops', subcategory: 'Deployment & Hosting', proficiency: 'advanced' },
        ],
      },
      {
        id: 'devops-automation',
        label: 'Automation & Optimization',
        skills: [
          { id: 'perf-refactor', name: 'Performance Refactoring', category: 'devops', subcategory: 'Automation & Optimization', proficiency: 'advanced' },
          { id: 'eng-scalability', name: 'Engineering Scalability Planning', category: 'devops', subcategory: 'Automation & Optimization', proficiency: 'advanced' },
          { id: 'multi-phase', name: 'Multi-Phase Rollout Planning', category: 'devops', subcategory: 'Automation & Optimization', proficiency: 'advanced' },
          { id: 'tech-debt', name: 'Technical Debt Identification', category: 'devops', subcategory: 'Automation & Optimization', proficiency: 'advanced' },
        ],
      },
    ],
  },
  {
    id: 'workspace',
    label: 'Tech Workspace',
    icon: '🛠',
    color: '#aa8844',
    position: [-20, 0, 2],
    subcategories: [
      {
        id: 'workspace-pm',
        label: 'Project Management',
        skills: [
          { id: 'clickup', name: 'ClickUp Ticket Structuring', category: 'workspace', subcategory: 'Project Management', proficiency: 'expert' },
          { id: 'user-stories', name: 'User Stories & Acceptance Criteria', category: 'workspace', subcategory: 'Project Management', proficiency: 'expert' },
          { id: 'sprint-planning', name: 'Sprint Planning & Agile Backlogs', category: 'workspace', subcategory: 'Project Management', proficiency: 'expert' },
          { id: 'solutions-briefs', name: 'Solutions & Implementation Briefs', category: 'workspace', subcategory: 'Project Management', proficiency: 'advanced' },
        ],
      },
      {
        id: 'workspace-leadership',
        label: 'Engineering Leadership',
        skills: [
          { id: 'mentoring', name: 'Mentoring Junior Developers', category: 'workspace', subcategory: 'Engineering Leadership', proficiency: 'advanced' },
          { id: 'code-review', name: 'Code Review Guidance', category: 'workspace', subcategory: 'Engineering Leadership', proficiency: 'advanced' },
          { id: 'arch-planning', name: 'Architecture Refactor Planning', category: 'workspace', subcategory: 'Engineering Leadership', proficiency: 'advanced', relatedProjects: ['derksen'] },
          { id: 'standards', name: 'Standards Alignment (IBM, Google)', category: 'workspace', subcategory: 'Engineering Leadership', proficiency: 'advanced' },
        ],
      },
      {
        id: 'workspace-docs',
        label: 'Documentation',
        skills: [
          { id: 'tech-docs', name: 'Technical Architecture Docs', category: 'workspace', subcategory: 'Documentation', proficiency: 'expert' },
          { id: 'game-design-docs', name: 'Game Design Documents', category: 'workspace', subcategory: 'Documentation', proficiency: 'advanced', relatedProjects: ['biblewalk'] },
          { id: 'content-authoring', name: 'Content Authoring System Docs', category: 'workspace', subcategory: 'Documentation', proficiency: 'advanced' },
          { id: 'readme', name: 'README & Setup Guides', category: 'workspace', subcategory: 'Documentation', proficiency: 'expert' },
          { id: 'docs-dir', name: '/docs Directory Standards', category: 'workspace', subcategory: 'Documentation', proficiency: 'advanced' },
        ],
      },
      {
        id: 'workspace-ai',
        label: 'AI & Tooling',
        skills: [
          { id: 'agentic-dev', name: 'Agentic Development Tools', category: 'workspace', subcategory: 'AI & Tooling', proficiency: 'advanced' },
          { id: 'multi-agent', name: 'Multi-Agent AI Workflows (OpenClaw)', category: 'workspace', subcategory: 'AI & Tooling', proficiency: 'intermediate' },
          { id: 'ai-assisted', name: 'AI-Assisted Development', category: 'workspace', subcategory: 'AI & Tooling', proficiency: 'advanced' },
        ],
      },
    ],
  },
  {
    id: 'strategic',
    label: 'Strategic',
    icon: '🧠',
    color: '#8855bb',
    position: [-19, 0, -2],
    subcategories: [
      {
        id: 'strategic-product',
        label: 'Product & Business',
        skills: [
          { id: 'product-strategy', name: 'Product Strategy Thinking', category: 'strategic', subcategory: 'Product & Business', proficiency: 'advanced' },
          { id: 'brand-eng', name: 'Brand + Engineering Alignment', category: 'strategic', subcategory: 'Product & Business', proficiency: 'advanced' },
          { id: 'mvp-scoping', name: 'Entrepreneurial MVP Scoping', category: 'strategic', subcategory: 'Product & Business', proficiency: 'advanced' },
          { id: 'social-positioning', name: 'Social Media Technical Positioning', category: 'strategic', subcategory: 'Product & Business', proficiency: 'intermediate' },
        ],
      },
      {
        id: 'strategic-community',
        label: 'Community & Impact',
        skills: [
          { id: 'community-platform', name: 'Community Platform Building', category: 'strategic', subcategory: 'Community & Impact', proficiency: 'advanced', relatedProjects: ['savannah-connect'] },
          { id: 'tech-mentoring', name: 'Technical Mentoring', category: 'strategic', subcategory: 'Community & Impact', proficiency: 'advanced' },
          { id: 'nonprofit-saas', name: 'Systems Thinking (Nonprofit + SaaS)', category: 'strategic', subcategory: 'Community & Impact', proficiency: 'advanced' },
          { id: 'curriculum-tech', name: 'Curriculum → Technical Platforms', category: 'strategic', subcategory: 'Community & Impact', proficiency: 'intermediate' },
        ],
      },
    ],
  },
];

// ─── Helper Functions ────────────────────────────────────────

export function getTotalSkillCount(): number {
  return SKILL_CATEGORIES.reduce(
    (total, cat) => total + cat.subcategories.reduce(
      (sub, s) => sub + s.skills.length, 0
    ), 0
  );
}

export function getCategorySkillCount(categoryId: SkillCategory): number {
  const cat = SKILL_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return 0;
  return cat.subcategories.reduce((t, s) => t + s.skills.length, 0);
}

export function getSkillsByProject(projectId: string): Skill[] {
  return SKILL_CATEGORIES.flatMap(cat =>
    cat.subcategories.flatMap(sub =>
      sub.skills.filter(s => s.relatedProjects?.includes(projectId))
    )
  );
}
```

---

## Component Breakdown

### New Components

| File | Responsibility | Lines (est.) |
|------|---------------|-------------|
| `src/zones/SkillTreeZone.tsx` | Refactored zone — renders pedestals, manages orbit state | ~300 |
| `src/objects/CategoryPedestal.tsx` | Single pedestal with glow ring, label, count badge, particle bloom | ~200 |
| `src/objects/SubcategoryOrbit.tsx` | Orbital ring of subcategory nodes with stagger animation | ~180 |
| `src/hud/SkillDetailPanel.tsx` | Detail panel content for skill list view | ~250 |
| `src/data/skills.ts` | Full typed skill inventory (as above) | ~400 |

### Modified Components

| File | Change |
|------|--------|
| `src/store/useForgeStore.ts` | Add `activeSkillCategory`, `activeSubcategory`, `expandedOrbit` state |
| `src/hud/DetailPanel.tsx` | Add skill detail variant to existing panel |
| `src/types/index.ts` | Add skill-related type exports |

---

## Zustand Store Additions

```typescript
// Additions to useForgeStore

interface SkillTreeState {
  activeSkillCategory: SkillCategory | null;
  activeSubcategory: string | null;     // subcategory ID
  orbitExpanded: boolean;

  // Actions
  expandCategory: (category: SkillCategory) => void;
  collapseCategory: () => void;
  selectSubcategory: (subcategoryId: string) => void;
  clearSubcategory: () => void;
}
```

---

## Acceptance Criteria

### Data Layer
- [ ] `src/data/skills.ts` contains all 70+ skills from the master inventory
- [ ] Every skill has `id`, `name`, `category`, `subcategory`, `proficiency`
- [ ] Skills with project connections have `relatedProjects` populated
- [ ] Helper functions (`getTotalSkillCount`, `getCategorySkillCount`, `getSkillsByProject`) work correctly
- [ ] TypeScript types are strict — no `any` types

### Category Pedestals (Layer 1)
- [ ] Five pedestals render at correct positions in the Skill Tree Zone
- [ ] Each pedestal has a floating label (Cinzel font) with category name
- [ ] Each pedestal displays a skill count badge (Rajdhani font, e.g., "28 skills")
- [ ] Pedestal base has a pulsing glow ring in the category color
- [ ] Proximity/hover triggers a subtle particle bloom effect
- [ ] Pedestals are interactable via existing interaction system (FORGE-019)
- [ ] Performance: Max 5 pedestals rendering, no per-frame allocations

### Subcategory Orbit (Layer 2)
- [ ] Clicking a pedestal fans out subcategory nodes in an orbital ring
- [ ] Nodes appear with staggered entrance animation (100ms delay each)
- [ ] Each node is a glowing orb with a floating text label
- [ ] Max 8 nodes visible at any time
- [ ] Clicking a different pedestal collapses current orbit, expands new one
- [ ] Walking away from the Skill Tree Zone collapses all orbits
- [ ] Orbit collapse has a smooth exit animation (reverse stagger)
- [ ] Performance: Orbit nodes use instanced meshes where possible

### Skill Detail Panel (Layer 3)
- [ ] Clicking a subcategory node opens the Detail Panel (FORGE-020)
- [ ] Panel header shows subcategory title + parent category breadcrumb
- [ ] Skills list shows: name, proficiency dots (1-4), optional project badge
- [ ] Project badges are clickable → navigates to Project Vault zone + opens that project
- [ ] Panel footer shows skill count + category context
- [ ] Panel accent color matches the parent category color
- [ ] Panel closes cleanly on Escape, click-outside, or walking away
- [ ] Reduced-motion: Skip stagger animations, use instant show/hide

### Cross-Linking
- [ ] Skills with `relatedProjects` show project badges in the detail panel
- [ ] Clicking a project badge teleports to the Vault zone and opens that project's detail
- [ ] Project detail panels show a "Skills Used" section listing linked skills

### Accessibility
- [ ] All interactive elements are keyboard navigable when HUD is focused
- [ ] Screen reader text describes category, subcategory, and skill count
- [ ] 2D fallback mode (FORGE-025) renders skills as a filterable HTML list
- [ ] Respects `prefers-reduced-motion`

### Performance
- [ ] No new per-frame allocations in the render loop
- [ ] Orbit nodes use geometry instancing
- [ ] Particle bloom uses existing ember system, not new emitters
- [ ] Total draw call increase: < 20 when all pedestals visible, orbit collapsed
- [ ] Total draw call increase: < 40 when orbit is expanded

---

## Visual Reference

- **Pedestal aesthetic**: Forge-stone base (dark metal, `#1a1511`), glowing category-colored ring at base, floating ember particles
- **Orbit aesthetic**: Small glowing orbs (radius ~0.3), connected to pedestal center by faint dotted lines (like constellation paths)
- **Label font**: Cinzel for category names, Rajdhani for counts and subcategory names
- **Colors**: Use existing zone color `#44aa88` as the zone ambient, individual category colors for each pedestal

---

## Testing Plan

| Test | Type | Description |
|------|------|-------------|
| `skills.test.ts` | Unit | Verify data integrity — no duplicate IDs, all categories populated, helpers return correct counts |
| `CategoryPedestal.test.tsx` | Component | Renders label, count, glow ring; responds to interaction |
| `SubcategoryOrbit.test.tsx` | Component | Expands/collapses correctly, respects max node count |
| `SkillDetailPanel.test.tsx` | Component | Displays skills, proficiency dots, project links |
| `useForgeStore.test.ts` | Unit | State transitions: expand → collapse → select subcategory → clear |
| Performance | Manual | Verify draw calls with R3F Perf monitor, check for GC spikes |

---

## Definition of Done

- [ ] All acceptance criteria pass
- [ ] All tests pass
- [ ] Files < 500 lines
- [ ] No TypeScript errors
- [ ] Performance verified (draw calls, no GC spikes)
- [ ] Works in 2D fallback mode
- [ ] Tested with keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Branch: `feat/UX-019-skill-tree-expanded`
- [ ] Commits use conventional format

---

## Updated Ticket Tracker Entry

Add to **PHASE UX-4: Information Architecture & Contact**:

```
| UX-019 | Skill Tree — Expanded Inventory | TODO | `feat/UX-019-skill-tree-expanded` |
```

---

## Follow-Up Tickets (Out of Scope)

- **UX-020**: Skill search/filter in 2D fallback mode
- **UX-021**: Animated skill proficiency growth (visitor sees dots "fill in" on hover)
- **UX-022**: Vault ↔ Skill Tree bidirectional navigation (click skill in vault → teleport to tree)
