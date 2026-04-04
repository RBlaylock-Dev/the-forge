import type { ForgeState } from '@/types';
import { selectCodexProgress } from '@/store/useForgeStore';

export type AchievementRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  condition: (state: ForgeState) => boolean;
}

export const RARITY_COLORS: Record<AchievementRarity, string> = {
  Common: '#44aa66',
  Rare: '#4488ff',
  Epic: '#cc44ff',
  Legendary: '#ff6600',
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-spark',
    title: 'First Spark',
    description: 'Visited the Hearth for the first time',
    icon: '\u{1F525}',
    rarity: 'Common',
    condition: (s) => s.discoveredZones.has('hearth'),
  },
  {
    id: 'skill-scout',
    title: 'Skill Scout',
    description: 'Explored all 5 skill categories',
    icon: '\u{1F9ED}',
    rarity: 'Rare',
    condition: (s) => s.discoveredSubcategories.size >= 21,
  },
  {
    id: 'vault-raider',
    title: 'Vault Raider',
    description: 'Viewed every project in the Vault',
    icon: '\u{1F4BC}',
    rarity: 'Rare',
    condition: (s) => s.discoveredProjects.size >= 12,
  },
  {
    id: 'time-traveler',
    title: 'Time Traveler',
    description: 'Explored the full timeline',
    icon: '\u{231B}',
    rarity: 'Rare',
    condition: (s) => s.discoveredEras.size >= 5,
  },
  {
    id: 'war-strategist',
    title: 'War Strategist',
    description: 'Viewed all active projects in the War Room',
    icon: '\u{2694}\u{FE0F}',
    rarity: 'Rare',
    condition: (s) => s.discoveredActiveProjects.size >= 7,
  },
  {
    id: 'forgemaster',
    title: 'Forgemaster',
    description: 'Achieved 100% Codex completion',
    icon: '\u{1F451}',
    rarity: 'Legendary',
    condition: (s) => selectCodexProgress(s) >= 1,
  },
  {
    id: 'secret-keeper',
    title: 'Secret Keeper',
    description: 'Found the hidden workshop',
    icon: '\u{1F510}',
    rarity: 'Epic',
    condition: (s) => s.discoveredZones.has('hidden-forge'),
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Visited The Forge between 10pm and 4am',
    icon: '\u{1F989}',
    rarity: 'Epic',
    condition: () => {
      const hour = new Date().getHours();
      return hour >= 22 || hour < 4;
    },
  },
  {
    id: 'world-walker',
    title: 'World Walker',
    description: 'Discovered all 5 main zones',
    icon: '\u{1F30D}',
    rarity: 'Rare',
    condition: (s) => {
      const mainZones = ['hearth', 'skill-tree', 'vault', 'timeline', 'war-room'] as const;
      return mainZones.every((z) => s.discoveredZones.has(z));
    },
  },
  {
    id: 'resume-downloaded',
    title: 'Paper Trail',
    description: 'Downloaded the resume',
    icon: '\u{1F4DC}',
    rarity: 'Common',
    condition: (s) => s.resumeDownloaded,
  },
];
