import { getCurrentSessionServer } from '@/lib/actions'
import { db } from '@/src/db'
import { user_macros } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

const DashboardPage = async () => {
    const user = (await getCurrentSessionServer()).user
    const userMacros = await db.select().from(user_macros).where(eq(user_macros.userId, user.id))

    return <div>DashboardPage</div>
}

export default DashboardPage
