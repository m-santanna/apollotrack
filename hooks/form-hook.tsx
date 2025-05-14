import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { activityLevels, dietGoals } from '@/lib/utils'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
    createFormHookContexts()

function NumberField({ label }: { label: string }) {
    const field = useFieldContext<number>()
    return (
        <div className="grid grid-cols-2 items-center gap-4">
            <Label>{label}</Label>
            <Input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
            />
        </div>
    )
}

function GenderField() {
    const field = useFieldContext<string>()
    return (
        <Select
            value={field.state.value}
            onValueChange={(value) => field.handleChange(value)}
        >
            <div className="grid grid-cols-2 items-center gap-4">
                <Label>Gender</Label>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
            </div>
            <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
            </SelectContent>
        </Select>
    )
}

function ActivityLevelField() {
    const field = useFieldContext<string>()
    return (
        <Select
            value={field.state.value}
            onValueChange={(value) => field.handleChange(value)}
        >
            <div className="grid grid-cols-2 items-center gap-4">
                <Label>Activity Level</Label>
                <SelectTrigger className="w-full">
                    <SelectValue
                        className="truncate"
                        placeholder="Select your level"
                    />
                </SelectTrigger>
            </div>
            <SelectContent>
                {activityLevels.map((activity) => (
                    <SelectItem key={activity.value} value={activity.value}>
                        {activity.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function DietGoalField() {
    const field = useFieldContext<string>()
    return (
        <Select
            value={field.state.value}
            onValueChange={(value) => field.handleChange(value)}
        >
            <div className="grid grid-cols-2 items-center gap-4">
                <Label>Goal</Label>
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder="Select your caloric surplus/deficit"
                        className="truncate"
                    />
                </SelectTrigger>
            </div>
            <SelectContent>
                {dietGoals.map((dietGoal) => (
                    <SelectItem key={dietGoal.value} value={dietGoal.value}>
                        {dietGoal.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function SubmitButton({ className }: { className?: string }) {
    const form = useFormContext()
    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button className={className} disabled={isSubmitting}>
                    Submit
                </Button>
            )}
        </form.Subscribe>
    )
}

export const { useAppForm } = createFormHook({
    fieldComponents: {
        NumberField,
        GenderField,
        ActivityLevelField,
        DietGoalField,
    },
    formComponents: { SubmitButton },
    fieldContext,
    formContext,
})
