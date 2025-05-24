import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
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

export default function FoodItemInfoDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(foodItemInfoDialogAtom)
    const setEditDialogOpen = useSetAtom(editFoodItemDialogAtom)
    const [foodList, setFoodList] = useAtom(foodListAtom)
    const [meals, setMeals] = useAtom(mealsAtom)
    const [daily, setDaily] = useAtom(dailyIntakeAtom)
    const foodItemInfo = useAtomValue(foodItemInfoValuesAtom)

    function deleteMeal() {
        let filteredMeals = foodList
        filteredMeals = filteredMeals.filter((curr) => curr !== foodItemInfo)
        setFoodList(filteredMeals)
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
            <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-[425px] max-h-[600px] overflow-scroll">
                <DialogHeader className="space-y-4">
                    <div className="space-y-2">
                        <DialogTitle>{foodItemInfo.name}</DialogTitle>
                        <DialogDescription>
                            This food has, per 100g, {foodItemInfo.calories}{' '}
                            calories, {foodItemInfo.protein}g of protein,{' '}
                            {foodItemInfo.carbs}g of carbs, {foodItemInfo.fat}g
                            of fat. And it costs {foodItemInfo.price} to buy{' '}
                            {foodItemInfo.totalAmount}g of it.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <div className="flex justify-between items-center gap-2 mt-4">
                    <Button
                        className="w-1/2"
                        variant="outline"
                        onClick={() => {
                            setDialogOpen(false)
                            setEditDialogOpen(true)
                        }}
                    >
                        Edit Food
                    </Button>
                    <Button
                        className="w-1/2"
                        variant={'destructive'}
                        onClick={deleteMeal}
                    >
                        Delele Food
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
