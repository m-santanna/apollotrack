import type { MacroTargets, UserProfile } from "./types";

// ==================== Unit Conversions ====================

function toKg(weight: number, unit: string): number {
  return unit === "lbs" ? weight * 0.453592 : weight;
}

function toCm(height: number, unit: string): number {
  return unit === "ft" ? height * 30.48 : height;
}

// ==================== Mifflin-St Jeor Formula ====================

export function calculateBMR(profile: UserProfile): number {
  const weightKg = toKg(profile.weight, profile.weightUnit);
  const heightCm = toCm(profile.height, profile.heightUnit);

  if (profile.sex === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * profile.age + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161;
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  return Math.round(bmr * profile.activityMultiplier);
}

export function calculateTargetCalories(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  return Math.round(tdee + profile.calorieAdjustment);
}

// ==================== Macro Split ====================
// Protein: continuous g/kg based on calorie adjustment
// Fat: 25% of calories
// Carbs: remaining calories

export function calculateMacroTargets(profile: UserProfile): MacroTargets {
  const calories = calculateTargetCalories(profile);
  const weightKg = toKg(profile.weight, profile.weightUnit);

  // Protein g/kg: scale based on calorie adjustment
  // Deficit → higher protein (preserve muscle), surplus → moderate protein
  // Range: 1.8 g/kg (max surplus) to 2.4 g/kg (max deficit)
  let proteinPerKg: number;
  if (profile.calorieAdjustment <= -500) {
    // Aggressive deficit: highest protein
    proteinPerKg = 2.4;
  } else if (profile.calorieAdjustment < 0) {
    // Linear interpolation: -500 → 2.4, 0 → 2.0
    proteinPerKg = 2.0 + (Math.abs(profile.calorieAdjustment) / 500) * 0.4;
  } else if (profile.calorieAdjustment === 0) {
    proteinPerKg = 2.0;
  } else {
    // Surplus: linear interpolation: 0 → 2.0, +500 → 1.8
    proteinPerKg = 2.0 - (profile.calorieAdjustment / 500) * 0.2;
  }

  const protein = Math.round(weightKg * proteinPerKg);
  const proteinCalories = protein * 4;

  // Fat: 25% of total calories
  const fatCalories = calories * 0.25;
  const fat = Math.round(fatCalories / 9);

  // Carbs: remaining calories
  const carbCalories = calories - proteinCalories - fatCalories;
  const carbs = Math.max(0, Math.round(carbCalories / 4));

  return { calories, protein, carbs, fat };
}

// ==================== Display Helpers ====================

export function formatCalorieAdjustment(adjustment: number): string {
  if (adjustment === 0) return "Maintain";
  if (adjustment > 0) return `+${adjustment} kcal`;
  return `${adjustment} kcal`;
}

export function formatActivityMultiplier(multiplier: number): string {
  if (multiplier <= 1.3) return "Sedentary";
  if (multiplier <= 1.5) return "Light";
  if (multiplier <= 1.65) return "Moderate";
  if (multiplier <= 1.8) return "Active";
  return "Very Active";
}
