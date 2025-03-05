'use client'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { DialogHeader } from './ui/dialog'
import { Form } from './ui/form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Input } from './ui/input'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MacrosFormValues, macrosFormSchema, activityLevels } from '@/lib/macros-utils'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { saveUserMacros } from '@/lib/actions'

const MacrosDialog = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isCalculating, setIsCalculating] = useState(false)
    const router = useRouter()

    const form = useForm<MacrosFormValues>({
        resolver: zodResolver(macrosFormSchema),
        defaultValues: {
            gender: 'male',
            weight: 70,
            height: 175,
            age: 30,
            activityLevel: 1,
        },
    })

    async function onSubmit(data: MacrosFormValues) {
        setIsCalculating(true)
        try {
            await saveUserMacros({
                gender: data.gender,
                weight: data.weight,
                height: data.height,
                age: data.age,
                activityLevel: data.activityLevel as 0 | 1 | 2 | 3 | 4,
            })
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            console.error('Error saving macros:', error)
        } finally {
            setIsCalculating(false)
        }
    }
    return (
        <>
            <Button variant="outline" className="mt-4" onClick={() => setIsOpen(true)}>
                Recalculate Macros
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Update Your Macros</DialogTitle>
                        <DialogDescription>
                            Enter your updated information to recalculate your daily macros.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                            <div className="grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                'w-full justify-between',
                                                                !field.value && 'text-muted-foreground',
                                                            )}
                                                        >
                                                            {field.value === 'male' ? 'Male' : 'Female'}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <div className="grid grid-cols-1 gap-1 p-1 w-[450px]">
                                                        {['male', 'female'].map((gender) => (
                                                            <Button
                                                                key={gender}
                                                                variant="ghost"
                                                                className="justify-start"
                                                                onClick={() => {
                                                                    form.setValue('gender', gender as 'male' | 'female')
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        gender === field.value
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0',
                                                                    )}
                                                                />
                                                                {gender === 'male' ? 'Male' : 'Female'}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="weight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Weight (kg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="height"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Height (cm)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Age</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="appearance-none"
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="activityLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Activity Level</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl className="overflow-hidden">
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn('justify-between')}
                                                            >
                                                                <span className="truncate">
                                                                    {activityLevels.find(
                                                                        (level) => level.value === field.value,
                                                                    )?.label || 'Select activity level'}
                                                                </span>
                                                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <div className="grid grid-cols-1 gap-1 p-1">
                                                            {activityLevels.map((level) => (
                                                                <Button
                                                                    key={level.value}
                                                                    variant="ghost"
                                                                    className="justify-start"
                                                                    onClick={() => {
                                                                        form.setValue('activityLevel', level.value)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            level.value === field.value
                                                                                ? 'opacity-100'
                                                                                : 'opacity-0',
                                                                        )}
                                                                    />
                                                                    {level.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isCalculating}>
                                    {isCalculating ? 'Calculating...' : 'Update Macros'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MacrosDialog
