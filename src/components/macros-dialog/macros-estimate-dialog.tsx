import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    estimateMacrosSchema,
    macrosAtom,
    macrosDialogEstimateAtom,
} from '@/lib/atoms'
import { useAtom, useSetAtom } from 'jotai/react'
import {
    activityLevels,
    calculateCalories,
    calculateMacros,
    dietGoals,
} from '@/lib/utils'
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Estimate Your Macros</DialogTitle>
                    <DialogDescription>
                        We'll calculate your ideal daily macros based on your body metrics and goals.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="flex flex-col gap-3"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <form.AppField
                            name="gender"
                            children={(field) => (
                                <field.SelectField
                                    label="Gender"
                                    array={[
                                        { label: 'Male', value: 'male' },
                                        { label: 'Female', value: 'female' },
                                    ]}
                                />
                            )}
                        />
                        <form.AppField
                            name="age"
                            children={(field) => <field.NumberField label="Age" />}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
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
                    </div>
                    <form.AppField
                        name="activityLevel"
                        children={(field) => (
                            <field.SelectField
                                label="Activity Level"
                                array={activityLevels}
                            />
                        )}
                    />
                    <form.AppField
                        name="dietGoal"
                        children={(field) => (
                            <field.SelectField
                                label="Diet Goal"
                                array={dietGoals}
                            />
                        )}
                    />
                    <form.AppForm>
                        <form.SubmitButton className="mt-2" />
                    </form.AppForm>
                </form>
            </DialogContent>
        </Dialog>
    )
}
