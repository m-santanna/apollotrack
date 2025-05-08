import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const activityLevels = [
    { value: 0, label: 'Sedentary (office job)' },
    { value: 1, label: 'Light Exercise (1-2 days/week)' },
    { value: 2, label: 'Moderate Exercise (3-5 days/week)' },
    { value: 3, label: 'Heavy Exercise (6-7 days/week)' },
    { value: 4, label: 'Athlete (2x daily)' },
]

export const dietGoalArray = [
    { value: 'Hard Cut', label: 'Hard Cut' },
    { value: 'Cut', label: 'Cut' },
    { value: 'Maintenance', label: 'Maintain Weight' },
    { value: 'Bulk', label: 'Bulk' },
    { value: 'Hard Bulk', label: 'Hard Bulk' },
]

export function calculateCalories(
    gender: string,
    weight: number,
    height: number,
    age: number,
    activityLevel: 0 | 1 | 2 | 3 | 4,
    dietGoal: string,
) {
    let multFactor = [1.2, 1.375, 1.55, 1.725, 1.9]
    let BMR
    // Calculate BMR based on gender using Mifflin-St Jeor equation
    if (gender === 'male') 
        BMR = 10 * weight + 6.25 * height - 5 * age + 5
     else 
        BMR = 10 * weight + 6.25 * height - 5 * age - 161
    
    // No need to check gender again since TDEE calculation is the same
    const TDEE = BMR * multFactor[activityLevel]
    if (dietGoal === 'Hard Cut') 
        // For hard cutting, subtract 500 calories
        return TDEE - 500
    else if (dietGoal === 'Cut') 
        // For cutting, subtract 300 calories
        return TDEE - 300
    else if (dietGoal === 'Hard Bulk') 
        // For hard bulking, add 500 calories
        return TDEE + 500
    else if (dietGoal === 'Bulk') 
        // For bulking, add 300 calories
        return TDEE + 300
    // For maintenance, return TDEE as is
    return TDEE
}

export function calculateMacros(TDEE: number, weight: number, dietGoal: string) {
    const weightInLbs = 2.2 * weight
    let protein, carbs, fat
    // Convert percentages to grams using macronutrient calorie content
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram

    if (dietGoal === 'Maintenance') {
        protein = weightInLbs // 1g protein per lb of body weight
        fat = (TDEE * 0.25) / 9 // 25% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    } else if (dietGoal === 'Cut' || dietGoal === 'Hard Cut') {
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

