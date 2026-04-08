'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForgeStore } from '@/store/useForgeStore';
import { SKILL_CATEGORIES } from '@/data/skills';
import { PROJECTS } from '@/data/projects';
import { RESUME_CATEGORIES, CATEGORY_TO_SKILLS, type ResumeCategory } from '@/data/resume-base';
import type { Skill, Project } from '@/types';

// ── Step indicator ──────────────────────────────────────────

const STEPS = [
  'What are you looking for?',
  'Select Skills',
  'Select Projects',
  'Preview & Generate',
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1 flex-1">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= current ? 'bg-[#c4813a]' : 'bg-[#c4813a]/20'
            }`}
          />
          {i < STEPS.length - 1 && <div className="w-1" />}
        </div>
      ))}
    </div>
  );
}

// ── Step 1: Category selection ──────────────────────────────

function StepCategories({
  selected,
  onToggle,
}: {
  selected: Set<ResumeCategory>;
  onToggle: (id: ResumeCategory) => void;
}) {
  return (
    <div>
      <h3
        className="text-xl text-[#c4813a] mb-1 font-semibold"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        What are you looking for?
      </h3>
      <p className="text-[#f5deb3]/50 text-sm mb-4">
        Select the areas most relevant to you. This filters the skills and projects.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RESUME_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onToggle(cat.id)}
            className={`text-left p-4 rounded-lg border transition-all duration-200 ${
              selected.has(cat.id)
                ? 'border-[#c4813a] bg-[#c4813a]/15 text-[#f5deb3]'
                : 'border-[#c4813a]/20 bg-[#0a0806]/50 text-[#f5deb3]/60 hover:border-[#c4813a]/40'
            }`}
          >
            <div className="font-semibold text-sm">{cat.label}</div>
            <div className="text-xs mt-1 opacity-70">{cat.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 2: Skill selection ─────────────────────────────────

function StepSkills({
  filteredSkills,
  selected,
  onToggle,
  onSelectAll,
  onClear,
}: {
  filteredSkills: Skill[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}) {
  // Group by subcategory
  const grouped = new Map<string, Skill[]>();
  for (const skill of filteredSkills) {
    const key = skill.subcategory;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(skill);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-xl text-[#c4813a] font-semibold"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Select Skills
          </h3>
          <p className="text-[#f5deb3]/50 text-sm mt-1">{selected.size} selected</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="text-xs px-3 py-1 rounded border border-[#c4813a]/40 text-[#c4813a] hover:bg-[#c4813a]/10 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={onClear}
            className="text-xs px-3 py-1 rounded border border-[#c4813a]/40 text-[#f5deb3]/40 hover:bg-[#c4813a]/10 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#c4813a]/30">
        {Array.from(grouped.entries()).map(([subcategory, skills]) => (
          <div key={subcategory}>
            <div className="text-xs uppercase tracking-wider text-[#c4813a]/70 mb-2 font-semibold">
              {subcategory}
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => onToggle(skill.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                    selected.has(skill.id)
                      ? 'border-[#c4813a] bg-[#c4813a]/20 text-[#f5deb3]'
                      : 'border-[#c4813a]/15 text-[#f5deb3]/40 hover:border-[#c4813a]/30'
                  }`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 3: Project selection ───────────────────────────────

function StepProjects({
  projects,
  selected,
  onToggle,
  onSelectAll,
  onClear,
}: {
  projects: Project[];
  selected: Set<string>;
  onToggle: (name: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-xl text-[#c4813a] font-semibold"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Select Projects
          </h3>
          <p className="text-[#f5deb3]/50 text-sm mt-1">{selected.size} selected</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="text-xs px-3 py-1 rounded border border-[#c4813a]/40 text-[#c4813a] hover:bg-[#c4813a]/10 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={onClear}
            className="text-xs px-3 py-1 rounded border border-[#c4813a]/40 text-[#f5deb3]/40 hover:bg-[#c4813a]/10 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#c4813a]/30">
        {projects.map((project) => (
          <button
            key={project.name}
            onClick={() => onToggle(project.name)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
              selected.has(project.name)
                ? 'border-[#c4813a] bg-[#c4813a]/15 text-[#f5deb3]'
                : 'border-[#c4813a]/15 bg-[#0a0806]/50 text-[#f5deb3]/50 hover:border-[#c4813a]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{project.name}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-50">
                {project.tier}
              </span>
            </div>
            <div className="text-xs mt-1 opacity-60 line-clamp-1">{project.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 4: Preview ─────────────────────────────────────────

function StepPreview({
  selectedSkills,
  selectedProjects,
  isGenerating,
  onGenerate,
}: {
  selectedSkills: Skill[];
  selectedProjects: Project[];
  isGenerating: boolean;
  onGenerate: () => void;
}) {
  return (
    <div>
      <h3
        className="text-xl text-[#c4813a] mb-4 font-semibold"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        Resume Preview
      </h3>
      <div className="bg-[#0a0806] border border-[#c4813a]/20 rounded-lg p-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#c4813a]/30">
        {/* Header */}
        <div className="border-b border-[#c4813a]/20 pb-3 mb-3">
          <div className="text-lg font-bold text-[#f5deb3]" style={{ fontFamily: 'Cinzel, serif' }}>
            Robert Blaylock
          </div>
          <div className="text-sm text-[#c4813a]">Senior Software Engineer</div>
          <div className="text-xs text-[#f5deb3]/40 mt-1">
            robert@rblaylock.dev &bull; rblaylock.dev &bull; Counce, TN
          </div>
        </div>

        {/* Skills */}
        {selectedSkills.length > 0 && (
          <div className="mb-3">
            <div className="text-xs uppercase tracking-wider text-[#c4813a] font-semibold mb-2">
              Skills ({selectedSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.map((s) => (
                <span
                  key={s.id}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#c4813a]/10 text-[#f5deb3]/70 border border-[#c4813a]/15"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {selectedProjects.length > 0 && (
          <div>
            <div className="text-xs uppercase tracking-wider text-[#c4813a] font-semibold mb-2">
              Projects ({selectedProjects.length})
            </div>
            {selectedProjects.map((p) => (
              <div key={p.name} className="mb-2 pb-2 border-b border-[#c4813a]/10 last:border-0">
                <div className="text-sm font-semibold text-[#f5deb3]/80">{p.name}</div>
                <div className="text-xs text-[#f5deb3]/40 mt-0.5">{p.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || (selectedSkills.length === 0 && selectedProjects.length === 0)}
        className="w-full mt-4 py-3 rounded-lg bg-[#c4813a] text-[#0a0806] font-bold text-sm hover:bg-[#e8a54b] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        {isGenerating ? 'Forging Resume...' : 'Download PDF Resume'}
      </button>
    </div>
  );
}

// ── Main Resume Builder ─────────────────────────────────────

export function ResumeBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<ResumeCategory>>(new Set());
  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(new Set());
  const [selectedProjectNames, setSelectedProjectNames] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  const isStarted = useForgeStore((s) => s.isStarted);

  // Listen for custom event to open builder
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-resume-builder', handler);
    return () => window.removeEventListener('open-resume-builder', handler);
  }, []);

  // Get filtered skills based on selected categories
  const filteredSkills: Skill[] = (() => {
    if (selectedCategories.size === 0) return [];
    const catIds = new Set<string>();
    for (const rc of Array.from(selectedCategories)) {
      for (const id of CATEGORY_TO_SKILLS[rc]) catIds.add(id);
    }
    const skills: Skill[] = [];
    for (const cat of SKILL_CATEGORIES) {
      if (!catIds.has(cat.id)) continue;
      for (const sub of cat.subcategories) {
        skills.push(...sub.skills);
      }
    }
    // For 3D category, filter to only 3D-related skills
    if (selectedCategories.has('3d') && !selectedCategories.has('frontend')) {
      return skills.filter(
        (s) =>
          s.name.toLowerCase().includes('three') ||
          s.name.toLowerCase().includes('r3f') ||
          s.name.toLowerCase().includes('glsl') ||
          s.name.toLowerCase().includes('webgl') ||
          s.name.toLowerCase().includes('3d') ||
          s.name.toLowerCase().includes('shader') ||
          s.subcategory.toLowerCase().includes('3d'),
      );
    }
    return skills;
  })();

  // Auto-select all filtered skills when categories change
  useEffect(() => {
    setSelectedSkillIds(new Set(filteredSkills.map((s) => s.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  const selectedSkills = filteredSkills.filter((s) => selectedSkillIds.has(s.id));
  const selectedProjects = PROJECTS.filter((p) => selectedProjectNames.has(p.name));

  const toggleCategory = useCallback((id: ResumeCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSkill = useCallback((id: string) => {
    setSelectedSkillIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleProject = useCallback((name: string) => {
    setSelectedProjectNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillIds: Array.from(selectedSkillIds),
          projectNames: Array.from(selectedProjectNames),
        }),
      });

      if (!res.ok) throw new Error('Failed to generate resume');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Robert-Blaylock-Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Could show error toast, but for now fail silently
    } finally {
      setIsGenerating(false);
    }
  }, [selectedSkillIds, selectedProjectNames]);

  const close = useCallback(() => {
    setIsOpen(false);
    setStep(0);
  }, []);

  // Escape to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, close]);

  if (!isStarted) return null;

  return (
    <>
      {/* HUD Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-[170px] sm:right-[200px] z-[10] flex items-center gap-2 px-4 py-2.5 rounded-full border bg-[#0a0806]/80 border-[#c4813a]/40 text-[#c4813a] hover:border-[#c4813a]/70 hover:bg-[#c4813a]/10 transition-all duration-300"
        style={{
          pointerEvents: 'auto',
          fontFamily: 'Rajdhani, sans-serif',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Build custom resume"
        title="Interactive Resume Builder"
      >
        <span className="text-lg leading-none">&#x1F4DC;</span>
        <span className="text-sm font-semibold hidden sm:inline">Build Resume</span>
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-2xl max-h-[85vh] mx-4 rounded-xl overflow-hidden flex flex-col"
              style={{
                background: 'linear-gradient(180deg, #1a1511 0%, #0f0c09 100%)',
                border: '1px solid rgba(196, 129, 58, 0.3)',
                fontFamily: 'Rajdhani, sans-serif',
              }}
              role="dialog"
              aria-label="Interactive Resume Builder"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#c4813a]/20">
                <h2
                  className="text-[#c4813a] text-lg font-semibold"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Resume Builder
                </h2>
                <button
                  onClick={close}
                  className="text-[#f5deb3]/50 hover:text-[#f5deb3] transition-colors text-xl leading-none px-2"
                  aria-label="Close resume builder"
                >
                  &times;
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <StepBar current={step} />

                <div aria-live="polite">
                  {step === 0 && (
                    <StepCategories selected={selectedCategories} onToggle={toggleCategory} />
                  )}
                  {step === 1 && (
                    <StepSkills
                      filteredSkills={filteredSkills}
                      selected={selectedSkillIds}
                      onToggle={toggleSkill}
                      onSelectAll={() =>
                        setSelectedSkillIds(new Set(filteredSkills.map((s) => s.id)))
                      }
                      onClear={() => setSelectedSkillIds(new Set())}
                    />
                  )}
                  {step === 2 && (
                    <StepProjects
                      projects={PROJECTS}
                      selected={selectedProjectNames}
                      onToggle={toggleProject}
                      onSelectAll={() =>
                        setSelectedProjectNames(new Set(PROJECTS.map((p) => p.name)))
                      }
                      onClear={() => setSelectedProjectNames(new Set())}
                    />
                  )}
                  {step === 3 && (
                    <StepPreview
                      selectedSkills={selectedSkills}
                      selectedProjects={selectedProjects}
                      isGenerating={isGenerating}
                      onGenerate={handleGenerate}
                    />
                  )}
                </div>
              </div>

              {/* Footer navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#c4813a]/20">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="text-sm px-4 py-2 rounded-lg border border-[#c4813a]/30 text-[#c4813a] hover:bg-[#c4813a]/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  Back
                </button>
                <span className="text-xs text-[#f5deb3]/30">
                  Step {step + 1} of {STEPS.length}
                </span>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    disabled={step === 0 && selectedCategories.size === 0}
                    className="text-sm px-4 py-2 rounded-lg bg-[#c4813a]/20 border border-[#c4813a]/40 text-[#c4813a] hover:bg-[#c4813a]/30 disabled:opacity-20 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    Next
                  </button>
                ) : (
                  <div /> // Empty spacer for the generate step
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
