import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import {
    scanResultAtom,
    scanResultDialogAtom,
    foodListAtom,
    addFoodItemDialogAtom,
} from '@/lib/atoms'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, Plus, Flame, Beef, Wheat, Droplets } from 'lucide-react'
import { roundNumber } from '@/lib/utils'
import { useAppForm } from '@/hooks/form-hook'

export default function ScanResultDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(scanResultDialogAtom)
    const scanResult = useAtomValue(scanResultAtom)
    const [foodList, setFoodList] = useAtom(foodListAtom)
    const setAddFoodDialog = useSetAtom(addFoodItemDialogAtom)

    const form = useAppForm({
        defaultValues: {
            price: 0,
            totalAmount: 0,
        },
        onSubmit: ({ value }) => {
            if (!scanResult) return
            const newFood = {
                name: scanResult.name,
                calories: roundNumber(scanResult.calories),
                protein: roundNumber(scanResult.protein),
                carbs: roundNumber(scanResult.carbs),
                fat: roundNumber(scanResult.fat),
                price: roundNumber(value.price),
                totalAmount: roundNumber(value.totalAmount),
            }
            setFoodList([...foodList, newFood])
            setDialogOpen(false)
            form.reset()
        },
    })

    if (!scanResult) return null

    const macros = [
        {
            label: 'Calories',
            value: scanResult.calories,
            unit: 'kcal',
            icon: Flame,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        },
        {
            label: 'Protein',
            value: scanResult.protein,
            unit: 'g',
            icon: Beef,
            color: 'text-red-500',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
        },
        {
            label: 'Carbs',
            value: scanResult.carbs,
            unit: 'g',
            icon: Wheat,
            color: 'text-amber-500',
            bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        },
        {
            label: 'Fat',
            value: scanResult.fat,
            unit: 'g',
            icon: Droplets,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        },
    ]

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                            <Check className="h-4 w-4 text-success" />
                        </div>
                        <div>
                            <DialogTitle>
                                {scanResult.name}
                            </DialogTitle>
                            <DialogDescription>
                                Nutritional values per 100g — extracted by AI
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3 py-2">
                    {macros.map(({ label, value, unit, icon: Icon, color, bgColor }) => (
                        <div
                            key={label}
                            className={`flex items-center gap-3 rounded-xl p-3 ${bgColor}`}
                        >
                            <Icon className={`h-5 w-5 ${color}`} />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    {label}
                                </p>
                                <p className="text-sm font-semibold">
                                    {value}
                                    {unit}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="grid gap-3 border-t pt-4"
                >
                    <p className="text-sm text-muted-foreground">
                        To add this to your food list, provide the package
                        details:
                    </p>
                    <form.AppField
                        name="totalAmount"
                        children={(field) => (
                            <field.NumberField label="Total Amount (g)" />
                        )}
                    />
                    <form.AppField
                        name="price"
                        children={(field) => (
                            <field.NumberField label="Price" />
                        )}
                    />
                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setDialogOpen(false)
                                setAddFoodDialog(true)
                            }}
                        >
                            <Plus className="mr-1.5 h-4 w-4" />
                            Add Manually
                        </Button>
                        <form.AppForm>
                            <form.SubmitButton className="flex-1" />
                        </form.AppForm>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
