import MacrosSection from '@/components/macros-section'
import Navbar from '@/components/navbar'
import { useLoadingHook } from '@/hooks/useLoadingEffect'
import { createFileRoute } from '@tanstack/react-router'
import Loading from '@/components/ui/loading'
import FoodListSection from '@/components/food-list-section'
import MealsSection from '@/components/meals-section'
import DialogWrapper from '@/components/dialog-wrapper'
import DailyIntakeSection from '@/components/daily-intake-section'
import UploadCard from '@/components/food-scanner/upload-card'

export const Route = createFileRoute('/')({
    component: Home,
})

function Home() {
    const [loaded] = useLoadingHook()
    if (!loaded) {
        return <Loading />
    }
    return (
        <div className="min-h-screen w-screen bg-background">
            <Navbar />
            <DialogWrapper />
            <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 pb-12">
                <div className="flex flex-col gap-6">
                    {/* AI Scanner Section */}
                    <section className="rounded-2xl border border-border/60 bg-card p-5 card-shadow">
                        <UploadCard />
                    </section>

                    {/* Macros Overview */}
                    <MacrosSection />

                    {/* Daily Intake */}
                    <DailyIntakeSection />

                    {/* Meals & Food side-by-side on larger screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MealsSection />
                        <FoodListSection />
                    </div>
                </div>
            </main>
        </div>
    )
}
