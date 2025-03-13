import CreateExercises from '@/components/CreateExercises'
import { db } from '@/src/db'
import { exercise } from '@/src/db/schema'

const page = async () => {
    const exercises = await db.select().from(exercise)
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <CreateExercises exercises={exercises} />
        </div>
    )
}

export default page
