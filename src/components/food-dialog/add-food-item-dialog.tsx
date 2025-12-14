import { addFoodItemDialogAtom, foodListAtom, foodSchema } from '@/lib/atoms'
import { useAtom } from 'jotai/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useAppForm } from '@/hooks/form-hook'
import { roundNumber } from '@/lib/utils'

export default function AddFoodItemDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(addFoodItemDialogAtom)
    const [foodList, setFoodList] = useAtom(foodListAtom)
    const form = useAppForm({
        defaultValues: {
            name: '',
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            price: 0,
            totalAmount: 0,
        },
        onSubmit: ({ value }) => {
            const newFood = {
                name: value.name,
                calories: roundNumber(value.calories),
                carbs: roundNumber(value.carbs),
                protein: roundNumber(value.protein),
                fat: roundNumber(value.fat),
                price: roundNumber(value.price),
                totalAmount: roundNumber(value.totalAmount),
            }
            setFoodList([...foodList, newFood])
            form.reset()
            setDialogOpen(false)
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
                    <DialogTitle>Let&apos;s add some food!</DialogTitle>
                    <DialogDescription>
                        Provide us the following information in grams, per 100g
                        of the product.
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
                            <field.NumberField label="Protein" />
                        )}
                    />
                    <form.AppField
                        name="carbs"
                        children={(field) => (
                            <field.NumberField label="Carbs" />
                        )}
                    />
                    <form.AppField
                        name="fat"
                        children={(field) => <field.NumberField label="Fat" />}
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
