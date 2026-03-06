import { addFoodItemDialogAtom, foodListAtom } from '@/lib/atoms'
import { useAtomValue, useSetAtom } from 'jotai/react'
import { Button } from '@/components/ui/button'
import { FoodDataTable } from '@/components/food-table/food-data-table'
import { columns } from '@/components/food-table/food-columns'
import { Plus, Apple } from 'lucide-react'

export default function FoodListSection() {
    const foodList = useAtomValue(foodListAtom)
    const setDialogOpen = useSetAtom(addFoodItemDialogAtom)

    if (foodList.length === 0)
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 card-shadow">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Apple className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            No Food Items Yet
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Start building your food library by adding items
                            manually or scanning a nutrition label.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setDialogOpen(true)}
                    >
                        <Plus className="mr-1.5 h-4 w-4" />
                        Add Food Item
                    </Button>
                </div>
            </div>
        )

    return (
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Food Library</h2>
                    <p className="text-sm text-muted-foreground">
                        {foodList.length} item{foodList.length !== 1 ? 's' : ''}{' '}
                        in your library
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDialogOpen(true)}
                >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Add Item
                </Button>
            </div>
            <FoodDataTable data={foodList} columns={columns} />
        </div>
    )
}
