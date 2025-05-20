import { useAppForm } from '@/hooks/form-hook'
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
    mealsAtom,
    setupDailyIntakeDialogAtom,
} from '@/lib/atoms'
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'

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
                calories: calories,
                protein: protein,
                fat: fat,
                carbs: carbs,
                price: price,
                meals: meals,
            })
            setDialogOpen(false)
        },
    })
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-[425px] max-h-[600px] overflow-scroll">
                <DialogHeader>
                    <DialogTitle>Setting up Daily Intake</DialogTitle>
                    <DialogDescription className="text-justify">
                        You just have to select the meals you want to be
                        calculated together to compose your full day of eating.
                        You can change these meals later if you need, so do not
                        worry, my great fitness warrior!
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
                    <form.AppField name="mealsName" mode="array">
                        {(field) => (
                            <div className="grid gap-4">
                                {field.state.value.map((_, index) => (
                                    <div
                                        key={index}
                                        className="grid items-center gap-1"
                                    >
                                        <div className="flex justify-between items-center gap-2">
                                            <h1 className="font-semibold">
                                                Meal {index + 1}
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
                                                    label="Meal Name"
                                                />
                                            )}
                                        </form.AppField>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        type="button"
                                        variant={'outline'}
                                        onClick={() => field.pushValue('')}
                                        className="w-1/2"
                                    >
                                        Add Meal
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
