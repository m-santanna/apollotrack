import { addFoodItemDialogAtom, foodListAtom } from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'
import { Button } from './ui/button'

export default function FoodListDisplay() {
    const [foodList, setFoodList] = useAtom(foodListAtom)
    const setDialogOpen = useSetAtom(addFoodItemDialogAtom)
    if (foodList.length == 0)
        return (
            <div className="relative flex flex-col justify-center items-center gap-4 border rounded-2xl w-6/7 md:w-1/2 p-4 animate-in slide-in-from-right duration-300">
                <h1 className="text-xl md:text-3xl text-center">
                    You don't have any Food Items registered!
                </h1>
                <Button onClick={() => setDialogOpen(true)}>
                    Add Food Item
                </Button>
            </div>
        )
    return (
        <div>
            {foodList.map((item) => (
                <div>{item.name}</div>
            ))}
        </div>
    )
}
