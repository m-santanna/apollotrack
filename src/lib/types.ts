// ==================== User Profile ====================

export type Sex = "male" | "female";

export type WeightUnit = "kg" | "lbs";
export type HeightUnit = "cm" | "ft";

export interface UserProfile {
  sex: Sex;
  age: number;
  weight: number;
  weightUnit: WeightUnit;
  height: number;
  heightUnit: HeightUnit;
  activityMultiplier: number; // 1.2 (sedentary) to 1.9 (very active)
  calorieAdjustment: number; // -750 to +500 kcal
  providers: AIProvider[];
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== Macro Targets ====================

export interface MacroTargets {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

// ==================== Food Entry ====================

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
  mealType: MealType;
  source: "ai" | "manual";
  imageData?: string; // base64 thumbnail for reference
  timestamp: string;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

// ==================== Daily Log ====================

export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
  totals: MacroTargets;
}

// ==================== AI Analysis ====================

export interface AIAnalysisResult {
  foods: AIFoodItem[];
  confidence: "high" | "medium" | "low";
  notes?: string;
}

export interface AIFoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export type AIProvider = "openai" | "gemini";

// ==================== AI Model Registry ====================

export interface AIModel {
  id: string;
  label: string;
  provider: AIProvider;
}

export const MODEL_REGISTRY: AIModel[] = [
  {
    id: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash-Lite",
    provider: "gemini",
  },
  {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    provider: "gemini",
  },
  {
    id: "gpt-4o-mini",
    label: "GPT-4o Mini",
    provider: "openai",
  },
  {
    id: "gpt-4.1-nano",
    label: "GPT-4.1 Nano",
    provider: "openai",
  },
  {
    id: "gpt-4.1-mini",
    label: "GPT-4.1 Mini",
    provider: "openai",
  },
];

export interface APIKeyConfig {
  provider: AIProvider;
  keyPreview: string; // last 4 chars for display
  createdAt: string;
}

// ==================== Storage Keys ====================

export const STORAGE_KEYS = {
  PROFILE: "profile",
  DAILY_LOG_PREFIX: "log:",
  PROVIDERS: "providers",
  PREFERRED_MODEL: "preferred-model",
} as const;
