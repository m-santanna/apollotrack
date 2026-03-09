"use client";

import { useCallback, useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/lib/storage";
import { calculateMacroTargets, calculateTDEE, calculateBMR } from "@/lib/macros";
import type { MacroTargets, UserProfile } from "@/lib/types";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [macroTargets, setMacroTargets] = useState<MacroTargets | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getProfile();
    setProfile(stored);
    if (stored) {
      setMacroTargets(calculateMacroTargets(stored));
    }
    setIsLoading(false);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      saveProfile(updated);
      setMacroTargets(calculateMacroTargets(updated));
      return updated;
    });
  }, []);

  const createProfile = useCallback((newProfile: UserProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
    setMacroTargets(calculateMacroTargets(newProfile));
  }, []);

  return {
    profile,
    macroTargets,
    isLoading,
    updateProfile,
    createProfile,
    tdee: profile ? calculateTDEE(profile) : null,
    bmr: profile ? calculateBMR(profile) : null,
  };
}
