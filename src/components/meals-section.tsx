import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from '@/components/ui/button'
import { createMealDialogAtom, mealsAtom } from '@/lib/atoms'
import { MealsDataTable } from './meals-table/meals-data-table'
import { columns } from './meals-table/meals-columns'

export default function MealsSection() {
    const meals = useAtomValue(mealsAtom)
    const setDialogOpen = useSetAtom(createMealDialogAtom)
    if (meals.length == 0)
        return (
            <div className="relative flex flex-col justify-center items-center gap-4 border rounded-2xl w-6/7 md:w-1/2 p-4 animate-in slide-in-from-left duration-300">
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl md:text-3xl text-center">
                        No meals found.
                    </h1>
                    <p className="text-accent-muted font-light text-justify">
                        You need food to create a meal irl, right? Same here!
                        Add all your food items before creating meals.
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>Create Meal</Button>
            </div>
        )
    return (
        <div className="relative flex flex-col gap-4 w-6/7 md:w-1/2 animate-in slide-in-from-right duration-300">
            <h1 className="text-xl md:text-3xl text-center text-primary font-bold">
                Your Meals
            </h1>
            <MealsDataTable columns={columns} data={meals} />
        </div>
    )
}
