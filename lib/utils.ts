import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bookmarkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL format'),
  category: z.string().min(1, 'Category is required'),
})
export const bookmarkArraySchema = z.array(bookmarkSchema)

export type Bookmark = z.infer<typeof bookmarkSchema>
export type BookmarkArray = z.infer<typeof bookmarkArraySchema>
