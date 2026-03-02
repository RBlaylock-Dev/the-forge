// ── Union Types ──────────────────────────────────────────────

export type ZoneId = 'hearth' | 'skill-tree' | 'vault' | 'timeline' | 'war-room';

export type ProjectTier = 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON';

export type ArtifactShape = 'box' | 'ico' | 'octa' | 'torus' | 'cone' | 'sphere';

// ── Data Models ──────────────────────────────────────────────

export interface Project {
  name: string;
  desc: string;
  tags: string[];
  tier: ProjectTier;
  color: number;
  liveUrl?: string;
  codeUrl?: string;
  shape: ArtifactShape;
  screenshot?: string;
  role?: string;
}

export interface Skill {
  name: string;
  level: number; // 1-5
}

export interface SkillCategory {
  name: string;
  color: number;
  skills: Skill[];
}

export interface TimelineEra {
  era: string;
  org: string;
  years: string;
  skill: string;
  color: number;
}

export interface ActiveProject {
  name: string;
  desc: string;
  color: number;
  status: string;
}

// ── World ────────────────────────────────────────────────────

export interface ZoneDef {
  name: string;
  center: { x: number; z: number };
  radius: number;
}

// ── Detail Panel ─────────────────────────────────────────────

export type DetailData =
  | { type: 'project'; data: Project }
  | { type: 'skill-category'; data: SkillCategory }
  | { type: 'timeline-era'; data: TimelineEra }
  | { type: 'active-project'; data: ActiveProject };

// ── Zustand Store ────────────────────────────────────────────

export interface ForgeState {
  // Game state
  isStarted: boolean;

  // Player
  playerPosition: { x: number; y: number; z: number };
  playerYaw: number;
  playerPitch: number;

  // Zones
  currentZone: ZoneId | null;
  discoveredZones: Set<ZoneId>;
  lastDiscoveredZone: ZoneId | null;

  // Interaction
  interactTarget: { name: string; userData: DetailData } | null;
  activeDetail: DetailData | null;
  showDetail: boolean;

  // Teleport
  teleportTarget: { x: number; z: number; yaw: number } | null;

  // Navigation fly (smooth animation)
  flyTarget: { x: number; z: number; yaw: number } | null;

  // Tour
  isTourActive: boolean;
  tourStep: number;

  // Resume
  showResume: boolean;

  // Contact
  showContact: boolean;

  // Actions
  startGame: () => void;
  updatePlayerPosition: (x: number, y: number, z: number) => void;
  updatePlayerRotation: (yaw: number, pitch: number) => void;
  setCurrentZone: (zone: ZoneId | null) => void;
  discoverZone: (zone: ZoneId) => void;
  setInteractTarget: (target: { name: string; userData: DetailData } | null) => void;
  showDetailPanel: (data: DetailData) => void;
  closeDetailPanel: () => void;
  teleportTo: (x: number, z: number, yaw: number) => void;
  clearTeleport: () => void;
  flyToZone: (x: number, z: number, yaw: number) => void;
  clearFlyTarget: () => void;
  startTour: () => void;
  advanceTour: () => void;
  endTour: () => void;
  openResume: () => void;
  closeResume: () => void;
  openContact: () => void;
  closeContact: () => void;
}
