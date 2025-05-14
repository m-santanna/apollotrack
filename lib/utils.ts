import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (office job)' },
    { value: 'light', label: 'Light Exercise (1-2 days/week)' },
    { value: 'moderate', label: 'Moderate Exercise (3-5 days/week)' },
    { value: 'heavy', label: 'Heavy Exercise (6-7 days/week)' },
    { value: 'athlete', label: 'Athlete (2x daily)' },
]

export function calculateCalories(
    gender: string,
    weight: number,
    height: number,
    age: number,
    activityLevel: string,
    caloricVariance: number,
) {
    let multFactorDict = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        heavy: 1.725,
        athlete: 1.9,
    }
    let BMR: number
    // Calculate BMR based on gender using Mifflin-St Jeor equation
    if (gender === 'male') BMR = 10 * weight + 6.25 * height - 5 * age + 5
    else BMR = 10 * weight + 6.25 * height - 5 * age - 161

    // No need to check gender again since TDEE calculation is the same
    const TDEE = BMR * multFactorDict[activityLevel]
    return TDEE + caloricVariance
}

export function calculateMacros(
    TDEE: number,
    weight: number,
    caloricVariance: number,
) {
    const weightInLbs = 2.2 * weight
    let protein, carbs, fat
    // Convert percentages to grams using macronutrient calorie content
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram

    if (caloricVariance > 0) {
        protein = weightInLbs // 1g protein per lb of body weight
        fat = (TDEE * 0.25) / 9 // 25% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    } else if (caloricVariance < 0) {
        protein = weightInLbs * 1.6 // 1.6g protein per lb of body weight
        fat = (TDEE * 0.25) / 9 // 25% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    } else {
        protein = weightInLbs * 1 // 1g protein per lb of body weight
        fat = (TDEE * 0.3) / 9 // 30% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    }
    return { protein, carbs, fat }
}
