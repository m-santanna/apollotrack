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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit {foodItemInfo.name}</DialogTitle>
                    <DialogDescription>
                        Update the nutritional values per 100g of the product.
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="flex flex-col gap-3"
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
                    <div className="grid grid-cols-3 gap-3">
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
                    </div>
                    <div className="grid grid-cols-2 gap-3">
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
                    </div>
                    <form.AppForm>
                        <form.SubmitButton className="mt-2" />
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}
