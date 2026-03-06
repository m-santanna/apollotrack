import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
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
        <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</Label>
            <Input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.valueAsNumber)}
            />
        </div>
    )
}

function TextField({
    label,
    labelClassName,
}: {
    label: string
    labelClassName?: string
}) {
    const field = useFieldContext<string>()
    return (
        <div className="flex flex-col gap-1.5">
            <Label className={labelClassName ?? "text-muted-foreground text-xs font-medium uppercase tracking-wider"}>{label}</Label>
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
        <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</Label>
            <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
            >
                <SelectTrigger className="w-full rounded-xl h-10">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {array.map((elem) => (
                        <SelectItem key={elem.value} value={elem.value}>
                            {elem.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

function SubmitButton({ className }: { className?: string }) {
    const form = useFormContext()
    return (
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
                <Button
                    className={cn("w-full mt-2", className)}
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
