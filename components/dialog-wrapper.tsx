import MacrosYourselfDialog from '@/components/macros-dialog/macros-yourself-dialog'
import MacrosEstimateDialog from '@/components/macros-dialog/macros-estimate-dialog'
import MacrosEditDialog from '@/components/macros-dialog/macros-edit-dialog'
import AddFoodItemDialog from '@/components/food-dialog/add-food-item-dialog'
import EditFoodItemDialog from '@/components/food-dialog/edit-food-item-dialog'
import CreateMealDialog from './meals-dialog/create-meal-dialog'

export default function DialogWrapper() {
    return (
        <>
            <MacrosYourselfDialog />
            <MacrosEstimateDialog />
            <MacrosEditDialog />
            <AddFoodItemDialog />
            <EditFoodItemDialog />
            <CreateMealDialog />
        </>
    )
}
