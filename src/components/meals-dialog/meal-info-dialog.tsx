import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
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
    mealInfoDialogAtom,
    mealInfoValuesAtom,
    mealsAtom,
} from '@/lib/atoms'
import { Button } from '../ui/button'
import { updateDailyThroughMeal } from '@/lib/utils'

export default function MealInfoDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(mealInfoDialogAtom)
    const setEditDialogOpen = useSetAtom(editMealDialogAtom)
    const mealInfoValues = useAtomValue(mealInfoValuesAtom)
    const [meals, setMeals] = useAtom(mealsAtom)
    const [daily, setDaily] = useAtom(dailyIntakeAtom)

    function deleteMeal() {
        let filteredMeals = meals
        filteredMeals = filteredMeals.filter((curr) => curr !== mealInfoValues)
        setMeals(filteredMeals)
        updateDailyThroughMeal(mealInfoValues, undefined, daily, setDaily)
        setDialogOpen(false)
    }
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-[425px] max-h-[600px] overflow-scroll">
                <DialogHeader className="space-y-4">
                    <div className="space-y-2">
                        <DialogTitle>{mealInfoValues.name}</DialogTitle>
                        <DialogDescription>
                            This meal has in total {mealInfoValues.calories}{' '}
                            calories, {mealInfoValues.protein}g of protein,{' '}
                            {mealInfoValues.carbs}g of carbs,{' '}
                            {mealInfoValues.fat}g of fat, and weights{' '}
                            {mealInfoValues.weight}g. It costs{' '}
                            {mealInfoValues.price} per serving.
                        </DialogDescription>
                    </div>
                    <div className="space-y-2">
                        <DialogTitle>Ingredients</DialogTitle>
                        <DialogDescription>
                            {mealInfoValues.ingredients.map((ingredient) => (
                                <div className="my-1">
                                    {ingredient.usedAmount}g of{' '}
                                    {ingredient.name}
                                </div>
                            ))}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <div className="flex justify-between items-center gap-2">
                    <Button
                        className="w-1/2"
                        variant="outline"
                        onClick={() => {
                            setDialogOpen(false)
                            setEditDialogOpen(true)
                        }}
                    >
                        Edit Meal
                    </Button>
                    <Button
                        className="w-1/2"
                        variant={'destructive'}
                        onClick={deleteMeal}
                    >
                        Delete Meal
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
