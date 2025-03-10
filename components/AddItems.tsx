'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { addFoodItems } from '@/lib/actions'
import { useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

const FIELD_CONFIG = [
    [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'calories', label: 'Calories (*)', type: 'number' },
    ],
    [
        { name: 'protein', label: 'Protein (*)', type: 'number', step: 0.01 },
        { name: 'carbs', label: 'Carbs (*)', type: 'number', step: 0.01 },
    ],
    [
        { name: 'fat', label: 'Fat (*)', type: 'number', step: 0.01 },
        { name: 'total_grams', label: 'Total Grams', type: 'number' },
    ],
    [
        { name: 'price', label: 'Price', type: 'number', step: 0.01 },
        { name: 'category', label: 'Category', type: 'text' },
    ],
]

const FormField = ({ label, name, type, step }: { label: string; name: string; type: string; step: number }) => (
    <div className="flex flex-col gap-1">
        <Label className="text-accent">{label}</Label>
        <Input required className="text-accent" type={type} name={`${name}`} step={step} />
    </div>
)

const FieldRow = ({
    fields,
    index,
}: {
    fields: { name: string; label: string; type: string; step?: number }[]
    index: number
}) => (
    <div className="grid grid-cols-2 gap-2">
        {fields.map((field) => (
            <FormField
                key={`${field.name}_${index}`}
                label={field.label}
                name={field.name}
                type={field.type}
                step={field.step ?? 1}
            />
        ))}
    </div>
)

const SubmitButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Submitting...' : 'Submit'}
        </Button>
    )
}

const FormButtons = ({
    numberOfItems,
    setNumberOfItems,
}: {
    numberOfItems: number
    setNumberOfItems: React.Dispatch<React.SetStateAction<number>>
}) => {
    const { pending } = useFormStatus()
    return (
        <div className="flex flex-col gap-2">
            <div className="w-full grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => setNumberOfItems(numberOfItems + 1)}
                    disabled={pending}
                >
                    Add Item
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => setNumberOfItems(numberOfItems - 1)}
                    disabled={numberOfItems === 1 || pending}
                >
                    Remove Item
                </Button>
            </div>
            <SubmitButton />
        </div>
    )
}

const AddItems = ({ firstTime }: { firstTime: boolean }) => {
    const [numberOfItems, setNumberOfItems] = useState(1)
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        await addFoodItems(formData)
        if (firstTime) router.push('/dashboard/welcome/training')
        else router.push('/dashboard')
    }

    const formInputs = () => {
        const inputs = []
        for (let i = 0; i < numberOfItems; i++) {
            inputs.push(
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex flex-col gap-4"
                    key={i}
                >
                    <span className="text-accent">{'Item #' + (i + 1)}</span>
                    {FIELD_CONFIG.map((fieldRow, rowIndex) => (
                        <FieldRow key={`row_${i}_${rowIndex}`} fields={fieldRow} index={i} />
                    ))}
                    <p className="text-muted-foreground text-sm">* Values per 100g of the product</p>
                </motion.div>,
            )
        }
        return inputs
    }

    return (
        <motion.div
            className="max-h-[80vh] overflow-scroll rounded-lg"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <form action={handleSubmit}>
                <div className="flex flex-col gap-4 p-4 bg-accent-foreground">
                    <AnimatePresence>{formInputs()}</AnimatePresence>
                    <FormButtons numberOfItems={numberOfItems} setNumberOfItems={setNumberOfItems} />
                </div>
            </form>
        </motion.div>
    )
}

export default AddItems
