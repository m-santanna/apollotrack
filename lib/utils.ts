import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const dietGoals = [
    { value: 'Hard Cut', label: 'Hard Cut (500 calories in deficit)' },
    { value: 'Cut', label: 'Cut (300 calories in deficit)' },
    { value: 'Slow Cut', label: 'Slow Cut (150 calories in deficit)' },
    { value: 'Maintenance', label: 'Maintenance (No deficit nor surplus)' },
    { value: 'Slow Bulk', label: 'Slow Bulk (150 calories in surplus)' },
    { value: 'Bulk', label: 'Bulk (300 calories in surplus)' },
    { value: 'Hard Bulk', label: 'Hard Bulk (500 calories in surplus)' },
]

export const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (office job)' },
    { value: 'light', label: 'Light Exercise (1-2 days/week)' },
    { value: 'moderate', label: 'Moderate Exercise (3-4 days/week)' },
    { value: 'active', label: 'Active Exercise (5-6 days/week)' },
    { value: 'heavy', label: 'Heavy Exercise (7 days/week)' },
    { value: 'athlete', label: 'Athlete (2x daily)' },
]
let dietGoalDict = {
    'Hard Cut': -500,
    Cut: -300,
    'Slow Cut': -150,
    Maintenance: 0,
    'Slow Bulk': 150,
    Bulk: 300,
    'Hard Bulk': 500,
}

export function calculateCalories(
    gender: string,
    weight: number,
    height: number,
    age: number,
    activityLevel: string,
    dietGoal: string,
) {
    let multFactorDict = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.465,
        active: 1.55,
        heavy: 1.725,
        athlete: 1.9,
    }
    let BMR: number
    // Calculate BMR based on gender using Mifflin-St Jeor equation
    if (gender === 'male') BMR = 10 * weight + 6.25 * height - 5 * age + 5
    else BMR = 10 * weight + 6.25 * height - 5 * age - 161

    // No need to check gender again since TDEE calculation is the same
    const TDEE = BMR * multFactorDict[activityLevel]
    return Math.round(TDEE + dietGoalDict[dietGoal])
}

export function calculateMacros(
    TDEE: number,
    weight: number,
    dietGoal: string,
) {
    const weightInLbs = 2.2 * weight
    let protein: number, carbs: number, fat: number
    // Convert percentages to grams using macronutrient calorie content
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram

    if (dietGoalDict[dietGoal] > 0) {
        protein = weightInLbs // 1g protein per lb of body weight
        fat = (TDEE * 0.25) / 9 // 25% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    } else if (dietGoalDict[dietGoal] < 0) {
        protein = weightInLbs * 1.6 // 1.6g protein per lb of body weight
        fat = (TDEE * 0.25) / 9 // 25% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    } else {
        protein = weightInLbs * 1 // 1g protein per lb of body weight
        fat = (TDEE * 0.3) / 9 // 30% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    }
    protein = Math.round(protein)
    fat = Math.round(fat)
    carbs = Math.round(carbs)
    return { protein, carbs, fat }
}
