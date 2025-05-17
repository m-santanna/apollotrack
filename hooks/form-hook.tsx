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

function TextField({ label }: { label: string }) {
    const field = useFieldContext<string>()
    return (
        <div className="grid grid-cols-2 items-center gap-4">
            <Label>{label}</Label>
            <Input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
            />
        </div>
    )
}

function SelectField({
    label,
    array,
}: {
    label: string
    array: { label: string; value: string }[]
}) {
    const field = useFieldContext<string>()
    return (
        <Select
            value={field.state.value}
            onValueChange={(value) => field.handleChange(value)}
        >
            <div className="grid grid-cols-2 items-center gap-4">
                <Label>{label}</Label>
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
            </div>
            <SelectContent>
                {array.map((elem) => (
                    <SelectItem key={elem.value} value={elem.value}>
                        {elem.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

function SubmitButton({ className }: { className?: string }) {
    const form = useFormContext()
    return (
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
                <Button
                    className={className}
                    type="submit"
                    disabled={!canSubmit}
                >
                    {isSubmitting ? '...' : 'Submit'}
                </Button>
            )}
        />
    )
}

export const { useAppForm } = createFormHook({
    fieldComponents: {
        NumberField,
        TextField,
        SelectField,
    },
    formComponents: { SubmitButton },
    fieldContext,
    formContext,
})
