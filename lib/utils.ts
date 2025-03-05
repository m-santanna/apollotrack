import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function calculateCalories(
    gender: string,
    weight: number,
    height: number,
    age: number,
    activityLevel: 0 | 1 | 2 | 3 | 4,
) {
    let multFactor = [1.2, 1.375, 1.55, 1.725, 1.9]
    let BMR
    // Calculate BMR based on gender using Mifflin-St Jeor equation
    if (gender === 'male') {
        BMR = 66.47 + weight * 13.75 + height * 5.003 - age * 6.755
    } else {
        BMR = 655.1 + weight * 9.563 + height * 1.85 - age * 4.676
    }
    // No need to check gender again since TDEE calculation is the same
    const TDEE = BMR * multFactor[activityLevel]
    return TDEE
}

export function calculateMacros(TDEE: number) {
    // Convert percentages to grams using macronutrient calorie content
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram
    const protein = (TDEE * 0.25) / 4 // 25% of calories from protein
    const carbs = (TDEE * 0.5) / 4 // 50% of calories from carbs
    const fat = (TDEE * 0.25) / 9 // 25% of calories from fat

    return { protein, carbs, fat }
}
