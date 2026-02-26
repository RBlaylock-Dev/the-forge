import type { ProjectTier } from '@/types';

export const TIER_COLORS: Record<ProjectTier, number> = {
  LEGENDARY: 0xff6600,
  EPIC: 0xcc44ff,
  RARE: 0x4488ff,
  COMMON: 0x44aa66,
};

export const FORGE_COLORS = {
  primary: 0xc4813a,
  accent: 0xe8a54b,
  wheat: 0xf5deb3,
  background: 0x0a0806,
  ground: 0x1a1210,
  fireLight: 0xff6b1a,
  ember: 0xff6b1a,
  forgeEmber: 0xff4400,
} as const;

export const ZONE_COLORS = {
  hearth: 0xc4813a,
  'skill-tree': 0x44aa88,
  vault: 0xaa6622,
  timeline: 0x6644aa,
  'war-room': 0x22aacc,
} as const;
