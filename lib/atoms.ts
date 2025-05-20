import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai/vanilla'
import { z } from 'zod'

export const macrosSchema = z.object({
    calories: z.number().gt(0, 'Dont forget this value!'),
    protein: z.number().gt(0, 'Dont forget this value!'),
    fat: z.number().gt(0, 'Dont forget this value!'),
    carbs: z.number().gt(0, 'Dont forget this value!'),
    dietGoal: z.string(),
})
export type Macros = z.infer<typeof macrosSchema>

export const foodSchema = z.object({
    name: z.string().nonempty(),
    calories: z.number().gt(0, 'Dont forget this value!'),
    protein: z.number().gt(0, 'Dont forget this value!'),
    fat: z.number().gt(0, 'Dont forget this value!'),
    carbs: z.number().gt(0, 'Dont forget this value!'),
    price: z.number().gt(0, 'Dont forget this value!'),
    totalAmount: z.number().gt(0, 'Dont forget this value!'),
})
export type Food = z.infer<typeof foodSchema>

export const ingredientSchema = foodSchema.extend({
    usedAmount: z.number().gt(0, 'Dont forget this value!'),
})
export type Ingredient = z.infer<typeof ingredientSchema>

export const mealSchema = z.object({
    name: z.string().nonempty(),
    calories: z.number().gt(0, 'Dont forget this value!'),
    protein: z.number().gt(0, 'Dont forget this value!'),
    fat: z.number().gt(0, 'Dont forget this value!'),
    carbs: z.number().gt(0, 'Dont forget this value!'),
    price: z.number().gt(0, 'Dont forget this value!'),
    weight: z.number().gt(0, 'Dont forget this value!'),
    ingredients: ingredientSchema.array(),
})
export type Meal = z.infer<typeof mealSchema>

export const dailyIntakeSchema = z.object({
    calories: z.number(),
    protein: z.number(),
    fat: z.number(),
    carbs: z.number(),
    price: z.number(),
    meals: mealSchema.array(),
})
export type DailyIntake = z.infer<typeof dailyIntakeSchema>

export const estimateMacrosSchema = z.object({
    gender: z.enum(['male', 'female']),
    weight: z.number(),
    height: z.number(),
    age: z.number(),
    activityLevel: z.enum([
        'sedentary',
        'light',
        'moderate',
        'active',
        'heavy',
        'athlete',
    ]),
    dietGoal: z.enum([
        'Hard Cut',
        'Cut',
        'Slow Cut',
        'Maintenance',
        'Slow Bulk',
        'Bulk',
        'Hard Bulk',
    ]),
})

export const yourselfMacrosSchema = z.object({
    calories: z.number().gt(0, 'Dont forget this value!'),
    protein: z.number().gt(0, 'Dont forget this value!'),
    carbs: z.number().gt(0, 'Dont forget this value!'),
    fat: z.number().gt(0, 'Dont forget this value!'),
})

export const macrosAtom = atomWithStorage<Macros>('macros', {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    dietGoal: 'Maintenance',
})
export const foodListAtom = atomWithStorage<Food[]>('foodList', [])
export const macrosDialogYourselfAtom = atom(false)
export const macrosDialogEstimateAtom = atom(false)
export const macrosEditDialogAtom = atom(false)
export const addFoodItemDialogAtom = atom(false)
export const editFoodItemDialogAtom = atom(false)
export const editFoodItemValuesAtom = atom<Food>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    price: 0,
    totalAmount: 0,
})
export const createMealDialogAtom = atom(false)
export const mealsAtom = atomWithStorage<Meal[]>('meals', [])
export const mealInfoDialogAtom = atom(false)
export const mealInfoValuesAtom = atom({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    price: 0,
    weight: 0,
    ingredients: [] as Ingredient[],
})
export const editMealDialogAtom = atom(false)
export const dailyIntakeAtom = atomWithStorage<DailyIntake>('dailyIntake', {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    price: 0,
    meals: [],
})
export const setupDailyIntakeDialogAtom = atom(false)
export const editDailyIntakeDialogAtom = atom(false)
