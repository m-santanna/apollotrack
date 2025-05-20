import MacrosSection from '@/components/macros-section'
import Navbar from '@/components/navbar'
import { useLoadingHook } from '@/hooks/useLoadingEffect'
import { createFileRoute } from '@tanstack/react-router'
import Loading from '@/components/ui/loading'
import FoodListSection from '@/components/food-list-section'
import MealsSection from '@/components/meals-section'
import DialogWrapper from '@/components/dialog-wrapper'
import DailyIntakeSection from '@/components/daily-intake-section'

export const Route = createFileRoute('/')({
    component: Home,
})

function Home() {
    const [loaded] = useLoadingHook()
    if (!loaded) {
        return <Loading />
    }
    return (
        <div className="h-screen w-screen">
            <Navbar />
            <DialogWrapper />
            <div className="flex flex-col items-center mt-8 gap-8">
                <MacrosSection />
                <DailyIntakeSection />
                <MealsSection />
                <FoodListSection />
            </div>
        </div>
    )
}
