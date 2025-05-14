import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useAppForm } from '@/hooks/form-hook'
import {
    macrosAtom,
    macrosDialogYourselfAtom,
    yourselfMacrosSchema,
} from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'

export default function MacrosYourselfDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(macrosDialogYourselfAtom)
    const setMacros = useSetAtom(macrosAtom)
    const form = useAppForm({
        defaultValues: {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
        },
        validators: {
            onSubmit: yourselfMacrosSchema,
        },
        onSubmit: ({ value }) => {
            setDialogOpen(false)
            const calories = value.calories,
                protein = value.protein,
                fat = value.fat,
                carbs = value.carbs
            setMacros({
                calories: calories,
                protein: protein,
                fat: fat,
                carbs: carbs,
                dietGoal: 'own',
            })
        },
    })
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Your macros</DialogTitle>
                    <DialogDescription>
                        Provide us the values you already know are appropriate
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="grid gap-2"
                >
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
                    <form.AppForm>
                        <form.SubmitButton className="w-1/2 translate-x-1/2 mt-4" />
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}
