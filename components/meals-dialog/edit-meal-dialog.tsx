import { useAtom, useAtomValue } from 'jotai/react'
import {
    Dialog,
    DialogOverlay,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import {
    dailyIntakeAtom,
    editMealDialogAtom,
    Food,
    foodListAtom,
    Ingredient,
    mealInfoValuesAtom,
    mealsAtom,
} from '@/lib/atoms'
import { useAppForm } from '@/hooks/form-hook'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import { roundNumber, updateDailyThroughMeal } from '@/lib/utils'

export default function EditMealDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(editMealDialogAtom)
    const [meals, setMeals] = useAtom(mealsAtom)
    const [daily, setDaily] = useAtom(dailyIntakeAtom)
    const foodList = useAtomValue(foodListAtom)
    const mealInitialValues = useAtomValue(mealInfoValuesAtom)

    const foodNamesArray: { label: string; value: string }[] = []
    foodList.map((item, index) => {
        foodNamesArray[index] = { label: item.name, value: item.name }
    })

    function getFoodByName(foodName: string) {
        return foodList.find((food) => food.name === foodName)!
    }

    function createIngredient(food: Food, amount: number): Ingredient {
        const ingredient: Ingredient = {
            ...food,
            usedAmount: amount,
        }
        return ingredient
    }

    const form = useAppForm({
        defaultValues: {
            name: mealInitialValues.name,
            ingredients: mealInitialValues.ingredients as {
                name: string
                usedAmount: number
            }[],
        },
        onSubmit: ({ value }) => {
            let filteredMeals = meals
            filteredMeals = filteredMeals.filter(
                (meal) => meal !== mealInitialValues,
            )
            setMeals(filteredMeals)

            let calories = 0,
                protein = 0,
                carbs = 0,
                fat = 0,
                weight = 0,
                price = 0
            const ingredients = value.ingredients.map((ingredient) => {
                const food = getFoodByName(ingredient.name)
                const multFactor = ingredient.usedAmount / 100
                calories += food.calories * multFactor
                protein += food.protein * multFactor
                carbs += food.carbs * multFactor
                fat += food.fat * multFactor
                weight += ingredient.usedAmount
                price += food.price * (ingredient.usedAmount / food.totalAmount)
                return createIngredient(food, ingredient.usedAmount)
            })
            const newMeal = {
                name: value.name,
                calories: roundNumber(calories),
                protein: roundNumber(protein),
                carbs: roundNumber(carbs),
                fat: roundNumber(fat),
                weight: roundNumber(weight),
                price: roundNumber(price),
                ingredients: ingredients,
            }
            setMeals((prev) => [...prev, newMeal])
            updateDailyThroughMeal(mealInitialValues, newMeal, daily, setDaily)
            setDialogOpen(false)
            form.reset()
        },
    })
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-[425px] max-h-[600px] overflow-scroll">
                <DialogHeader>
                    <DialogTitle>Editing {mealInitialValues.name}</DialogTitle>
                    <DialogDescription>
                        How about reshaping this meal? Do not forget we use
                        grams!
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="grid gap-2"
                >
                    <form.AppField
                        name="name"
                        validators={{
                            onChange: ({ value }) =>
                                value.length < 3
                                    ? 'Meal name should have at least 3 characters'
                                    : undefined,
                        }}
                        children={(field) => (
                            <field.TextField
                                label="Meal Name"
                                labelClassName="font-semibold text-md"
                            />
                        )}
                    />
                    <form.AppField name="ingredients" mode="array">
                        {(field) => (
                            <div className="grid gap-4">
                                {field.state.value.map((_, index) => (
                                    <div
                                        key={index}
                                        className="grid items-center gap-1"
                                    >
                                        <div className="flex justify-between items-center gap-2">
                                            <h1 className="font-semibold">
                                                Ingredient {index + 1}
                                            </h1>
                                            <Button
                                                variant="ghost"
                                                type="button"
                                                disabled={
                                                    field.state.value.length ==
                                                    1
                                                }
                                                onClick={() =>
                                                    field.removeValue(index)
                                                }
                                            >
                                                <Trash className="size-4" />
                                            </Button>
                                        </div>
                                        <form.AppField
                                            name={`ingredients[${index}].name`}
                                            validators={{
                                                onChange: ({ value }) =>
                                                    value === ''
                                                        ? 'Select something!'
                                                        : undefined,
                                            }}
                                        >
                                            {(subField) => (
                                                <subField.SelectField
                                                    array={foodNamesArray}
                                                    label="Name"
                                                />
                                            )}
                                        </form.AppField>
                                        <form.AppField
                                            name={`ingredients[${index}].usedAmount`}
                                            validators={{
                                                onChange: ({ value }) =>
                                                    value <= 0 || !value
                                                        ? 'You must introduce a value here!'
                                                        : undefined,
                                            }}
                                        >
                                            {(subField) => (
                                                <subField.NumberField label="Used Amount" />
                                            )}
                                        </form.AppField>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        type="button"
                                        variant={'outline'}
                                        onClick={() =>
                                            field.pushValue({
                                                name: '',
                                                usedAmount: 0,
                                            })
                                        }
                                        className="w-1/2"
                                    >
                                        Add Ingredient
                                    </Button>
                                    <form.AppForm>
                                        <form.SubmitButton className="w-1/2" />
                                    </form.AppForm>
                                </div>
                            </div>
                        )}
                    </form.AppField>
                </form>
            </DialogContent>
        </Dialog>
    )
}
