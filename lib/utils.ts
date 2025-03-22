import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Function to handle number input changes
export const handleInputNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: number) => void) => {
    if (e.target.value === '' || e.target.value === '-') {
        e.target.value = ''
        onChange(0)
        return
    }
    if (e.target.value.length > 1 && e.target.value.startsWith('0') && !e.target.value.startsWith('0.')) {
        e.target.value = e.target.value.replace(/^0+/, '')
    }
    onChange(Number(e.target.value))
}
