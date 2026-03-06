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
            setMacros({
                calories: value.calories,
                protein: value.protein,
                fat: value.fat,
                carbs: value.carbs,
                dietGoal: 'own',
            })
        },
    })
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set Your Macros</DialogTitle>
                    <DialogDescription>
                        Enter the daily macro values you already know work for you.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="flex flex-col gap-3"
                >
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
                    <form.AppForm>
                        <form.SubmitButton className="mt-2" />
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}
