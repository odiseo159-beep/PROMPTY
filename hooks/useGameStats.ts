"use client";

import { useProgressStore, getXPForLevel, SandboxEntry } from "../store";

interface GameStats {
  // Derived / computed
  levelProgress: number;         // 0-100, percentage through current level
  isStreakActive: boolean;       // true if activity recorded today or yesterday
  recentSandboxEntries: SandboxEntry[];  // last 5 entries
  badgeCount: number;

  // Raw store values
  userId: string | null;
  username: string | null;
  currentXP: number;
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  streakDays: number;
  longestStreak: number;
  lastActivityDate: string | null;
  completedLessons: string[];
  currentLessonId: string | null;
  earnedBadges: string[];
  sandboxHistory: SandboxEntry[];

  // Actions
  addXP: (amount: number) => void;
  updateStreak: () => void;
  completeLesson: (lessonId: string) => void;
  earnBadge: (badgeId: string) => void;
  addSandboxEntry: (entry: Omit<SandboxEntry, "id">) => void;
  setUser: (userId: string, username: string) => void;
  resetProgress: () => void;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

/**
 * useGameStats — a derived hook on top of useProgressStore.
 * Computes gamification stats and exposes them alongside all raw store values and actions.
 */
export function useGameStats(): GameStats {
  const store = useProgressStore();

  const {
    currentXP,
    currentLevel,
    lastActivityDate,
    sandboxHistory,
    earnedBadges,
  } = store;

  // Percentage progress through the current level
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForLevel(currentLevel + 1);
  const levelRange = xpForNextLevel - xpForCurrentLevel;
  const xpIntoLevel = currentXP; // currentXP is always relative within the level
  const levelProgress =
    levelRange > 0 ? Math.min(100, Math.round((xpIntoLevel / (levelRange)) * 100)) : 100;

  // Streak is active if the last activity was today or yesterday
  const today = todayISO();
  const yesterday = yesterdayISO();
  const isStreakActive =
    lastActivityDate === today || lastActivityDate === yesterday;

  // Last 5 sandbox entries (already stored newest-first)
  const recentSandboxEntries = sandboxHistory.slice(0, 5);

  return {
    // Derived
    levelProgress,
    isStreakActive,
    recentSandboxEntries,
    badgeCount: earnedBadges.length,

    // Raw store values
    userId: store.userId,
    username: store.username,
    currentXP: store.currentXP,
    totalXP: store.totalXP,
    currentLevel: store.currentLevel,
    xpToNextLevel: store.xpToNextLevel,
    streakDays: store.streakDays,
    longestStreak: store.longestStreak,
    lastActivityDate: store.lastActivityDate,
    completedLessons: store.completedLessons,
    currentLessonId: store.currentLessonId,
    earnedBadges: store.earnedBadges,
    sandboxHistory: store.sandboxHistory,

    // Actions
    addXP: store.addXP,
    updateStreak: store.updateStreak,
    completeLesson: store.completeLesson,
    earnBadge: store.earnBadge,
    addSandboxEntry: store.addSandboxEntry,
    setUser: store.setUser,
    resetProgress: store.resetProgress,
  };
}
