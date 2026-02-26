import type { ZoneId, ZoneDef } from '@/types';

export const ZONE_DEFS: Record<ZoneId, ZoneDef> = {
  hearth: {
    name: 'The Hearth',
    center: { x: 0, z: 0 },
    radius: 10,
  },
  'skill-tree': {
    name: 'The Skill Tree',
    center: { x: -22, z: 0 },
    radius: 10,
  },
  vault: {
    name: 'The Project Vault',
    center: { x: 22, z: 0 },
    radius: 12,
  },
  timeline: {
    name: 'The Timeline',
    center: { x: 0, z: -24 },
    radius: 10,
  },
  'war-room': {
    name: 'The War Room',
    center: { x: 0, z: 24 },
    radius: 10,
  },
};
