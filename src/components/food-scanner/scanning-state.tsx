import { useAtomValue } from 'jotai/react'
import { scanErrorAtom, scanLoadingAtom } from '@/lib/atoms'
import { Loader2, AlertCircle } from 'lucide-react'

export default function ScanningState() {
    const isLoading = useAtomValue(scanLoadingAtom)
    const error = useAtomValue(scanErrorAtom)

    if (isLoading) {
        return (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                    <p className="text-sm font-medium text-foreground">
                        Analyzing your image...
                    </p>
                    <p className="text-xs text-muted-foreground">
                        AI is extracting nutritional information
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
            </div>
        )
    }

    return null
}
