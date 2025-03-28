'use server'

import { db } from '@/src/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { user_macros, user_food } from '@/src/db/schema'
import { calculateCalories, calculateMacros } from '@/lib/macros-utils'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

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
    dietGoal: string
}) {
    const session = await getCurrentSessionServer()
    const userId = session.user.id

    const { gender, weight, height, age, activityLevel, dietGoal } = formData

    // Calculate calories and macros
    const calories = Math.round(calculateCalories(gender, weight, height, age, activityLevel, dietGoal))
    const { protein, carbs, fat } = calculateMacros(calories, weight, dietGoal)

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
                diet_goal: dietGoal,
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
            diet_goal: dietGoal,
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
    dietGoal: string
}) {
    const session = await getCurrentSessionServer()
    const userId = session.user.id

    const { calories, protein, carbs, fat, dietGoal } = formData

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
                diet_goal: dietGoal,
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
            diet_goal: dietGoal,
        })
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function addFoodItems(formData: FormData) {
    const session = await getCurrentSessionServer()
    const userId = session.user.id

    const names = formData.getAll('name')
    const foodIds = formData.getAll('foodId')
    const total_grams = formData.getAll('total_grams')
    const prices = formData.getAll('price')

    const items = names.map((_, index) => ({
        userId,
        foodId: foodIds[index] as string,
        name: names[index] as string,
        total_grams: Number(total_grams[index]),
        price: Number(prices[index]),
    }))

    items.map(async (item) => {
        await db.insert(user_food).values(item)
    })

    revalidatePath('/dashboard')
}

export async function createExerciseGroups(formData: FormData) {
    const session = await getCurrentSessionServer()
    const userId = session.user.id

    //TODO

    revalidatePath('/dashboard')
}
