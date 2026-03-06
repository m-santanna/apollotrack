import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    dailyIntakeAtom,
    editFoodItemDialogAtom,
    foodItemInfoDialogAtom,
    foodItemInfoValuesAtom,
    foodListAtom,
    mealsAtom,
} from '@/lib/atoms'
import { updateSystemThroughFood } from '@/lib/utils'
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { Flame, Beef, Wheat, Droplets, Package, DollarSign, Pencil, Trash2 } from 'lucide-react'

export default function FoodItemInfoDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(foodItemInfoDialogAtom)
    const setEditDialogOpen = useSetAtom(editFoodItemDialogAtom)
    const [foodList, setFoodList] = useAtom(foodListAtom)
    const [meals, setMeals] = useAtom(mealsAtom)
    const [daily, setDaily] = useAtom(dailyIntakeAtom)
    const foodItemInfo = useAtomValue(foodItemInfoValuesAtom)

    function deleteFood() {
        let filteredList = foodList
        filteredList = filteredList.filter((curr) => curr !== foodItemInfo)
        setFoodList(filteredList)
        updateSystemThroughFood(
            foodItemInfo,
            undefined,
            meals,
            setMeals,
            daily,
            setDaily,
        )
        setDialogOpen(false)
    }
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{foodItemInfo.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Per 100g</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Flame className="size-4 text-orange-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Calories</p>
                                <p className="font-semibold text-sm">{foodItemInfo.calories}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Beef className="size-4 text-red-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Protein</p>
                                <p className="font-semibold text-sm">{foodItemInfo.protein}g</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Wheat className="size-4 text-amber-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Carbs</p>
                                <p className="font-semibold text-sm">{foodItemInfo.carbs}g</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Droplets className="size-4 text-blue-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Fat</p>
                                <p className="font-semibold text-sm">{foodItemInfo.fat}g</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <Package className="size-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Amount</p>
                                <p className="font-semibold text-sm">{foodItemInfo.totalAmount}g</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/50 px-3 py-2.5">
                            <DollarSign className="size-4 text-green-500" />
                            <div>
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="font-semibold text-sm">{foodItemInfo.price}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-2">
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
                        onClick={deleteFood}
                    >
                        <Trash2 className="size-3.5" />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
