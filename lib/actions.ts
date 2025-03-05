'use server'

import { db } from '@/src/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { user_macros } from '@/src/db/schema'
import { calculateCalories, calculateMacros } from '@/lib/utils'
import { eq } from 'drizzle-orm'

// Helper function to get the current session
export async function getCurrentSessionServer() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.id) {
        throw new Error('Not authenticated')
    }
    return session
}

export async function saveUserMacrosEstimate(formData: {
    gender: string
    weight: number
    height: number
    age: number
    activityLevel: 0 | 1 | 2 | 3 | 4
}) {
    const session = await getCurrentSessionServer()
    const userId = session.user.id

    const { gender, weight, height, age, activityLevel } = formData

    // Calculate calories and macros
    const calories = Math.round(calculateCalories(gender, weight, height, age, activityLevel))
    const { protein, carbs, fat } = calculateMacros(calories)

    // Check if user already has macros saved
    const existingMacros = await db.select().from(user_macros).where(eq(user_macros.userId, userId))

    if (existingMacros.length > 0) {
        // Update existing macros
        await db
            .update(user_macros)
            .set({
                daily_calories: Math.round(calories),
                daily_protein: Math.round(protein),
                daily_carbs: Math.round(carbs),
                daily_fat: Math.round(fat),
            })
            .where(eq(user_macros.userId, userId))
    } else {
        // Insert new macros
        await db.insert(user_macros).values({
            userId,
            daily_calories: Math.round(calories),
            daily_protein: Math.round(protein),
            daily_carbs: Math.round(carbs),
            daily_fat: Math.round(fat),
        })
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function saveUserMacrosYourself(formData: {
    calories: number
    protein: number
    carbs: number
    fat: number
}) {
    const session = await getCurrentSessionServer()
    const userId = session.user.id

    const { calories, protein, carbs, fat } = formData

    await db.insert(user_macros).values({
        userId,
        daily_calories: calories,
        daily_protein: protein,
        daily_carbs: carbs,
        daily_fat: fat,
    })

    revalidatePath('/dashboard')
    return { success: true }
}
