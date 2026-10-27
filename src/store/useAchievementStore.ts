import { create } from 'zustand';

const STORAGE_KEY = 'forge-achievements';

interface UnlockedEntry {
  id: string;
  unlockedAt: number;
}

interface AchievementState {
  unlocked: Map<string, number>; // id → timestamp
  pending: string[]; // ids awaiting toast display

  unlock: (id: string) => void;
  dismissToast: (id: string) => void;
}

function loadUnlocked(): Map<string, number> {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return new Map();
    const entries: UnlockedEntry[] = JSON.parse(raw);
    return new Map(entries.map((e) => [e.id, e.unlockedAt]));
  } catch {
    return new Map();
  }
}

function saveUnlocked(unlocked: Map<string, number>) {
  try {
    const entries: UnlockedEntry[] = Array.from(unlocked.entries()).map(([id, unlockedAt]) => ({
      id,
      unlockedAt,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* quota or SSR */
  }
}

const hydrated = loadUnlocked();

export const useAchievementStore = create<AchievementState>()((set) => ({
  unlocked: hydrated,
  pending: [],

  unlock: (id: string) =>
    set((state) => {
      if (state.unlocked.has(id)) return state;
      const next = new Map(state.unlocked);
      next.set(id, Date.now());
      saveUnlocked(next);
      return { unlocked: next, pending: [...state.pending, id] };
    }),

  dismissToast: (id: string) =>
    set((state) => ({
      pending: state.pending.filter((p) => p !== id),
    })),
}));
