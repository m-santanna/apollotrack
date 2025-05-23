import { clsx, type ClassValue } from 'clsx'
import { useSetAtom } from 'jotai/react'
import { twMerge } from 'tailwind-merge'
import {
    DailyIntake,
    dailyIntakeAtom,
    Food,
    Ingredient,
    Meal,
    mealsAtom,
} from './atoms'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const dietGoals = [
    { value: 'Hard Cut', label: 'Hard Cut (500 calories in deficit)' },
    { value: 'Cut', label: 'Cut (300 calories in deficit)' },
    { value: 'Slow Cut', label: 'Slow Cut (150 calories in deficit)' },
    { value: 'Maintenance', label: 'Maintenance (No deficit nor surplus)' },
    { value: 'Slow Bulk', label: 'Slow Bulk (150 calories in surplus)' },
    { value: 'Bulk', label: 'Bulk (300 calories in surplus)' },
    { value: 'Hard Bulk', label: 'Hard Bulk (500 calories in surplus)' },
]

export const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (office job)' },
    { value: 'light', label: 'Light Exercise (1-2 days/week)' },
    { value: 'moderate', label: 'Moderate Exercise (3-4 days/week)' },
    { value: 'active', label: 'Active Exercise (5-6 days/week)' },
    { value: 'heavy', label: 'Heavy Exercise (7 days/week)' },
    { value: 'athlete', label: 'Athlete (2x daily)' },
]
let dietGoalDict = {
    'Hard Cut': -500,
    Cut: -300,
    'Slow Cut': -150,
    Maintenance: 0,
    'Slow Bulk': 150,
    Bulk: 300,
    'Hard Bulk': 500,
}

export function calculateCalories(
    gender: string,
    weight: number,
    height: number,
    age: number,
    activityLevel: string,
    dietGoal: string,
) {
    let multFactorDict = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.465,
        active: 1.55,
        heavy: 1.725,
        athlete: 1.9,
    }
    let BMR: number
    // Calculate BMR based on gender using Mifflin-St Jeor equation
    if (gender === 'male') BMR = 10 * weight + 6.25 * height - 5 * age + 5
    else BMR = 10 * weight + 6.25 * height - 5 * age - 161

    // No need to check gender again since TDEE calculation is the same
    const TDEE = BMR * multFactorDict[activityLevel]
    return Math.round(TDEE + dietGoalDict[dietGoal])
}

export function calculateMacros(
    TDEE: number,
    weight: number,
    dietGoal: string,
) {
    const weightInLbs = 2.2 * weight
    let protein: number, carbs: number, fat: number
    // Convert percentages to grams using macronutrient calorie content
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram

    if (dietGoalDict[dietGoal] > 0) {
        protein = weightInLbs // 1g protein per lb of body weight
        fat = (TDEE * 0.25) / 9 // 25% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    } else if (dietGoalDict[dietGoal] < 0) {
        protein = weightInLbs * 1.6 // 1.6g protein per lb of body weight
        fat = (TDEE * 0.25) / 9 // 25% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    } else {
        protein = weightInLbs * 1 // 1g protein per lb of body weight
        fat = (TDEE * 0.3) / 9 // 30% of calories from fat
        carbs = (TDEE - fat * 9 - protein * 4) / 4 // Remaining calories from carbs
    }
    protein = Math.round(protein)
    fat = Math.round(fat)
    carbs = Math.round(carbs)
    return { protein, carbs, fat }
}

export function roundNumber(value: number): number {
    return Math.round(value * 100) / 100
}

export function updateSystemThroughFood(
    foodPrev: Food,
    foodAfter: Food | undefined,
    meals: Meal[],
    setMeals: ReturnType<typeof useSetAtom<typeof mealsAtom>>,
    daily: DailyIntake,
    setDaily: ReturnType<typeof useSetAtom<typeof dailyIntakeAtom>>,
) {
    for (let i = 0; i < meals.length; i++) {
        const currMeal = meals[i]
        for (let j = 0; j < currMeal.ingredients.length; j++) {
            if (foodEqualsIngredient(currMeal.ingredients[j], foodPrev))
                updateMealThroughFood(
                    foodPrev,
                    foodAfter,
                    meals,
                    setMeals,
                    currMeal,
                    j,
                    daily,
                    setDaily,
                )
        }
    }
}

function foodEqualsIngredient(ingredient: Ingredient, food: Food) {
    return (
        ingredient.name === food.name &&
        ingredient.calories === food.calories &&
        ingredient.carbs === food.carbs &&
        ingredient.protein === food.protein &&
        ingredient.fat === food.fat &&
        ingredient.price === food.price
    )
}

function updateMealThroughFood(
    foodPrev: Food,
    foodAfter: Food | undefined,
    meals: Meal[],
    setMeals: ReturnType<typeof useSetAtom<typeof mealsAtom>>,
    meal: Meal,
    ingredientPos: number,
    daily: DailyIntake,
    setDaily: ReturnType<typeof useSetAtom<typeof dailyIntakeAtom>>,
) {
    const filteredMeals = meals.filter((currMeal) => currMeal !== meal)

    // The following code updates the values of the meal
    const ingredientUsedAmount = meal.ingredients[ingredientPos].usedAmount
    let caloriesDiff: number,
        carbsDiff: number,
        proteinDiff: number,
        fatDiff: number,
        priceDiff: number,
        weightDiff = 0
    if (foodAfter) {
        caloriesDiff =
            (foodAfter.calories * ingredientUsedAmount) / 100 -
            (foodPrev.calories * ingredientUsedAmount) / 100

        carbsDiff =
            (foodAfter.carbs * ingredientUsedAmount) / 100 -
            (foodPrev.carbs * ingredientUsedAmount) / 100

        proteinDiff =
            (foodAfter.protein * ingredientUsedAmount) / 100 -
            (foodPrev.protein * ingredientUsedAmount) / 100

        fatDiff =
            (foodAfter.fat * ingredientUsedAmount) / 100 -
            (foodPrev.fat * ingredientUsedAmount) / 100

        priceDiff =
            (foodAfter.price * ingredientUsedAmount) / foodAfter.totalAmount -
            (foodPrev.price * ingredientUsedAmount) / foodPrev.totalAmount
    } else {
        caloriesDiff = (-1 * (foodPrev.calories * ingredientUsedAmount)) / 100
        carbsDiff = (-1 * (foodPrev.carbs * ingredientUsedAmount)) / 100
        proteinDiff = (-1 * (foodPrev.protein * ingredientUsedAmount)) / 100
        fatDiff = (-1 * (foodPrev.fat * ingredientUsedAmount)) / 100
        priceDiff =
            (-1 * (foodPrev.price * ingredientUsedAmount)) /
            foodPrev.totalAmount
        weightDiff = -ingredientUsedAmount
    }
    const newMeal = {
        name: meal.name,
        calories: roundNumber(meal.calories + caloriesDiff),
        carbs: roundNumber(meal.carbs + carbsDiff),
        protein: roundNumber(meal.protein + proteinDiff),
        fat: roundNumber(meal.fat + fatDiff),
        price: roundNumber(meal.price + priceDiff),
        weight: roundNumber(meal.weight - ingredientUsedAmount),
        ingredients: meal.ingredients,
    }
    // The following code updates the ingredient
    if (foodAfter) {
        newMeal.ingredients[ingredientPos] = {
            ...foodAfter,
            usedAmount: ingredientUsedAmount,
        }
    } else
        newMeal.ingredients = newMeal.ingredients.filter(
            (_, index) => index != ingredientPos,
        )
    if (newMeal.ingredients.length == 0) setMeals(filteredMeals)
    else setMeals([...filteredMeals, newMeal])
    updateDailyThroughFood(newMeal, daily, setDaily)
}

function updateDailyThroughFood(
    newMeal: Meal,
    daily: DailyIntake,
    setDaily: ReturnType<typeof useSetAtom<typeof dailyIntakeAtom>>,
) {
    const dailyMeals = daily.meals
    for (let i = 0; i < dailyMeals.length; i++) {
        const dailyMeal = dailyMeals[i]
        if (dailyMeal.name === newMeal.name) {
            if (dailyMeal == newMeal) break
            else {
                const caloriesDiff = newMeal.calories - dailyMeal.calories
                const carbsDiff = newMeal.carbs - dailyMeal.carbs
                const proteinDiff = newMeal.protein - dailyMeal.protein
                const fatDiff = newMeal.fat - dailyMeal.fat
                const priceDiff = newMeal.price - dailyMeal.price
                const newDailyMeals = [...dailyMeals]
                newDailyMeals[i] = newMeal
                setDaily({
                    calories: roundNumber(daily.calories + caloriesDiff),
                    carbs: roundNumber(daily.carbs + carbsDiff),
                    protein: roundNumber(daily.protein + proteinDiff),
                    fat: roundNumber(daily.fat + fatDiff),
                    price: roundNumber(daily.price + priceDiff),
                    meals: newDailyMeals,
                })
            }
        }
    }
}

export function updateDailyThroughMeal(
    prevMeal: Meal,
    newMeal: Meal | undefined,
    daily: DailyIntake,
    setDaily: ReturnType<typeof useSetAtom<typeof dailyIntakeAtom>>,
) {
    const dailyMeals = daily.meals
    for (let i = 0; i < dailyMeals.length; i++) {
        const dailyMeal = daily.meals[i]
        if (dailyMeal.name === prevMeal.name)
            if (!newMeal) {
                const newDailyMeals = dailyMeals.filter(
                    (_, index) => index != i,
                )
                setDaily({
                    calories: roundNumber(daily.calories - dailyMeal.calories),
                    carbs: roundNumber(daily.carbs - dailyMeal.carbs),
                    protein: roundNumber(daily.protein - dailyMeal.protein),
                    fat: roundNumber(daily.fat - dailyMeal.fat),
                    price: roundNumber(daily.price - dailyMeal.price),
                    meals: newDailyMeals,
                })
                break
            } else if (dailyMeal != newMeal) {
                const caloriesDiff = newMeal.calories - dailyMeal.calories
                const carbsDiff = newMeal.carbs - dailyMeal.carbs
                const proteinDiff = newMeal.protein - dailyMeal.protein
                const fatDiff = newMeal.fat - dailyMeal.fat
                const priceDiff = newMeal.price - dailyMeal.price
                const newDailyMeals = [...dailyMeals]
                newDailyMeals[i] = newMeal
                setDaily({
                    calories: roundNumber(daily.calories + caloriesDiff),
                    carbs: roundNumber(daily.carbs + carbsDiff),
                    protein: roundNumber(daily.protein + proteinDiff),
                    fat: roundNumber(daily.fat + fatDiff),
                    price: roundNumber(daily.price + priceDiff),
                    meals: newDailyMeals,
                })
                break
            }
    }
}
