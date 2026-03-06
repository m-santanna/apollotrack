import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import {
    Dialog,
    DialogContent,
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
import { Flame, Beef, Wheat, Droplets, Weight, DollarSign, Pencil, Trash2 } from 'lucide-react'

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
            <DialogContent className="sm:max-w-[400px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mealInfoValues.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Macro grid */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Flame className="size-4 text-orange-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Calories</p>
                                <p className="font-semibold text-sm">{mealInfoValues.calories}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Beef className="size-4 text-red-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Protein</p>
                                <p className="font-semibold text-sm">{mealInfoValues.protein}g</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Wheat className="size-4 text-amber-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Carbs</p>
                                <p className="font-semibold text-sm">{mealInfoValues.carbs}g</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Droplets className="size-4 text-blue-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Fat</p>
                                <p className="font-semibold text-sm">{mealInfoValues.fat}g</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Weight className="size-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Weight</p>
                                <p className="font-semibold text-sm">{mealInfoValues.weight}g</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <DollarSign className="size-4 text-green-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="font-semibold text-sm">{mealInfoValues.price}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Ingredients</p>
                        <div className="space-y-1.5">
                            {mealInfoValues.ingredients.map((ingredient, i) => (
                                <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2 text-sm">
                                    <span className="font-medium">{ingredient.name}</span>
                                    <span className="text-muted-foreground">{ingredient.usedAmount}g</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-1">
                    <Button
                        className="flex-1 gap-2"
                        variant="outline"
                        onClick={() => {
                            setDialogOpen(false)
                            setEditDialogOpen(true)
                        }}
                    >
                        <Pencil className="size-3.5" />
                        Edit
                    </Button>
                    <Button
                        className="flex-1 gap-2"
                        variant="destructive"
                        onClick={deleteMeal}
                    >
                        <Trash2 className="size-3.5" />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
