import MacrosYourselfDialog from '@/components/macros-dialog/macros-yourself-dialog'
import MacrosEstimateDialog from '@/components/macros-dialog/macros-estimate-dialog'
import MacrosEditDialog from '@/components/macros-dialog/macros-edit-dialog'
import AddFoodItemDialog from '@/components/food-dialog/add-food-item-dialog'
import EditFoodItemDialog from '@/components/food-dialog/edit-food-item-dialog'
import CreateMealDialog from '@/components/meals-dialog/create-meal-dialog'
import MealInfoDialog from '@/components/meals-dialog/meal-info-dialog'
import EditMealDialog from '@/components/meals-dialog/edit-meal-dialog'

export default function DialogWrapper() {
    return (
        <>
            <MacrosYourselfDialog />
            <MacrosEstimateDialog />
            <MacrosEditDialog />
            <AddFoodItemDialog />
            <EditFoodItemDialog />
            <CreateMealDialog />
            <MealInfoDialog />
            <EditMealDialog />
        </>
    )
}
