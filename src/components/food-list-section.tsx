import { addFoodItemDialogAtom, foodListAtom } from '@/lib/atoms'
import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from '@/components/ui/button'
import { FoodDataTable } from '@/components/food-table/food-data-table'
import { columns } from '@/components/food-table/food-columns'

export default function FoodListSection() {
    const foodList = useAtomValue(foodListAtom)
    const setDialogOpen = useSetAtom(addFoodItemDialogAtom)
    if (foodList.length == 0)
        return (
            <div className="relative flex flex-col justify-center items-center gap-4 border rounded-2xl w-6/7 md:w-1/2 p-4 animate-in slide-in-from-right duration-300">
                <h1 className="text-xl md:text-3xl text-center">
                    You don't have any food items registered!
                </h1>
                <Button onClick={() => setDialogOpen(true)}>
                    Add Food Item
                </Button>
            </div>
        )
    return (
        <div className="relative flex flex-col gap-4 w-6/7 md:w-1/2 animate-in slide-in-from-right duration-300">
            <h1 className="text-xl md:text-3xl text-center text-primary font-bold">
                Your Foods
            </h1>
            <FoodDataTable data={foodList} columns={columns} />
        </div>
    )
}
