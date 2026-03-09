"use client";

import { STORAGE_KEYS, type DailyLog, type FoodEntry, type UserProfile } from "./types";

// ==================== Generic Storage ====================

export function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

// ==================== Profile ====================

export function getProfile(): UserProfile | null {
  return getItem<UserProfile>(STORAGE_KEYS.PROFILE);
}

export function saveProfile(profile: UserProfile): void {
  setItem(STORAGE_KEYS.PROFILE, { ...profile, updatedAt: new Date().toISOString() });
}

// ==================== Daily Log ====================

function getLogKey(date: string): string {
  return `${STORAGE_KEYS.DAILY_LOG_PREFIX}${date}`;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDailyLog(date: string): DailyLog {
  const log = getItem<DailyLog>(getLogKey(date));
  return log ?? { date, entries: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } };
}

export function saveDailyLog(log: DailyLog): void {
  // Recalculate totals
  const totals = log.entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  setItem(getLogKey(log.date), { ...log, totals });
}

export function addFoodEntry(date: string, entry: FoodEntry): DailyLog {
  const log = getDailyLog(date);
  log.entries.push(entry);
  saveDailyLog(log);
  return getDailyLog(date); // Return fresh copy with recalculated totals
}

export function removeFoodEntry(date: string, entryId: string): DailyLog {
  const log = getDailyLog(date);
  log.entries = log.entries.filter((e) => e.id !== entryId);
  saveDailyLog(log);
  return getDailyLog(date);
}

export function updateFoodEntry(date: string, entryId: string, updates: Partial<FoodEntry>): DailyLog {
  const log = getDailyLog(date);
  log.entries = log.entries.map((e) => (e.id === entryId ? { ...e, ...updates } : e));
  saveDailyLog(log);
  return getDailyLog(date);
}

// ==================== All Logged Dates ====================

export function getLoggedDates(): string[] {
  if (typeof window === "undefined") return [];
  const dates: string[] = [];
  const prefix = STORAGE_KEYS.DAILY_LOG_PREFIX;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) {
      dates.push(key.slice(prefix.length));
    }
  }
  return dates.sort().reverse();
}

// ==================== Export / Import ====================

export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  if (typeof window === "undefined") return JSON.stringify(data);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("diet-tracker:")) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) ?? "null");
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("diet-tracker:")) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
    return true;
  } catch {
    return false;
  }
}
