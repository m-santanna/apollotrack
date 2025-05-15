// app/routes/index.tsx
import MacrosSection from '@/components/macros-section'
import MacrosYourselfDialog from '@/components/macros-dialog/macros-yourself-dialog'
import MacrosEstimateDialog from '@/components/macros-dialog/macros-estimate-dialog'
import MacrosEditDialog from '@/components/macros-dialog/macros-edit-dialog'
import Navbar from '@/components/navbar'
import { useLoadingHook } from '@/hooks/useLoadingEffect'
import { createFileRoute } from '@tanstack/react-router'
import Loading from '@/components/ui/loading'
import AddFoodItemDialog from '@/components/food-dialog/add-food-item-dialog'
import FoodListSection from '@/components/food-list-section'
import EditFoodItemDialog from '@/components/food-dialog/edit-food-item-dialog'

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
            <EditFoodItemDialog />
            <div className="flex flex-col items-center mt-8 gap-8">
                <MacrosSection />
                <FoodListSection />
            </div>
        </div>
    )
}
