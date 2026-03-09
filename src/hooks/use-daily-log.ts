"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDailyLog,
  saveDailyLog,
  formatDate,
  removeFoodEntry as removeEntry,
  updateFoodEntry as updateEntry,
} from "@/lib/storage";
import type { DailyLog, FoodEntry, MealType } from "@/lib/types";

export function useDailyLog(date?: Date) {
  const dateStr = formatDate(date ?? new Date());
  const [log, setLog] = useState<DailyLog>({
    date: dateStr,
    entries: [],
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  });

  const refresh = useCallback(() => {
    setLog(getDailyLog(dateStr));
  }, [dateStr]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEntry = useCallback(
    (entry: Omit<FoodEntry, "id" | "timestamp">) => {
      const fullEntry: FoodEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
      const currentLog = getDailyLog(dateStr);
      currentLog.entries.push(fullEntry);
      saveDailyLog(currentLog);
      refresh();
      return fullEntry;
    },
    [dateStr, refresh],
  );

  const removeEntry_ = useCallback(
    (entryId: string) => {
      removeEntry(dateStr, entryId);
      refresh();
    },
    [dateStr, refresh],
  );

  const updateEntry_ = useCallback(
    (entryId: string, updates: Partial<FoodEntry>) => {
      updateEntry(dateStr, entryId, updates);
      refresh();
    },
    [dateStr, refresh],
  );

  const getMealEntries = useCallback(
    (mealType: MealType) => {
      return log.entries.filter((e) => e.mealType === mealType);
    },
    [log.entries],
  );

  return {
    log,
    addEntry,
    removeEntry: removeEntry_,
    updateEntry: updateEntry_,
    getMealEntries,
    refresh,
  };
}
