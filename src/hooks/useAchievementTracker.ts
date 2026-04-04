'use client';

import { useEffect } from 'react';
import { useForgeStore } from '@/store/useForgeStore';
import { useAchievementStore } from '@/store/useAchievementStore';
import { ACHIEVEMENTS } from '@/data/achievements';

/**
 * useAchievementTracker — Evaluates achievement conditions against
 * the current forge state and unlocks any newly earned achievements.
 * Runs on every relevant state change.
 */
export function useAchievementTracker() {
  const forgeState = useForgeStore();
  const unlock = useAchievementStore((s) => s.unlock);
  const unlocked = useAchievementStore((s) => s.unlocked);

  useEffect(() => {
    if (!forgeState.isStarted) return;

    for (const achievement of ACHIEVEMENTS) {
      if (unlocked.has(achievement.id)) continue;
      try {
        if (achievement.condition(forgeState)) {
          unlock(achievement.id);
        }
      } catch {
        /* condition threw — skip */
      }
    }
  }, [
    forgeState.isStarted,
    forgeState.discoveredZones,
    forgeState.discoveredProjects,
    forgeState.discoveredSubcategories,
    forgeState.discoveredEras,
    forgeState.discoveredActiveProjects,
    forgeState.resumeDownloaded,
    unlock,
    unlocked,
  ]);
}
