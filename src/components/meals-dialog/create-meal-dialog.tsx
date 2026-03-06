import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import {
    createMealDialogAtom,
    Food,
    foodListAtom,
    Ingredient,
    mealsAtom,
} from '@/lib/atoms'
import { useAppForm } from '@/hooks/form-hook'
import { Button } from '../ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { roundNumber } from '@/lib/utils'

export default function CreateMealDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(createMealDialogAtom)
    const setMeals = useSetAtom(mealsAtom)
    const foodList = useAtomValue(foodListAtom)

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
            name: '',
            ingredients: [{ name: '', usedAmount: 0 }],
        },
        onSubmit: ({ value }) => {
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
            setMeals((prev) => [
                ...prev,
                {
                    name: value.name,
                    calories: roundNumber(calories),
                    protein: roundNumber(protein),
                    carbs: roundNumber(carbs),
                    fat: roundNumber(fat),
                    weight: roundNumber(weight),
                    price: roundNumber(price),
                    ingredients: ingredients,
                },
            ])
            form.reset()
            setDialogOpen(false)
        },
    })
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create a Meal</DialogTitle>
                    <DialogDescription>
                        Select your ingredients and specify how many grams of each you use.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="flex flex-col gap-3"
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
                            <field.TextField label="Meal Name" />
                        )}
                    />
                    <form.AppField name="ingredients" mode="array">
                        {(field) => (
                            <div className="flex flex-col gap-3">
                                {field.state.value.map((_, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-border/60 bg-secondary/30 p-3 space-y-2"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Ingredient {index + 1}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                type="button"
                                                disabled={
                                                    field.state.value.length === 1
                                                }
                                                onClick={() =>
                                                    field.removeValue(index)
                                                }
                                                className="size-7 rounded-lg"
                                            >
                                                <Trash2 className="size-3.5 text-destructive" />
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
                                                    label="Food"
                                                />
                                            )}
                                        </form.AppField>
                                        <form.AppField
                                            name={`ingredients[${index}].usedAmount`}
                                            validators={{
                                                onChange: ({ value }) =>
                                                    value <= 0 || !value
                                                        ? 'Amount is required'
                                                        : undefined,
                                            }}
                                        >
                                            {(subField) => (
                                                <subField.NumberField label="Amount (g)" />
                                            )}
                                        </form.AppField>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        field.pushValue({
                                            name: '',
                                            usedAmount: 0,
                                        })
                                    }
                                    className="w-full gap-2"
                                >
                                    <Plus className="size-4" />
                                    Add Ingredient
                                </Button>
                                <form.AppForm>
                                    <form.SubmitButton />
                                </form.AppForm>
                            </div>
                        )}
                    </form.AppField>
                </form>
            </DialogContent>
        </Dialog>
    )
}
