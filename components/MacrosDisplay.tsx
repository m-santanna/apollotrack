import { Card } from './ui/card'

const MacrosDisplay = ({
    calories,
    protein,
    carbs,
    fat,
}: {
    calories: number
    protein: number
    carbs: number
    fat: number
}) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-background/60">
                <div className="text-muted-foreground text-sm">Calories</div>
                <div className="text-2xl font-bold text-foreground">{calories}</div>
            </Card>

            <Card className="p-4 bg-background/60">
                <div className="text-muted-foreground text-sm">Protein</div>
                <div className="text-2xl font-bold text-foreground">{protein}g</div>
            </Card>

            <Card className="p-4 bg-background/60">
                <div className="text-muted-foreground text-sm">Carbs</div>
                <div className="text-2xl font-bold text-foreground">{carbs}g</div>
            </Card>

            <Card className="p-4 bg-background/60">
                <div className="text-muted-foreground text-sm">Fat</div>
                <div className="text-2xl font-bold text-foreground">{fat}g</div>
            </Card>
        </div>
    )
}

export default MacrosDisplay
