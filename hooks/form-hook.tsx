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
import { activityLevels } from '@/lib/utils'

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
                    <SelectItem value={activity.value}>
                        {activity.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function SubmitButton() {
    const form = useFormContext()
    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button
                    className="w-1/2 translate-x-1/2 mt-4"
                    disabled={isSubmitting}
                >
                    Submit
                </Button>
            )}
        </form.Subscribe>
    )
}

export const { useAppForm } = createFormHook({
    fieldComponents: { NumberField, GenderField, ActivityLevelField },
    formComponents: { SubmitButton },
    fieldContext,
    formContext,
})
