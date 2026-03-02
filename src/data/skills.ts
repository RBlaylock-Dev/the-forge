import type { Skill, SkillProficiency, SkillCategoryId, SkillCategoryConfig } from '@/types';

// ── Proficiency Config ──────────────────────────────────────

export const PROFICIENCY_LEVELS: Record<SkillProficiency, {
  label: string;
  dots: number;
  color: string;
}> = {
  expert:       { label: 'Expert',       dots: 4, color: '#ff6600' },
  advanced:     { label: 'Advanced',     dots: 3, color: '#e8a54b' },
  intermediate: { label: 'Intermediate', dots: 2, color: '#44aa88' },
  exploring:    { label: 'Exploring',    dots: 1, color: '#6644aa' },
};

// ── Category Configs ────────────────────────────────────────

export const SKILL_CATEGORIES: SkillCategoryConfig[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: '\u{1F5A5}',
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
    icon: '\u2699\uFE0F',
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
    icon: '\u{1F680}',
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
    icon: '\u{1F6E0}',
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
    icon: '\u{1F9E0}',
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
          { id: 'curriculum-tech', name: 'Curriculum \u2192 Technical Platforms', category: 'strategic', subcategory: 'Community & Impact', proficiency: 'intermediate' },
        ],
      },
    ],
  },
];

// ── Helper Functions ────────────────────────────────────────

export function getTotalSkillCount(): number {
  return SKILL_CATEGORIES.reduce(
    (total, cat) => total + cat.subcategories.reduce(
      (sub, s) => sub + s.skills.length, 0
    ), 0
  );
}

export function getCategorySkillCount(categoryId: SkillCategoryId): number {
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
