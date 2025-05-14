import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    estimateMacrosSchema,
    macrosAtom,
    macrosDialogEstimateAtom,
} from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'
import { Button } from './ui/button'
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
            caloricVariance: 0,
        },
        validators: {
            onSubmit: estimateMacrosSchema,
        },
        onSubmit: ({ value }) => {
            console.log('gotin')
            const calories = calculateCalories(
                value.gender,
                value.weight,
                value.height,
                value.age,
                value.activityLevel,
                value.caloricVariance,
            )
            const { protein, carbs, fat } = calculateMacros(
                calories,
                value.weight,
                value.caloricVariance,
            )
            console.log({ calories, protein, fat, carbs })
        },
    })
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                            <field.NumberField label="Height" />
                        )}
                    />
                    <form.AppField
                        name="weight"
                        children={(field) => (
                            <field.NumberField label="Weight" />
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
                        name="caloricVariance"
                        children={(field) => (
                            <field.NumberField label="Caloric Variance" />
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
