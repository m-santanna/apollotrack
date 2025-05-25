import MacrosYourselfDialog from '@/components/macros-dialog/macros-yourself-dialog'
import MacrosEstimateDialog from '@/components/macros-dialog/macros-estimate-dialog'
import MacrosEditDialog from '@/components/macros-dialog/macros-edit-dialog'
import AddFoodItemDialog from '@/components/food-dialog/add-food-item-dialog'
import EditFoodItemDialog from '@/components/food-dialog/edit-food-item-dialog'
import CreateMealDialog from '@/components/meals-dialog/create-meal-dialog'
import MealInfoDialog from '@/components/meals-dialog/meal-info-dialog'
import EditMealDialog from '@/components/meals-dialog/edit-meal-dialog'
import CreateDailyIntakeDialog from './daily-intake-dialog/create-day-dialog'
import EditDailyIntakeDialog from './daily-intake-dialog/edit-day-dialog'
import FoodItemInfoDialog from './food-dialog/food-item-info-dialog'
import InfoDailyIntakeDialog from './daily-intake-dialog/daily-info-dialog'

export default function DialogWrapper() {
    return (
        <>
            <MacrosYourselfDialog />
            <MacrosEstimateDialog />
            <MacrosEditDialog />
            <AddFoodItemDialog />
            <FoodItemInfoDialog />
            <EditFoodItemDialog />
            <CreateMealDialog />
            <MealInfoDialog />
            <EditMealDialog />
            <CreateDailyIntakeDialog />
            <EditDailyIntakeDialog />
            <InfoDailyIntakeDialog />
        </>
    )
}
