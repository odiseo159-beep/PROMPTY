"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SandboxEntry {
  id: string;
  prompt: string;
  score: number;
  timestamp: string;
  badges: string[];
}

export interface ProgressState {
  // User Identity
  userId: string | null;
  username: string | null;

  // XP & Leveling
  currentXP: number;
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;

  // Streaks
  streakDays: number;
  lastActivityDate: string | null;
  longestStreak: number;

  // Lessons
  completedLessons: string[];
  currentLessonId: string | null;

  // Badges
  earnedBadges: string[];

  // Sandbox History
  sandboxHistory: SandboxEntry[];
}

interface ProgressActions {
  /** Add XP and auto-level up when threshold is crossed. */
  addXP: (amount: number) => void;

  /** Check if today continues the streak; increment or reset accordingly. */
  updateStreak: () => void;

  /** Mark a lesson as completed (idempotent). */
  completeLesson: (lessonId: string) => void;

  /** Earn a badge (idempotent). */
  earnBadge: (badgeId: string) => void;

  /** Add a sandbox history entry with an auto-generated ID. */
  addSandboxEntry: (entry: Omit<SandboxEntry, "id">) => void;

  /** Set user identity. */
  setUser: (userId: string, username: string) => void;

  /** Reset all progress while keeping userId and username. */
  resetProgress: () => void;
}

export type ProgressStore = ProgressState & ProgressActions;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the **cumulative** total XP required to reach the given level.
 * Level 1 requires 100 XP, level 2 requires 200 XP on top of that, etc.
 * Total to reach level N = sum(i * 100 for i in 1..N-1)
 */
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  // Sum of arithmetic series: (level-1) * level / 2 * 100
  return ((level - 1) * level * 100) / 2;
}

/** Returns the XP needed to advance from the current level to the next. */
function xpThresholdForLevel(level: number): number {
  return level * 100;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

const initialState: ProgressState = {
  userId: null,
  username: null,
  currentXP: 0,
  totalXP: 0,
  currentLevel: 1,
  xpToNextLevel: 100,
  streakDays: 0,
  lastActivityDate: null,
  longestStreak: 0,
  completedLessons: [],
  currentLessonId: null,
  earnedBadges: [],
  sandboxHistory: [],
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXP(amount: number) {
        set((state) => {
          let { currentXP, totalXP, currentLevel } = state;
          currentXP += amount;
          totalXP += amount;

          // Level-up loop: keep levelling up while XP exceeds current threshold
          while (currentXP >= xpThresholdForLevel(currentLevel)) {
            currentXP -= xpThresholdForLevel(currentLevel);
            currentLevel += 1;
          }

          const xpToNextLevel = xpThresholdForLevel(currentLevel) - currentXP;

          return { currentXP, totalXP, currentLevel, xpToNextLevel };
        });
      },

      updateStreak() {
        set((state) => {
          const today = todayISO();
          const yesterday = yesterdayISO();
          const { lastActivityDate, streakDays, longestStreak } = state;

          if (lastActivityDate === today) {
            // Already recorded activity today — no change
            return {};
          }

          let newStreak: number;
          if (lastActivityDate === yesterday) {
            // Continuing the streak
            newStreak = streakDays + 1;
          } else {
            // Streak broken (or first activity)
            newStreak = 1;
          }

          return {
            streakDays: newStreak,
            lastActivityDate: today,
            longestStreak: Math.max(longestStreak, newStreak),
          };
        });
      },

      completeLesson(lessonId: string) {
        set((state) => {
          if (state.completedLessons.includes(lessonId)) return {};
          return { completedLessons: [...state.completedLessons, lessonId] };
        });
      },

      earnBadge(badgeId: string) {
        set((state) => {
          if (state.earnedBadges.includes(badgeId)) return {};
          return { earnedBadges: [...state.earnedBadges, badgeId] };
        });
      },

      addSandboxEntry(entry: Omit<SandboxEntry, "id">) {
        const newEntry: SandboxEntry = { id: generateId(), ...entry };
        set((state) => ({
          sandboxHistory: [newEntry, ...state.sandboxHistory],
        }));
      },

      setUser(userId: string, username: string) {
        set({ userId, username });
      },

      resetProgress() {
        const { userId, username } = get();
        set({ ...initialState, userId, username });
      },
    }),
    {
      name: "promptly-progress",
    }
  )
);
