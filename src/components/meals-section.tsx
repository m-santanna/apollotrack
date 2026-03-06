import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from '@/components/ui/button'
import { createMealDialogAtom, mealsAtom } from '@/lib/atoms'
import { MealsDataTable } from './meals-table/meals-data-table'
import { columns } from './meals-table/meals-columns'
import { Plus, UtensilsCrossed } from 'lucide-react'

export default function MealsSection() {
    const meals = useAtomValue(mealsAtom)
    const setDialogOpen = useSetAtom(createMealDialogAtom)

    if (meals.length === 0)
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 card-shadow">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <UtensilsCrossed className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">No Meals Yet</h3>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Add your food items first, then combine them into
                            meals.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setDialogOpen(true)}
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Create Meal
                    </Button>
                </div>
            </div>
        )

    return (
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Your Meals</h2>
                    <p className="text-sm text-muted-foreground">
                        {meals.length} meal{meals.length !== 1 ? 's' : ''}{' '}
                        created
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDialogOpen(true)}
                >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Meal
                </Button>
            </div>
            <MealsDataTable columns={columns} data={meals} />
        </div>
    )
}
