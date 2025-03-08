import { eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { getCurrentSessionServer } from '@/lib/actions'
import { food_item, user_macros } from '@/src/db/schema'
import WelcomeUser from '@/components/welcome_user/WelcomeUser'
import WelcomeDiet from '@/components/welcome_user/WelcomeDiet'

const DashboardPage = async () => {
    const user = (await getCurrentSessionServer()).user

    const userMacros = await db.select().from(user_macros).where(eq(user_macros.userId, user.id))
    // The user can't delete his macros, so this verification is only true if it's their first time
    if (userMacros.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <WelcomeUser />
            </div>
        )
    }

    const foodItems = await db.select().from(food_item).where(eq(food_item.userId, user.id))
    // The welcome process redirects to the diet page, so if the user has no food items, it means the user deleted his items
    if (foodItems.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <WelcomeDiet firstTime={false} />
            </div>
        )
    }
}

export default DashboardPage
