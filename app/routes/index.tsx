// app/routes/index.tsx
import MacrosDisplay from '@/components/macros-display'
import MacrosYourselfDialog from '@/components/macros-yourself-dialog'
import MacrosEstimateDialog from '@/components/macros-estimate-dialog'
import MacrosEditDialog from '@/components/macros-edit-dialog'
import Navbar from '@/components/navbar'
import Spinner from '@/components/ui/spinner'
import { useLoadingHook } from '@/hooks/useLoadingEffect'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Home,
})

function Home() {
    const [loaded] = useLoadingHook()
    if (!loaded) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Spinner childSize="w-6 h-6" outerSize="h-10 w-10" />
            </div>
        )
    }
    return (
        <div className="h-screen w-screen">
            <Navbar />
            <MacrosYourselfDialog />
            <MacrosEstimateDialog />
            <MacrosEditDialog />
            <div className="flex flex-col items-center">
                <MacrosDisplay />
            </div>
        </div>
    )
}
