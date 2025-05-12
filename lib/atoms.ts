import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai/vanilla'
import { z } from 'zod'

export const macrosSchema = z.object({
    calories: z.number(),
    protein: z.number(),
    fat: z.number(),
    carbs: z.number(),
})

export const foodSchema = z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    fat: z.number(),
    carbs: z.number(),
})

export type Macros = z.infer<typeof macrosSchema>
export type Food = z.infer<typeof foodSchema>

export const macrosAtom = atomWithStorage<Macros>('macros', {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
})
export const caloricVarianceAtom = atomWithStorage<number>(
    'caloricVarianceGoal',
    0,
)
export const foodListAtom = atomWithStorage<Food[]>('foodList', [])
export const macrosDialogAtom = atom(false)
