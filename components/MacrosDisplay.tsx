'use client'

import { Card } from './ui/card'
import { motion } from 'framer-motion'

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
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
        </motion.div>
    )
}

export default MacrosDisplay
