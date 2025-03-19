'use server'

import { db } from '@/src/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { user_macros, food_item } from '@/src/db/schema'
import { calculateCalories, calculateMacros } from '@/lib/utils'
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
}) {
    const session = await getCurrentSessionServer()
    const userId = session.user.id

    const { gender, weight, height, age, activityLevel } = formData

    // Calculate calories and macros
    const calories = Math.round(calculateCalories(gender, weight, height, age, activityLevel))
    const { protein, carbs, fat } = calculateMacros(calories, weight)

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

export async function addFoodItems(formData: FormData) {
    const session = await getCurrentSessionServer()
    const userId = session.user.id

    const names = formData.getAll('name')
    const calories = formData.getAll('calories')
    const proteins = formData.getAll('protein')
    const carbs = formData.getAll('carbs')
    const fats = formData.getAll('fat')
    const total_grams = formData.getAll('total_grams')
    const prices = formData.getAll('price')
    const categories = formData.getAll('category')

    const items = names.map((_, index) => ({
        userId,
        name: names[index] as string,
        calories: Number(calories[index]),
        protein: Number(proteins[index]),
        carbs: Number(carbs[index]),
        fat: Number(fats[index]),
        total_grams: Number(total_grams[index]),
        price: Number(prices[index]),
        category: categories[index] as string,
    }))

    items.map(async (item) => {
        await db.insert(food_item).values(item)
    })

    revalidatePath('/dashboard')
}

export async function createExerciseGroups(formData: FormData) {
    const session = await getCurrentSessionServer()
    const userId = session.user.id

    //TODO

    revalidatePath('/dashboard')
}
