import { eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { getCurrentSessionServer } from '@/lib/actions'
import { food_item, user_macros } from '@/src/db/schema'
import WelcomeComponent from '@/components/welcome_user/WelcomeComponent'
import AddItems from '@/components/AddItems'
import CreateExercises from '@/components/CreateExercises'

const DashboardPage = async () => {
    const user = (await getCurrentSessionServer()).user

    const userMacros = await db.select().from(user_macros).where(eq(user_macros.userId, user.id))
    // The user can't delete his macros, so this verification is only true if it's their first time
    if (userMacros.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <WelcomeComponent
                    mainText="Welcome to ApolloTrack!"
                    secondaryText="First of all, we need to get some information about you."
                    mainButtonText="Get Started"
                    mainLink="/dashboard/welcome/macros"
                />
            </div>
        )
    }

    const foodItems = await db.select().from(food_item).where(eq(food_item.userId, user.id))
    // The welcome process redirects to the diet page, so if the user has no food items, it means the user deleted his items
    if (foodItems.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <AddItems firstTime={false} />
            </div>
        )
    }

    //const workouts = await db.select().from(workouts).where(eq(workout_group.userId, user.id))
    // The welcome process redirects to the workout page, so if the user has no workout groups, it means the user deleted his workouts
    //if (workouts.length === 0) {
    //    return (
    //        <div className="flex justify-center items-center h-screen w-full">
    //            <CreateExercises />
    //        </div>
    //    )
    //}
}

export default DashboardPage
