import { eq } from 'drizzle-orm'
import { db } from '@/src/db'
import { getCurrentSessionServer } from '@/lib/actions'
import { food_item, user_macros, exerciseGroup } from '@/src/db/schema'
import DashboardBlock from '@/components/DashboardBlock'

const DashboardPage = async () => {
    const user = (await getCurrentSessionServer()).user

    const userMacros = await db.select().from(user_macros).where(eq(user_macros.userId, user.id))
    const foodItems = await db.select().from(food_item).where(eq(food_item.userId, user.id))
    const exercise_group = await db.select().from(exerciseGroup).where(eq(exerciseGroup.userId, user.id))
    const uncheckedFoodItems = foodItems.filter((item) => item.checked == false)

    return (
        <div className="h-screen w-screen flex flex-col items-center gap-4 p-10 md:p-20">
            <DashboardBlock type="macros" databaseData={userMacros} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <DashboardBlock type="diet" databaseData={foodItems} />
                <DashboardBlock type="training" databaseData={exercise_group} />
                <DashboardBlock type="supermarket" databaseData={uncheckedFoodItems} />
            </div>
        </div>
    )
}

export default DashboardPage
