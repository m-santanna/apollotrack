import { useAppForm } from '@/hooks/form-hook'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import {
    dailyIntakeAtom,
    mealsAtom,
    setupDailyIntakeDialogAtom,
} from '@/lib/atoms'
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from '../ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { roundNumber } from '@/lib/utils'

export default function CreateDailyIntakeDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(setupDailyIntakeDialogAtom)
    const meals = useAtomValue(mealsAtom)
    const setDailyIntake = useSetAtom(dailyIntakeAtom)

    const mealsNameArray: { label: string; value: string }[] = []
    meals.map(
        (meal, index) =>
            (mealsNameArray[index] = { label: meal.name, value: meal.name }),
    )

    function getMeal(name: string) {
        return meals.find((meal) => meal.name === name)!
    }

    const form = useAppForm({
        defaultValues: {
            mealsName: [''] as string[],
        },
        onSubmit: ({ value }) => {
            let protein = 0,
                carbs = 0,
                fat = 0,
                price = 0,
                calories = 0
            const meals = value.mealsName.map((name) => {
                const currMeal = getMeal(name)
                calories += currMeal.calories
                protein += currMeal.protein
                carbs += currMeal.carbs
                fat += currMeal.fat
                price += currMeal.price
                return currMeal
            })
            setDailyIntake({
                calories: roundNumber(calories),
                protein: roundNumber(protein),
                fat: roundNumber(fat),
                carbs: roundNumber(carbs),
                price: roundNumber(price),
                meals: meals,
            })
            setDialogOpen(false)
        },
    })
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Set Up Daily Intake</DialogTitle>
                    <DialogDescription>
                        Select the meals that make up your full day of eating. You can always adjust this later.
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
                    <form.AppField name="mealsName" mode="array">
                        {(field) => (
                            <div className="flex flex-col gap-3">
                                {field.state.value.map((_, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-border/60 bg-secondary/30 p-3 space-y-2"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Meal {index + 1}
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
                                            name={`mealsName[${index}]`}
                                            validators={{
                                                onChange: ({ value }) =>
                                                    value === ''
                                                        ? 'Select something!'
                                                        : undefined,
                                            }}
                                        >
                                            {(subField) => (
                                                <subField.SelectField
                                                    array={mealsNameArray}
                                                    label="Meal"
                                                />
                                            )}
                                        </form.AppField>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => field.pushValue('')}
                                    className="w-full gap-2"
                                >
                                    <Plus className="size-4" />
                                    Add Meal
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
