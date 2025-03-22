import { z } from 'zod'

export const estimateMacrosFormSchema = z.object({
    gender: z.enum(['male', 'female'], {
        required_error: 'Please select your gender.',
    }),
    weight: z.number().min(30, {
        message: 'Weight must be at least 30 kg.',
    }),
    height: z.number().min(120, {
        message: 'Height must be at least 120 cm.',
    }),
    age: z
        .number()
        .min(16, {
            message: 'Age must be at least 16 years.',
        })
        .max(100, {
            message: 'Age must be at most 100 years.',
        }),
    activityLevel: z.number().min(0).max(4),
    dietGoal: z.string(),
})

export const yourselfMacrosFormSchema = z.object({
    calories: z.number().min(1000, {
        message: 'Calories must be at least 1000.',
    }),
    protein: z.number().min(50, {
        message: 'Protein must be at least 50g.',
    }),
    carbs: z.number().min(100, {
        message: 'Carbs must be at least 100g.',
    }),
    fat: z.number().min(30, { message: 'Fat must be at least 30g.' }),
    dietGoal: z.string(),
})

export type EstimateMacrosFormValues = z.infer<typeof estimateMacrosFormSchema>
export type YourselfMacrosFormValues = z.infer<typeof yourselfMacrosFormSchema>

export const activityLevels = [
    { value: 0, label: 'Sedentary (office job)' },
    { value: 1, label: 'Light Exercise (1-2 days/week)' },
    { value: 2, label: 'Moderate Exercise (3-5 days/week)' },
    { value: 3, label: 'Heavy Exercise (6-7 days/week)' },
    { value: 4, label: 'Athlete (2x daily)' },
]

export const dietGoalArray = [
    { value: 'Cut', label: 'Cutting' },
    { value: 'Bulk', label: 'Bulking' },
    { value: 'Maintenance', label: 'Maintaining' },
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
    if (gender === 'male') {
        BMR = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
        BMR = 10 * weight + 6.25 * height - 5 * age - 161
    }
    // No need to check gender again since TDEE calculation is the same
    const TDEE = BMR * multFactor[activityLevel]
    if (dietGoal === 'Cut') {
        // For cutting, subtract 300 calories
        return TDEE - 300
    } else if (dietGoal === 'Bulk') {
        // For bulking, add 300 calories
        return TDEE + 300
    }
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
    } else if (dietGoal === 'Cut') {
        protein = weightInLbs * 1.6 // 1.6g protein per lb of body weight
        fat = (TDEE * 0.25) / 9 // 25% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    } else {
        protein = weightInLbs * 1 // 1.2g protein per lb of body weight
        fat = (TDEE * 0.3) / 9 // 30% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    }
    return { protein, carbs, fat }
}
