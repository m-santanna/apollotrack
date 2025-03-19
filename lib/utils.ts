import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Function to handle number input changes
export const handleInputNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: number) => void) => {
    if (e.target.value === '' || e.target.value === '-') {
        e.target.value = ''
        onChange(0)
        return
    }
    if (e.target.value.length > 1 && e.target.value.startsWith('0') && !e.target.value.startsWith('0.')) {
        e.target.value = e.target.value.replace(/^0+/, '')
    }
    onChange(Number(e.target.value))
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
        BMR = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
        BMR = 10 * weight + 6.25 * height - 5 * age - 161
    }
    // No need to check gender again since TDEE calculation is the same
    const TDEE = BMR * multFactor[activityLevel]
    return TDEE
}

export function calculateMacros(TDEE: number, weight: number) {
    // Convert percentages to grams using macronutrient calorie content
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram
    const weightInLbs = 2.2 * weight
    const protein = weightInLbs // 1g protein per lb of body weight
    const fat = (TDEE * 0.2) / 9 // 20% of calories from fat
    const carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs

    return { protein, carbs, fat }
}
