'use server'

import { db } from '@/src/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

// Helper function to get the current session
async function getCurrentSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.id) {
        throw new Error('Not authenticated')
    }
    return session
}
