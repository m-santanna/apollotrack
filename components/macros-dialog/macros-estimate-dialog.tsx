import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
} from '@/components/ui/dialog'
import {
    estimateMacrosSchema,
    macrosAtom,
    macrosDialogEstimateAtom,
} from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'
import { calculateCalories, calculateMacros } from '@/lib/utils'
import { useAppForm } from '@/hooks/form-hook'

export default function MacrosEstimateDialog() {
    const [dialogOpen, setDialogOpen] = useAtom(macrosDialogEstimateAtom)
    const setMacros = useSetAtom(macrosAtom)
    const form = useAppForm({
        defaultValues: {
            gender: 'male',
            weight: 60,
            height: 170,
            age: 20,
            activityLevel: 'moderate',
            dietGoal: 'Maintenance',
        },
        validators: {
            onSubmit: estimateMacrosSchema,
        },
        onSubmit: ({ value }) => {
            const calories = calculateCalories(
                value.gender,
                value.weight,
                value.height,
                value.age,
                value.activityLevel,
                value.dietGoal,
            )
            const { protein, carbs, fat } = calculateMacros(
                calories,
                value.weight,
                value.dietGoal,
            )
            const dietGoal = value.dietGoal
            setDialogOpen(false)
            setMacros({ calories, protein, fat, carbs, dietGoal })
        },
    })
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Macros estimation</DialogTitle>
                    <DialogDescription>
                        We will do our best to calculate your needed macros
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
                        name="gender"
                        children={(field) => <field.GenderField />}
                    />
                    <form.AppField
                        name="height"
                        children={(field) => (
                            <field.NumberField label="Height (cm)" />
                        )}
                    />
                    <form.AppField
                        name="weight"
                        children={(field) => (
                            <field.NumberField label="Weight (kg)" />
                        )}
                    />
                    <form.AppField
                        name="age"
                        children={(field) => <field.NumberField label="Age" />}
                    />
                    <form.AppField
                        name="activityLevel"
                        children={(field) => <field.ActivityLevelField />}
                    />
                    <form.AppField
                        name="dietGoal"
                        children={(field) => <field.DietGoalField />}
                    />
                    <form.AppForm>
                        <form.SubmitButton className="w-1/2 translate-x-1/2 mt-4" />
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}
