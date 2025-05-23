import {
    dailyIntakeAtom,
    editFoodItemDialogAtom,
    foodItemInfoValuesAtom,
    foodListAtom,
    foodSchema,
    mealsAtom,
} from '@/lib/atoms'
import { useAtom, useAtomValue } from 'jotai/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from '@/components/ui/dialog'
import { useAppForm } from '@/hooks/form-hook'
import { updateSystemThroughFood } from '@/lib/utils'

export default function EditFoodItemDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(editFoodItemDialogAtom)
    const foodItemInfo = useAtomValue(foodItemInfoValuesAtom)
    const [foodList, setFoodList] = useAtom(foodListAtom)
    const [meals, setMeals] = useAtom(mealsAtom)
    const [daily, setDaily] = useAtom(dailyIntakeAtom)

    const form = useAppForm({
        defaultValues: foodItemInfo,
        onSubmit: ({ value }) => {
            const filteredList = foodList.filter(
                (food) => food !== foodItemInfo,
            )
            setFoodList([...filteredList, value])
            updateSystemThroughFood(
                foodItemInfo,
                value,
                meals,
                setMeals,
                daily,
                setDaily,
            )
            setDialogOpen(false)
            form.reset()
        },
        validators: {
            onSubmit: foodSchema,
        },
    })

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Let&apos;s edit your {foodItemInfo.name}!
                    </DialogTitle>
                    <DialogDescription>
                        Change what you must! Remember: calories, protein,
                        etc... should have their values based per 100g of the
                        product.
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="grid gap-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <form.AppField
                        name="name"
                        children={(field) => (
                            <field.TextField label="Food Name" />
                        )}
                    />
                    <form.AppField
                        name="calories"
                        children={(field) => (
                            <field.NumberField label="Calories" />
                        )}
                    />
                    <form.AppField
                        name="protein"
                        children={(field) => (
                            <field.NumberField label="Protein (g)" />
                        )}
                    />
                    <form.AppField
                        name="carbs"
                        children={(field) => (
                            <field.NumberField label="Carbs (g)" />
                        )}
                    />
                    <form.AppField
                        name="fat"
                        children={(field) => (
                            <field.NumberField label="Fat (g)" />
                        )}
                    />
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
                    <form.AppForm>
                        <form.SubmitButton className="w-1/2 translate-x-1/2 mt-4" />
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}
