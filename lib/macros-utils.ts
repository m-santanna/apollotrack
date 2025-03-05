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
