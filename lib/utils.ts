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
    activityLevel: 0 | 1 | 2 | 3 | 4
) {
    let multFactor = [1.2, 1.375, 1.55, 1.725, 1.9]
    let BMR
    let TDEE
    if (gender === 'male') {
        BMR = 66.47 + weight * 13.75 + height * 5.003 - age * 6.755
    } else {
        BMR = 655.1 + weight * 9.563 + height * 1.85 - age * 4.676
    }
    if (gender === 'male') {
        TDEE = BMR * multFactor[activityLevel]
    } else {
        TDEE = BMR * multFactor[activityLevel]
    }
    return TDEE
}

export function calculateMacros(gender: string, weight: number, TDEE: number) {
    let protein = 0
    let carbs = 0
    let fat = 0

    if (gender === 'male') {
        protein = weight * 1.6
        carbs = weight * 2.5
        fat = (TDEE - protein * 4 - carbs * 4) / 9
    } else {
        protein = weight * 1.4
        carbs = weight * 2.3
        fat = (TDEE - protein * 4 - carbs * 4) / 9
    }

    return { protein, carbs, fat }
}
