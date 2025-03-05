import WelcomeUser from '@/components/welcome_user/WelcomeUser'
import { getCurrentSessionServer } from '@/lib/actions'
import { user_macros } from '@/src/db/schema'
import { db } from '@/src/db'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

const WelcomePage = async () => {
    const user = (await getCurrentSessionServer()).user
    const userMacros = await db.select().from(user_macros).where(eq(user_macros.userId, user.id))

    if (userMacros.length > 0) {
        return redirect('/dashboard')
    }
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <WelcomeUser />
        </div>
    )
}

export default WelcomePage
