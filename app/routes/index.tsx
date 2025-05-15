// app/routes/index.tsx
import MacrosDisplay from '@/components/macros-display'
import MacrosYourselfDialog from '@/components/macros-yourself-dialog'
import MacrosEstimateDialog from '@/components/macros-estimate-dialog'
import MacrosEditDialog from '@/components/macros-edit-dialog'
import Navbar from '@/components/navbar'
import { useLoadingHook } from '@/hooks/useLoadingEffect'
import { createFileRoute } from '@tanstack/react-router'
import Loading from '@/components/ui/loading'
import AddFoodItemDialog from '@/components/add-food-item-dialog'
import FoodListDisplay from '@/components/food-list-display'

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
            <MacrosYourselfDialog />
            <MacrosEstimateDialog />
            <MacrosEditDialog />
            <AddFoodItemDialog />
            <div className="flex flex-col items-center mt-8 gap-4">
                <MacrosDisplay />
                <FoodListDisplay />
            </div>
        </div>
    )
}
